import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/:petId', async (req,res)=>{
  const q = `SELECT pv.id, vc.name, pv.applied_date, pv.next_due_date, pv.notes
             FROM pet_vaccines pv
             JOIN vaccine_catalog vc ON vc.id = pv.vaccine_catalog_id
             WHERE pv.pet_id=$1
             ORDER BY pv.applied_date DESC`;
  const r = await pool.query(q, [req.params.petId]);
  res.json(r.rows);
});

router.post('/:petId', async (req,res)=>{
  const { vaccine_catalog_id, applied_date, notes } = req.body;
  const cat = await pool.query('SELECT default_interval_days, name FROM vaccine_catalog WHERE id=$1', [vaccine_catalog_id]);
  const interval = cat.rows[0]?.default_interval_days || 365;
  const next = new Date(applied_date);
  next.setDate(next.getDate() + interval);
  const q = `INSERT INTO pet_vaccines (pet_id, vaccine_catalog_id, applied_date, next_due_date, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const r = await pool.query(q, [req.params.petId, vaccine_catalog_id, applied_date, next.toISOString().slice(0,10), notes || '']);

  await pool.query(`INSERT INTO reminders (pet_id, type, title, start_at, next_trigger) VALUES ($1,'vaccine',$2,$3,$3)`, [req.params.petId, `Vacina: ${cat.rows[0]?.name||'Vacina'}`, next.toISOString()]);

  res.status(201).json(r.rows[0]);
});

export default router;
