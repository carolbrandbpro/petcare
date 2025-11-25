import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/due', async (req,res)=>{
  const r = await pool.query('SELECT * FROM reminders WHERE next_trigger <= now()');
  res.json(r.rows);
});

router.get('/:petId', async (req,res)=>{
  const r = await pool.query('SELECT * FROM reminders WHERE pet_id=$1 ORDER BY next_trigger ASC NULLS LAST, created_at DESC', [req.params.petId]);
  res.json(r.rows);
});

router.post('/:id/complete', async (req,res)=>{
  const r = await pool.query('UPDATE reminders SET next_trigger=NULL WHERE id=$1 RETURNING *', [req.params.id]);
  res.json(r.rows[0]);
});

router.post('/:id/snooze', async (req,res)=>{
  const { days } = req.body;
  const d = Number.isFinite(Number(days)) ? Number(days) : 7;
  const cur = await pool.query('SELECT next_trigger FROM reminders WHERE id=$1', [req.params.id]);
  let base = cur.rows[0]?.next_trigger ? new Date(cur.rows[0].next_trigger) : new Date();
  base.setDate(base.getDate() + d);
  const next = base.toISOString();
  const r = await pool.query('UPDATE reminders SET next_trigger=$1 WHERE id=$2 RETURNING *', [next, req.params.id]);
  res.json(r.rows[0]);
});

export default router;
