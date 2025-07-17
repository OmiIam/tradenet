import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import SQLiteDatabase from './config/sqlite';
import DatabaseService from './services/database';
import { logger } from './config/logger';
import { globalErrorHandler, notFoundHandler, asyncHandler } from './middleware/errorHandler';
import { securityHeaders, apiRateLimiter, speedLimiter, sanitizeInput } from './middleware/security';
import { authenticateToken } from './middleware/auth';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';
import payeeRoutes from './routes/payees';
import adminRoutes from './routes/admin';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Initialize SQLite database
try {
  const db = SQLiteDatabase.getInstance();
  DatabaseService.initializeTestData().then(() => {
    logger.info('Database initialized with test data');
  }).catch(error => {
    logger.error('Failed to initialize test data:', error);
  });
} catch (error) {
  logger.error('Failed to initialize SQLite database:', error);
  process.exit(1);
}

// Security middleware
app.use(securityHeaders);
app.use(apiRateLimiter);
app.use(speedLimiter);

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3003'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Allow all localhost origins for development
      if (origin && origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Input sanitization
app.use(sanitizeInput);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payees', payeeRoutes);
app.use('/api/admin', adminRoutes);

// Dashboard overview endpoint
app.get('/api/dashboard/overview', authenticateToken, asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  
  // Get user info
  const user = await DatabaseService.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Get user accounts
  const accounts = await DatabaseService.getAccountsByUserId(userId);
  
  // Get total balance
  const totalBalance = await DatabaseService.getTotalBalance(userId);
  
  // Get recent transactions
  const recentTransactions = await DatabaseService.getTransactionsByUserId(userId, 5);
  
  // Get pending transactions count
  const pendingTransactions = await DatabaseService.getPendingTransactionsCount(userId);
  
  // Mock monthly spending and income calculations
  const monthlySpending = 3250.75;
  const monthlyIncome = 5500.00;
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isAdmin: user.is_admin,
      accountType: user.account_type
    },
    accounts: accounts.map(account => ({
      id: account.id,
      accountNumber: account.account_number.replace(/^(\d{4})/, '****'),
      accountType: account.account_type,
      accountName: account.account_name,
      balance: account.balance,
      availableBalance: account.available_balance
    })),
    totalBalance,
    recentTransactions: recentTransactions.map(transaction => ({
      id: transaction.id,
      accountId: transaction.account_id,
      transactionType: transaction.transaction_type,
      amount: transaction.amount,
      balanceAfter: transaction.balance_after,
      description: transaction.description,
      category: transaction.category,
      status: transaction.status,
      transactionDate: transaction.transaction_date,
      createdAt: transaction.created_at
    })),
    monthlySpending,
    monthlyIncome,
    pendingTransactions
  });
}));

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Internet Banking API',
    version: '1.0.0',
    description: 'Production-grade banking backend API',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      accounts: '/api/accounts',
      transactions: '/api/transactions',
      payees: '/api/payees',
      admin: '/api/admin'
    },
    docs: '/api/docs',
    health: '/health'
  });
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Promise Rejection:', { reason, promise });
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`📚 API documentation available at http://localhost:${PORT}/api`);
  logger.info(`🔍 Health check available at http://localhost:${PORT}/health`);
});

export default app;