import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectDB } from './src/config/database.js';
import { logger } from './src/utils/logger.js';

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION — shutting down', err);
  process.exit(1);
});

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on :${env.PORT} (${env.NODE_ENV})`);
  });

  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION — shutting down', err);
    server.close(() => process.exit(1));
  });

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      logger.info(`${signal} received — closing server`);
      server.close(() => process.exit(0));
    });
  });
};

start();
