import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import DatabaseService from '../services/database';
import { 
  loginValidation, 
  registerValidation, 
  handleValidationErrors 
} from '../middleware/validation';
import { 
  authRateLimiter 
} from '../middleware/security';
import { 
  authenticateToken, 
  AuthenticatedRequest 
} from '../middleware/auth';
import { 
  asyncHandler,
  AuthenticationError,
  ConflictError,
  ValidationError 
} from '../middleware/errorHandler';
import { logger } from '../config/logger';

const router = express.Router();

// Apply auth rate limiting to all auth routes
router.use(authRateLimiter);

// Register endpoint
router.post('/register', 
  registerValidation,
  handleValidationErrors,
  asyncHandler(async (req: any, res: any) => {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      accountType = 'personal'
    } = req.body;

    // Check if user already exists
    const existingUser = await DatabaseService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await DatabaseService.createUser({
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone,
      account_type: accountType,
      is_admin: false,
      is_active: true
    });

    // Generate tokens
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
        accountType: user.account_type
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    logger.info(`New user registered: ${user.email}`);

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
  })
);

// Login endpoint
router.post('/login',
  loginValidation,
  handleValidationErrors,
  asyncHandler(async (req: any, res: any) => {
    const { email, password, rememberMe = false } = req.body;

    // Find user by email
    const user = await DatabaseService.getUserByEmail(email);
    
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if account is active
    if (!user.is_active) {
      throw new AuthenticationError('Account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
        accountType: user.account_type
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );

    // Set httpOnly cookies
    const accessTokenMaxAge = 60 * 60 * 1000; // 1 hour
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

    logger.info(`User logged in: ${user.email}`);

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
  })
);

// Get current user endpoint
router.get('/me',
  authenticateToken,
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const user = await DatabaseService.getUserByEmail(req.user!.email);
    
    if (!user) {
      throw new AuthenticationError('User not found');
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
  })
);

// Refresh token endpoint
router.post('/refresh',
  asyncHandler(async (req: any, res: any) => {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token required');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret') as any;
      // For simplicity, we'll just generate a new token without looking up the user
      // In a real app, you'd want to validate the user still exists and is active
      
      // Generate new access token
      const accessToken = jwt.sign(
        decoded,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      // Set new access token cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
        path: '/'
      });

      res.json({
        success: true,
        expiresAt: Date.now() + (60 * 60 * 1000)
      });

    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  })
);

// Logout endpoint
router.post('/logout',
  asyncHandler(async (req: any, res: any) => {
    // Clear cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  })
);

export default router;