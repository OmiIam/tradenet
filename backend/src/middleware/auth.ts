import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    accountType: 'personal' | 'business';
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Fallback to httpOnly cookie
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
      logger.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      isAdmin: decoded.isAdmin,
      accountType: decoded.accountType
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expired', 
        code: 'TOKEN_EXPIRED' 
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Invalid token', 
        code: 'TOKEN_INVALID' 
      });
    }

    logger.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.user.isAdmin) {
    logger.warn(`Non-admin user ${req.user.email} attempted to access admin endpoint: ${req.path}`);
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  next();
};

export const requireBusinessAccount = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.accountType !== 'business' && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Business account required' });
  }

  next();
};

// Middleware to check if user owns the resource
export const requireOwnership = (userIdParam: string = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const resourceUserId = req.params[userIdParam];
    
    // Admin can access any resource
    if (req.user.isAdmin) {
      return next();
    }

    // User can only access their own resources
    if (req.user.id !== resourceUserId) {
      logger.warn(`User ${req.user.email} attempted to access resource belonging to user ${resourceUserId}`);
      return res.status(403).json({ error: 'Access denied to this resource' });
    }

    next();
  };
};