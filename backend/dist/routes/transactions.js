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
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await database_1.default.getTransactionsByUserId(Number(req.user.id), limit);
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
            createdAt: transaction.created_at
        }))
    });
}));
router.get('/account/:accountId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const accountId = parseInt(req.params.accountId || '0');
    const limit = parseInt(req.query.limit) || 10;
    const account = await database_1.default.getAccountById(accountId);
    if (!account || account.user_id !== Number(req.user.id)) {
        throw new errorHandler_1.NotFoundError('Account not found');
    }
    const transactions = await database_1.default.getTransactionsByAccountId(accountId, limit);
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
            createdAt: transaction.created_at
        }))
    });
}));
router.post('/transfer', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { fromAccountId, toAccountId, amount, description } = req.body;
    if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
        throw new errorHandler_1.ValidationError('Invalid transfer parameters');
    }
    const fromAccount = await database_1.default.getAccountById(fromAccountId);
    if (!fromAccount || fromAccount.user_id !== Number(req.user.id)) {
        throw new errorHandler_1.NotFoundError('Source account not found');
    }
    const toAccount = await database_1.default.getAccountById(toAccountId);
    if (!toAccount) {
        throw new errorHandler_1.NotFoundError('Destination account not found');
    }
    if (fromAccount.balance < amount) {
        throw new errorHandler_1.ValidationError('Insufficient funds');
    }
    const newFromBalance = fromAccount.balance - amount;
    await database_1.default.createTransaction({
        account_id: fromAccountId,
        transaction_type: 'debit',
        amount: -amount,
        balance_after: newFromBalance,
        description: description || `Transfer to ${toAccount.account_name}`,
        category: 'transfer',
        status: 'completed'
    });
    const newToBalance = toAccount.balance + amount;
    await database_1.default.createTransaction({
        account_id: toAccountId,
        transaction_type: 'credit',
        amount: amount,
        balance_after: newToBalance,
        description: description || `Transfer from ${fromAccount.account_name}`,
        category: 'transfer',
        status: 'completed'
    });
    await database_1.default.updateAccountBalance(fromAccountId, newFromBalance);
    await database_1.default.updateAccountBalance(toAccountId, newToBalance);
    res.json({
        success: true,
        message: 'Transfer completed successfully',
        transfer: {
            fromAccount: fromAccount.account_name,
            toAccount: toAccount.account_name,
            amount: amount,
            description: description || `Transfer to ${toAccount.account_name}`
        }
    });
}));
exports.default = router;
//# sourceMappingURL=transactions.js.map