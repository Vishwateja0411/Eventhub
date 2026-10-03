/**
 * Global error handler middleware.
 * Must be registered AFTER all routes (4 arguments = Express error handler).
 */
const errorHandler = (err, req, res, next) => {
  // Log the error (never expose stack traces in production)
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${err.message}`, err.stack);
  } else {
    console.error(`[ERROR] ${err.message}`);
  }

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: `A record with this ${err.meta?.target?.join(', ')} already exists.`,
    });
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.meta?.cause || 'Record not found.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token expired.' });
  }

  // Zod validation errors (thrown manually)
  if (err.name === 'ZodError') {
    return res.status(422).json({
      error: 'Validation Error',
      issues: err.errors,
    });
  }

  // Known HTTP errors (thrown with err.status)
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Error',
    message: err.message || 'Internal server error.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
