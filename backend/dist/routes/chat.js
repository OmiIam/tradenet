"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../services/database"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../config/logger");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/sessions', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const sessions = await database_1.default.getUserChatSessions(userId);
    res.json({
        success: true,
        data: sessions
    });
}));
router.post('/sessions', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { subject, priority = 'medium' } = req.body;
    const session = await database_1.default.createChatSession(userId, subject);
    await database_1.default.addChatMessage(session.id, userId, 'system', 'Chat session started. A support agent will be with you shortly.');
    logger_1.logger.info(`New chat session created: ${session.id} for user: ${userId}`);
    res.status(201).json({
        success: true,
        data: session,
        message: 'Chat session created successfully'
    });
}));
router.get('/sessions/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const sessionId = parseInt(req.params.id);
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    const session = await database_1.default.getChatSession(sessionId);
    if (!session) {
        throw new errorHandler_1.NotFoundError('Chat session not found');
    }
    if (session.user_id !== userId && !isAdmin) {
        throw new errorHandler_1.ForbiddenError('Access denied to this chat session');
    }
    res.json({
        success: true,
        data: session
    });
}));
router.get('/sessions/:id/messages', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const sessionId = parseInt(req.params.id);
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    const session = await database_1.default.getChatSession(sessionId);
    if (!session) {
        throw new errorHandler_1.NotFoundError('Chat session not found');
    }
    if (session.user_id !== userId && !isAdmin) {
        throw new errorHandler_1.ForbiddenError('Access denied to this chat session');
    }
    const messages = await database_1.default.getChatMessages(sessionId);
    await database_1.default.markMessagesAsRead(sessionId, userId);
    res.json({
        success: true,
        data: messages
    });
}));
router.post('/sessions/:id/messages', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const sessionId = parseInt(req.params.id);
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    const { messageText } = req.body;
    if (!messageText || messageText.trim().length === 0) {
        throw new errorHandler_1.ValidationError('Message text is required');
    }
    const session = await database_1.default.getChatSession(sessionId);
    if (!session) {
        throw new errorHandler_1.NotFoundError('Chat session not found');
    }
    if (session.user_id !== userId && !isAdmin) {
        throw new errorHandler_1.ForbiddenError('Access denied to this chat session');
    }
    if (session.status === 'closed') {
        throw new errorHandler_1.ValidationError('Cannot send messages to a closed chat session');
    }
    const senderType = isAdmin ? 'agent' : 'user';
    const message = await database_1.default.addChatMessage(sessionId, userId, senderType, messageText.trim());
    if (isAdmin && session.status === 'waiting') {
        await database_1.default.updateChatSession(sessionId, {
            status: 'active',
            agent_id: userId
        });
    }
    logger_1.logger.info(`Message sent in session ${sessionId} by user ${userId}`);
    res.status(201).json({
        success: true,
        data: message,
        message: 'Message sent successfully'
    });
}));
router.put('/sessions/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const sessionId = parseInt(req.params.id);
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
        throw new errorHandler_1.ForbiddenError('Admin access required');
    }
    const { status, priority, agent_id } = req.body;
    const updates = {};
    if (status)
        updates.status = status;
    if (priority)
        updates.priority = priority;
    if (agent_id !== undefined)
        updates.agent_id = agent_id;
    const session = await database_1.default.updateChatSession(sessionId, updates);
    if (!session) {
        throw new errorHandler_1.NotFoundError('Chat session not found');
    }
    logger_1.logger.info(`Chat session ${sessionId} updated by admin ${req.user.id}`);
    res.json({
        success: true,
        data: session,
        message: 'Chat session updated successfully'
    });
}));
router.get('/admin/sessions', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
        throw new errorHandler_1.ForbiddenError('Admin access required');
    }
    const sessions = await database_1.default.getActiveChatSessions();
    res.json({
        success: true,
        data: sessions
    });
}));
router.post('/admin/status', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const isAdmin = req.user.isAdmin;
    if (!isAdmin) {
        throw new errorHandler_1.ForbiddenError('Admin access required');
    }
    const { status } = req.body;
    const agentId = req.user.id;
    if (!['online', 'busy', 'offline'].includes(status)) {
        throw new errorHandler_1.ValidationError('Invalid status. Must be one of: online, busy, offline');
    }
    await database_1.default.updateAgentStatus(agentId, status);
    logger_1.logger.info(`Agent ${agentId} status updated to: ${status}`);
    res.json({
        success: true,
        message: `Status updated to ${status}`
    });
}));
exports.default = router;
//# sourceMappingURL=chat.js.map