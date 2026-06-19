'use strict';

/**
 * DS Properties — Application Constants
 *
 * Centralized enums and configuration values used across the application.
 * These MUST match the CHECK constraints defined in DATABASE_REVIEW.md.
 */

const ROLES = Object.freeze({
  ADMIN: 'admin',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
});

const ROLE_VALUES = Object.freeze(Object.values(ROLES));

const TRANSACTION_TYPES = Object.freeze({
  INTAKE: 'intake',
  OUTTAKE: 'outtake',
});

const TRANSACTION_TYPE_VALUES = Object.freeze(Object.values(TRANSACTION_TYPES));

const PAYMENT_MODES = Object.freeze({
  CASH: 'cash',
  CHEQUE: 'cheque',
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
});

const PAYMENT_MODE_VALUES = Object.freeze(Object.values(PAYMENT_MODES));

const AUDIT_ACTIONS = Object.freeze({
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
});

const AUDIT_ACTION_VALUES = Object.freeze(Object.values(AUDIT_ACTIONS));

// Pagination defaults
const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

// Account lockout configuration
const LOCKOUT = Object.freeze({
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
});

// Cache configuration
const CACHE = Object.freeze({
  DASHBOARD_TTL_SECONDS: 300, // 5 minutes
});

// Amount thresholds (in INR)
const THRESHOLDS = Object.freeze({
  LARGE_AMOUNT: 1000000, // ₹10,00,000
  DUPLICATE_WINDOW_MINUTES: 10,
});

module.exports = {
  ROLES,
  ROLE_VALUES,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_VALUES,
  PAYMENT_MODES,
  PAYMENT_MODE_VALUES,
  AUDIT_ACTIONS,
  AUDIT_ACTION_VALUES,
  PAGINATION,
  LOCKOUT,
  CACHE,
  THRESHOLDS,
};
