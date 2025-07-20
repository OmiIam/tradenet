"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const logger_1 = require("../config/logger");
class ChatSocketService {
    constructor(io) {
        this.connectedUsers = new Map();
        this.sessionRooms = new Map();
        this.typingUsers = new Map();
        this.io = io;
        this.setupSocketHandlers();
    }
    setupSocketHandlers() {
        this.io.on('connection', (socket) => {
            if (!socket.user) {
                logger_1.logger.error('Socket connected without user authentication');
                socket.disconnect();
                return;
            }
            this.handleUserConnection(socket);
            this.setupEventHandlers(socket);
        });
    }
    handleUserConnection(socket) {
        const userId = socket.user.id;
        if (!this.connectedUsers.has(userId)) {
            this.connectedUsers.set(userId, new Set());
        }
        this.connectedUsers.get(userId).add(socket.id);
        if (socket.user.isAdmin) {
            this.updateAgentStatus(userId, 'online');
        }
        socket.emit('connection_status', 'connected');
        logger_1.logger.info('User connected to chat', {
            userId,
            userName: `${socket.user.firstName} ${socket.user.lastName}`,
            socketId: socket.id,
            isAdmin: socket.user.isAdmin
        });
    }
    setupEventHandlers(socket) {
        const userId = socket.user.id;
        socket.on('join_session', async (sessionId) => {
            try {
                const session = await database_1.default.getChatSession(sessionId);
                if (!session) {
                    socket.emit('message_error', 'Chat session not found');
                    return;
                }
                if (session.user_id !== userId && !socket.user.isAdmin) {
                    socket.emit('message_error', 'Access denied to this chat session');
                    return;
                }
                const roomName = `session_${sessionId}`;
                socket.join(roomName);
                if (!this.sessionRooms.has(sessionId)) {
                    this.sessionRooms.set(sessionId, new Set());
                }
                this.sessionRooms.get(sessionId).add(socket.id);
                if (socket.user.isAdmin && !session.agent_id) {
                    await database_1.default.updateChatSession(sessionId, {
                        agent_id: userId,
                        status: 'active'
                    });
                    this.io.to(roomName).emit('session_updated', {
                        sessionId,
                        status: 'active',
                        agentId: userId,
                        agentName: `${socket.user.firstName} ${socket.user.lastName}`
                    });
                }
                logger_1.logger.info('User joined chat session', {
                    userId,
                    sessionId,
                    roomName,
                    isAdmin: socket.user.isAdmin
                });
            }
            catch (error) {
                logger_1.logger.error('Error joining session:', error);
                socket.emit('message_error', 'Failed to join chat session');
            }
        });
        socket.on('leave_session', (sessionId) => {
            const roomName = `session_${sessionId}`;
            socket.leave(roomName);
            if (this.sessionRooms.has(sessionId)) {
                this.sessionRooms.get(sessionId).delete(socket.id);
                if (this.sessionRooms.get(sessionId).size === 0) {
                    this.sessionRooms.delete(sessionId);
                }
            }
            this.handleTypingStop(sessionId, userId);
            logger_1.logger.info('User left chat session', { userId, sessionId, roomName });
        });
        socket.on('send_message', async (data) => {
            try {
                const { sessionId, messageText } = data;
                if (!messageText || messageText.trim().length === 0) {
                    socket.emit('message_error', 'Message text is required');
                    return;
                }
                const session = await database_1.default.getChatSession(sessionId);
                if (!session) {
                    socket.emit('message_error', 'Chat session not found');
                    return;
                }
                if (session.user_id !== userId && !socket.user.isAdmin) {
                    socket.emit('message_error', 'Access denied to this chat session');
                    return;
                }
                const senderType = socket.user.isAdmin ? 'agent' : 'user';
                const message = await database_1.default.addChatMessage(sessionId, userId, senderType, messageText.trim());
                const messageWithSender = {
                    ...message,
                    senderName: `${socket.user.firstName} ${socket.user.lastName}`,
                    senderType
                };
                const roomName = `session_${sessionId}`;
                this.io.to(roomName).emit('new_message', messageWithSender);
                this.handleTypingStop(sessionId, userId);
                logger_1.logger.info('Message sent in chat session', {
                    userId,
                    sessionId,
                    messageId: message.id,
                    senderType
                });
            }
            catch (error) {
                logger_1.logger.error('Error sending message:', error);
                socket.emit('message_error', 'Failed to send message');
            }
        });
        socket.on('typing_start', (sessionId) => {
            this.handleTypingStart(sessionId, userId, socket);
        });
        socket.on('typing_stop', (sessionId) => {
            this.handleTypingStop(sessionId, userId);
        });
        socket.on('update_agent_status', async (status) => {
            if (socket.user.isAdmin) {
                await this.updateAgentStatus(userId, status);
            }
        });
        socket.on('disconnect', () => {
            this.handleUserDisconnection(socket);
        });
    }
    handleTypingStart(sessionId, userId, socket) {
        if (!this.typingUsers.has(sessionId)) {
            this.typingUsers.set(sessionId, new Set());
        }
        const typingSet = this.typingUsers.get(sessionId);
        if (!typingSet.has(userId)) {
            typingSet.add(userId);
            const roomName = `session_${sessionId}`;
            socket.to(roomName).emit('user_typing', {
                userId,
                userName: `${socket.user.firstName} ${socket.user.lastName}`,
                isTyping: true
            });
        }
    }
    handleTypingStop(sessionId, userId) {
        if (this.typingUsers.has(sessionId)) {
            const typingSet = this.typingUsers.get(sessionId);
            if (typingSet.has(userId)) {
                typingSet.delete(userId);
                const roomName = `session_${sessionId}`;
                this.io.to(roomName).emit('user_typing', {
                    userId,
                    userName: '',
                    isTyping: false
                });
            }
        }
    }
    async updateAgentStatus(agentId, status) {
        try {
            await database_1.default.updateAgentStatus(agentId, status);
            this.io.emit('agent_status_changed', {
                agentId,
                status
            });
            logger_1.logger.info('Agent status updated', { agentId, status });
        }
        catch (error) {
            logger_1.logger.error('Error updating agent status:', error);
        }
    }
    handleUserDisconnection(socket) {
        const userId = socket.user.id;
        if (this.connectedUsers.has(userId)) {
            this.connectedUsers.get(userId).delete(socket.id);
            if (this.connectedUsers.get(userId).size === 0) {
                this.connectedUsers.delete(userId);
                if (socket.user.isAdmin) {
                    this.updateAgentStatus(userId, 'offline');
                }
            }
        }
        for (const [sessionId, socketIds] of this.sessionRooms.entries()) {
            if (socketIds.has(socket.id)) {
                socketIds.delete(socket.id);
                this.handleTypingStop(sessionId, userId);
                if (socketIds.size === 0) {
                    this.sessionRooms.delete(sessionId);
                }
            }
        }
        logger_1.logger.info('User disconnected from chat', {
            userId,
            userName: `${socket.user.firstName} ${socket.user.lastName}`,
            socketId: socket.id,
            isAdmin: socket.user.isAdmin
        });
    }
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }
    getActiveSessionsCount() {
        return this.sessionRooms.size;
    }
    isUserConnected(userId) {
        return this.connectedUsers.has(userId);
    }
    notifySessionUpdate(sessionId, updateData) {
        const roomName = `session_${sessionId}`;
        this.io.to(roomName).emit('session_updated', updateData);
    }
}
exports.default = ChatSocketService;
//# sourceMappingURL=chatSocketService.js.map