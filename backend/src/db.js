import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1931@localhost:5432/petcare';
const useSSL = String(process.env.DATABASE_SSL||'').toLowerCase() === 'true';
export const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined
});

export default pool;
