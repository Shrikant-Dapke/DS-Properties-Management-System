'use strict';

/**
 * DS Properties — Custom Error Classes
 *
 * All application errors extend AppError with a statusCode.
 * The global errorHandler middleware uses these to format responses.
 */

class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   * @param {Array} errors - Optional array of field-level errors
   */
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Distinguishes expected errors from bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

class ValidationError extends AppError {
  /**
   * @param {string} message - Error message
   * @param {Array} errors - Array of { field, message } objects
   */
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400, errors);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied. Insufficient permissions.') {
    super(message, 403);
  }
}

class AccountLockedError extends AppError {
  constructor(lockedUntil) {
    super('Account is temporarily locked due to too many failed login attempts', 423);
    this.lockedUntil = lockedUntil;
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 429);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  AccountLockedError,
  ConflictError,
  RateLimitError,
};
