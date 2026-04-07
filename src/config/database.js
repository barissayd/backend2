import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: env.NODE_ENV !== 'production',
    });
  } catch (err) {
    logger.error('MongoDB initial connection failed', err);
    process.exit(1);
  }

  const conn = mongoose.connection;

  conn.on('connected', () => logger.info(`MongoDB connected: ${conn.host}/${conn.name}`));
  conn.on('error', (err) => logger.error('MongoDB connection error', err));
  conn.on('disconnected', () => logger.warn('MongoDB disconnected'));
  conn.on('reconnected', () => logger.info('MongoDB reconnected'));

  process.on('SIGINT', async () => {
    await conn.close();
    logger.info('MongoDB connection closed via app termination');
    process.exit(0);
  });

  return conn;
};
