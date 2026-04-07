import AppError from '../utils/AppError.js';

/**
 * Validates request shape against a Zod schema describing
 * `{ body?, query?, params? }`. On success, replaces the request fields
 * with the parsed (and coerced) values.
 */
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    return next(new AppError('Validation failed', 422, result.error.flatten()));
  }

  if (result.data.body !== undefined) req.body = result.data.body;
  if (result.data.query !== undefined) req.query = result.data.query;
  if (result.data.params !== undefined) req.params = result.data.params;
  next();
};
