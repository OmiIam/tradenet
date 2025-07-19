import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Simple database interface
const DB_PATH = path.join(process.cwd(), '..', 'data.json');

function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  
  // Create default test users if no database exists
  const defaultUsers = [
    {
      id: 1,
      email: 'admin@primeedge.com',
      password_hash: '$2a$10$SQpCjnC3Q8P6QyBOfcqBDORSF8Ei4buZU621HqCjEcXD0cDjUdzSq',
      first_name: 'System',
      last_name: 'Administrator',
      phone: '(555) 000-0000',
      account_type: 'personal',
      is_admin: true,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      email: 'user@primeedge.com',
      password_hash: '$2a$10$4lSMDyivmM.qdtuqbabIAeYQUcxvHW3NoHsd1kf7BE4rvOvdI865e',
      first_name: 'John',
      last_name: 'Doe',
      phone: '(555) 123-4567',
      account_type: 'personal',
      is_admin: false,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'business@primeedge.com',
      password_hash: '$2a$10$R7eDV5boW5sLotfMZWp/FO99mSwBToXj2gVSQ57PgV1NRa3.L5hoi',
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone: '(555) 987-6543',
      account_type: 'business',
      is_admin: false,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];
  
  return { users: defaultUsers, accounts: [], transactions: [], payees: [], adminLogs: [], sessions: [] };
}

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = loadDatabase();
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
      path: '/'
    });

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
      accessToken,
      refreshToken,
      expiresAt: Date.now() + (60 * 60 * 1000)
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get current user endpoint
router.get('/me', (req, res) => {
  try {
    let token: string | undefined;

    // Check Authorization header first (for cross-origin requests)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Fallback to httpOnly cookie
      token = req.cookies?.accessToken;
    }

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    const db = loadDatabase();
    const user = db.users.find((u: any) => u.id === decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User not found' });
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

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;