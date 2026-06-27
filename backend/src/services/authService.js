'use strict';

/**
 * DS Properties — Auth Service
 *
 * Business logic for authentication: login, token management, password change.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/environment');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');
const auditModel = require('../models/auditModel');
const { AuthenticationError, ForbiddenError, AccountLockedError, NotFoundError, ValidationError } = require('../utils/errors');

const SALT_ROUNDS = 12;

/**
 * Generate a JWT access token
 * @param {Object} user
 * @returns {string}
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      publicId: user.public_id,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

/**
 * Generate a random refresh token string
 * @returns {string}
 */
function generateRefreshTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @param {Object} meta - { ipAddress, userAgent }
 * @returns {Promise<{ user, accessToken, refreshToken }>}
 */
async function login(username, password, meta = {}) {
  // Find user
  const user = await userModel.findByUsername(username);
  if (!user) {
    // Log failed attempt (no user_id to record)
    await auditModel.create({
      userId: null,
      action: 'login_failed',
      tableName: 'users',
      recordId: null,
      newValue: { username, reason: 'user_not_found' },
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    throw new AuthenticationError('Invalid username or password');
  }

  // Check if account is active
  if (!user.is_active) {
    throw new ForbiddenError('Account is deactivated. Contact an administrator.');
  }

  // Check if account is locked
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const minutesLeft = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
    await auditModel.create({
      userId: user.id,
      action: 'login_failed',
      tableName: 'users',
      recordId: user.id,
      newValue: { reason: 'account_locked', minutes_left: minutesLeft },
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    throw new AccountLockedError(new Date(user.locked_until));
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    await userModel.incrementFailedAttempts(user.id);
    await auditModel.create({
      userId: user.id,
      action: 'login_failed',
      tableName: 'users',
      recordId: user.id,
      newValue: { reason: 'wrong_password', attempts: user.failed_login_attempts + 1 },
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    throw new AuthenticationError('Invalid username or password');
  }

  // Success — reset failed attempts and update last login
  await userModel.resetFailedAttempts(user.id);
  await userModel.updateLastLogin(user.id);

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshTokenStr = generateRefreshTokenString();
  const refreshTokenHash = await bcrypt.hash(refreshTokenStr, SALT_ROUNDS);

  // Parse refresh token expiry (e.g., '30d' → 30 days from now)
  const expiresIn = env.jwtRefreshExpiresIn;
  const daysMatch = expiresIn.match(/^(\d+)d$/);
  const days = daysMatch ? parseInt(daysMatch[1], 10) : 30;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await refreshTokenModel.create(user.id, refreshTokenHash, expiresAt);

  // Log successful login
  await auditModel.create({
    userId: user.id,
    action: 'login',
    tableName: 'users',
    recordId: user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  // Return user data without sensitive fields
  const safeUser = {
    publicId: user.public_id,
    name: user.name,
    username: user.username,
    role: user.role,
  };

  return {
    user: safeUser,
    accessToken,
    refreshToken: refreshTokenStr,
  };
}

/**
 * Refresh access token using a valid refresh token
 * @param {string} refreshTokenStr - Raw refresh token
 * @returns {Promise<{ accessToken }>}
 */
async function refreshAccessToken(refreshTokenStr) {
  // We need to check all non-revoked, non-expired tokens and compare hashes
  // This is computationally expensive with bcrypt, so we store the hash and compare
  // In practice, we'd use a faster hash for lookup. For this project size, we'll
  // query all active tokens for the lookup.

  // Alternative approach: use the token itself as lookup key (hash stored in DB)
  // We'll iterate active tokens and compare — this is acceptable for < 100 concurrent users

  const db = require('../config/database');
  const { rows } = await db.query(
    `SELECT id, user_id, token_hash, expires_at
     FROM refresh_tokens
     WHERE revoked_at IS NULL AND expires_at > NOW()
     ORDER BY created_at DESC`,
  );

  let matchedToken = null;
  for (const token of rows) {
    const isMatch = await bcrypt.compare(refreshTokenStr, token.token_hash);
    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  // Get user
  const user = await userModel.findById(matchedToken.user_id);
  if (!user || !user.is_active) {
    // Revoke token if user is gone or deactivated
    await refreshTokenModel.revoke(matchedToken.token_hash);
    throw new AuthenticationError('User account not found or deactivated');
  }

  // Generate new access token
  const accessToken = generateAccessToken(user);

  return { accessToken };
}

/**
 * Logout — revoke the refresh token
 * @param {string} refreshTokenStr
 */
async function logout(refreshTokenStr) {
  // Find and revoke the matching token
  const db = require('../config/database');
  const { rows } = await db.query(
    `SELECT id, token_hash
     FROM refresh_tokens
     WHERE revoked_at IS NULL AND expires_at > NOW()`,
  );

  for (const token of rows) {
    const isMatch = await bcrypt.compare(refreshTokenStr, token.token_hash);
    if (isMatch) {
      await refreshTokenModel.revoke(token.token_hash);
      return true;
    }
  }

  // Token not found — maybe already expired/revoked. Not an error.
  return false;
}

/**
 * Change user password
 * @param {string} publicId - User's public UUID
 * @param {string} currentPassword
 * @param {string} newPassword
 * @param {Object} meta - { ipAddress, userAgent }
 */
async function changePassword(publicId, currentPassword, newPassword, meta = {}) {
  // Get user with password hash
  const db = require('../config/database');
  const { rows } = await db.query(
    'SELECT id, public_id, password_hash FROM users WHERE public_id = $1 AND deleted_at IS NULL',
    [publicId],
  );

  const user = rows[0];
  if (!user) {
    throw new NotFoundError('User');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    throw new ValidationError('Current password is incorrect');
  }

  // Ensure new password is different
  const isSame = await bcrypt.compare(newPassword, user.password_hash);
  if (isSame) {
    throw new ValidationError('New password must be different from current password');
  }

  // Hash new password and update
  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userModel.updatePassword(publicId, newHash);

  // Revoke all refresh tokens (force re-login)
  await refreshTokenModel.revokeAllForUser(user.id);

  // Audit log
  await auditModel.create({
    userId: user.id,
    action: 'password_change',
    tableName: 'users',
    recordId: user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
}

module.exports = {
  login,
  refreshAccessToken,
  logout,
  changePassword,
};
