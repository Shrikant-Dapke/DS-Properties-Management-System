'use strict';

/**
 * DS Properties — Audit Log Model
 *
 * Database query functions for the audit_logs table.
 */

const db = require('../config/database');

/**
 * Create an audit log entry
 * @param {Object} data
 */
async function create({ userId, action, tableName, recordId, oldValue, newValue, ipAddress, userAgent }) {
  await db.query(
    `INSERT INTO audit_logs (user_id, action, table_name, record_id, old_value, new_value, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      userId,
      action,
      tableName,
      recordId || null,
      oldValue ? JSON.stringify(oldValue) : null,
      newValue ? JSON.stringify(newValue) : null,
      ipAddress || null,
      userAgent || null,
    ],
  );
}

/**
 * Find audit logs with pagination and filters
 * @param {Object} filters
 * @returns {Promise<{ rows: Array, total: number }>}
 */
async function findAll({ userId, action, tableName, dateFrom, dateTo, page = 1, limit = 20 } = {}) {
  const conditions = [];
  const params = [];
  let paramIndex = 0;

  if (userId) {
    paramIndex++;
    conditions.push(`user_id = $${paramIndex}`);
    params.push(userId);
  }

  if (action) {
    paramIndex++;
    conditions.push(`action = $${paramIndex}`);
    params.push(action);
  }

  if (tableName) {
    paramIndex++;
    conditions.push(`table_name = $${paramIndex}`);
    params.push(tableName);
  }

  if (dateFrom) {
    paramIndex++;
    conditions.push(`created_at >= $${paramIndex}`);
    params.push(dateFrom);
  }

  if (dateTo) {
    paramIndex++;
    conditions.push(`created_at <= $${paramIndex}`);
    params.push(dateTo);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const offset = (page - 1) * limit;

  // Get total count
  const countResult = await db.query(
    `SELECT COUNT(*) FROM audit_logs ${whereClause}`,
    params,
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Get paginated rows
  paramIndex++;
  params.push(limit);
  paramIndex++;
  params.push(offset);

  const { rows } = await db.query(
    `SELECT al.id, al.user_id, u.name AS user_name, u.username,
            al.action, al.table_name, al.record_id,
            al.old_value, al.new_value,
            al.ip_address, al.user_agent, al.created_at
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ${whereClause}
     ORDER BY al.created_at DESC
     LIMIT $${paramIndex - 1} OFFSET $${paramIndex}`,
    params,
  );

  return { rows, total };
}

module.exports = {
  create,
  findAll,
};
