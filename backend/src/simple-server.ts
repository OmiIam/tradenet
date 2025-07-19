import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import simpleAuthRoutes from './routes/simple-auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Get allowed origins from environment variable or use localhost defaults
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://primeedgefinancebank.com',
      'http://primeedgefinancebank.com',
      'https://internet-banking-production-68f4.up.railway.app'
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', simpleAuthRoutes);

// Dashboard overview endpoint
app.get('/api/dashboard/overview', (req, res) => {
  // Simple mock dashboard data for the simple server
  const mockData = {
    user: {
      id: 1,
      email: 'admin@primeedge.com',
      firstName: 'System',
      lastName: 'Administrator',
      isAdmin: true,
      accountType: 'personal'
    },
    accounts: [
      {
        id: 1,
        accountNumber: '****1234',
        accountType: 'Checking',
        accountName: 'Primary Checking',
        balance: 15420.50,
        availableBalance: 15420.50
      }
    ],
    totalBalance: 15420.50,
    recentTransactions: [
      {
        id: 1,
        accountId: 1,
        transactionType: 'credit',
        amount: 2500.00,
        description: 'Salary Deposit',
        category: 'Income',
        status: 'completed',
        transactionDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ],
    monthlySpending: 3250.75,
    monthlyIncome: 5500.00,
    pendingTransactions: 0
  };
  
  res.json(mockData);
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Internet Banking API',
    version: '1.0.0',
    description: 'Production-grade banking backend API',
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard/overview'
    },
    health: '/health'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
});

export default app;