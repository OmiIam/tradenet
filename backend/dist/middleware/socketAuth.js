"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../config/logger");
const authenticateSocket = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (!token) {
            logger_1.logger.warn('WebSocket connection attempted without token', {
                socketId: socket.id,
                ip: socket.handshake.address
            });
            return next(new Error('Authentication token required'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        if (!decoded || !decoded.id) {
            logger_1.logger.warn('WebSocket connection attempted with invalid token', {
                socketId: socket.id,
                ip: socket.handshake.address
            });
            return next(new Error('Invalid authentication token'));
        }
        socket.user = {
            id: decoded.id,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            isAdmin: decoded.isAdmin || false,
            accountType: decoded.accountType || 'personal'
        };
        logger_1.logger.info('WebSocket connection authenticated', {
            socketId: socket.id,
            userId: socket.user.id,
            userEmail: socket.user.email,
            isAdmin: socket.user.isAdmin
        });
        next();
    }
    catch (error) {
        logger_1.logger.error('WebSocket authentication error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            socketId: socket.id,
            ip: socket.handshake.address
        });
        next(new Error('Authentication failed'));
    }
};
exports.authenticateSocket = authenticateSocket;
exports.default = exports.authenticateSocket;
//# sourceMappingURL=socketAuth.js.map