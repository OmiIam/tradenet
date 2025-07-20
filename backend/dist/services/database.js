"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const sqlite_1 = __importDefault(require("../config/sqlite"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../config/logger");
class DatabaseService {
    constructor() {
        this.db = sqlite_1.default.getInstance();
    }
    async createUser(userData) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        INSERT INTO users (email, password_hash, first_name, last_name, phone, account_type, is_admin, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const result = stmt.run(userData.email, userData.password_hash, userData.first_name, userData.last_name, userData.phone || null, userData.account_type || 'personal', userData.is_admin ? 1 : 0, userData.is_active !== undefined ? (userData.is_active ? 1 : 0) : 1);
            const user = await this.getUserById(result.lastInsertRowid);
            if (!user) {
                throw new Error('Failed to create user');
            }
            return user;
        }
        catch (error) {
            logger_1.logger.error('Error creating user:', error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM users WHERE id = ?');
            return stmt.get(id) || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting user by ID:', error);
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM users WHERE email = ?');
            return stmt.get(email) || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting user by email:', error);
            throw error;
        }
    }
    async updateUser(id, userData) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        UPDATE users 
        SET first_name = ?, last_name = ?, phone = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
            stmt.run(userData.first_name, userData.last_name, userData.phone || null, userData.is_active ? 1 : 0, id);
            return this.getUserById(id);
        }
        catch (error) {
            logger_1.logger.error('Error updating user:', error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM users ORDER BY created_at DESC');
            return stmt.all();
        }
        catch (error) {
            logger_1.logger.error('Error getting all users:', error);
            throw error;
        }
    }
    async createAccount(accountData) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        INSERT INTO accounts (user_id, account_number, account_type, account_name, balance, available_balance, interest_rate, minimum_balance, monthly_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const result = stmt.run(accountData.user_id, accountData.account_number, accountData.account_type || 'checking', accountData.account_name, accountData.balance || 0, accountData.available_balance || 0, accountData.interest_rate || 0, accountData.minimum_balance || 0, accountData.monthly_fee || 0);
            const account = await this.getAccountById(result.lastInsertRowid);
            if (!account) {
                throw new Error('Failed to create account');
            }
            return account;
        }
        catch (error) {
            logger_1.logger.error('Error creating account:', error);
            throw error;
        }
    }
    async getAccountById(id) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM accounts WHERE id = ?');
            return stmt.get(id) || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting account by ID:', error);
            throw error;
        }
    }
    async getAccountsByUserId(userId) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM accounts WHERE user_id = ? AND is_active = 1');
            return stmt.all(userId);
        }
        catch (error) {
            logger_1.logger.error('Error getting accounts by user ID:', error);
            throw error;
        }
    }
    async updateAccountBalance(accountId, newBalance) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        UPDATE accounts 
        SET balance = ?, available_balance = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
            stmt.run(newBalance, newBalance, accountId);
            return this.getAccountById(accountId);
        }
        catch (error) {
            logger_1.logger.error('Error updating account balance:', error);
            throw error;
        }
    }
    async getAllAccounts() {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM accounts ORDER BY created_at DESC');
            return stmt.all();
        }
        catch (error) {
            logger_1.logger.error('Error getting all accounts:', error);
            throw error;
        }
    }
    async createTransaction(transactionData) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description, category, status, transaction_date, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const result = stmt.run(transactionData.account_id, transactionData.transaction_type, transactionData.amount, transactionData.balance_after, transactionData.description, transactionData.category || 'general', transactionData.status || 'completed', transactionData.transaction_date || new Date().toISOString(), transactionData.created_by || null);
            const transaction = await this.getTransactionById(result.lastInsertRowid);
            if (!transaction) {
                throw new Error('Failed to create transaction');
            }
            return transaction;
        }
        catch (error) {
            logger_1.logger.error('Error creating transaction:', error);
            throw error;
        }
    }
    async getTransactionById(id) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM transactions WHERE id = ?');
            return stmt.get(id) || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting transaction by ID:', error);
            throw error;
        }
    }
    async getTransactionsByAccountId(accountId, limit = 10) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT * FROM transactions 
        WHERE account_id = ? 
        ORDER BY transaction_date DESC 
        LIMIT ?
      `);
            return stmt.all(accountId, limit);
        }
        catch (error) {
            logger_1.logger.error('Error getting transactions by account ID:', error);
            throw error;
        }
    }
    async getTransactionsByUserId(userId, limit = 10) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT t.* FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = ?
        ORDER BY t.transaction_date DESC
        LIMIT ?
      `);
            return stmt.all(userId, limit);
        }
        catch (error) {
            logger_1.logger.error('Error getting transactions by user ID:', error);
            throw error;
        }
    }
    async getAllTransactions() {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM transactions ORDER BY transaction_date DESC');
            return stmt.all();
        }
        catch (error) {
            logger_1.logger.error('Error getting all transactions:', error);
            throw error;
        }
    }
    async createPayee(payeeData) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        INSERT INTO payees (user_id, name, account_number, routing_number, bank_name, payee_type, phone, email, memo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const result = stmt.run(payeeData.user_id, payeeData.name, payeeData.account_number || null, payeeData.routing_number || null, payeeData.bank_name || null, payeeData.payee_type || 'person', payeeData.phone || null, payeeData.email || null, payeeData.memo || null);
            const payee = await this.getPayeeById(result.lastInsertRowid);
            if (!payee) {
                throw new Error('Failed to create payee');
            }
            return payee;
        }
        catch (error) {
            logger_1.logger.error('Error creating payee:', error);
            throw error;
        }
    }
    async getPayeeById(id) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM payees WHERE id = ?');
            return stmt.get(id) || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting payee by ID:', error);
            throw error;
        }
    }
    async getPayeesByUserId(userId) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM payees WHERE user_id = ? AND is_active = 1');
            return stmt.all(userId);
        }
        catch (error) {
            logger_1.logger.error('Error getting payees by user ID:', error);
            throw error;
        }
    }
    async getAllPayees() {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM payees ORDER BY created_at DESC');
            return stmt.all();
        }
        catch (error) {
            logger_1.logger.error('Error getting all payees:', error);
            throw error;
        }
    }
    async updatePayee(id, updates) {
        try {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(id);
            const stmt = this.db.getDatabase().prepare(`UPDATE payees SET ${fields} WHERE id = ?`);
            stmt.run(...values);
            return this.getPayeeById(id);
        }
        catch (error) {
            logger_1.logger.error('Error updating payee:', error);
            throw error;
        }
    }
    async getTotalBalance(userId) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT SUM(balance) as total 
        FROM accounts 
        WHERE user_id = ? AND is_active = 1
      `);
            const result = stmt.get(userId);
            return result.total || 0;
        }
        catch (error) {
            logger_1.logger.error('Error getting total balance:', error);
            throw error;
        }
    }
    async getPendingTransactionsCount(userId) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT COUNT(*) as count 
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = ? AND t.status = 'pending'
      `);
            const result = stmt.get(userId);
            return result.count || 0;
        }
        catch (error) {
            logger_1.logger.error('Error getting pending transactions count:', error);
            throw error;
        }
    }
    async createChatSession(userId, subject) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        INSERT INTO chat_sessions (user_id, subject, status, priority)
        VALUES (?, ?, 'waiting', 'medium')
      `);
            const result = stmt.run(userId, subject || null);
            const session = await this.getChatSession(result.lastInsertRowid);
            if (!session) {
                throw new Error('Failed to create chat session');
            }
            return session;
        }
        catch (error) {
            logger_1.logger.error('Error creating chat session:', error);
            throw error;
        }
    }
    async getChatSession(sessionId) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM chat_sessions WHERE id = ?');
            return stmt.get(sessionId) || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting chat session:', error);
            throw error;
        }
    }
    async getUserChatSessions(userId) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT * FROM chat_sessions 
        WHERE user_id = ? 
        ORDER BY updated_at DESC
      `);
            return stmt.all(userId);
        }
        catch (error) {
            logger_1.logger.error('Error getting user chat sessions:', error);
            throw error;
        }
    }
    async getActiveChatSessions() {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT * FROM chat_sessions 
        WHERE status IN ('waiting', 'active') 
        ORDER BY created_at ASC
      `);
            return stmt.all();
        }
        catch (error) {
            logger_1.logger.error('Error getting active chat sessions:', error);
            throw error;
        }
    }
    async updateChatSession(sessionId, updates) {
        try {
            const fields = [];
            const values = [];
            if (updates.status) {
                fields.push('status = ?');
                values.push(updates.status);
            }
            if (updates.agent_id !== undefined) {
                fields.push('agent_id = ?');
                values.push(updates.agent_id);
            }
            if (updates.priority) {
                fields.push('priority = ?');
                values.push(updates.priority);
            }
            if (updates.closed_at) {
                fields.push('closed_at = ?');
                values.push(updates.closed_at);
            }
            fields.push('updated_at = CURRENT_TIMESTAMP');
            values.push(sessionId);
            const stmt = this.db.getDatabase().prepare(`
        UPDATE chat_sessions 
        SET ${fields.join(', ')}
        WHERE id = ?
      `);
            stmt.run(...values);
            return this.getChatSession(sessionId);
        }
        catch (error) {
            logger_1.logger.error('Error updating chat session:', error);
            throw error;
        }
    }
    async addChatMessage(sessionId, senderId, senderType, messageText) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        INSERT INTO chat_messages (session_id, sender_id, sender_type, message_text, message_type)
        VALUES (?, ?, ?, ?, 'text')
      `);
            const result = stmt.run(sessionId, senderId, senderType, messageText);
            const updateStmt = this.db.getDatabase().prepare(`
        UPDATE chat_sessions 
        SET updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
            updateStmt.run(sessionId);
            const message = await this.getChatMessage(result.lastInsertRowid);
            if (!message) {
                throw new Error('Failed to create chat message');
            }
            return message;
        }
        catch (error) {
            logger_1.logger.error('Error adding chat message:', error);
            throw error;
        }
    }
    async getChatMessage(messageId) {
        try {
            const stmt = this.db.getDatabase().prepare('SELECT * FROM chat_messages WHERE id = ?');
            return stmt.get(messageId) || null;
        }
        catch (error) {
            logger_1.logger.error('Error getting chat message:', error);
            throw error;
        }
    }
    async getChatMessages(sessionId) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT * FROM chat_messages 
        WHERE session_id = ? 
        ORDER BY created_at ASC
      `);
            return stmt.all(sessionId);
        }
        catch (error) {
            logger_1.logger.error('Error getting chat messages:', error);
            throw error;
        }
    }
    async markMessagesAsRead(sessionId, userId) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        UPDATE chat_messages 
        SET is_read = 1 
        WHERE session_id = ? AND sender_id != ? AND is_read = 0
      `);
            stmt.run(sessionId, userId);
        }
        catch (error) {
            logger_1.logger.error('Error marking messages as read:', error);
            throw error;
        }
    }
    async getUnreadMessageCount(sessionId, userId) {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT COUNT(*) as count 
        FROM chat_messages 
        WHERE session_id = ? AND sender_id != ? AND is_read = 0
      `);
            const result = stmt.get(sessionId, userId);
            return result.count || 0;
        }
        catch (error) {
            logger_1.logger.error('Error getting unread message count:', error);
            throw error;
        }
    }
    async updateAgentStatus(agentId, status) {
        try {
            const existingStmt = this.db.getDatabase().prepare('SELECT * FROM chat_agent_status WHERE agent_id = ?');
            const existing = existingStmt.get(agentId);
            if (existing) {
                const updateStmt = this.db.getDatabase().prepare(`
          UPDATE chat_agent_status 
          SET status = ?, last_activity = CURRENT_TIMESTAMP 
          WHERE agent_id = ?
        `);
                updateStmt.run(status, agentId);
            }
            else {
                const insertStmt = this.db.getDatabase().prepare(`
          INSERT INTO chat_agent_status (agent_id, status, max_concurrent_chats, current_chat_count)
          VALUES (?, ?, 3, 0)
        `);
                insertStmt.run(agentId, status);
            }
        }
        catch (error) {
            logger_1.logger.error('Error updating agent status:', error);
            throw error;
        }
    }
    async getAvailableAgents() {
        try {
            const stmt = this.db.getDatabase().prepare(`
        SELECT * FROM chat_agent_status 
        WHERE status = 'online' AND current_chat_count < max_concurrent_chats
      `);
            return stmt.all();
        }
        catch (error) {
            logger_1.logger.error('Error getting available agents:', error);
            throw error;
        }
    }
    async initializeTestData() {
        try {
            const existingUsers = await this.getAllUsers();
            if (existingUsers.length > 0) {
                logger_1.logger.info('Database already has test data');
                return;
            }
            logger_1.logger.info('Initializing database with comprehensive test data...');
            const users = [
                {
                    email: 'admin@primeedge.com',
                    password: 'admin123',
                    first_name: 'System',
                    last_name: 'Administrator',
                    phone: '(555) 000-0001',
                    account_type: 'personal',
                    is_admin: true,
                    is_active: true
                },
                {
                    email: 'user@primeedge.com',
                    password: 'user123',
                    first_name: 'John',
                    last_name: 'Doe',
                    phone: '(555) 123-4567',
                    account_type: 'personal',
                    is_admin: false,
                    is_active: true
                },
                {
                    email: 'business@primeedge.com',
                    password: 'business123',
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    phone: '(555) 987-6543',
                    account_type: 'business',
                    is_admin: false,
                    is_active: true
                },
                {
                    email: 'mike.wilson@email.com',
                    password: 'mike123',
                    first_name: 'Mike',
                    last_name: 'Wilson',
                    phone: '(555) 111-2222',
                    account_type: 'personal',
                    is_admin: false,
                    is_active: false
                },
                {
                    email: 'emily.davis@startup.io',
                    password: 'emily123',
                    first_name: 'Emily',
                    last_name: 'Davis',
                    phone: '(555) 333-4444',
                    account_type: 'business',
                    is_admin: false,
                    is_active: true
                },
                {
                    email: 'lisa.brown@email.com',
                    password: 'lisa123',
                    first_name: 'Lisa',
                    last_name: 'Brown',
                    phone: '(555) 555-6666',
                    account_type: 'personal',
                    is_admin: false,
                    is_active: true
                }
            ];
            const createdUsers = [];
            for (const userData of users) {
                const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
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
            const accounts = [
                {
                    user_id: createdUsers[1]?.id || 0,
                    account_number: '4532123456789012',
                    account_type: 'checking',
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
                    account_type: 'savings',
                    account_name: 'Emergency Savings',
                    balance: 25000.00,
                    available_balance: 25000.00,
                    interest_rate: 2.5,
                    minimum_balance: 500,
                    monthly_fee: 0
                },
                {
                    user_id: createdUsers[2]?.id || 0,
                    account_number: '4532901234567890',
                    account_type: 'business',
                    account_name: 'Business Operations',
                    balance: 125000.75,
                    available_balance: 125000.75,
                    interest_rate: 0.5,
                    minimum_balance: 1000,
                    monthly_fee: 25
                },
                {
                    user_id: createdUsers[3]?.id || 0,
                    account_number: '4532111122223333',
                    account_type: 'checking',
                    account_name: 'Personal Checking',
                    balance: 5200.00,
                    available_balance: 5200.00,
                    interest_rate: 0.01,
                    minimum_balance: 100,
                    monthly_fee: 0
                },
                {
                    user_id: createdUsers[4]?.id || 0,
                    account_number: '4532444455556666',
                    account_type: 'business',
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
                    account_type: 'checking',
                    account_name: 'Business Checking',
                    balance: 45200.00,
                    available_balance: 45200.00,
                    interest_rate: 0.25,
                    minimum_balance: 1000,
                    monthly_fee: 15
                },
                {
                    user_id: createdUsers[5]?.id || 0,
                    account_number: '4532000011112222',
                    account_type: 'checking',
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
                    account_type: 'savings',
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
            const transactionTemplates = [
                { account: 0, type: 'credit', amount: 2500.00, desc: 'Salary Deposit', category: 'income', days_ago: 1 },
                { account: 0, type: 'debit', amount: -150.00, desc: 'Grocery Store Purchase', category: 'food', days_ago: 2 },
                { account: 0, type: 'debit', amount: -89.99, desc: 'Gas Station', category: 'transportation', days_ago: 3 },
                { account: 0, type: 'debit', amount: -45.00, desc: 'Restaurant Dinner', category: 'food', days_ago: 4 },
                { account: 0, type: 'transfer', amount: -500.00, desc: 'Transfer to Savings', category: 'transfer', days_ago: 5 },
                { account: 1, type: 'transfer', amount: 500.00, desc: 'Transfer from Checking', category: 'transfer', days_ago: 5 },
                { account: 1, type: 'credit', amount: 25.50, desc: 'Interest Payment', category: 'interest', days_ago: 30 },
                { account: 2, type: 'credit', amount: 15000.00, desc: 'Client Payment - Project Alpha', category: 'income', days_ago: 1 },
                { account: 2, type: 'debit', amount: -2500.00, desc: 'Office Rent', category: 'business', days_ago: 2 },
                { account: 2, type: 'debit', amount: -1200.00, desc: 'Employee Salaries', category: 'business', days_ago: 3 },
                { account: 2, type: 'debit', amount: -89.99, desc: 'Office Supplies', category: 'business', days_ago: 4 },
                { account: 4, type: 'credit', amount: 50000.00, desc: 'Investor Funding Round', category: 'income', days_ago: 7 },
                { account: 4, type: 'debit', amount: -5000.00, desc: 'Software Licenses', category: 'business', days_ago: 8 },
                { account: 4, type: 'debit', amount: -3500.00, desc: 'Marketing Campaign', category: 'business', days_ago: 10 },
                { account: 5, type: 'credit', amount: 8500.00, desc: 'Product Sales Revenue', category: 'income', days_ago: 2 },
                { account: 5, type: 'debit', amount: -1200.00, desc: 'Payment Processing Fees', category: 'business', days_ago: 3 },
                { account: 6, type: 'credit', amount: 3200.00, desc: 'Salary Deposit', category: 'income', days_ago: 1 },
                { account: 6, type: 'debit', amount: -1200.00, desc: 'Rent Payment', category: 'housing', days_ago: 2 },
                { account: 6, type: 'debit', amount: -350.00, desc: 'Utility Bills', category: 'utilities', days_ago: 3 },
                { account: 6, type: 'transfer', amount: -500.00, desc: 'Transfer to Vacation Fund', category: 'transfer', days_ago: 4 },
                { account: 7, type: 'transfer', amount: 500.00, desc: 'Transfer from Checking', category: 'transfer', days_ago: 4 }
            ];
            for (const template of transactionTemplates) {
                const account = createdAccounts[template.account];
                if (!account)
                    continue;
                const transactionDate = new Date();
                transactionDate.setDate(transactionDate.getDate() - template.days_ago);
                await this.createTransaction({
                    account_id: account.id,
                    transaction_type: template.type,
                    amount: template.amount,
                    balance_after: account.balance,
                    description: template.desc,
                    category: template.category,
                    status: 'completed',
                    transaction_date: transactionDate.toISOString()
                });
            }
            const payees = [
                {
                    user_id: createdUsers[1]?.id || 0,
                    name: 'Electric Company',
                    account_number: '9876543210',
                    routing_number: '021000021',
                    bank_name: 'Bank of America',
                    payee_type: 'utility',
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
                    payee_type: 'person',
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
                    payee_type: 'business',
                    phone: '(555) 777-8888',
                    email: 'rent@officespace.com',
                    memo: 'Monthly office rent'
                }
            ];
            for (const payeeData of payees) {
                await this.createPayee(payeeData);
            }
            logger_1.logger.info('Comprehensive test data initialization completed successfully');
        }
        catch (error) {
            logger_1.logger.error('Error initializing test data:', error);
            throw error;
        }
    }
}
exports.DatabaseService = DatabaseService;
exports.default = new DatabaseService();
//# sourceMappingURL=database.js.map