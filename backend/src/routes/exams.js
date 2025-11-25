import express from 'express';
import pool from '../db.js';
import fs from 'fs';
import path from 'path';
const router = express.Router();

async function ensureTables(){
  await pool.query(`CREATE TABLE IF NOT EXISTS exams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
    title text NOT NULL,
    exam_date date,
    notes text,
    files jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now()
  )`);
}

router.get('/:petId', async (req,res)=>{
  await ensureTables();
  const r = await pool.query(`SELECT id, title, exam_date, notes, files FROM exams WHERE pet_id=$1 ORDER BY exam_date DESC NULLS LAST, created_at DESC`, [req.params.petId]);
  res.json(r.rows);
});

router.post('/:petId', async (req,res)=>{
  await ensureTables();
  const { title, exam_date, notes } = req.body;
  const r = await pool.query(`INSERT INTO exams (pet_id, title, exam_date, notes) VALUES ($1,$2,$3,$4) RETURNING *`, [req.params.petId, title, exam_date, notes||'']);
  res.status(201).json(r.rows[0]);
});

export default router;

router.put('/:id', async (req,res)=>{
  const { title, exam_date, notes, files } = req.body;
  const r = await pool.query(`UPDATE exams SET title=$1, exam_date=$2, notes=$3, files=$4 WHERE id=$5 RETURNING *`, [title, exam_date, notes, files||'[]', req.params.id]);
  res.json(r.rows[0]);
});

router.delete('/:id', async (req,res)=>{
  await pool.query('DELETE FROM exams WHERE id=$1', [req.params.id]);
  res.json({ok:true});
});

router.post('/:id/files', async (req,res)=>{
  const { name, content } = req.body;
  if(!name || !content) return res.status(400).json({error:'missing'});
  const header = content.split(',')[0] || '';
  const m = header.match(/^data:(.*);base64$/);
  const mime = m ? m[1] : 'application/octet-stream';
  const allowed = ['image/jpeg','image/png','application/pdf'];
  if(!allowed.includes(mime)) return res.status(415).json({error:'unsupported_type'});
  const dir = path.join(process.cwd(), 'uploads', 'exams', req.params.id);
  await fs.promises.mkdir(dir, { recursive: true });
  const buf = Buffer.from(content.split(',').pop(), 'base64');
  if(buf.length > 8*1024*1024) return res.status(413).json({error:'file_too_large'});
  const safeName = path.basename(name).replace(/[^a-zA-Z0-9._-]/g,'_');
  const filePath = path.join(dir, safeName);
  await fs.promises.writeFile(filePath, buf);
  const url = `/uploads/exams/${req.params.id}/${safeName}`;
  const cur = await pool.query('SELECT files FROM exams WHERE id=$1', [req.params.id]);
  const files = Array.isArray(cur.rows[0]?.files) ? cur.rows[0].files : [];
  files.push({ name: safeName, url, mime });
  const r = await pool.query('UPDATE exams SET files=$1 WHERE id=$2 RETURNING *', [JSON.stringify(files), req.params.id]);
  res.status(201).json(r.rows[0]);
});

router.delete('/:id/files', async (req,res)=>{
  const { name } = req.body;
  if(!name) return res.status(400).json({error:'missing'});
  const dir = path.join(process.cwd(), 'uploads', 'exams', req.params.id);
  const filePath = path.join(dir, name);
  try{ await fs.promises.unlink(filePath); }catch(e){}
  const cur = await pool.query('SELECT files FROM exams WHERE id=$1', [req.params.id]);
  const files = (Array.isArray(cur.rows[0]?.files) ? cur.rows[0].files : []).filter(f=>f.name!==name);
  const r = await pool.query('UPDATE exams SET files=$1 WHERE id=$2 RETURNING *', [JSON.stringify(files), req.params.id]);
  res.json(r.rows[0]);
});