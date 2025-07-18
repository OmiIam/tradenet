import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Simple JSON database interface
interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  account_type: 'personal' | 'business';
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Database {
  users: User[];
  accounts: any[];
  transactions: any[];
  payees: any[];
  adminLogs: any[];
  sessions: any[];
}

const DB_PATH = path.join(process.cwd(), '..', 'data.json');

function loadDatabase(): Database {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  
  return {
    users: [],
    accounts: [],
    transactions: [],
    payees: [],
    adminLogs: [],
    sessions: []
  };
}

function saveDatabase(db: Database): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

export const authService = {
  async findUserByEmail(email: string): Promise<User | null> {
    const db = loadDatabase();
    return db.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  },

  generateAccessToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isAdmin: user.is_admin,
      accountType: user.account_type
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: process.env.JWT_EXPIRE || '1h' } as SignOptions);
  },

  generateRefreshToken(userId: number): string {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
    const payload = { userId };
    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' } as SignOptions);
  },

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return null;
    }
  },

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    accountType?: 'personal' | 'business';
  }): Promise<User> {
    const db = loadDatabase();
    const passwordHash = await this.hashPassword(userData.password);
    
    const newUser: User = {
      id: Math.max(...db.users.map(u => u.id), 0) + 1,
      email: userData.email.toLowerCase(),
      password_hash: passwordHash,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      account_type: userData.accountType || 'personal',
      is_admin: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
  }
};