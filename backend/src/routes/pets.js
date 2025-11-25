import express from 'express';
import pool from '../db.js';
const router = express.Router();

// simple auth middleware (for scaffold only)
export function requireAuth(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'missing token'});
  // in scaffold we skip verification; production: verify JWT
  req.user = { id: '00000000-0000-0000-0000-000000000000' };
  next();
}

router.post('/', requireAuth, async (req,res)=>{
  const { name, species, breed, birth_date } = req.body;
  const r = await pool.query(
    `INSERT INTO pets (owner_id, name, species, breed, birth_date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [req.user.id, name, species, breed, birth_date]
  );
  res.status(201).json(r.rows[0]);
});

router.get('/:id', requireAuth, async (req,res)=>{
  const r = await pool.query('SELECT * FROM pets WHERE id=$1', [req.params.id]);
  res.json(r.rows[0]);
});

export default router;
