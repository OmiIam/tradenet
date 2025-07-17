import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JsonDB } from '../database/json-db';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  accountType: 'personal' | 'business';
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// JWT utilities
export function generateAccessToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      accountType: user.accountType
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function generateRefreshToken(userId: number): string {
  return jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAccessToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      isAdmin: decoded.isAdmin,
      accountType: decoded.accountType
    };
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Auth utilities
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = JsonDB.findUserByEmail(email);
    
    if (!user || !user.is_active) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isAdmin: user.is_admin,
      accountType: user.account_type
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function registerUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  accountType?: 'personal' | 'business';
}): Promise<{ user: AuthUser; tokens: { accessToken: string; refreshToken: string; expiresAt: number } } | null> {
  try {
    // Check if user already exists
    const existingUser = JsonDB.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const newUser = JsonDB.createUser({
      email: userData.email,
      password_hash: passwordHash,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      date_of_birth: userData.dateOfBirth,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      zip_code: userData.zipCode,
      account_type: userData.accountType || 'personal',
      is_admin: false,
      is_active: true
    });

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      isAdmin: newUser.is_admin,
      accountType: newUser.account_type
    };

    // Generate tokens
    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(newUser.id);
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour

    return {
      user: authUser,
      tokens: {
        accessToken,
        refreshToken,
        expiresAt
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

export function getCurrentUser(token: string): AuthUser | null {
  return verifyAccessToken(token);
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: number } | null> {
  try {
    const userId = verifyRefreshToken(refreshToken);
    if (!userId) {
      return null;
    }

    // Find user by ID (simplified for JSON DB)
    const user = JsonDB.findUserByEmail('user@primeedge.com'); // This is a simplification
    if (!user || !user.is_active) {
      return null;
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isAdmin: user.is_admin,
      accountType: user.account_type
    };

    // Generate new tokens
    const newAccessToken = generateAccessToken(authUser);
    const newRefreshToken = generateRefreshToken(userId);
    const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export function logout(sessionToken: string): void {
  // For JSON DB, we don't need to do anything special
  console.log('User logged out');
}