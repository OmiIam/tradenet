import express from 'express';
import DatabaseService from '../services/database';
import { 
  authenticateToken, 
  AuthenticatedRequest 
} from '../middleware/auth';
import { 
  asyncHandler,
  NotFoundError,
  ForbiddenError,
  ValidationError 
} from '../middleware/errorHandler';
import { logger } from '../config/logger';

const router = express.Router();

// Apply authentication to all chat routes
router.use(authenticateToken);

// GET /api/chat/sessions - Get user's chat sessions
router.get('/sessions',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const userId = req.user!.id;
    
    const sessions = await DatabaseService.getUserChatSessions(userId);
    
    res.json({
      success: true,
      data: sessions
    });
  })
);

// POST /api/chat/sessions - Create new chat session
router.post('/sessions',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const userId = req.user!.id;
    const { subject, priority = 'medium' } = req.body;
    
    const session = await DatabaseService.createChatSession(userId, subject);
    
    // Add initial system message
    await DatabaseService.addChatMessage(
      session.id,
      userId,
      'system',
      'Chat session started. A support agent will be with you shortly.'
    );
    
    logger.info(`New chat session created: ${session.id} for user: ${userId}`);
    
    res.status(201).json({
      success: true,
      data: session,
      message: 'Chat session created successfully'
    });
  })
);

// GET /api/chat/sessions/:id - Get specific chat session
router.get('/sessions/:id',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const sessionId = parseInt(req.params.id);
    const userId = req.user!.id;
    const isAdmin = req.user!.isAdmin;
    
    const session = await DatabaseService.getChatSession(sessionId);
    
    if (!session) {
      throw new NotFoundError('Chat session not found');
    }
    
    // Check if user owns the session or is an admin
    if (session.user_id !== userId && !isAdmin) {
      throw new ForbiddenError('Access denied to this chat session');
    }
    
    res.json({
      success: true,
      data: session
    });
  })
);

// GET /api/chat/sessions/:id/messages - Get messages for a chat session
router.get('/sessions/:id/messages',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const sessionId = parseInt(req.params.id);
    const userId = req.user!.id;
    const isAdmin = req.user!.isAdmin;
    
    const session = await DatabaseService.getChatSession(sessionId);
    
    if (!session) {
      throw new NotFoundError('Chat session not found');
    }
    
    // Check if user owns the session or is an admin
    if (session.user_id !== userId && !isAdmin) {
      throw new ForbiddenError('Access denied to this chat session');
    }
    
    const messages = await DatabaseService.getChatMessages(sessionId);
    
    // Mark messages as read for the requesting user
    await DatabaseService.markMessagesAsRead(sessionId, userId);
    
    res.json({
      success: true,
      data: messages
    });
  })
);

// POST /api/chat/sessions/:id/messages - Send a message in a chat session
router.post('/sessions/:id/messages',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const sessionId = parseInt(req.params.id);
    const userId = req.user!.id;
    const isAdmin = req.user!.isAdmin;
    const { messageText } = req.body;
    
    if (!messageText || messageText.trim().length === 0) {
      throw new ValidationError('Message text is required');
    }
    
    const session = await DatabaseService.getChatSession(sessionId);
    
    if (!session) {
      throw new NotFoundError('Chat session not found');
    }
    
    // Check if user owns the session or is an admin
    if (session.user_id !== userId && !isAdmin) {
      throw new ForbiddenError('Access denied to this chat session');
    }
    
    // Check if session is closed
    if (session.status === 'closed') {
      throw new ValidationError('Cannot send messages to a closed chat session');
    }
    
    const senderType = isAdmin ? 'agent' : 'user';
    
    const message = await DatabaseService.addChatMessage(
      sessionId,
      userId,
      senderType,
      messageText.trim()
    );
    
    // If this is the first agent message, update session status to active
    if (isAdmin && session.status === 'waiting') {
      await DatabaseService.updateChatSession(sessionId, {
        status: 'active',
        agent_id: userId
      });
    }
    
    logger.info(`Message sent in session ${sessionId} by user ${userId}`);
    
    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  })
);

// PUT /api/chat/sessions/:id - Update chat session (admin only)
router.put('/sessions/:id',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const sessionId = parseInt(req.params.id);
    const isAdmin = req.user!.isAdmin;
    
    if (!isAdmin) {
      throw new ForbiddenError('Admin access required');
    }
    
    const { status, priority, agent_id } = req.body;
    const updates: any = {};
    
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (agent_id !== undefined) updates.agent_id = agent_id;
    
    const session = await DatabaseService.updateChatSession(sessionId, updates);
    
    if (!session) {
      throw new NotFoundError('Chat session not found');
    }
    
    logger.info(`Chat session ${sessionId} updated by admin ${req.user!.id}`);
    
    res.json({
      success: true,
      data: session,
      message: 'Chat session updated successfully'
    });
  })
);

// GET /api/chat/admin/sessions - Get all active chat sessions (admin only)
router.get('/admin/sessions',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const isAdmin = req.user!.isAdmin;
    
    if (!isAdmin) {
      throw new ForbiddenError('Admin access required');
    }
    
    const sessions = await DatabaseService.getActiveChatSessions();
    
    res.json({
      success: true,
      data: sessions
    });
  })
);

// POST /api/chat/admin/status - Update agent status (admin only)
router.post('/admin/status',
  asyncHandler(async (req: AuthenticatedRequest, res: any) => {
    const isAdmin = req.user!.isAdmin;
    
    if (!isAdmin) {
      throw new ForbiddenError('Admin access required');
    }
    
    const { status } = req.body;
    const agentId = req.user!.id;
    
    if (!['online', 'busy', 'offline'].includes(status)) {
      throw new ValidationError('Invalid status. Must be one of: online, busy, offline');
    }
    
    await DatabaseService.updateAgentStatus(agentId, status);
    
    logger.info(`Agent ${agentId} status updated to: ${status}`);
    
    res.json({
      success: true,
      message: `Status updated to ${status}`
    });
  })
);

export default router;