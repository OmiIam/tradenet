"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const database_1 = __importDefault(require("../services/database"));
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
router.get('/users', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const users = await database_1.default.getAllUsers();
    const enrichedUsers = await Promise.all(users.map(async (user) => {
        const accounts = await database_1.default.getAccountsByUserId(user.id);
        const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            accountType: user.account_type,
            isAdmin: user.is_admin,
            isActive: user.is_active,
            createdAt: user.created_at,
            accountCount: accounts.length,
            totalBalance: totalBalance
        };
    }));
    res.json({
        users: enrichedUsers
    });
}));
router.put('/users/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = parseInt(req.params.id || '0');
    const { firstName, lastName, phone, isActive } = req.body;
    const updatedUser = await database_1.default.updateUser(userId, {
        first_name: firstName,
        last_name: lastName,
        phone,
        is_active: isActive
    });
    if (!updatedUser) {
        throw new errorHandler_1.NotFoundError('User not found');
    }
    res.json({
        success: true,
        user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            phone: updatedUser.phone,
            accountType: updatedUser.account_type,
            isAdmin: updatedUser.is_admin,
            isActive: updatedUser.is_active,
            createdAt: updatedUser.created_at
        }
    });
}));
router.get('/accounts', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const accounts = await database_1.default.getAllAccounts();
    const enrichedAccounts = await Promise.all(accounts.map(async (account) => {
        const user = await database_1.default.getUserById(account.user_id);
        return {
            id: account.id,
            userId: account.user_id,
            userEmail: user?.email || '',
            userName: user ? `${user.first_name} ${user.last_name}` : '',
            accountNumber: account.account_number,
            accountType: account.account_type,
            accountName: account.account_name,
            balance: account.balance,
            availableBalance: account.available_balance,
            interestRate: account.interest_rate,
            minimumBalance: account.minimum_balance,
            monthlyFee: account.monthly_fee,
            isActive: account.is_active,
            createdAt: account.created_at
        };
    }));
    res.json({
        accounts: enrichedAccounts
    });
}));
router.put('/accounts/:id/balance', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const accountId = parseInt(req.params.id || '0');
    const { balance, reason } = req.body;
    if (typeof balance !== 'number' || balance < 0) {
        throw new errorHandler_1.ValidationError('Invalid balance amount');
    }
    const account = await database_1.default.getAccountById(accountId);
    if (!account) {
        throw new errorHandler_1.NotFoundError('Account not found');
    }
    const oldBalance = account.balance;
    const updatedAccount = await database_1.default.updateAccountBalance(accountId, balance);
    await database_1.default.createTransaction({
        account_id: accountId,
        transaction_type: 'adjustment',
        amount: balance - oldBalance,
        balance_after: balance,
        description: reason || 'Admin balance adjustment',
        category: 'adjustment',
        status: 'completed',
        created_by: Number(req.user.id)
    });
    res.json({
        success: true,
        message: 'Account balance updated successfully',
        account: {
            id: updatedAccount.id,
            accountNumber: updatedAccount.account_number,
            accountName: updatedAccount.account_name,
            oldBalance: oldBalance,
            newBalance: updatedAccount.balance
        }
    });
}));
router.get('/transactions', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const transactions = await database_1.default.getAllTransactions();
    const enrichedTransactions = await Promise.all(transactions.map(async (transaction) => {
        const account = await database_1.default.getAccountById(transaction.account_id);
        const user = account ? await database_1.default.getUserById(account.user_id) : null;
        return {
            id: transaction.id,
            accountId: transaction.account_id,
            userName: user ? `${user.first_name} ${user.last_name}` : '',
            userEmail: user?.email || '',
            accountName: account?.account_name || '',
            accountNumber: account?.account_number || '',
            transactionType: transaction.transaction_type,
            amount: transaction.amount,
            balanceAfter: transaction.balance_after,
            description: transaction.description,
            category: transaction.category,
            status: transaction.status,
            transactionDate: transaction.transaction_date,
            createdAt: transaction.created_at,
            createdBy: transaction.created_by
        };
    }));
    res.json({
        transactions: enrichedTransactions
    });
}));
router.get('/payees', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const payees = await database_1.default.getAllPayees();
    const enrichedPayees = await Promise.all(payees.map(async (payee) => {
        const user = await database_1.default.getUserById(payee.user_id);
        return {
            id: payee.id,
            userId: payee.user_id,
            userName: user ? `${user.first_name} ${user.last_name}` : '',
            userEmail: user?.email || '',
            name: payee.name,
            accountNumber: payee.account_number,
            routingNumber: payee.routing_number,
            bankName: payee.bank_name,
            payeeType: payee.payee_type,
            phone: payee.phone,
            email: payee.email,
            memo: payee.memo,
            isVerified: payee.is_verified,
            isActive: payee.is_active,
            createdAt: payee.created_at
        };
    }));
    res.json({
        payees: enrichedPayees
    });
}));
router.put('/payees/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const payeeId = parseInt(req.params.id || '0');
    const { isVerified, isActive } = req.body;
    const payee = await database_1.default.getPayeeById(payeeId);
    if (!payee) {
        throw new errorHandler_1.NotFoundError('Payee not found');
    }
    const updatedPayee = await database_1.default.updatePayee(payeeId, {
        is_verified: isVerified,
        is_active: isActive
    });
    res.json({
        success: true,
        message: 'Payee updated successfully',
        payee: {
            id: updatedPayee.id,
            name: updatedPayee.name,
            isVerified: updatedPayee.is_verified,
            isActive: updatedPayee.is_active
        }
    });
}));
router.get('/stats', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const users = await database_1.default.getAllUsers();
    const accounts = await database_1.default.getAllAccounts();
    const transactions = await database_1.default.getAllTransactions();
    const activeUsers = users.filter(user => user.is_active).length;
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const todayTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        const today = new Date();
        return transactionDate.toDateString() === today.toDateString();
    }).length;
    const todayVolume = transactions
        .filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        const today = new Date();
        return transactionDate.toDateString() === today.toDateString();
    })
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const pendingTransactions = transactions.filter(transaction => transaction.status === 'pending').length;
    res.json({
        totalUsers: users.length,
        activeUsers,
        totalAccounts: accounts.length,
        totalBalance,
        todayTransactions,
        todayVolume,
        pendingTransactions,
        systemAlerts: 0
    });
}));
exports.default = router;
//# sourceMappingURL=admin.js.map