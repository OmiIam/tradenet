import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import DatabaseService from '../services/database';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user accounts
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const accounts = await DatabaseService.getAccountsByUserId(Number(req.user!.id));
  
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

// Get specific account
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const accountId = parseInt(req.params.id || '0');
  const account = await DatabaseService.getAccountById(accountId);
  
  if (!account) {
    throw new NotFoundError('Account not found');
  }

  // Check if account belongs to user
  if (account.user_id !== Number(req.user!.id)) {
    throw new NotFoundError('Account not found');
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

// Create new account
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { accountName, accountType, initialBalance = 0 } = req.body;
  
  // Generate account number (simplified for demo)
  const accountNumber = '4532' + Math.random().toString().slice(2, 14);
  
  const account = await DatabaseService.createAccount({
    user_id: Number(req.user!.id),
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

export default router;