'use strict';

/**
 * DS Properties — Validation Middleware
 *
 * Validates request body/query/params against a Joi schema.
 * Returns 400 with field-level errors on failure.
 */

/**
 * Create validation middleware for a given Joi schema
 * @param {Joi.Schema} schema
 * @param {'body'|'query'|'params'} source - Where to validate from
 * @returns {Function} Express middleware
 */
function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,       // Collect all errors
      stripUnknown: true,      // Remove unknown fields
      allowUnknown: false,
    });

    if (error) {
      // Pass Joi error to error handler (which checks err.isJoi)
      return next(error);
    }

    // Replace request data with validated/sanitized values
    req[source] = value;
    next();
  };
}

module.exports = validate;
