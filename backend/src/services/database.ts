import SQLiteDatabase from '../config/sqlite';
import bcrypt from 'bcryptjs';
import { logger } from '../config/logger';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  account_type: 'personal' | 'business';
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  user_id: number;
  account_number: string;
  account_type: 'checking' | 'savings' | 'business' | 'cd';
  account_name: string;
  balance: number;
  available_balance: number;
  interest_rate: number;
  minimum_balance: number;
  monthly_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  transaction_type: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest' | 'adjustment';
  amount: number;
  balance_after: number;
  description: string;
  reference_number?: string;
  payee_id?: number;
  category: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  notes?: string;
  transaction_date: string;
  created_at: string;
  created_by?: number;
}

export interface Payee {
  id: number;
  user_id: number;
  name: string;
  account_number?: string;
  routing_number?: string;
  bank_name?: string;
  payee_type: 'person' | 'business' | 'utility' | 'government';
  phone?: string;
  email?: string;
  address?: string;
  memo?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  private db: SQLiteDatabase;

  constructor() {
    this.db = SQLiteDatabase.getInstance();
  }

  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO users (email, password_hash, first_name, last_name, phone, account_type, is_admin, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.phone || null,
        userData.account_type || 'personal',
        userData.is_admin ? 1 : 0,
        userData.is_active !== undefined ? (userData.is_active ? 1 : 0) : 1
      );

      const user = await this.getUserById(result.lastInsertRowid as number);
      if (!user) {
        throw new Error('Failed to create user');
      }
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM users WHERE id = ?');
      return stmt.get(id) as User || null;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM users WHERE email = ?');
      return stmt.get(email) as User || null;
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        UPDATE users 
        SET first_name = ?, last_name = ?, phone = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run(
        userData.first_name,
        userData.last_name,
        userData.phone || null,
        userData.is_active ? 1 : 0,
        id
      );

      return this.getUserById(id);
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM users ORDER BY created_at DESC');
      return stmt.all() as User[];
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  // Account operations
  async createAccount(accountData: Partial<Account>): Promise<Account> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO accounts (user_id, account_number, account_type, account_name, balance, available_balance, interest_rate, minimum_balance, monthly_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        accountData.user_id,
        accountData.account_number,
        accountData.account_type || 'checking',
        accountData.account_name,
        accountData.balance || 0,
        accountData.available_balance || 0,
        accountData.interest_rate || 0,
        accountData.minimum_balance || 0,
        accountData.monthly_fee || 0
      );

      const account = await this.getAccountById(result.lastInsertRowid as number);
      if (!account) {
        throw new Error('Failed to create account');
      }
      return account;
    } catch (error) {
      logger.error('Error creating account:', error);
      throw error;
    }
  }

  async getAccountById(id: number): Promise<Account | null> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM accounts WHERE id = ?');
      return stmt.get(id) as Account || null;
    } catch (error) {
      logger.error('Error getting account by ID:', error);
      throw error;
    }
  }

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM accounts WHERE user_id = ? AND is_active = 1');
      return stmt.all(userId) as Account[];
    } catch (error) {
      logger.error('Error getting accounts by user ID:', error);
      throw error;
    }
  }

  async updateAccountBalance(accountId: number, newBalance: number): Promise<Account | null> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        UPDATE accounts 
        SET balance = ?, available_balance = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run(newBalance, newBalance, accountId);
      return this.getAccountById(accountId);
    } catch (error) {
      logger.error('Error updating account balance:', error);
      throw error;
    }
  }

  async getAllAccounts(): Promise<Account[]> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM accounts ORDER BY created_at DESC');
      return stmt.all() as Account[];
    } catch (error) {
      logger.error('Error getting all accounts:', error);
      throw error;
    }
  }

  // Transaction operations
  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description, category, status, transaction_date, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        transactionData.account_id,
        transactionData.transaction_type,
        transactionData.amount,
        transactionData.balance_after,
        transactionData.description,
        transactionData.category || 'general',
        transactionData.status || 'completed',
        transactionData.transaction_date || new Date().toISOString(),
        transactionData.created_by || null
      );

      const transaction = await this.getTransactionById(result.lastInsertRowid as number);
      if (!transaction) {
        throw new Error('Failed to create transaction');
      }
      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM transactions WHERE id = ?');
      return stmt.get(id) as Transaction || null;
    } catch (error) {
      logger.error('Error getting transaction by ID:', error);
      throw error;
    }
  }

  async getTransactionsByAccountId(accountId: number, limit: number = 10): Promise<Transaction[]> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        SELECT * FROM transactions 
        WHERE account_id = ? 
        ORDER BY transaction_date DESC 
        LIMIT ?
      `);
      return stmt.all(accountId, limit) as Transaction[];
    } catch (error) {
      logger.error('Error getting transactions by account ID:', error);
      throw error;
    }
  }

  async getTransactionsByUserId(userId: number, limit: number = 10): Promise<Transaction[]> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        SELECT t.* FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = ?
        ORDER BY t.transaction_date DESC
        LIMIT ?
      `);
      return stmt.all(userId, limit) as Transaction[];
    } catch (error) {
      logger.error('Error getting transactions by user ID:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM transactions ORDER BY transaction_date DESC');
      return stmt.all() as Transaction[];
    } catch (error) {
      logger.error('Error getting all transactions:', error);
      throw error;
    }
  }

  // Payee operations
  async createPayee(payeeData: Partial<Payee>): Promise<Payee> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        INSERT INTO payees (user_id, name, account_number, routing_number, bank_name, payee_type, phone, email, memo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        payeeData.user_id,
        payeeData.name,
        payeeData.account_number || null,
        payeeData.routing_number || null,
        payeeData.bank_name || null,
        payeeData.payee_type || 'person',
        payeeData.phone || null,
        payeeData.email || null,
        payeeData.memo || null
      );

      const payee = await this.getPayeeById(result.lastInsertRowid as number);
      if (!payee) {
        throw new Error('Failed to create payee');
      }
      return payee;
    } catch (error) {
      logger.error('Error creating payee:', error);
      throw error;
    }
  }

  async getPayeeById(id: number): Promise<Payee | null> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM payees WHERE id = ?');
      return stmt.get(id) as Payee || null;
    } catch (error) {
      logger.error('Error getting payee by ID:', error);
      throw error;
    }
  }

  async getPayeesByUserId(userId: number): Promise<Payee[]> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM payees WHERE user_id = ? AND is_active = 1');
      return stmt.all(userId) as Payee[];
    } catch (error) {
      logger.error('Error getting payees by user ID:', error);
      throw error;
    }
  }

  // Dashboard and analytics
  async getTotalBalance(userId: number): Promise<number> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        SELECT SUM(balance) as total 
        FROM accounts 
        WHERE user_id = ? AND is_active = 1
      `);
      const result = stmt.get(userId) as { total: number };
      return result.total || 0;
    } catch (error) {
      logger.error('Error getting total balance:', error);
      throw error;
    }
  }

  async getPendingTransactionsCount(userId: number): Promise<number> {
    try {
      const stmt = this.db.getDatabase().prepare(`
        SELECT COUNT(*) as count 
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = ? AND t.status = 'pending'
      `);
      const result = stmt.get(userId) as { count: number };
      return result.count || 0;
    } catch (error) {
      logger.error('Error getting pending transactions count:', error);
      throw error;
    }
  }

  // Initialize database with test data
  async initializeTestData(): Promise<void> {
    try {
      // Check if data already exists
      const existingUsers = await this.getAllUsers();
      if (existingUsers.length > 0) {
        logger.info('Database already has test data');
        return;
      }

      logger.info('Initializing database with test data...');

      // Create test users
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user123', 10);
      const businessPassword = await bcrypt.hash('business123', 10);

      const adminUser = await this.createUser({
        email: 'admin@primeedge.com',
        password_hash: adminPassword,
        first_name: 'System',
        last_name: 'Administrator',
        account_type: 'personal',
        is_admin: true,
        is_active: true
      });

      const regularUser = await this.createUser({
        email: 'user@primeedge.com',
        password_hash: userPassword,
        first_name: 'John',
        last_name: 'Doe',
        phone: '(555) 123-4567',
        account_type: 'personal',
        is_admin: false,
        is_active: true
      });

      const businessUser = await this.createUser({
        email: 'business@primeedge.com',
        password_hash: businessPassword,
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '(555) 987-6543',
        account_type: 'business',
        is_admin: false,
        is_active: true
      });

      // Create test accounts
      const checkingAccount = await this.createAccount({
        user_id: regularUser.id,
        account_number: '4532123456789012',
        account_type: 'checking',
        account_name: 'Primary Checking',
        balance: 15420.50,
        available_balance: 15420.50,
        interest_rate: 0.01,
        minimum_balance: 100,
        monthly_fee: 0
      });

      const savingsAccount = await this.createAccount({
        user_id: regularUser.id,
        account_number: '4532567890123456',
        account_type: 'savings',
        account_name: 'Emergency Savings',
        balance: 25000.00,
        available_balance: 25000.00,
        interest_rate: 2.5,
        minimum_balance: 500,
        monthly_fee: 0
      });

      const businessAccount = await this.createAccount({
        user_id: businessUser.id,
        account_number: '4532901234567890',
        account_type: 'business',
        account_name: 'Business Operations',
        balance: 125000.75,
        available_balance: 125000.75,
        interest_rate: 0.5,
        minimum_balance: 1000,
        monthly_fee: 25
      });

      // Create test transactions
      await this.createTransaction({
        account_id: checkingAccount.id,
        transaction_type: 'credit',
        amount: 2500.00,
        balance_after: 15420.50,
        description: 'Salary Deposit',
        category: 'income',
        status: 'completed',
        transaction_date: new Date('2024-01-15T08:00:00Z').toISOString()
      });

      await this.createTransaction({
        account_id: checkingAccount.id,
        transaction_type: 'debit',
        amount: -150.00,
        balance_after: 14920.50,
        description: 'Grocery Store Purchase',
        category: 'food',
        status: 'completed',
        transaction_date: new Date('2024-01-14T10:30:00Z').toISOString()
      });

      // Create test payee
      await this.createPayee({
        user_id: regularUser.id,
        name: 'Electric Company',
        account_number: '9876543210',
        routing_number: '021000021',
        bank_name: 'Bank of America',
        payee_type: 'utility',
        phone: '(800) 555-0123',
        email: 'billing@electricco.com',
        memo: 'Monthly electricity bill'
      });

      logger.info('Test data initialization completed successfully');
    } catch (error) {
      logger.error('Error initializing test data:', error);
      throw error;
    }
  }
}

export default new DatabaseService();