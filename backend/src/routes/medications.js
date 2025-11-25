import express from 'express';
import pool from '../db.js';
const router = express.Router();

async function ensureTables(){
  await pool.query(`CREATE TABLE IF NOT EXISTS medication_catalog (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    species text,
    default_interval_days int
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pet_medications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
    medication_catalog_id uuid REFERENCES medication_catalog(id),
    start_date date,
    next_due_date date,
    notes text,
    created_at timestamptz DEFAULT now()
  )`);
}

router.get('/:petId', async (req,res)=>{
  await ensureTables();
  const q = `SELECT pm.id, mc.name, pm.start_date, pm.next_due_date, pm.notes
             FROM pet_medications pm
             JOIN medication_catalog mc ON mc.id = pm.medication_catalog_id
             WHERE pm.pet_id=$1
             ORDER BY pm.start_date DESC`;
  const r = await pool.query(q, [req.params.petId]);
  res.json(r.rows);
});

router.post('/:petId', async (req,res)=>{
  await ensureTables();
  const { medication_catalog_id, start_date, notes } = req.body;
  const cat = await pool.query('SELECT default_interval_days, name FROM medication_catalog WHERE id=$1', [medication_catalog_id]);
  const interval = cat.rows[0]?.default_interval_days || 30;
  const next = new Date(start_date);
  next.setDate(next.getDate() + interval);
  const q = `INSERT INTO pet_medications (pet_id, medication_catalog_id, start_date, next_due_date, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const r = await pool.query(q, [req.params.petId, medication_catalog_id, start_date, next.toISOString().slice(0,10), notes || '']);

  await pool.query(`INSERT INTO reminders (pet_id, type, title, start_at, next_trigger) VALUES ($1,'medication',$2,$3,$3)`, [req.params.petId, `Medicamento: ${cat.rows[0]?.name||'Medicamento'}`, next.toISOString()]);

  res.status(201).json(r.rows[0]);
});

export default router;