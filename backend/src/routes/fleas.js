import express from 'express';
import pool from '../db.js';
const router = express.Router();

async function ensureTables(){
  await pool.query(`CREATE TABLE IF NOT EXISTS flea_tick_treatments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
    product text,
    status text,
    applied_date date,
    next_due_date date,
    notes text,
    created_at timestamptz DEFAULT now()
  )`);
}

router.get('/:petId', async (req,res)=>{
  await ensureTables();
  const r = await pool.query(`SELECT id, product, status, applied_date, next_due_date, notes FROM flea_tick_treatments WHERE pet_id=$1 ORDER BY applied_date DESC NULLS LAST, created_at DESC`, [req.params.petId]);
  res.json(r.rows);
});

router.post('/:petId', async (req,res)=>{
  await ensureTables();
  const { product, status, applied_date, notes } = req.body;
  let next = null;
  if(applied_date){ const d = new Date(applied_date); d.setDate(d.getDate() + 30); next = d.toISOString().slice(0,10); }
  const r = await pool.query(`INSERT INTO flea_tick_treatments (pet_id, product, status, applied_date, next_due_date, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [req.params.petId, product||'Tratamento', status||'aplicada', applied_date||null, next, notes||'']);
  res.status(201).json(r.rows[0]);
});

export default router;

router.put('/:id', async (req,res)=>{
  const { product, status, applied_date, notes } = req.body;
  let next = null;
  if(applied_date){ const d = new Date(applied_date); d.setDate(d.getDate() + 30); next = d.toISOString().slice(0,10); }
  const r = await pool.query(`UPDATE flea_tick_treatments SET product=$1, status=$2, applied_date=$3, next_due_date=$4, notes=$5 WHERE id=$6 RETURNING *`, [product, status, applied_date||null, next, notes||'', req.params.id]);
  res.json(r.rows[0]);
});

router.delete('/:id', async (req,res)=>{
  await pool.query('DELETE FROM flea_tick_treatments WHERE id=$1', [req.params.id]);
  res.json({ok:true});
});