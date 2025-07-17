"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoIdValidation = exports.payeeValidation = exports.accountValidation = exports.transferValidation = exports.registerValidation = exports.loginValidation = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = require("../config/logger");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined
        }));
        logger_1.logger.warn(`Validation errors for ${req.method} ${req.path}:`, formattedErrors);
        return res.status(400).json({
            error: 'Validation failed',
            details: formattedErrors
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('rememberMe')
        .optional()
        .isBoolean()
        .withMessage('Remember me must be a boolean')
];
exports.registerValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, and number'),
    (0, express_validator_1.body)('firstName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name must be 1-50 characters and contain only letters'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name must be 1-50 characters and contain only letters'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Valid phone number is required'),
    (0, express_validator_1.body)('dateOfBirth')
        .optional()
        .isISO8601()
        .toDate()
        .custom((value) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) {
            throw new Error('Must be at least 18 years old');
        }
        return true;
    }),
    (0, express_validator_1.body)('accountType')
        .optional()
        .isIn(['personal', 'business'])
        .withMessage('Account type must be personal or business')
];
exports.transferValidation = [
    (0, express_validator_1.body)('fromAccountId')
        .isMongoId()
        .withMessage('Valid from account ID is required'),
    (0, express_validator_1.body)('toAccountId')
        .isMongoId()
        .withMessage('Valid to account ID is required'),
    (0, express_validator_1.body)('amount')
        .isFloat({ min: 0.01, max: 1000000 })
        .withMessage('Amount must be between $0.01 and $1,000,000'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description must be less than 200 characters'),
    (0, express_validator_1.body)('scheduledDate')
        .optional()
        .isISO8601()
        .toDate()
        .custom((value) => {
        if (new Date(value) < new Date()) {
            throw new Error('Scheduled date must be in the future');
        }
        return true;
    })
];
exports.accountValidation = [
    (0, express_validator_1.body)('accountType')
        .isIn(['checking', 'savings', 'business', 'credit'])
        .withMessage('Account type must be checking, savings, business, or credit'),
    (0, express_validator_1.body)('accountName')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Account name must be 1-100 characters'),
    (0, express_validator_1.body)('initialDeposit')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Initial deposit must be a positive number')
];
exports.payeeValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Payee name must be 1-100 characters'),
    (0, express_validator_1.body)('accountNumber')
        .isLength({ min: 8, max: 20 })
        .matches(/^[0-9]+$/)
        .withMessage('Account number must be 8-20 digits'),
    (0, express_validator_1.body)('routingNumber')
        .isLength({ min: 9, max: 9 })
        .matches(/^[0-9]+$/)
        .withMessage('Routing number must be exactly 9 digits'),
    (0, express_validator_1.body)('bankName')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Bank name must be 1-100 characters'),
    (0, express_validator_1.body)('payeeType')
        .isIn(['personal', 'business', 'utility', 'government'])
        .withMessage('Payee type must be personal, business, utility, or government'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Valid phone number is required'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required')
];
const mongoIdValidation = (field) => [
    (0, express_validator_1.body)(field)
        .isMongoId()
        .withMessage(`Valid ${field} is required`)
];
exports.mongoIdValidation = mongoIdValidation;
//# sourceMappingURL=validation.js.map