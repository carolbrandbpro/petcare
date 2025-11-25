import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const router = express.Router();

function auth(req){
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if(!t) return null;
  try{ return jwt.verify(t, process.env.JWT_SECRET || 'devsecret'); }catch{ return null; }
}

router.get('/me', async (req,res)=>{
  const a = auth(req); if(!a) return res.status(401).json({error:'unauthorized'});
  const r = await pool.query('SELECT id,email,name,avatar_url FROM users WHERE id=$1',[a.id]);
  const u = r.rows[0];
  if(!u) return res.status(404).json({error:'not_found'});
  res.json(u);
});

router.put('/me', async (req,res)=>{
  const a = auth(req); if(!a) return res.status(401).json({error:'unauthorized'});
  const { name, avatar_url } = req.body;
  await pool.query('UPDATE users SET name=COALESCE($2,name), avatar_url=COALESCE($3,avatar_url) WHERE id=$1',[a.id, name, avatar_url]);
  const r = await pool.query('SELECT id,email,name,avatar_url FROM users WHERE id=$1',[a.id]);
  res.json(r.rows[0]);
});

router.put('/password', async (req,res)=>{
  const a = auth(req); if(!a) return res.status(401).json({error:'unauthorized'});
  const { currentPassword, newPassword } = req.body;
  const r = await pool.query('SELECT password_hash FROM users WHERE id=$1',[a.id]);
  const u = r.rows[0]; if(!u) return res.status(404).json({error:'not_found'});
  const ok = await bcrypt.compare(currentPassword || '', u.password_hash);
  if(!ok) return res.status(401).json({error:'invalid_current_password'});
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash=$2 WHERE id=$1',[a.id, hash]);
  res.json({ok:true});
});

router.post('/avatar', async (req,res)=>{
  const a = auth(req); if(!a) return res.status(401).json({error:'unauthorized'});
  const { dataUrl } = req.body;
  if(!dataUrl || !dataUrl.startsWith('data:image/')) return res.status(400).json({error:'invalid_image'});
  const base64 = dataUrl.split(',')[1];
  const buf = Buffer.from(base64, 'base64');
  const dir = path.join(process.cwd(), 'uploads', 'users');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${a.id}.jpg`);
  fs.writeFileSync(file, buf);
  const publicUrl = `/uploads/users/${a.id}.jpg`;
  await pool.query('UPDATE users SET avatar_url=$2 WHERE id=$1',[a.id, publicUrl]);
  res.json({ avatar_url: publicUrl });
});

export default router;