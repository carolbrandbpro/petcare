import express from 'express';
import pool from '../db.js';
const router = express.Router();

async function ensureTables(){
  await pool.query(`CREATE TABLE IF NOT EXISTS baths (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
    bath_date date,
    place text,
    notes text,
    created_at timestamptz DEFAULT now()
  )`);
}

router.get('/:petId', async (req,res)=>{
  await ensureTables();
  const r = await pool.query(`SELECT id, bath_date, place, notes FROM baths WHERE pet_id=$1 ORDER BY bath_date DESC NULLS LAST, created_at DESC`, [req.params.petId]);
  res.json(r.rows);
});

router.post('/:petId', async (req,res)=>{
  await ensureTables();
  const { bath_date, place, notes } = req.body;
  const r = await pool.query(`INSERT INTO baths (pet_id, bath_date, place, notes) VALUES ($1,$2,$3,$4) RETURNING *`, [req.params.petId, bath_date||null, place||'', notes||'']);
  res.status(201).json(r.rows[0]);
});

export default router;

router.put('/:id', async (req,res)=>{
  const { bath_date, place, notes } = req.body;
  const r = await pool.query(`UPDATE baths SET bath_date=$1, place=$2, notes=$3 WHERE id=$4 RETURNING *`, [bath_date||null, place||'', notes||'', req.params.id]);
  res.json(r.rows[0]);
});

router.delete('/:id', async (req,res)=>{
  await pool.query('DELETE FROM baths WHERE id=$1', [req.params.id]);
  res.json({ok:true});
});