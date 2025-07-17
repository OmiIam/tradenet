-- Prime Edge Banking Database Schema
-- SQLite Database Structure

-- Users table - Store user authentication and profile information
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  account_type TEXT CHECK(account_type IN ('personal', 'business')) DEFAULT 'personal',
  is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table - Store bank account information
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT CHECK(account_type IN ('checking', 'savings', 'business', 'cd')) DEFAULT 'checking',
  account_name TEXT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  available_balance DECIMAL(15,2) DEFAULT 0.00,
  interest_rate DECIMAL(5,4) DEFAULT 0.0000,
  minimum_balance DECIMAL(15,2) DEFAULT 0.00,
  monthly_fee DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Transactions table - Store all transaction history
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  transaction_type TEXT CHECK(transaction_type IN ('debit', 'credit', 'transfer', 'fee', 'interest', 'adjustment')) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  reference_number TEXT UNIQUE,
  payee_id INTEGER,
  category TEXT DEFAULT 'general',
  status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'completed',
  notes TEXT,
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER, -- For admin-created transactions
  FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE,
  FOREIGN KEY (payee_id) REFERENCES payees (id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Payees table - Store payee information for transfers and payments
CREATE TABLE IF NOT EXISTS payees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  account_number TEXT,
  routing_number TEXT,
  bank_name TEXT,
  payee_type TEXT CHECK(payee_type IN ('person', 'business', 'utility', 'government')) DEFAULT 'person',
  phone TEXT,
  email TEXT,
  address TEXT,
  memo TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Admin logs table - Track all administrative actions for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'user', 'account', 'transaction', 'payee'
  target_id INTEGER NOT NULL,
  old_values TEXT, -- JSON string of old values
  new_values TEXT, -- JSON string of new values
  reason TEXT, -- Admin reason for the action
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Sessions table - Store user sessions for authentication
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Account types lookup table
CREATE TABLE IF NOT EXISTS account_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  min_balance DECIMAL(15,2) DEFAULT 0.00,
  monthly_fee DECIMAL(10,2) DEFAULT 0.00,
  interest_rate DECIMAL(5,4) DEFAULT 0.0000,
  is_active BOOLEAN DEFAULT TRUE
);

-- Transaction categories lookup table
CREATE TABLE IF NOT EXISTS transaction_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_system BOOLEAN DEFAULT FALSE, -- System categories cannot be deleted
  is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_number);
CREATE INDEX IF NOT EXISTS idx_payees_user_id ON payees(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);

-- Insert default account types
INSERT OR IGNORE INTO account_types (type_name, display_name, description, min_balance, monthly_fee, interest_rate) VALUES
('checking', 'Prime Checking', 'Everyday banking with no monthly fees and unlimited transactions', 100.00, 0.00, 0.0005),
('savings', 'High-Yield Savings', 'Grow your money with competitive interest rates', 0.00, 0.00, 0.0425),
('business', 'Business Checking', 'Flexible checking account for small to medium businesses', 500.00, 15.00, 0.0000),
('cd', 'Certificate of Deposit', 'Secure investment with guaranteed returns', 1000.00, 0.00, 0.0515);

-- Insert default transaction categories
INSERT OR IGNORE INTO transaction_categories (category_name, display_name, icon, color, is_system) VALUES
('transfer', 'Transfer', 'ArrowRightLeft', 'blue', TRUE),
('deposit', 'Deposit', 'Plus', 'green', TRUE),
('withdrawal', 'Withdrawal', 'Minus', 'red', TRUE),
('fee', 'Fee', 'AlertCircle', 'orange', TRUE),
('interest', 'Interest', 'TrendingUp', 'emerald', TRUE),
('adjustment', 'Adjustment', 'Settings', 'purple', TRUE),
('payment', 'Payment', 'CreditCard', 'indigo', FALSE),
('grocery', 'Groceries', 'ShoppingCart', 'green', FALSE),
('gas', 'Gas & Fuel', 'Fuel', 'yellow', FALSE),
('dining', 'Dining', 'Utensils', 'red', FALSE),
('entertainment', 'Entertainment', 'Music', 'purple', FALSE),
('utilities', 'Utilities', 'Zap', 'blue', FALSE),
('healthcare', 'Healthcare', 'Heart', 'pink', FALSE),
('shopping', 'Shopping', 'Bag', 'orange', FALSE),
('travel', 'Travel', 'Plane', 'cyan', FALSE),
('education', 'Education', 'GraduationCap', 'indigo', FALSE);