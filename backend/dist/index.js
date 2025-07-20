"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const sqlite_1 = __importDefault(require("./config/sqlite"));
const database_1 = __importDefault(require("./services/database"));
const logger_1 = require("./config/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const security_1 = require("./middleware/security");
const auth_1 = require("./middleware/auth");
const auth_2 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const payees_1 = __importDefault(require("./routes/payees"));
const admin_1 = __importDefault(require("./routes/admin"));
const chat_1 = __importDefault(require("./routes/chat"));
const socketAuth_1 = require("./middleware/socketAuth");
const chatSocketService_1 = __importDefault(require("./services/chatSocketService"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5001;
app.set('trust proxy', 1);
try {
    const db = sqlite_1.default.getInstance();
    database_1.default.initializeTestData().then(() => {
        logger_1.logger.info('Database initialized with test data');
    }).catch(error => {
        logger_1.logger.error('Failed to initialize test data:', error);
    });
}
catch (error) {
    logger_1.logger.error('Failed to initialize SQLite database:', error);
    process.exit(1);
}
app.use(security_1.securityHeaders);
app.use(security_1.apiRateLimiter);
app.use(security_1.speedLimiter);
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'https://primeedgefinancebank.com',
            'http://primeedgefinancebank.com',
            'https://internet-banking-production-68f4.up.railway.app'
        ];
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            if (origin && origin.startsWith('http://localhost:')) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
const io = new socket_io_1.Server(server, {
    cors: corsOptions,
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
});
io.use(socketAuth_1.authenticateSocket);
const chatSocketService = new chatSocketService_1.default(io);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use(security_1.sanitizeInput);
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    next();
});
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
    });
});
app.use('/api/auth', auth_2.default);
app.use('/api/users', users_1.default);
app.use('/api/accounts', accounts_1.default);
app.use('/api/transactions', transactions_1.default);
app.use('/api/payees', payees_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/chat', chat_1.default);
app.get('/api/dashboard/overview', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const user = await database_1.default.getUserById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const accounts = await database_1.default.getAccountsByUserId(userId);
    const totalBalance = await database_1.default.getTotalBalance(userId);
    const recentTransactions = await database_1.default.getTransactionsByUserId(userId, 5);
    const pendingTransactions = await database_1.default.getPendingTransactionsCount(userId);
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
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.globalErrorHandler);
const gracefulShutdown = () => {
    logger_1.logger.info('Received shutdown signal, closing server gracefully...');
    process.exit(0);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Promise Rejection:', { reason, promise });
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
server.listen(PORT, () => {
    logger_1.logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger_1.logger.info(`📚 API documentation available at http://localhost:${PORT}/api`);
    logger_1.logger.info(`🔍 Health check available at http://localhost:${PORT}/health`);
    logger_1.logger.info(`🔌 WebSocket server ready for real-time chat`);
});
exports.default = app;
//# sourceMappingURL=index.js.map