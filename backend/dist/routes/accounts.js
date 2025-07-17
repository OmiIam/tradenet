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
    const accounts = await database_1.default.getAccountsByUserId(Number(req.user.id));
    res.json({
        accounts: accounts.map(account => ({
            id: account.id,
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
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const accountId = parseInt(req.params.id || '0');
    const account = await database_1.default.getAccountById(accountId);
    if (!account) {
        throw new errorHandler_1.NotFoundError('Account not found');
    }
    if (account.user_id !== Number(req.user.id)) {
        throw new errorHandler_1.NotFoundError('Account not found');
    }
    res.json({
        account: {
            id: account.id,
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
        }
    });
}));
router.post('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { accountName, accountType, initialBalance = 0 } = req.body;
    const accountNumber = '4532' + Math.random().toString().slice(2, 14);
    const account = await database_1.default.createAccount({
        user_id: Number(req.user.id),
        account_number: accountNumber,
        account_type: accountType,
        account_name: accountName,
        balance: initialBalance,
        available_balance: initialBalance,
        interest_rate: accountType === 'savings' ? 2.5 : 0.01,
        minimum_balance: accountType === 'business' ? 1000 : 100,
        monthly_fee: accountType === 'business' ? 25 : 0
    });
    res.status(201).json({
        success: true,
        account: {
            id: account.id,
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
        }
    });
}));
exports.default = router;
//# sourceMappingURL=accounts.js.map