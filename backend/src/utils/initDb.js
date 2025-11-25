import pkg from 'pg';
import fs from 'fs';
import path from 'path';
const { Client } = pkg;

function parseConn(str){
  const u = new URL(str);
  const base = str.replace(`/${u.pathname.split('/').pop()}`,'/postgres');
  return { db: u.pathname.split('/').pop(), base };
}

export async function initDb(){
  const conn = process.env.DATABASE_URL || 'postgres://postgres:1931@localhost:5432/petcare';
  const { db, base } = parseConn(conn);
  const admin = new Client({ connectionString: base });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[db]);
  if(exists.rowCount===0){
    await admin.query(`CREATE DATABASE ${db}`);
  }
  await admin.end();
  const client = new Client({ connectionString: conn });
  await client.connect();
  const sql = fs.readFileSync(path.join(process.cwd(),'src','migrations','initial.sql'),'utf8');
  await client.query(sql);
  await client.end();
}

export default initDb;