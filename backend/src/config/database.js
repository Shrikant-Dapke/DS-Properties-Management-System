'use strict';

/**
 * DS Properties — PostgreSQL Connection Pool
 *
 * Creates a pg Pool using DATABASE_URL from environment.
 * Exports: pool instance + a query() convenience function.
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');
const env = require('./environment');

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,                   // Max connections in pool
  idleTimeoutMillis: 30000,  // Close idle clients after 30s
  connectionTimeoutMillis: 5000, // Fail fast if can't connect in 5s
  ssl: env.isProd ? { rejectUnauthorized: false } : false,
});

// Log pool events
pool.on('connect', () => {
  logger.debug('New database client connected');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database pool error');
});

/**
 * Convenience query function — grabs a client from the pool, runs query, releases.
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  logger.debug({
    query: text.substring(0, 100),
    duration,
    rows: result.rowCount,
  }, 'Executed query');

  return result;
}

/**
 * Get a client from the pool for transactions (BEGIN/COMMIT/ROLLBACK).
 * Caller MUST call client.release() when done.
 * @returns {Promise<import('pg').PoolClient>}
 */
async function getClient() {
  return pool.connect();
}

/**
 * Health check — test the database connection.
 * @returns {Promise<boolean>}
 */
async function healthCheck() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  pool,
  query,
  getClient,
  healthCheck,
};
