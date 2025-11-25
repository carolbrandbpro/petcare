import express from 'express';
import pool from '../db.js';
const router = express.Router();

async function ensureTables(){
  await pool.query(`CREATE TABLE IF NOT EXISTS appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id uuid REFERENCES pets(id),
    user_id uuid REFERENCES users(id),
    title text,
    description text,
    start_at timestamptz,
    end_at timestamptz,
    location text,
    status text DEFAULT 'scheduled'
  )`);
}

router.get('/:petId', async (req,res)=>{
  await ensureTables();
  const r = await pool.query(`SELECT id, title, description, start_at, end_at, location, status FROM appointments WHERE pet_id=$1 ORDER BY start_at DESC`, [req.params.petId]);
  res.json(r.rows);
});

router.post('/:petId', async (req,res)=>{
  await ensureTables();
  const { title, description, start_at, end_at, location } = req.body;
  const r = await pool.query(`INSERT INTO appointments (pet_id, title, description, start_at, end_at, location) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [req.params.petId, title||'Consulta', description||'', start_at||null, end_at||null, location||'']);
  try{
    await pool.query(`INSERT INTO reminders (pet_id, type, title, start_at, next_trigger) VALUES ($1,'appointment',$2,$3,$3)`, [req.params.petId, `Consulta: ${title||'Consulta'}`, start_at||new Date().toISOString()]);
  }catch(e){ /* silent scaffold */ }
  res.status(201).json(r.rows[0]);
});

export default router;

// extra endpoints for update/delete
router.put('/:id', async (req,res)=>{
  const { title, description, start_at, end_at, location, status } = req.body;
  const q = `UPDATE appointments SET title=$1, description=$2, start_at=$3, end_at=$4, location=$5, status=$6 WHERE id=$7 RETURNING *`;
  const r = await pool.query(q, [title, description, start_at, end_at, location, status||'scheduled', req.params.id]);
  res.json(r.rows[0]);
});

router.delete('/:id', async (req,res)=>{
  await pool.query('DELETE FROM appointments WHERE id=$1', [req.params.id]);
  res.json({ok:true});
});