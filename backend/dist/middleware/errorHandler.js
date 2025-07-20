"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.globalErrorHandler = exports.notFoundHandler = exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.ForbiddenError = exports.AuthenticationError = exports.ValidationError = void 0;
const logger_1 = require("../config/logger");
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.isOperational = true;
        this.code = 'VALIDATION_ERROR';
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends Error {
    constructor(message = 'Authentication required') {
        super(message);
        this.statusCode = 401;
        this.isOperational = true;
        this.code = 'AUTHENTICATION_ERROR';
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class ForbiddenError extends Error {
    constructor(message = 'Access forbidden') {
        super(message);
        this.statusCode = 403;
        this.isOperational = true;
        this.code = 'FORBIDDEN_ERROR';
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
class AuthorizationError extends Error {
    constructor(message = 'Insufficient privileges') {
        super(message);
        this.statusCode = 403;
        this.isOperational = true;
        this.code = 'AUTHORIZATION_ERROR';
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.statusCode = 404;
        this.isOperational = true;
        this.code = 'NOT_FOUND';
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 409;
        this.isOperational = true;
        this.code = 'CONFLICT';
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends Error {
    constructor(message = 'Internal server error') {
        super(message);
        this.statusCode = 500;
        this.isOperational = false;
        this.code = 'INTERNAL_SERVER_ERROR';
        this.name = 'InternalServerError';
    }
}
exports.InternalServerError = InternalServerError;
const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.isOperational = err.isOperational ?? false;
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        user: req.user?.email || 'anonymous'
    };
    if (err.statusCode >= 500) {
        logger_1.logger.error('Server Error:', errorDetails);
    }
    else {
        logger_1.logger.warn('Client Error:', errorDetails);
    }
    let response = {
        error: err.message,
        code: err.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
        path: req.path
    };
    if (err.name === 'ValidationError') {
        response.error = 'Validation failed';
        response.details = err.message;
        err.statusCode = 400;
    }
    if (err.name === 'CastError') {
        response.error = 'Invalid ID format';
        err.statusCode = 400;
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
        response.error = 'Duplicate entry';
        response.field = Object.keys(err.keyValue)[0];
        err.statusCode = 409;
    }
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
    if (process.env.NODE_ENV === 'production' && err.statusCode >= 500) {
        response = {
            error: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
            timestamp: new Date().toISOString(),
            path: req.path
        };
    }
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    res.status(err.statusCode).json(response);
};
exports.globalErrorHandler = globalErrorHandler;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map