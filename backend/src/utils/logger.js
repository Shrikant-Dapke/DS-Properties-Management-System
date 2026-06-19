'use strict';

/**
 * DS Properties — Logger (pino)
 *
 * Structured JSON logger for production, human-readable for development.
 * ADR-013: Use pino for structured logging.
 */

const pino = require('pino');
const env = require('../config/environment');

const logger = pino({
  level: env.logLevel,

  // In production, output raw JSON for log aggregation tools
  // In development, pino-pretty is used via pipe in npm run dev
  ...(env.isDev
    ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      },
    }
    : {}),

  // Base fields included in every log
  base: {
    service: 'ds-properties-api',
    env: env.nodeEnv,
  },

  // Redact sensitive fields from logs
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'passwordHash', 'token'],
    censor: '[REDACTED]',
  },
});

module.exports = logger;
