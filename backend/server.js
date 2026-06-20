'use strict';

/**
 * DS Properties — HTTP Server Entry Point
 *
 * Imports the Express app and starts the HTTP server.
 * Handles graceful shutdown on SIGTERM/SIGINT.
 */

const app = require('./src/app');
const env = require('./src/config/environment');
const logger = require('./src/utils/logger');
const { pool } = require('./src/config/database');

const server = app.listen(env.port, () => {
  logger.info({
    port: env.port,
    env: env.nodeEnv,
    pid: process.pid,
  }, `🚀 DS Properties API server running on port ${env.port}`);
});

// --------------- Graceful Shutdown ---------------

async function gracefulShutdown(signal) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async (err) => {
    if (err) {
      logger.error(err, 'Error during server shutdown');
      process.exit(1);
    }

    logger.info('HTTP server closed');

    // Close database connection pool
    try {
      await pool.end();
      logger.info('Database pool closed');
    } catch (poolErr) {
      logger.error(poolErr, 'Error closing database pool');
    }

    logger.info('Graceful shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown — could not close connections in time');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// --------------- Unhandled Error Handlers ---------------

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled Promise Rejection');
  // In production, you may want to restart the process
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception — shutting down');
  process.exit(1);
});
