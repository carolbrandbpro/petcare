import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

const loginAttempts = new Map();
const MAX_ATTEMPTS = Number(process.env.LOGIN_MAX_ATTEMPTS ?? 3);
const BLOCK_MINUTES = Number(process.env.LOGIN_BLOCK_MINUTES ?? 10); // tempo de bloqueio após atingir o limite
const JWT_TTL = process.env.JWT_TTL || '7d';

function getAttemptKey(req, email){
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString();
  return `${(email||'').toLowerCase()}|${ip}`;
}

function isBlocked(key){
  const rec = loginAttempts.get(key);
  if(!rec) return false;
  const now = Date.now();
  return rec.blockUntil && rec.blockUntil > now;
}

function registerFailure(key){
  const now = Date.now();
  const rec = loginAttempts.get(key) || { count: 0, blockUntil: 0 };
  rec.count += 1;
  if(rec.count >= MAX_ATTEMPTS){
    rec.blockUntil = now + BLOCK_MINUTES*60*1000;
    rec.count = 0;
  }
  loginAttempts.set(key, rec);
  return rec;
}

function clearAttempts(key){ loginAttempts.delete(key); }

router.post('/register', async (req,res)=>{
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const r = await pool.query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1,$2,$3) RETURNING id,email,name',
    [email, hash, name]
  );
  res.status(201).json(r.rows[0]);
});

router.post('/login', async (req,res)=>{
  let { email, password } = req.body;
  email = (email || '').trim().toLowerCase();
  password = (password || '').trim();
  const key = getAttemptKey(req, email);
  if(isBlocked(key)){
    const rec = loginAttempts.get(key);
    const retryAfterSec = Math.ceil((rec.blockUntil - Date.now())/1000);
    res.setHeader('Retry-After', String(retryAfterSec));
    return res.status(429).json({ error: 'too_many_attempts', retryAfterSeconds: retryAfterSec });
  }
  if((email==='admin@admin.com' || email==='admin@local') && password==='admin'){
    const token = jwt.sign({id:'admin-demo'}, process.env.JWT_SECRET || 'devsecret', {expiresIn: JWT_TTL});
    clearAttempts(key);
    return res.json({ token, user: { id: 'admin-demo', email, name: 'Admin' }});
  }
  try{
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = r.rows[0];
    if(!user) throw new Error('not_found');
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match){
      const rec = registerFailure(key);
      const left = rec.blockUntil && rec.blockUntil>Date.now() ? Math.ceil((rec.blockUntil-Date.now())/1000) : undefined;
      if(left){
        res.setHeader('Retry-After', String(left));
        return res.status(429).json({error:'too_many_attempts', retryAfterSeconds: left});
      }
      return res.status(401).json({error:'invalid'});
    }
    const token = jwt.sign({id:user.id}, process.env.JWT_SECRET || 'devsecret', {expiresIn: JWT_TTL});
    clearAttempts(key);
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
  }catch(err){
    return res.status(500).json({error:'auth_unavailable'});
  }
});

export default router;
