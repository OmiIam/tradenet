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

  async getAllPayees(): Promise<Payee[]> {
    try {
      const stmt = this.db.getDatabase().prepare('SELECT * FROM payees ORDER BY created_at DESC');
      return stmt.all() as Payee[];
    } catch (error) {
      logger.error('Error getting all payees:', error);
      throw error;
    }
  }

  async updatePayee(id: number, updates: Partial<Payee>): Promise<Payee | null> {
    try {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);

      const stmt = this.db.getDatabase().prepare(`UPDATE payees SET ${fields} WHERE id = ?`);
      stmt.run(...values);

      return this.getPayeeById(id);
    } catch (error) {
      logger.error('Error updating payee:', error);
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

  // Initialize database with comprehensive test data
  async initializeTestData(): Promise<void> {
    try {
      // Check if data already exists
      const existingUsers = await this.getAllUsers();
      if (existingUsers.length > 0) {
        logger.info('Database already has test data');
        return;
      }

      logger.info('Initializing database with comprehensive test data...');

      // Create test users with hashed passwords
      const users = [
        {
          email: 'admin@primeedge.com',
          password: 'admin123',
          first_name: 'System',
          last_name: 'Administrator',
          phone: '(555) 000-0001',
          account_type: 'personal' as const,
          is_admin: true,
          is_active: true
        },
        {
          email: 'user@primeedge.com',
          password: 'user123',
          first_name: 'John',
          last_name: 'Doe',
          phone: '(555) 123-4567',
          account_type: 'personal' as const,
          is_admin: false,
          is_active: true
        },
        {
          email: 'business@primeedge.com',
          password: 'business123',
          first_name: 'Sarah',
          last_name: 'Johnson',
          phone: '(555) 987-6543',
          account_type: 'business' as const,
          is_admin: false,
          is_active: true
        },
        {
          email: 'mike.wilson@email.com',
          password: 'mike123',
          first_name: 'Mike',
          last_name: 'Wilson',
          phone: '(555) 111-2222',
          account_type: 'personal' as const,
          is_admin: false,
          is_active: false
        },
        {
          email: 'emily.davis@startup.io',
          password: 'emily123',
          first_name: 'Emily',
          last_name: 'Davis',
          phone: '(555) 333-4444',
          account_type: 'business' as const,
          is_admin: false,
          is_active: true
        },
        {
          email: 'lisa.brown@email.com',
          password: 'lisa123',
          first_name: 'Lisa',
          last_name: 'Brown',
          phone: '(555) 555-6666',
          account_type: 'personal' as const,
          is_admin: false,
          is_active: true
        }
      ];

      const createdUsers = [];
      for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.createUser({
          email: userData.email,
          password_hash: hashedPassword,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          account_type: userData.account_type,
          is_admin: userData.is_admin,
          is_active: userData.is_active
        });
        createdUsers.push(user);
      }

      // Create test accounts
      const accounts = [
        // John Doe accounts
        {
          user_id: createdUsers[1]?.id || 0,
          account_number: '4532123456789012',
          account_type: 'checking' as const,
          account_name: 'Primary Checking',
          balance: 15420.50,
          available_balance: 15420.50,
          interest_rate: 0.01,
          minimum_balance: 100,
          monthly_fee: 0
        },
        {
          user_id: createdUsers[1]?.id || 0,
          account_number: '4532567890123456',
          account_type: 'savings' as const,
          account_name: 'Emergency Savings',
          balance: 25000.00,
          available_balance: 25000.00,
          interest_rate: 2.5,
          minimum_balance: 500,
          monthly_fee: 0
        },
        // Sarah Johnson business account
        {
          user_id: createdUsers[2]?.id || 0,
          account_number: '4532901234567890',
          account_type: 'business' as const,
          account_name: 'Business Operations',
          balance: 125000.75,
          available_balance: 125000.75,
          interest_rate: 0.5,
          minimum_balance: 1000,
          monthly_fee: 25
        },
        // Mike Wilson account (inactive user)
        {
          user_id: createdUsers[3]?.id || 0,
          account_number: '4532111122223333',
          account_type: 'checking' as const,
          account_name: 'Personal Checking',
          balance: 5200.00,
          available_balance: 5200.00,
          interest_rate: 0.01,
          minimum_balance: 100,
          monthly_fee: 0
        },
        // Emily Davis business accounts
        {
          user_id: createdUsers[4]?.id || 0,
          account_number: '4532444455556666',
          account_type: 'business' as const,
          account_name: 'Startup Operations',
          balance: 89500.25,
          available_balance: 89500.25,
          interest_rate: 0.75,
          minimum_balance: 2500,
          monthly_fee: 50
        },
        {
          user_id: createdUsers[4]?.id || 0,
          account_number: '4532777788889999',
          account_type: 'checking' as const,
          account_name: 'Business Checking',
          balance: 45200.00,
          available_balance: 45200.00,
          interest_rate: 0.25,
          minimum_balance: 1000,
          monthly_fee: 15
        },
        // Lisa Brown accounts
        {
          user_id: createdUsers[5]?.id || 0,
          account_number: '4532000011112222',
          account_type: 'checking' as const,
          account_name: 'Main Checking',
          balance: 18500.25,
          available_balance: 18500.25,
          interest_rate: 0.01,
          minimum_balance: 100,
          monthly_fee: 0
        },
        {
          user_id: createdUsers[5]?.id || 0,
          account_number: '4532333344445555',
          account_type: 'savings' as const,
          account_name: 'Vacation Fund',
          balance: 10000.00,
          available_balance: 10000.00,
          interest_rate: 3.0,
          minimum_balance: 500,
          monthly_fee: 0
        }
      ];

      const createdAccounts = [];
      for (const accountData of accounts) {
        const account = await this.createAccount(accountData);
        createdAccounts.push(account);
      }

      // Create comprehensive test transactions
      const transactionTemplates = [
        // John Doe transactions
        { account: 0, type: 'credit', amount: 2500.00, desc: 'Salary Deposit', category: 'income', days_ago: 1 },
        { account: 0, type: 'debit', amount: -150.00, desc: 'Grocery Store Purchase', category: 'food', days_ago: 2 },
        { account: 0, type: 'debit', amount: -89.99, desc: 'Gas Station', category: 'transportation', days_ago: 3 },
        { account: 0, type: 'debit', amount: -45.00, desc: 'Restaurant Dinner', category: 'food', days_ago: 4 },
        { account: 0, type: 'transfer', amount: -500.00, desc: 'Transfer to Savings', category: 'transfer', days_ago: 5 },
        { account: 1, type: 'transfer', amount: 500.00, desc: 'Transfer from Checking', category: 'transfer', days_ago: 5 },
        { account: 1, type: 'credit', amount: 25.50, desc: 'Interest Payment', category: 'interest', days_ago: 30 },
        
        // Sarah Johnson business transactions
        { account: 2, type: 'credit', amount: 15000.00, desc: 'Client Payment - Project Alpha', category: 'income', days_ago: 1 },
        { account: 2, type: 'debit', amount: -2500.00, desc: 'Office Rent', category: 'business', days_ago: 2 },
        { account: 2, type: 'debit', amount: -1200.00, desc: 'Employee Salaries', category: 'business', days_ago: 3 },
        { account: 2, type: 'debit', amount: -89.99, desc: 'Office Supplies', category: 'business', days_ago: 4 },
        
        // Emily Davis startup transactions
        { account: 4, type: 'credit', amount: 50000.00, desc: 'Investor Funding Round', category: 'income', days_ago: 7 },
        { account: 4, type: 'debit', amount: -5000.00, desc: 'Software Licenses', category: 'business', days_ago: 8 },
        { account: 4, type: 'debit', amount: -3500.00, desc: 'Marketing Campaign', category: 'business', days_ago: 10 },
        { account: 5, type: 'credit', amount: 8500.00, desc: 'Product Sales Revenue', category: 'income', days_ago: 2 },
        { account: 5, type: 'debit', amount: -1200.00, desc: 'Payment Processing Fees', category: 'business', days_ago: 3 },
        
        // Lisa Brown transactions
        { account: 6, type: 'credit', amount: 3200.00, desc: 'Salary Deposit', category: 'income', days_ago: 1 },
        { account: 6, type: 'debit', amount: -1200.00, desc: 'Rent Payment', category: 'housing', days_ago: 2 },
        { account: 6, type: 'debit', amount: -350.00, desc: 'Utility Bills', category: 'utilities', days_ago: 3 },
        { account: 6, type: 'transfer', amount: -500.00, desc: 'Transfer to Vacation Fund', category: 'transfer', days_ago: 4 },
        { account: 7, type: 'transfer', amount: 500.00, desc: 'Transfer from Checking', category: 'transfer', days_ago: 4 }
      ];

      for (const template of transactionTemplates) {
        const account = createdAccounts[template.account];
        if (!account) continue;
        const transactionDate = new Date();
        transactionDate.setDate(transactionDate.getDate() - template.days_ago);
        
        await this.createTransaction({
          account_id: account.id,
          transaction_type: template.type as any,
          amount: template.amount,
          balance_after: account.balance, // Simplified - would need proper calculation
          description: template.desc,
          category: template.category,
          status: 'completed',
          transaction_date: transactionDate.toISOString()
        });
      }

      // Create test payees
      const payees = [
        {
          user_id: createdUsers[1]?.id || 0,
          name: 'Electric Company',
          account_number: '9876543210',
          routing_number: '021000021',
          bank_name: 'Bank of America',
          payee_type: 'utility' as const,
          phone: '(800) 555-0123',
          email: 'billing@electricco.com',
          memo: 'Monthly electricity bill'
        },
        {
          user_id: createdUsers[1]?.id || 0,
          name: 'Jane Smith',
          account_number: '1234567890',
          routing_number: '021000021',
          bank_name: 'Chase Bank',
          payee_type: 'person' as const,
          phone: '(555) 234-5678',
          email: 'jane.smith@email.com',
          memo: 'Friend - split expenses'
        },
        {
          user_id: createdUsers[2]?.id || 0,
          name: 'Office Landlord LLC',
          account_number: '5555666677',
          routing_number: '021000021',
          bank_name: 'Wells Fargo',
          payee_type: 'business' as const,
          phone: '(555) 777-8888',
          email: 'rent@officespace.com',
          memo: 'Monthly office rent'
        }
      ];

      for (const payeeData of payees) {
        await this.createPayee(payeeData);
      }

      logger.info('Comprehensive test data initialization completed successfully');
    } catch (error) {
      logger.error('Error initializing test data:', error);
      throw error;
    }
  }
}

export default new DatabaseService();