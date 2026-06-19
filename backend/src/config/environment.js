'use strict';

/**
 * DS Properties — Environment Configuration
 *
 * Loads and validates environment variables from .env file.
 * Fails fast on startup if required variables are missing.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validates that all required environment variables are present.
 * Throws an error with all missing variables listed.
 */
function validateEnv() {
  const required = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\nCopy .env.example to .env and fill in the values.`,
    );
  }

  // Warn about dev-mode secrets
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET.includes('dev_') || process.env.JWT_SECRET.includes('CHANGE_ME')) {
      throw new Error('JWT_SECRET must be changed from default value in production!');
    }
    if (process.env.JWT_REFRESH_SECRET.includes('dev_') || process.env.JWT_REFRESH_SECRET.includes('CHANGE_ME')) {
      throw new Error('JWT_REFRESH_SECRET must be changed from default value in production!');
    }
  }
}

// Run validation immediately on import
validateEnv();

const env = Object.freeze({
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://dsp_dev:dsp_dev_password@localhost:5432/dsp_development',

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 500,

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
});

module.exports = env;
