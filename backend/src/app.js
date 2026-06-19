'use strict';

/**
 * DS Properties — Express Application Setup
 *
 * Configures Express with security middleware, routing, and error handling.
 * This file exports the Express app instance. server.js handles listening.
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/environment');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { NotFoundError } = require('./utils/errors');

const app = express();

// --------------- Security Middleware ---------------

// Set secure HTTP headers
app.use(helmet());

// CORS — allow frontend origin
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Trust proxy (for correct IP behind Nginx)
if (env.isProd) {
  app.set('trust proxy', 1);
}

// --------------- Body Parsing ---------------

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// --------------- Request Logging ---------------

app.use(requestLogger);

// --------------- Routes ---------------

// Health check — public, no auth required
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: 'not_connected', // Will be updated when DB module is added (Task 07)
    version: '1.0.0',
  });
});

// API routes will be mounted here in Task 10+
// app.use('/api/v1', require('./routes'));

// --------------- 404 Handler ---------------

app.use((_req, _res, next) => {
  next(new NotFoundError('Route'));
});

// --------------- Global Error Handler ---------------

app.use(errorHandler);

module.exports = app;
