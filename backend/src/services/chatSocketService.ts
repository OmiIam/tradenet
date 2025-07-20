import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import DatabaseService from './database';
import { logger } from '../config/logger';

export interface ChatSocketEvents {
  // Client to server events
  join_session: (sessionId: number) => void;
  leave_session: (sessionId: number) => void;
  send_message: (data: { sessionId: number; messageText: string }) => void;
  typing_start: (sessionId: number) => void;
  typing_stop: (sessionId: number) => void;
  update_agent_status: (status: 'online' | 'busy' | 'offline') => void;
  
  // Server to client events
  new_message: (message: any) => void;
  message_error: (error: string) => void;
  user_typing: (data: { userId: number; userName: string; isTyping: boolean }) => void;
  session_updated: (session: any) => void;
  agent_status_changed: (data: { agentId: number; status: string }) => void;
  connection_status: (status: 'connected' | 'disconnected' | 'error') => void;
}

class ChatSocketService {
  private io: Server;
  private connectedUsers: Map<number, Set<string>> = new Map(); // userId -> Set of socketIds
  private sessionRooms: Map<number, Set<string>> = new Map(); // sessionId -> Set of socketIds
  private typingUsers: Map<number, Set<number>> = new Map(); // sessionId -> Set of userIds

  constructor(io: Server) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      if (!socket.user) {
        logger.error('Socket connected without user authentication');
        socket.disconnect();
        return;
      }

      this.handleUserConnection(socket);
      this.setupEventHandlers(socket);
    });
  }

  private handleUserConnection(socket: AuthenticatedSocket): void {
    const userId = socket.user!.id;
    
    // Track connected user
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)!.add(socket.id);

    // Update agent status if user is admin
    if (socket.user!.isAdmin) {
      this.updateAgentStatus(userId, 'online');
    }

    // Send connection confirmation
    socket.emit('connection_status', 'connected');

    logger.info('User connected to chat', {
      userId,
      userName: `${socket.user!.firstName} ${socket.user!.lastName}`,
      socketId: socket.id,
      isAdmin: socket.user!.isAdmin
    });
  }

  private setupEventHandlers(socket: AuthenticatedSocket): void {
    const userId = socket.user!.id;

    // Join chat session room
    socket.on('join_session', async (sessionId: number) => {
      try {
        const session = await DatabaseService.getChatSession(sessionId);
        
        if (!session) {
          socket.emit('message_error', 'Chat session not found');
          return;
        }

        // Check permissions
        if (session.user_id !== userId && !socket.user!.isAdmin) {
          socket.emit('message_error', 'Access denied to this chat session');
          return;
        }

        // Join the session room
        const roomName = `session_${sessionId}`;
        socket.join(roomName);

        // Track session participants
        if (!this.sessionRooms.has(sessionId)) {
          this.sessionRooms.set(sessionId, new Set());
        }
        this.sessionRooms.get(sessionId)!.add(socket.id);

        // If admin joining, assign as agent
        if (socket.user!.isAdmin && !session.agent_id) {
          await DatabaseService.updateChatSession(sessionId, {
            agent_id: userId,
            status: 'active'
          });

          // Notify all participants that agent joined
          this.io.to(roomName).emit('session_updated', {
            sessionId,
            status: 'active',
            agentId: userId,
            agentName: `${socket.user!.firstName} ${socket.user!.lastName}`
          });
        }

        logger.info('User joined chat session', {
          userId,
          sessionId,
          roomName,
          isAdmin: socket.user!.isAdmin
        });

      } catch (error) {
        logger.error('Error joining session:', error);
        socket.emit('message_error', 'Failed to join chat session');
      }
    });

    // Leave chat session room
    socket.on('leave_session', (sessionId: number) => {
      const roomName = `session_${sessionId}`;
      socket.leave(roomName);

      // Remove from session tracking
      if (this.sessionRooms.has(sessionId)) {
        this.sessionRooms.get(sessionId)!.delete(socket.id);
        if (this.sessionRooms.get(sessionId)!.size === 0) {
          this.sessionRooms.delete(sessionId);
        }
      }

      // Stop typing if user was typing
      this.handleTypingStop(sessionId, userId);

      logger.info('User left chat session', { userId, sessionId, roomName });
    });

    // Send message
    socket.on('send_message', async (data: { sessionId: number; messageText: string }) => {
      try {
        const { sessionId, messageText } = data;

        if (!messageText || messageText.trim().length === 0) {
          socket.emit('message_error', 'Message text is required');
          return;
        }

        const session = await DatabaseService.getChatSession(sessionId);
        if (!session) {
          socket.emit('message_error', 'Chat session not found');
          return;
        }

        // Check permissions
        if (session.user_id !== userId && !socket.user!.isAdmin) {
          socket.emit('message_error', 'Access denied to this chat session');
          return;
        }

        const senderType = socket.user!.isAdmin ? 'agent' : 'user';
        
        // Save message to database
        const message = await DatabaseService.addChatMessage(
          sessionId,
          userId,
          senderType,
          messageText.trim()
        );

        // Add sender info for real-time display
        const messageWithSender = {
          ...message,
          senderName: `${socket.user!.firstName} ${socket.user!.lastName}`,
          senderType
        };

        // Broadcast to all users in the session room
        const roomName = `session_${sessionId}`;
        this.io.to(roomName).emit('new_message', messageWithSender);

        // Stop typing indicator for sender
        this.handleTypingStop(sessionId, userId);

        logger.info('Message sent in chat session', {
          userId,
          sessionId,
          messageId: message.id,
          senderType
        });

      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('message_error', 'Failed to send message');
      }
    });

    // Typing indicators
    socket.on('typing_start', (sessionId: number) => {
      this.handleTypingStart(sessionId, userId, socket);
    });

    socket.on('typing_stop', (sessionId: number) => {
      this.handleTypingStop(sessionId, userId);
    });

    // Agent status updates
    socket.on('update_agent_status', async (status: 'online' | 'busy' | 'offline') => {
      if (socket.user!.isAdmin) {
        await this.updateAgentStatus(userId, status);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      this.handleUserDisconnection(socket);
    });
  }

  private handleTypingStart(sessionId: number, userId: number, socket: AuthenticatedSocket): void {
    if (!this.typingUsers.has(sessionId)) {
      this.typingUsers.set(sessionId, new Set());
    }
    
    const typingSet = this.typingUsers.get(sessionId)!;
    if (!typingSet.has(userId)) {
      typingSet.add(userId);
      
      // Broadcast typing indicator to others in the session
      const roomName = `session_${sessionId}`;
      socket.to(roomName).emit('user_typing', {
        userId,
        userName: `${socket.user!.firstName} ${socket.user!.lastName}`,
        isTyping: true
      });
    }
  }

  private handleTypingStop(sessionId: number, userId: number): void {
    if (this.typingUsers.has(sessionId)) {
      const typingSet = this.typingUsers.get(sessionId)!;
      if (typingSet.has(userId)) {
        typingSet.delete(userId);
        
        // Broadcast stop typing to others in the session
        const roomName = `session_${sessionId}`;
        this.io.to(roomName).emit('user_typing', {
          userId,
          userName: '', // Name not needed for stop typing
          isTyping: false
        });
      }
    }
  }

  private async updateAgentStatus(agentId: number, status: string): Promise<void> {
    try {
      await DatabaseService.updateAgentStatus(agentId, status);
      
      // Broadcast agent status change to all connected users
      this.io.emit('agent_status_changed', {
        agentId,
        status
      });

      logger.info('Agent status updated', { agentId, status });
    } catch (error) {
      logger.error('Error updating agent status:', error);
    }
  }

  private handleUserDisconnection(socket: AuthenticatedSocket): void {
    const userId = socket.user!.id;
    
    // Remove from connected users
    if (this.connectedUsers.has(userId)) {
      this.connectedUsers.get(userId)!.delete(socket.id);
      if (this.connectedUsers.get(userId)!.size === 0) {
        this.connectedUsers.delete(userId);
        
        // If admin disconnected, update status to offline
        if (socket.user!.isAdmin) {
          this.updateAgentStatus(userId, 'offline');
        }
      }
    }

    // Remove from all session rooms
    for (const [sessionId, socketIds] of this.sessionRooms.entries()) {
      if (socketIds.has(socket.id)) {
        socketIds.delete(socket.id);
        // Stop typing if user was typing
        this.handleTypingStop(sessionId, userId);
        
        if (socketIds.size === 0) {
          this.sessionRooms.delete(sessionId);
        }
      }
    }

    logger.info('User disconnected from chat', {
      userId,
      userName: `${socket.user!.firstName} ${socket.user!.lastName}`,
      socketId: socket.id,
      isAdmin: socket.user!.isAdmin
    });
  }

  // Public methods for external use
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getActiveSessionsCount(): number {
    return this.sessionRooms.size;
  }

  public isUserConnected(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }

  public notifySessionUpdate(sessionId: number, updateData: any): void {
    const roomName = `session_${sessionId}`;
    this.io.to(roomName).emit('session_updated', updateData);
  }
}

export default ChatSocketService;