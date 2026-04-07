/**
 * Wraps an async route handler so any rejected promise is forwarded to the
 * global error middleware. Eliminates per-handler try/catch boilerplate.
 */
export const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
