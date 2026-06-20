'use strict';

/**
 * DS Properties — Role Authorization Middleware
 *
 * Factory function that creates middleware to check user roles.
 * Usage: authorize('admin'), authorize('admin', 'operator')
 */

const { ForbiddenError } = require('../utils/errors');

function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
}

module.exports = authorize;
