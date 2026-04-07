import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue?.[field];
  return new AppError(`Duplicate value for ${field}: "${value}"`, 409);
};

const handleMongooseValidation = (err) => {
  const details = Object.fromEntries(
    Object.entries(err.errors).map(([k, v]) => [k, v.message])
  );
  return new AppError('Validation failed', 422, details);
};

const handleZod = (err) =>
  new AppError('Validation failed', 422, err.flatten());

const handleJwt = () => new AppError('Invalid token. Please log in again.', 401);
const handleJwtExpired = () => new AppError('Token expired. Please log in again.', 401);

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, _next) {
  let error = err;

  if (err.name === 'CastError') error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKey(err);
  else if (err.name === 'ValidationError') error = handleMongooseValidation(err);
  else if (err instanceof ZodError) error = handleZod(err);
  else if (err.name === 'JsonWebTokenError') error = handleJwt();
  else if (err.name === 'TokenExpiredError') error = handleJwtExpired();

  if (!(error instanceof AppError)) {
    error = new AppError(error.message || 'Internal Server Error', error.statusCode || 500);
    error.isOperational = false;
  }

  // Log every error — full detail in dev, structured in prod
  const logPayload = {
    method: req.method,
    url: req.originalUrl,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.details && { details: error.details }),
  };
  if (error.statusCode >= 500) logger.error('Request failed', { ...logPayload, stack: err.stack });
  else logger.warn('Request rejected', logPayload);

  const body = {
    status: error.status,
    message: error.message,
    ...(error.details && { details: error.details }),
  };

  if (env.NODE_ENV === 'development') {
    body.stack = err.stack;
  } else if (!error.isOperational) {
    // Hide programmer-error internals in production
    body.message = 'Something went wrong';
    delete body.details;
  }

  res.status(error.statusCode).json(body);
}
