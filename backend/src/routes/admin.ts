import express from 'express';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler';
import DatabaseService from '../services/database';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users
router.get('/users', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const users = await DatabaseService.getAllUsers();
  
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

// Update user
router.put('/users/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const userId = parseInt(req.params.id || '0');
  const { firstName, lastName, phone, isActive } = req.body;
  
  const updatedUser = await DatabaseService.updateUser(userId, {
    first_name: firstName,
    last_name: lastName,
    phone,
    is_active: isActive
  });
  
  if (!updatedUser) {
    throw new NotFoundError('User not found');
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

// Get all accounts
router.get('/accounts', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const accounts = await DatabaseService.getAllAccounts();
  
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

// Update account balance
router.put('/accounts/:id/balance', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const accountId = parseInt(req.params.id || '0');
  const { balance, reason } = req.body;
  
  if (typeof balance !== 'number' || balance < 0) {
    throw new ValidationError('Invalid balance amount');
  }
  
  const account = await DatabaseService.getAccountById(accountId);
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  
  const oldBalance = account.balance;
  const updatedAccount = await DatabaseService.updateAccountBalance(accountId, balance);
  
  // Create admin adjustment transaction
  await DatabaseService.createTransaction({
    account_id: accountId,
    transaction_type: 'adjustment',
    amount: balance - oldBalance,
    balance_after: balance,
    description: reason || 'Admin balance adjustment',
    category: 'adjustment',
    status: 'completed',
    created_by: Number(req.user!.id)
  });
  
  res.json({
    success: true,
    message: 'Account balance updated successfully',
    account: {
      id: updatedAccount!.id,
      accountNumber: updatedAccount!.account_number,
      accountName: updatedAccount!.account_name,
      oldBalance: oldBalance,
      newBalance: updatedAccount!.balance
    }
  });
}));

// Get all transactions
router.get('/transactions', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const transactions = await DatabaseService.getAllTransactions();
  
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

// Get system stats
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const users = await DatabaseService.getAllUsers();
  const accounts = await DatabaseService.getAllAccounts();
  const transactions = await DatabaseService.getAllTransactions();
  
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
    systemAlerts: 0 // Placeholder for now
  });
}));

export default router;