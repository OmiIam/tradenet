"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../services/database"));
const validation_1 = require("../middleware/validation");
const security_1 = require("../middleware/security");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../config/logger");
const router = express_1.default.Router();
router.use(security_1.authRateLimiter);
router.post('/register', validation_1.registerValidation, validation_1.handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName, phone, dateOfBirth, address, city, state, zipCode, accountType = 'personal' } = req.body;
    const existingUser = await database_1.default.getUserByEmail(email);
    if (existingUser) {
        throw new errorHandler_1.ConflictError('User with this email already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await database_1.default.createUser({
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        phone,
        account_type: accountType,
        is_admin: false,
        is_active: true
    });
    const accessToken = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
        accountType: user.account_type
    }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '7d' });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
        path: '/'
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    });
    logger_1.logger.info(`New user registered: ${user.email}`);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isAdmin: user.is_admin,
            accountType: user.account_type
        },
        expiresAt: Date.now() + (60 * 60 * 1000)
    });
}));
router.post('/login', validation_1.loginValidation, validation_1.handleValidationErrors, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, rememberMe = false } = req.body;
    const user = await database_1.default.getUserByEmail(email);
    if (!user) {
        throw new errorHandler_1.AuthenticationError('Invalid email or password');
    }
    if (!user.is_active) {
        throw new errorHandler_1.AuthenticationError('Account has been deactivated');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new errorHandler_1.AuthenticationError('Invalid email or password');
    }
    const accessToken = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
        accountType: user.account_type
    }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '7d' });
    const accessTokenMaxAge = 60 * 60 * 1000;
    const refreshTokenMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: accessTokenMaxAge,
        path: '/'
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: refreshTokenMaxAge,
        path: '/'
    });
    logger_1.logger.info(`User logged in: ${user.email}`);
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isAdmin: user.is_admin,
            accountType: user.account_type
        },
        expiresAt: Date.now() + accessTokenMaxAge
    });
}));
router.get('/me', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await database_1.default.getUserByEmail(req.user.email);
    if (!user) {
        throw new errorHandler_1.AuthenticationError('User not found');
    }
    res.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            accountType: user.account_type,
            isAdmin: user.is_admin,
            createdAt: user.created_at
        }
    });
}));
router.post('/refresh', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new errorHandler_1.AuthenticationError('Refresh token required');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
        const accessToken = jsonwebtoken_1.default.sign(decoded, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
            path: '/'
        });
        res.json({
            success: true,
            expiresAt: Date.now() + (60 * 60 * 1000)
        });
    }
    catch (error) {
        throw new errorHandler_1.AuthenticationError('Invalid refresh token');
    }
}));
router.post('/logout', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map