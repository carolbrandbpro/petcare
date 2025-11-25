import './env.js';
import app from './app.js';
import pool from './db.js';
import bcrypt from 'bcrypt';
import { initDb } from './utils/initDb.js';

async function ensureAdmin(){
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name text,
    role text DEFAULT 'tutor',
    phone text,
    created_at timestamptz DEFAULT now()
  )`);
  const emails = ['admin@local', 'admin@admin.com'];
  const hash = await bcrypt.hash('admin', 10);
  for(const email of emails){
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if(exists.rows.length === 0){
      await pool.query('INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4)', [email, hash, 'Admin', 'admin']);
      console.log(`Seeded default admin user: ${email} / admin`);
    }
  }
}

initDb().then(()=>ensureAdmin()).catch(err=>console.error('db init error', err)).finally(()=>{
  const port = process.env.PORT || 4001;
  app.listen(port, ()=>console.log(`Backend running on ${port}`));
});
