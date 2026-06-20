'use strict';

/**
 * DS Properties — Audit Logger Middleware
 *
 * Factory middleware that logs create/update/delete operations to audit_logs.
 * Runs AFTER the response is sent — does not block the request.
 */

const auditModel = require('../models/auditModel');
const logger = require('../utils/logger');

/**
 * Create audit logging middleware for a specific table
 * @param {string} tableName
 * @returns {Function} Express middleware
 */
function auditLog(tableName) {
  return (req, res, next) => {
    // Store original json method to intercept the response
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Call original json to send the response
      originalJson(body);

      // After response is sent, log the audit entry asynchronously
      setImmediate(async () => {
        try {
          // Only log successful mutations
          const statusCode = res.statusCode;
          let action = null;

          if (statusCode === 201) {
            action = 'create';
          } else if (req.method === 'PUT' && statusCode === 200) {
            action = 'update';
          } else if (req.method === 'DELETE' && statusCode === 200) {
            action = 'delete';
          }

          if (!action || !req.user) {
            return;
          }

          const recordId = body?.data?.id || body?.data?.public_id || null;

          await auditModel.create({
            userId: req.user.id,
            action,
            tableName,
            recordId: typeof recordId === 'number' ? recordId : null,
            oldValue: req._auditOldValue || null,
            newValue: action === 'delete' ? null : (body?.data || null),
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
          });
        } catch (err) {
          // Audit failures must not crash the request
          logger.error({ err, tableName }, 'Failed to write audit log');
        }
      });

      return res;
    };

    next();
  };
}

module.exports = auditLog;
