'use strict';

/**
 * DS Properties — Migration Runner
 *
 * Reads and executes SQL migration files in order against PostgreSQL.
 * Usage: node scripts/migrate.js
 *
 * Migrations are idempotent (use IF NOT EXISTS, OR REPLACE, DROP IF EXISTS).
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load env vars
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dsp_dev:dsp_dev_password@localhost:5432/dsp_development';

const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');

async function runMigrations() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  let client;

  try {
    client = await pool.connect();
    // eslint-disable-next-line no-console
    console.log('✅ Connected to database');

    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Get list of migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No migration files found.');
      return;
    }

    // Get already-executed migrations
    const { rows: executed } = await client.query('SELECT filename FROM _migrations ORDER BY id');
    const executedSet = new Set(executed.map((r) => r.filename));

    let migrated = 0;

    for (const file of files) {
      if (executedSet.has(file)) {
        // eslint-disable-next-line no-console
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      // eslint-disable-next-line no-console
      console.log(`🔄 Running ${file}...`);

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO _migrations (filename) VALUES ($1)',
          [file],
        );
        await client.query('COMMIT');

        // eslint-disable-next-line no-console
        console.log(`✅ ${file} — done`);
        migrated++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ ${file} — FAILED`);
        console.error(err.message);
        process.exit(1);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`\n🎉 Migration complete. ${migrated} new migration(s) applied, ${executedSet.size} already executed.`);

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runMigrations();
