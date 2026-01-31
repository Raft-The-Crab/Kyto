#!/usr/bin/env node
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL environment variable.');
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();
  try {
    console.log('Creating projects table if not exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project JSONB NOT NULL,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL
      );
    `);
    console.log('Done.');
  } catch (err) {
    console.error('DB init failed:', err);
    process.exit(2);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
