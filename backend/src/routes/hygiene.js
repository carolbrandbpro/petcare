import express from 'express';
import pool from '../db.js';
const router = express.Router();

async function ensureTables(){
  await pool.query(`CREATE TABLE IF NOT EXISTS hygiene_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
    kind text,
    status text,
    event_date date,
    notes text,
    created_at timestamptz DEFAULT now()
  )`);
}

router.get('/:petId', async (req,res)=>{
  await ensureTables();
  const r = await pool.query(`SELECT id, kind, status, event_date, notes FROM hygiene_events WHERE pet_id=$1 ORDER BY event_date DESC NULLS LAST, created_at DESC`, [req.params.petId]);
  res.json(r.rows);
});

router.post('/:petId', async (req,res)=>{
  await ensureTables();
  const { kind, status, event_date, notes } = req.body;
  const r = await pool.query(`INSERT INTO hygiene_events (pet_id, kind, status, event_date, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [req.params.petId, kind||'orelhas', status||'realizada', event_date||null, notes||'']);
  res.status(201).json(r.rows[0]);
});

export default router;

router.put('/:id', async (req,res)=>{
  const { kind, status, event_date, notes } = req.body;
  const r = await pool.query(`UPDATE hygiene_events SET kind=$1, status=$2, event_date=$3, notes=$4 WHERE id=$5 RETURNING *`, [kind, status, event_date||null, notes||'', req.params.id]);
  res.json(r.rows[0]);
});

router.delete('/:id', async (req,res)=>{
  await pool.query('DELETE FROM hygiene_events WHERE id=$1', [req.params.id]);
  res.json({ok:true});
});