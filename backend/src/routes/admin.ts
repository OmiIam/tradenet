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
  
  // Get additional data for each user
  const enrichedUsers = await Promise.all(users.map(async (user) => {
    const accounts = await DatabaseService.getAccountsByUserId(user.id);
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
  
  // Get user information for each account
  const enrichedAccounts = await Promise.all(accounts.map(async (account) => {
    const user = await DatabaseService.getUserById(account.user_id);
    
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
  
  // Get enriched transaction data with user and account information
  const enrichedTransactions = await Promise.all(transactions.map(async (transaction) => {
    const account = await DatabaseService.getAccountById(transaction.account_id);
    const user = account ? await DatabaseService.getUserById(account.user_id) : null;
    
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

// Get all payees
router.get('/payees', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const payees = await DatabaseService.getAllPayees();
  
  // Get enriched payee data with user information
  const enrichedPayees = await Promise.all(payees.map(async (payee) => {
    const user = await DatabaseService.getUserById(payee.user_id);
    
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

// Update payee status
router.put('/payees/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const payeeId = parseInt(req.params.id || '0');
  const { isVerified, isActive } = req.body;
  
  const payee = await DatabaseService.getPayeeById(payeeId);
  if (!payee) {
    throw new NotFoundError('Payee not found');
  }
  
  const updatedPayee = await DatabaseService.updatePayee(payeeId, {
    is_verified: isVerified,
    is_active: isActive
  });
  
  res.json({
    success: true,
    message: 'Payee updated successfully',
    payee: {
      id: updatedPayee!.id,
      name: updatedPayee!.name,
      isVerified: updatedPayee!.is_verified,
      isActive: updatedPayee!.is_active
    }
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