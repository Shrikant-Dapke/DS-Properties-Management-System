'use strict';

/**
 * DS Properties — Route Index
 *
 * Mounts all API route groups under /api/v1.
 */

const express = require('express');
const router = express.Router();

// Route groups
const authRoutes = require('./authRoutes');

// Mount routes
router.use('/auth', authRoutes);

// Future route groups will be mounted here:
// router.use('/users', require('./userRoutes'));
// router.use('/customers', require('./customerRoutes'));
// router.use('/transactions', require('./transactionRoutes'));
// router.use('/dashboard', require('./dashboardRoutes'));
// router.use('/reports', require('./reportRoutes'));
// router.use('/settings', require('./settingsRoutes'));

module.exports = router;
