'use strict';

/**
 * DS Properties — Rate Limiter Middleware
 *
 * Tiered rate limiting: auth, write, read, global.
 * ADR-012: Express-rate-limit for rate limiting.
 */

const rateLimit = require('express-rate-limit');
const env = require('../config/environment');

// Auth endpoints — strict (10 req/min per IP)
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in a minute.',
  },
});

// Write endpoints — moderate (30 req/min per IP)
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});

// Read endpoints — permissive (200 req/min per IP)
const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please try again shortly.',
  },
});

// Global limiter (500 req/min per IP)
const globalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

module.exports = {
  authLimiter,
  writeLimiter,
  readLimiter,
  globalLimiter,
};
