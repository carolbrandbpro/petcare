import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
const router = express.Router();

export function requireAuth(req,res,next){
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if(!t) return res.status(401).json({error:'missing_token'});
  try{
    const decoded = jwt.verify(t, process.env.JWT_SECRET || 'devsecret');
    req.user = { id: decoded.id };
    next();
  }catch(err){
    return res.status(401).json({error:'invalid_token'});
  }
}

router.post('/', requireAuth, async (req,res)=>{
  const { name, species, breed, birth_date } = req.body;
  const r = await pool.query(
    `INSERT INTO pets (owner_id, name, species, breed, birth_date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [req.user.id, name, species, breed, birth_date]
  );
  res.status(201).json(r.rows[0]);
});

router.get('/', requireAuth, async (req,res)=>{
  const r = await pool.query('SELECT * FROM pets WHERE owner_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(r.rows);
});

router.get('/:id', requireAuth, async (req,res)=>{
  const r = await pool.query('SELECT * FROM pets WHERE id=$1', [req.params.id]);
  res.json(r.rows[0]);
});

router.post('/:id/avatar', requireAuth, async (req,res)=>{
  const petId = req.params.id;
  const { dataUrl } = req.body;
  if(!dataUrl || !dataUrl.startsWith('data:image/')) return res.status(400).json({error:'invalid_image'});
  const pet = await pool.query('SELECT id, owner_id FROM pets WHERE id=$1',[petId]);
  const row = pet.rows[0];
  if(!row) return res.status(404).json({error:'not_found'});
  if(row.owner_id !== req.user.id) return res.status(403).json({error:'forbidden'});
  const base64 = dataUrl.split(',')[1];
  const buf = Buffer.from(base64, 'base64');
  const dir = path.join(process.cwd(), 'uploads', 'pets');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${petId}.jpg`);
  fs.writeFileSync(file, buf);
  const publicUrl = `/uploads/pets/${petId}.jpg`;
  await pool.query('UPDATE pets SET avatar_url=$2 WHERE id=$1',[petId, publicUrl]);
  res.json({ avatar_url: publicUrl });
});

export default router;
