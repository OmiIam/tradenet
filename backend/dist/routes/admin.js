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
    res.json({
        users: users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            accountType: user.account_type,
            isAdmin: user.is_admin,
            isActive: user.is_active,
            createdAt: user.created_at
        }))
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
    res.json({
        accounts: accounts.map(account => ({
            id: account.id,
            userId: account.user_id,
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
        }))
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
    res.json({
        transactions: transactions.map(transaction => ({
            id: transaction.id,
            accountId: transaction.account_id,
            transactionType: transaction.transaction_type,
            amount: transaction.amount,
            balanceAfter: transaction.balance_after,
            description: transaction.description,
            category: transaction.category,
            status: transaction.status,
            transactionDate: transaction.transaction_date,
            createdAt: transaction.created_at,
            createdBy: transaction.created_by
        }))
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