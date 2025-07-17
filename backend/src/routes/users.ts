import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import DatabaseService from '../services/database';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const user = await DatabaseService.getUserById(Number(req.user!.id));
  
  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      accountType: user.account_type,
      isAdmin: user.is_admin,
      createdAt: user.created_at
    }
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { firstName, lastName, phone } = req.body;
  
  const updatedUser = await DatabaseService.updateUser(Number(req.user!.id), {
    first_name: firstName,
    last_name: lastName,
    phone,
    is_active: true
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
      createdAt: updatedUser.created_at
    }
  });
}));

export default router;