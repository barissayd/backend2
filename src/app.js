import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import notFound from './middlewares/notFound.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

// Behind a load balancer / reverse proxy (Heroku, Nginx, etc.)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — comma-separated allow-list, "*" for any
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  })
);

app.use(compression());

// Body parsers with hard size cap
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL injection and XSS
app.use(mongoSanitize());
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// HTTP request logging -> winston
app.use(
  morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: logger.stream,
  })
);

// Global rate limit
app.use('/api', globalLimiter);

// Mount API
app.use('/api/v1', apiRouter);

// 404 + global error handler (always last)
app.use(notFound);
app.use(errorHandler);

export default app;
