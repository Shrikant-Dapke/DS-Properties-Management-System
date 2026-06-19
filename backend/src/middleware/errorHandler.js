'use strict';

/**
 * DS Properties — Global Error Handler Middleware
 *
 * Catches all errors and formats them into a consistent JSON response.
 * Distinguishes operational errors (expected) from programming errors (bugs).
 */

const logger = require('../utils/logger');
const { AppError: _AppError } = require('../utils/errors');


function errorHandler(err, req, res, _next) {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Joi validation errors (from middleware/validate.js)
  if (err.isJoi) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/"/g, ''),
    }));
  }

  // PostgreSQL errors
  if (err.code && typeof err.code === 'string' && err.code.length === 5) {
    statusCode = 500;

    switch (err.code) {
      case '23505': // unique_violation
        statusCode = 409;
        message = 'A record with this value already exists';
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        message = 'Referenced record does not exist';
        break;
      case '23514': // check_violation
        statusCode = 400;
        message = 'Invalid value provided';
        break;
      case '23502': // not_null_violation
        statusCode = 400;
        message = 'Required field is missing';
        break;
      default:
        message = 'Database error';
    }
  }

  // Log the error
  if (statusCode >= 500) {
    // Server errors — log full stack trace
    logger.error({
      err,
      statusCode,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    }, `Server error: ${message}`);
  } else {
    // Client errors — log at warn level without stack trace
    logger.warn({
      statusCode,
      message,
      method: req.method,
      url: req.originalUrl,
    }, `Client error: ${message}`);
  }

  // In production, hide internal error details
  if (statusCode >= 500 && !err.isOperational) {
    message = 'An unexpected error occurred. Please try again later.';
    errors = [];
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && {
      stack: err.stack,
    }),
  });
}

module.exports = errorHandler;
