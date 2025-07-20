"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const simple_auth_1 = __importDefault(require("./routes/simple-auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);
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
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use('/api/auth', simple_auth_1.default);
app.get('/api/dashboard/overview', (req, res) => {
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
app.use('*', (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        path: req.path
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📚 API documentation available at http://localhost:${PORT}/api`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=simple-server.js.map