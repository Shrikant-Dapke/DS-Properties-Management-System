'use strict';

/**
 * DS Properties — JWT Authentication Middleware
 *
 * Verifies the Bearer token from the Authorization header.
 * Attaches req.user = { id, publicId, role } on success.
 */

const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const { AuthenticationError } = require('../utils/errors');

function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Access token required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: payload.userId,
      publicId: payload.publicId,
      role: payload.role,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Access token expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Invalid access token'));
    }
    next(new AuthenticationError('Authentication failed'));
  }
}

module.exports = authenticate;
