'use strict';

/**
 * DS Properties — Auth Routes
 *
 * POST /api/v1/auth/login      — public
 * POST /api/v1/auth/refresh    — public
 * POST /api/v1/auth/logout     — authenticated
 * PUT  /api/v1/auth/change-password — authenticated
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiter');
const { loginValidator, refreshValidator, changePasswordValidator } = require('../validators/authValidators');

// Public routes (with auth rate limiting)
router.post('/login', authLimiter, validate(loginValidator), authController.login);
router.post('/refresh', authLimiter, validate(refreshValidator), authController.refresh);

// Authenticated routes
router.post('/logout', authenticate, authController.logout);
router.put('/change-password', authenticate, validate(changePasswordValidator), authController.changePassword);

module.exports = router;
