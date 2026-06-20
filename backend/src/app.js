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
const db = require('./config/database');
const requestLogger = require('./middleware/requestLogger');
const { globalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { NotFoundError } = require('./utils/errors');
const routes = require('./routes');

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

// --------------- Rate Limiting ---------------

app.use(globalLimiter);

// --------------- Routes ---------------

// Health check — public, no auth required
app.get('/api/v1/health', async (_req, res) => {
  const dbHealthy = await db.healthCheck();
  res.status(200).json({
    status: dbHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbHealthy ? 'connected' : 'disconnected',
    version: '1.0.0',
  });
});

// API routes
app.use('/api/v1', routes);

// --------------- 404 Handler ---------------

app.use((_req, _res, next) => {
  next(new NotFoundError('Route'));
});

// --------------- Global Error Handler ---------------

app.use(errorHandler);

module.exports = app;
