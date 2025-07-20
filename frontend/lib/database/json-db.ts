import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { hashPassword } from '../auth/simple-utils';

// Simple JSON-based database for development
export interface JsonDatabase {
  users: any[];
  accounts: any[];
  transactions: any[];
  payees: any[];
  adminLogs: any[];
  sessions: any[];
  chatSessions: any[];
  chatMessages: any[];
  chatAgentStatus: any[];
}

const DB_PATH = join(process.cwd(), 'data.json');

function loadDatabase(): JsonDatabase {
  if (!existsSync(DB_PATH)) {
    const emptyDb: JsonDatabase = {
      users: [],
      accounts: [],
      transactions: [],
      payees: [],
      adminLogs: [],
      sessions: [],
      chatSessions: [],
      chatMessages: [],
      chatAgentStatus: []
    };
    saveDatabase(emptyDb);
    return emptyDb;
  }
  
  try {
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading database:', error);
    return {
      users: [],
      accounts: [],
      transactions: [],
      payees: [],
      adminLogs: [],
      sessions: [],
      chatSessions: [],
      chatMessages: [],
      chatAgentStatus: []
    };
  }
}

function saveDatabase(db: JsonDatabase): void {
  try {
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Initialize database with test users
export async function initializeJsonDatabase() {
  const db = loadDatabase();
  
  // Check if users already exist
  if (db.users.length > 0) {
    console.log('✅ Database already has users');
    return;
  }

  console.log('🌱 Seeding JSON database with test data...');

  // Create test users
  const adminPassword = await hashPassword('admin123');
  const userPassword = await hashPassword('user123');
  const businessPassword = await hashPassword('business123');

  db.users = [
    {
      id: 1,
      email: 'admin@primeedge.com',
      password_hash: adminPassword,
      first_name: 'System',
      last_name: 'Administrator',
      account_type: 'personal',
      is_admin: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      email: 'user@primeedge.com',
      password_hash: userPassword,
      first_name: 'John',
      last_name: 'Doe',
      phone: '(555) 123-4567',
      account_type: 'personal',
      is_admin: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'business@primeedge.com',
      password_hash: businessPassword,
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone: '(555) 987-6543',
      account_type: 'business',
      is_admin: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Create accounts
  db.accounts = [
    {
      id: 1,
      user_id: 2,
      account_number: '4532123456789012',
      account_type: 'checking',
      account_name: 'Primary Checking',
      balance: 15420.50,
      available_balance: 15420.50,
      interest_rate: 0.01,
      minimum_balance: 100,
      monthly_fee: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      account_number: '4532567890123456',
      account_type: 'savings',
      account_name: 'Emergency Savings',
      balance: 25000.00,
      available_balance: 25000.00,
      interest_rate: 2.5,
      minimum_balance: 500,
      monthly_fee: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      user_id: 3,
      account_number: '4532901234567890',
      account_type: 'business',
      account_name: 'Business Operations',
      balance: 125000.75,
      available_balance: 125000.75,
      interest_rate: 0.5,
      minimum_balance: 1000,
      monthly_fee: 25,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Create sample transactions
  db.transactions = [
    {
      id: 1,
      account_id: 1,
      transaction_type: 'credit',
      amount: 2500.00,
      balance_after: 15420.50,
      description: 'Salary Deposit',
      category: 'income',
      status: 'completed',
      transaction_date: new Date('2024-01-15T08:00:00Z').toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      account_id: 1,
      transaction_type: 'debit',
      amount: -150.00,
      balance_after: 14920.50,
      description: 'Grocery Store Purchase',
      category: 'food',
      status: 'completed',
      transaction_date: new Date('2024-01-14T10:30:00Z').toISOString(),
      created_at: new Date().toISOString()
    }
  ];

  // Create sample payees
  db.payees = [
    {
      id: 1,
      user_id: 2,
      name: 'Electric Company',
      account_number: '9876543210',
      routing_number: '021000021',
      bank_name: 'Bank of America',
      payee_type: 'utility',
      phone: '(800) 555-0123',
      email: 'billing@electricco.com',
      memo: 'Monthly electricity bill',
      is_verified: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  saveDatabase(db);
  console.log('✅ JSON database seeded successfully!');
  console.log('\n📝 Test User Credentials:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│                     TEST USERS                         │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ 👤 Regular User:                                       │');
  console.log('│    Email: user@primeedge.com                           │');
  console.log('│    Password: user123                                   │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ 🏢 Business User:                                      │');
  console.log('│    Email: business@primeedge.com                       │');
  console.log('│    Password: business123                               │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ 🔐 Admin User:                                         │');
  console.log('│    Email: admin@primeedge.com                          │');
  console.log('│    Password: admin123                                  │');
  console.log('└─────────────────────────────────────────────────────────┘');
}

// Database operations
export const JsonDB = {
  // User operations
  findUserByEmail: (email: string) => {
    const db = loadDatabase();
    return db.users.find(user => user.email === email);
  },

  createUser: (userData: any) => {
    const db = loadDatabase();
    const newUser = {
      id: Math.max(...db.users.map(u => u.id), 0) + 1,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
  },

  // Account operations
  getAccountsByUserId: (userId: number) => {
    const db = loadDatabase();
    return db.accounts.filter(account => account.user_id === userId);
  },

  getTotalBalance: (userId: number) => {
    const db = loadDatabase();
    const accounts = db.accounts.filter(account => account.user_id === userId);
    return accounts.reduce((total, account) => total + account.balance, 0);
  },

  // Transaction operations
  getRecentTransactions: (userId: number, limit: number = 10) => {
    const db = loadDatabase();
    const userAccounts = db.accounts.filter(account => account.user_id === userId);
    const accountIds = userAccounts.map(account => account.id);
    
    return db.transactions
      .filter(transaction => accountIds.includes(transaction.account_id))
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
      .slice(0, limit);
  },

  getPendingTransactionsCount: (userId: number) => {
    const db = loadDatabase();
    const userAccounts = db.accounts.filter(account => account.user_id === userId);
    const accountIds = userAccounts.map(account => account.id);
    
    return db.transactions.filter(transaction => 
      accountIds.includes(transaction.account_id) && transaction.status === 'pending'
    ).length;
  },

  getTransactionsByDateRange: (userId: number, startDate: string, endDate: string) => {
    const db = loadDatabase();
    const userAccounts = db.accounts.filter(account => account.user_id === userId);
    const accountIds = userAccounts.map(account => account.id);
    
    return db.transactions.filter(transaction => {
      if (!accountIds.includes(transaction.account_id)) return false;
      const transactionDate = new Date(transaction.transaction_date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  },

  // Chat operations
  createChatSession: (userId: number, subject?: string) => {
    const db = loadDatabase();
    const newSession = {
      id: Math.max(...db.chatSessions.map(s => s.id), 0) + 1,
      user_id: userId,
      agent_id: null,
      status: 'waiting',
      subject: subject || null,
      priority: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      closed_at: null
    };
    db.chatSessions.push(newSession);
    saveDatabase(db);
    return newSession;
  },

  getChatSession: (sessionId: number) => {
    const db = loadDatabase();
    return db.chatSessions.find(session => session.id === sessionId);
  },

  getUserChatSessions: (userId: number) => {
    const db = loadDatabase();
    return db.chatSessions
      .filter(session => session.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getActiveChatSessions: () => {
    const db = loadDatabase();
    return db.chatSessions.filter(session => 
      session.status === 'waiting' || session.status === 'active'
    );
  },

  updateChatSession: (sessionId: number, updates: any) => {
    const db = loadDatabase();
    const sessionIndex = db.chatSessions.findIndex(session => session.id === sessionId);
    if (sessionIndex !== -1) {
      db.chatSessions[sessionIndex] = {
        ...db.chatSessions[sessionIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      saveDatabase(db);
      return db.chatSessions[sessionIndex];
    }
    return null;
  },

  addChatMessage: (sessionId: number, senderId: number, senderType: string, messageText: string) => {
    const db = loadDatabase();
    const newMessage = {
      id: Math.max(...db.chatMessages.map(m => m.id), 0) + 1,
      session_id: sessionId,
      sender_id: senderId,
      sender_type: senderType,
      message_text: messageText,
      message_type: 'text',
      is_read: false,
      created_at: new Date().toISOString()
    };
    db.chatMessages.push(newMessage);
    
    // Update session timestamp
    const sessionIndex = db.chatSessions.findIndex(session => session.id === sessionId);
    if (sessionIndex !== -1) {
      db.chatSessions[sessionIndex].updated_at = new Date().toISOString();
    }
    
    saveDatabase(db);
    return newMessage;
  },

  getChatMessages: (sessionId: number) => {
    const db = loadDatabase();
    return db.chatMessages
      .filter(message => message.session_id === sessionId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  markMessagesAsRead: (sessionId: number, userId: number) => {
    const db = loadDatabase();
    let updated = false;
    db.chatMessages.forEach(message => {
      if (message.session_id === sessionId && message.sender_id !== userId && !message.is_read) {
        message.is_read = true;
        updated = true;
      }
    });
    if (updated) {
      saveDatabase(db);
    }
  },

  getUnreadMessageCount: (sessionId: number, userId: number) => {
    const db = loadDatabase();
    return db.chatMessages.filter(message => 
      message.session_id === sessionId && 
      message.sender_id !== userId && 
      !message.is_read
    ).length;
  },

  // Agent status operations
  updateAgentStatus: (agentId: number, status: string) => {
    const db = loadDatabase();
    const existingIndex = db.chatAgentStatus.findIndex(agent => agent.agent_id === agentId);
    
    if (existingIndex !== -1) {
      db.chatAgentStatus[existingIndex] = {
        ...db.chatAgentStatus[existingIndex],
        status,
        last_activity: new Date().toISOString()
      };
    } else {
      db.chatAgentStatus.push({
        id: Math.max(...db.chatAgentStatus.map(a => a.id), 0) + 1,
        agent_id: agentId,
        status,
        max_concurrent_chats: 3,
        current_chat_count: 0,
        last_activity: new Date().toISOString()
      });
    }
    
    saveDatabase(db);
  },

  getAvailableAgents: () => {
    const db = loadDatabase();
    return db.chatAgentStatus.filter(agent => 
      agent.status === 'online' && 
      agent.current_chat_count < agent.max_concurrent_chats
    );
  }
};

export default JsonDB;