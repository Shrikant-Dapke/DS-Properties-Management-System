'use strict';

/**
 * DS Properties — Refresh Token Model
 *
 * Database query functions for the refresh_tokens table.
 */

const db = require('../config/database');

/**
 * Create a new refresh token
 * @param {number} userId - Internal user ID
 * @param {string} tokenHash - bcrypt hash of the refresh token
 * @param {Date} expiresAt
 * @returns {Promise<Object>}
 */
async function create(userId, tokenHash, expiresAt) {
  const { rows } = await db.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at, created_at`,
    [userId, tokenHash, expiresAt],
  );
  return rows[0];
}

/**
 * Find an active (non-revoked, non-expired) token by its hash
 * @param {string} tokenHash
 * @returns {Promise<Object|null>}
 */
async function findByTokenHash(tokenHash) {
  const { rows } = await db.query(
    `SELECT id, user_id, token_hash, expires_at, revoked_at, created_at
     FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()`,
    [tokenHash],
  );
  return rows[0] || null;
}

/**
 * Revoke a specific token
 * @param {string} tokenHash
 * @returns {Promise<boolean>}
 */
async function revoke(tokenHash) {
  const { rowCount } = await db.query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash],
  );
  return rowCount > 0;
}

/**
 * Revoke all tokens for a user (logout all sessions)
 * @param {number} userId
 * @returns {Promise<number>} Number of tokens revoked
 */
async function revokeAllForUser(userId) {
  const { rowCount } = await db.query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId],
  );
  return rowCount;
}

/**
 * Delete expired tokens (cleanup job)
 * @returns {Promise<number>} Number of tokens deleted
 */
async function deleteExpired() {
  const { rowCount } = await db.query(
    'DELETE FROM refresh_tokens WHERE expires_at < NOW()',
  );
  return rowCount;
}

module.exports = {
  create,
  findByTokenHash,
  revoke,
  revokeAllForUser,
  deleteExpired,
};
