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
  const { email, password, name, phone } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const r = await pool.query(
    'INSERT INTO users (email, password_hash, name, phone) VALUES ($1,$2,$3,$4) RETURNING id,email,name,phone',
    [email, hash, name, phone || null]
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
  // fluxo único baseado no banco (remove id estático 'admin-demo')
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

router.post('/google', async (req,res)=>{
  try{
    const { access_token, id_token } = req.body;
    let data;
    if(access_token){
      const resp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${access_token}` } });
      if(!resp.ok) return res.status(401).json({ error: 'invalid_google_token' });
      data = await resp.json();
    } else if(id_token){
      const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`);
      if(!resp.ok) return res.status(401).json({ error: 'invalid_google_token' });
      const t = await resp.json();
      data = { email: t.email, name: t.name, picture: t.picture };
    } else {
      return res.status(400).json({ error: 'missing_token' });
    }
    const email = (data.email || '').toLowerCase();
    if(!email) return res.status(400).json({ error: 'missing_email' });
    let user;
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    user = r.rows[0];
    if(!user){
      const random = Math.random().toString(36).slice(2);
      const hash = await bcrypt.hash(random, 10);
      const ins = await pool.query('INSERT INTO users (email, password_hash, name, avatar_url) VALUES ($1,$2,$3,$4) RETURNING *', [email, hash, data.name || null, data.picture || null]);
      user = ins.rows[0];
    } else {
      await pool.query('UPDATE users SET name=COALESCE($2,name), avatar_url=COALESCE($3,avatar_url) WHERE id=$1', [user.id, data.name || null, data.picture || null]);
      const r2 = await pool.query('SELECT * FROM users WHERE id=$1', [user.id]);
      user = r2.rows[0];
    }
    const token = jwt.sign({id:user.id}, process.env.JWT_SECRET || 'devsecret', { expiresIn: JWT_TTL });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url } });
  }catch(err){
    return res.status(500).json({ error: 'auth_unavailable' });
  }
});

export default router;
