import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { logger } from '../config/logger';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    accountType: string;
  };
}

export const authenticateSocket = (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => {
  try {
    // Get token from auth object or query string
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    
    if (!token) {
      logger.warn('WebSocket connection attempted without token', {
        socketId: socket.id,
        ip: socket.handshake.address
      });
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    if (!decoded || !decoded.id) {
      logger.warn('WebSocket connection attempted with invalid token', {
        socketId: socket.id,
        ip: socket.handshake.address
      });
      return next(new Error('Invalid authentication token'));
    }

    // Attach user info to socket
    socket.user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      isAdmin: decoded.isAdmin || false,
      accountType: decoded.accountType || 'personal'
    };

    logger.info('WebSocket connection authenticated', {
      socketId: socket.id,
      userId: socket.user.id,
      userEmail: socket.user.email,
      isAdmin: socket.user.isAdmin
    });

    next();
  } catch (error) {
    logger.error('WebSocket authentication error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      socketId: socket.id,
      ip: socket.handshake.address
    });
    next(new Error('Authentication failed'));
  }
};

export default authenticateSocket;