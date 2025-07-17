import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, ValidationError } from '../middleware/errorHandler';
import DatabaseService from '../services/database';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get transactions
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const transactions = await DatabaseService.getTransactionsByUserId(Number(req.user!.id), limit);
  
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

// Get transactions for specific account
router.get('/account/:accountId', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const accountId = parseInt(req.params.accountId || '0');
  const limit = parseInt(req.query.limit as string) || 10;
  
  // Verify account belongs to user
  const account = await DatabaseService.getAccountById(accountId);
  if (!account || account.user_id !== Number(req.user!.id)) {
    throw new NotFoundError('Account not found');
  }
  
  const transactions = await DatabaseService.getTransactionsByAccountId(accountId, limit);
  
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

// Create transfer
router.post('/transfer', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;
  
  if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
    throw new ValidationError('Invalid transfer parameters');
  }
  
  // Verify source account belongs to user
  const fromAccount = await DatabaseService.getAccountById(fromAccountId);
  if (!fromAccount || fromAccount.user_id !== Number(req.user!.id)) {
    throw new NotFoundError('Source account not found');
  }
  
  // Verify destination account exists
  const toAccount = await DatabaseService.getAccountById(toAccountId);
  if (!toAccount) {
    throw new NotFoundError('Destination account not found');
  }
  
  // Check sufficient balance
  if (fromAccount.balance < amount) {
    throw new ValidationError('Insufficient funds');
  }
  
  // Create debit transaction for source account
  const newFromBalance = fromAccount.balance - amount;
  await DatabaseService.createTransaction({
    account_id: fromAccountId,
    transaction_type: 'debit',
    amount: -amount,
    balance_after: newFromBalance,
    description: description || `Transfer to ${toAccount.account_name}`,
    category: 'transfer',
    status: 'completed'
  });
  
  // Create credit transaction for destination account
  const newToBalance = toAccount.balance + amount;
  await DatabaseService.createTransaction({
    account_id: toAccountId,
    transaction_type: 'credit',
    amount: amount,
    balance_after: newToBalance,
    description: description || `Transfer from ${fromAccount.account_name}`,
    category: 'transfer',
    status: 'completed'
  });
  
  // Update account balances
  await DatabaseService.updateAccountBalance(fromAccountId, newFromBalance);
  await DatabaseService.updateAccountBalance(toAccountId, newToBalance);
  
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

export default router;