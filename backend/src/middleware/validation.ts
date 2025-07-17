import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { logger } from '../config/logger';

// Generic validation middleware
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));

    logger.warn(`Validation errors for ${req.method} ${req.path}:`, formattedErrors);
    
    return res.status(400).json({
      error: 'Validation failed',
      details: formattedErrors
    });
  }
  
  next();
};

// Authentication validation rules
export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('Remember me must be a boolean')
];

export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, and number'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must be 1-50 characters and contain only letters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must be 1-50 characters and contain only letters'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Valid phone number is required'),
  body('dateOfBirth')
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
  body('accountType')
    .optional()
    .isIn(['personal', 'business'])
    .withMessage('Account type must be personal or business')
];

// Transaction validation rules
export const transferValidation: ValidationChain[] = [
  body('fromAccountId')
    .isMongoId()
    .withMessage('Valid from account ID is required'),
  body('toAccountId')
    .isMongoId()
    .withMessage('Valid to account ID is required'),
  body('amount')
    .isFloat({ min: 0.01, max: 1000000 })
    .withMessage('Amount must be between $0.01 and $1,000,000'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters'),
  body('scheduledDate')
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

// Account validation rules
export const accountValidation: ValidationChain[] = [
  body('accountType')
    .isIn(['checking', 'savings', 'business', 'credit'])
    .withMessage('Account type must be checking, savings, business, or credit'),
  body('accountName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Account name must be 1-100 characters'),
  body('initialDeposit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Initial deposit must be a positive number')
];

// Payee validation rules
export const payeeValidation: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Payee name must be 1-100 characters'),
  body('accountNumber')
    .isLength({ min: 8, max: 20 })
    .matches(/^[0-9]+$/)
    .withMessage('Account number must be 8-20 digits'),
  body('routingNumber')
    .isLength({ min: 9, max: 9 })
    .matches(/^[0-9]+$/)
    .withMessage('Routing number must be exactly 9 digits'),
  body('bankName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Bank name must be 1-100 characters'),
  body('payeeType')
    .isIn(['personal', 'business', 'utility', 'government'])
    .withMessage('Payee type must be personal, business, utility, or government'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Valid phone number is required'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
];

// Generic MongoDB ObjectId validation
export const mongoIdValidation = (field: string) => [
  body(field)
    .isMongoId()
    .withMessage(`Valid ${field} is required`)
];