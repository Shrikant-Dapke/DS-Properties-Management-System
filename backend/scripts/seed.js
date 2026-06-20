'use strict';

/**
 * DS Properties — Seed Runner
 *
 * Runs all seed files in order.
 * Usage: node scripts/seed.js
 */

const path = require('path');
const { Pool } = require('pg');

// Load env vars
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dsp_dev:dsp_dev_password@localhost:5432/dsp_development';

// Import seed functions
const seedCategories = require('../seeds/001_seed_categories');
const seedAdminUser = require('../seeds/002_seed_admin_user');
const seedAppSettings = require('../seeds/003_seed_app_settings');

async function runSeeds() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  let client;

  try {
    client = await pool.connect();
    // eslint-disable-next-line no-console
    console.log('✅ Connected to database\n');

    // Run seeds in order (within a transaction)
    await client.query('BEGIN');

    await seedCategories(client);
    // eslint-disable-next-line no-console
    console.log('');

    await seedAdminUser(client);
    // eslint-disable-next-line no-console
    console.log('');

    await seedAppSettings(client);

    await client.query('COMMIT');

    // eslint-disable-next-line no-console
    console.log('\n🎉 All seeds completed successfully!');

  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runSeeds();
