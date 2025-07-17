import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import DatabaseService from '../services/database';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get payees
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const payees = await DatabaseService.getPayeesByUserId(Number(req.user!.id));
  
  res.json({
    payees: payees.map(payee => ({
      id: payee.id,
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
    }))
  });
}));

// Get specific payee
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const payeeId = parseInt(req.params.id || '0');
  const payee = await DatabaseService.getPayeeById(payeeId);
  
  if (!payee || payee.user_id !== Number(req.user!.id)) {
    throw new NotFoundError('Payee not found');
  }
  
  res.json({
    payee: {
      id: payee.id,
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
    }
  });
}));

// Add payee
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { name, accountNumber, routingNumber, bankName, payeeType, phone, email, memo } = req.body;
  
  const payee = await DatabaseService.createPayee({
    user_id: Number(req.user!.id),
    name,
    account_number: accountNumber,
    routing_number: routingNumber,
    bank_name: bankName,
    payee_type: payeeType || 'person',
    phone,
    email,
    memo
  });
  
  res.status(201).json({
    success: true,
    payee: {
      id: payee.id,
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
    }
  });
}));

export default router;