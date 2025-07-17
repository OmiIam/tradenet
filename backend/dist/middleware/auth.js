"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnership = exports.requireBusinessAccount = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../config/logger");
const authenticateToken = (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        else {
            token = req.cookies?.accessToken;
        }
        if (!token) {
            return res.status(401).json({
                error: 'Access token required',
                code: 'TOKEN_MISSING'
            });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger_1.logger.error('JWT_SECRET not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            isAdmin: decoded.isAdmin,
            accountType: decoded.accountType
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Invalid token',
                code: 'TOKEN_INVALID'
            });
        }
        logger_1.logger.error('Authentication error:', error);
        return res.status(500).json({ error: 'Authentication error' });
    }
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (!req.user.isAdmin) {
        logger_1.logger.warn(`Non-admin user ${req.user.email} attempted to access admin endpoint: ${req.path}`);
        return res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireBusinessAccount = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.accountType !== 'business' && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Business account required' });
    }
    next();
};
exports.requireBusinessAccount = requireBusinessAccount;
const requireOwnership = (userIdParam = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const resourceUserId = req.params[userIdParam];
        if (req.user.isAdmin) {
            return next();
        }
        if (req.user.id !== resourceUserId) {
            logger_1.logger.warn(`User ${req.user.email} attempted to access resource belonging to user ${resourceUserId}`);
            return res.status(403).json({ error: 'Access denied to this resource' });
        }
        next();
    };
};
exports.requireOwnership = requireOwnership;
//# sourceMappingURL=auth.js.map