'use strict';

/**
 * DS Properties — User Model
 *
 * Database query functions for the users table.
 * All functions use parameterized queries and return plain objects.
 */

const db = require('../config/database');

/**
 * Find a user by username (active, non-deleted only)
 * @param {string} username
 * @returns {Promise<Object|null>}
 */
async function findByUsername(username) {
  const { rows } = await db.query(
    `SELECT id, public_id, name, username, password_hash, role,
            is_active, failed_login_attempts, locked_until,
            last_login_at, created_at, updated_at
     FROM users
     WHERE username = $1 AND deleted_at IS NULL`,
    [username],
  );
  return rows[0] || null;
}

/**
 * Find a user by public UUID
 * @param {string} publicId - UUID
 * @returns {Promise<Object|null>}
 */
async function findByPublicId(publicId) {
  const { rows } = await db.query(
    `SELECT id, public_id, name, username, role,
            is_active, last_login_at, created_at, updated_at
     FROM users
     WHERE public_id = $1 AND deleted_at IS NULL`,
    [publicId],
  );
  return rows[0] || null;
}

/**
 * Find a user by internal ID
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function findById(id) {
  const { rows } = await db.query(
    `SELECT id, public_id, name, username, password_hash, role,
            is_active, failed_login_attempts, locked_until,
            last_login_at, created_at, updated_at
     FROM users
     WHERE id = $1 AND deleted_at IS NULL`,
    [id],
  );
  return rows[0] || null;
}

/**
 * Get all active users (admin only)
 * @returns {Promise<Array>}
 */
async function findAll() {
  const { rows } = await db.query(
    `SELECT public_id, name, username, role, is_active,
            last_login_at, created_at, updated_at
     FROM users
     WHERE deleted_at IS NULL
     ORDER BY created_at ASC`,
  );
  return rows;
}

/**
 * Create a new user
 * @param {Object} data
 * @returns {Promise<Object>} Created user (without password_hash)
 */
async function create({ name, username, passwordHash, role }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, username, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING public_id, name, username, role, is_active, created_at`,
    [name, username, passwordHash, role],
  );
  return rows[0];
}

/**
 * Update user fields
 * @param {string} publicId - UUID
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
async function update(publicId, { name, role, isActive }) {
  const { rows } = await db.query(
    `UPDATE users
     SET name = COALESCE($2, name),
         role = COALESCE($3, role),
         is_active = COALESCE($4, is_active)
     WHERE public_id = $1 AND deleted_at IS NULL
     RETURNING public_id, name, username, role, is_active, updated_at`,
    [publicId, name, role, isActive],
  );
  return rows[0] || null;
}

/**
 * Update user password
 * @param {string} publicId - UUID
 * @param {string} passwordHash
 * @returns {Promise<boolean>}
 */
async function updatePassword(publicId, passwordHash) {
  const { rowCount } = await db.query(
    `UPDATE users SET password_hash = $2
     WHERE public_id = $1 AND deleted_at IS NULL`,
    [publicId, passwordHash],
  );
  return rowCount > 0;
}

/**
 * Increment failed login attempts. Lock account after 5 failures.
 * @param {number} id - Internal user ID
 */
async function incrementFailedAttempts(id) {
  await db.query(
    `UPDATE users
     SET failed_login_attempts = failed_login_attempts + 1,
         locked_until = CASE
           WHEN failed_login_attempts >= 4 THEN NOW() + INTERVAL '15 minutes'
           ELSE locked_until
         END
     WHERE id = $1`,
    [id],
  );
}

/**
 * Reset failed login attempts and clear lockout
 * @param {number} id - Internal user ID
 */
async function resetFailedAttempts(id) {
  await db.query(
    `UPDATE users
     SET failed_login_attempts = 0, locked_until = NULL
     WHERE id = $1`,
    [id],
  );
}

/**
 * Update last_login_at timestamp
 * @param {number} id - Internal user ID
 */
async function updateLastLogin(id) {
  await db.query(
    'UPDATE users SET last_login_at = NOW() WHERE id = $1',
    [id],
  );
}

/**
 * Soft-delete a user
 * @param {string} publicId - UUID
 * @returns {Promise<boolean>}
 */
async function softDelete(publicId) {
  const { rowCount } = await db.query(
    'UPDATE users SET deleted_at = NOW() WHERE public_id = $1 AND deleted_at IS NULL',
    [publicId],
  );
  return rowCount > 0;
}

module.exports = {
  findByUsername,
  findByPublicId,
  findById,
  findAll,
  create,
  update,
  updatePassword,
  incrementFailedAttempts,
  resetFailedAttempts,
  updateLastLogin,
  softDelete,
};
