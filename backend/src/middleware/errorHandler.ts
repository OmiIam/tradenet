import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../config/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

// Custom error classes
export class ValidationError extends Error {
  statusCode = 400;
  isOperational = true;
  code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  statusCode = 401;
  isOperational = true;
  code = 'AUTHENTICATION_ERROR';

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  isOperational = true;
  code = 'FORBIDDEN_ERROR';

  constructor(message: string = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class AuthorizationError extends Error {
  statusCode = 403;
  isOperational = true;
  code = 'AUTHORIZATION_ERROR';

  constructor(message: string = 'Insufficient privileges') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  isOperational = true;
  code = 'NOT_FOUND';

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  isOperational = true;
  code = 'CONFLICT';

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends Error {
  statusCode = 500;
  isOperational = false;
  code = 'INTERNAL_SERVER_ERROR';

  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
  }
}

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  next(error);
};

// Global error handler
export const globalErrorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error properties
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational ?? false;

  // Log error details
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: (req as any).user?.email || 'anonymous'
  };

  if (err.statusCode >= 500) {
    logger.error('Server Error:', errorDetails);
  } else {
    logger.warn('Client Error:', errorDetails);
  }

  // Handle specific error types
  let response: any = {
    error: err.message,
    code: err.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString(),
    path: req.path
  };

  // Handle MongoDB errors
  if (err.name === 'ValidationError') {
    response.error = 'Validation failed';
    response.details = err.message;
    err.statusCode = 400;
  }

  if (err.name === 'CastError') {
    response.error = 'Invalid ID format';
    err.statusCode = 400;
  }

  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    response.error = 'Duplicate entry';
    response.field = Object.keys((err as any).keyValue)[0];
    err.statusCode = 409;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    response.error = 'Invalid token';
    response.code = 'TOKEN_INVALID';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    response.error = 'Token expired';
    response.code = 'TOKEN_EXPIRED';
    err.statusCode = 401;
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && err.statusCode >= 500) {
    response = {
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      path: req.path
    };
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(err.statusCode).json(response);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};