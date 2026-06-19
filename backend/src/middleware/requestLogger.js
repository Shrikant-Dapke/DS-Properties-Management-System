'use strict';

/**
 * DS Properties — HTTP Request Logger Middleware
 *
 * Logs every HTTP request using pino-http for structured output.
 * ADR-013: Use pino for structured logging (replaces morgan).
 */

const pinoHttp = require('pino-http');
const logger = require('../utils/logger');

const requestLogger = pinoHttp({
  logger,

  // Customize the log level based on response status
  customLogLevel (_req, res, err) {
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },

  // Customize the success message
  customSuccessMessage (req, res) {
    return `${req.method} ${req.url} → ${res.statusCode}`;
  },

  // Customize the error message
  customErrorMessage (req, res) {
    return `${req.method} ${req.url} → ${res.statusCode}`;
  },

  // Don't log these paths (noisy)
  autoLogging: {
    ignore (req) {
      return req.url === '/api/v1/health';
    },
  },

  // Customize what's serialized from the request
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

module.exports = requestLogger;
