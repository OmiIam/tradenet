'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types';

interface WebSocketHookOptions {
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

interface TypingUser {
  userId: number;
  userName: string;
  isTyping: boolean;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  connect: () => void;
  disconnect: () => void;
  joinSession: (sessionId: number) => void;
  leaveSession: (sessionId: number) => void;
  sendMessage: (sessionId: number, messageText: string) => void;
  startTyping: (sessionId: number) => void;
  stopTyping: (sessionId: number) => void;
  onNewMessage: (callback: (message: ChatMessage) => void) => void;
  onTyping: (callback: (user: TypingUser) => void) => void;
  onSessionUpdate: (callback: (data: any) => void) => void;
  onConnectionStatus: (callback: (status: 'connected' | 'disconnected' | 'error') => void) => void;
  onMessageError: (callback: (error: string) => void) => void;
  connectedUsersCount: number;
}

export function useWebSocket(options: WebSocketHookOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = false,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectedUsersCount, setConnectedUsersCount] = useState(0);
  
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Event callback refs
  const messageCallbackRef = useRef<((message: ChatMessage) => void) | null>(null);
  const typingCallbackRef = useRef<((user: TypingUser) => void) | null>(null);
  const sessionUpdateCallbackRef = useRef<((data: any) => void) | null>(null);
  const connectionStatusCallbackRef = useRef<((status: 'connected' | 'disconnected' | 'error') => void) | null>(null);
  const messageErrorCallbackRef = useRef<((error: string) => void) | null>(null);

  const getAuthToken = () => {
    // In a real app, you'd get this from your auth context or localStorage
    // For now, we'll assume it's available from cookies or auth context
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  const setupSocketListeners = useCallback((socketInstance: Socket) => {
    socketInstance.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
      reconnectAttempts.current = 0;
      
      if (connectionStatusCallbackRef.current) {
        connectionStatusCallbackRef.current('connected');
      }
      
      console.log('WebSocket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      setIsConnecting(false);
      
      if (connectionStatusCallbackRef.current) {
        connectionStatusCallbackRef.current('disconnected');
      }
      
      console.log('WebSocket disconnected:', reason);
      
      // Auto-reconnect for certain disconnect reasons
      if (reason === 'io server disconnect' || reason === 'transport close') {
        attemptReconnect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      setIsConnecting(false);
      setConnectionError(error.message);
      
      if (connectionStatusCallbackRef.current) {
        connectionStatusCallbackRef.current('error');
      }
      
      console.error('WebSocket connection error:', error);
      attemptReconnect();
    });

    socketInstance.on('new_message', (message: ChatMessage) => {
      if (messageCallbackRef.current) {
        messageCallbackRef.current(message);
      }
    });

    socketInstance.on('user_typing', (user: TypingUser) => {
      if (typingCallbackRef.current) {
        typingCallbackRef.current(user);
      }
    });

    socketInstance.on('session_updated', (data: any) => {
      if (sessionUpdateCallbackRef.current) {
        sessionUpdateCallbackRef.current(data);
      }
    });

    socketInstance.on('message_error', (error: string) => {
      if (messageErrorCallbackRef.current) {
        messageErrorCallbackRef.current(error);
      }
    });

    socketInstance.on('connection_status', (status: 'connected' | 'disconnected' | 'error') => {
      if (connectionStatusCallbackRef.current) {
        connectionStatusCallbackRef.current(status);
      }
    });
  }, []);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current < reconnectionAttempts) {
      reconnectAttempts.current++;
      setIsConnecting(true);
      
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      
      reconnectTimeout.current = setTimeout(() => {
        console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${reconnectionAttempts})`);
        connect();
      }, reconnectionDelay * reconnectAttempts.current);
    } else {
      setConnectionError('Failed to reconnect after multiple attempts');
      setIsConnecting(false);
    }
  }, [reconnectionAttempts, reconnectionDelay]);

  const connect = useCallback(() => {
    if (socket?.connected) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setConnectionError('No authentication token available');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
    
    const newSocket = io(backendUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    setupSocketListeners(newSocket);
    setSocket(newSocket);
  }, [socket, setupSocketListeners]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError(null);
    reconnectAttempts.current = 0;
  }, [socket]);

  const joinSession = useCallback((sessionId: number) => {
    if (socket?.connected) {
      socket.emit('join_session', sessionId);
    }
  }, [socket]);

  const leaveSession = useCallback((sessionId: number) => {
    if (socket?.connected) {
      socket.emit('leave_session', sessionId);
    }
  }, [socket]);

  const sendMessage = useCallback((sessionId: number, messageText: string) => {
    if (socket?.connected) {
      socket.emit('send_message', { sessionId, messageText });
    }
  }, [socket]);

  const startTyping = useCallback((sessionId: number) => {
    if (socket?.connected) {
      socket.emit('typing_start', sessionId);
    }
  }, [socket]);

  const stopTyping = useCallback((sessionId: number) => {
    if (socket?.connected) {
      socket.emit('typing_stop', sessionId);
    }
  }, [socket]);

  // Event subscription methods
  const onNewMessage = useCallback((callback: (message: ChatMessage) => void) => {
    messageCallbackRef.current = callback;
  }, []);

  const onTyping = useCallback((callback: (user: TypingUser) => void) => {
    typingCallbackRef.current = callback;
  }, []);

  const onSessionUpdate = useCallback((callback: (data: any) => void) => {
    sessionUpdateCallbackRef.current = callback;
  }, []);

  const onConnectionStatus = useCallback((callback: (status: 'connected' | 'disconnected' | 'error') => void) => {
    connectionStatusCallbackRef.current = callback;
  }, []);

  const onMessageError = useCallback((callback: (error: string) => void) => {
    messageErrorCallbackRef.current = callback;
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      disconnect();
    };
  }, []);

  return {
    socket,
    isConnected,
    isConnecting,
    connectionError,
    connect,
    disconnect,
    joinSession,
    leaveSession,
    sendMessage,
    startTyping,
    stopTyping,
    onNewMessage,
    onTyping,
    onSessionUpdate,
    onConnectionStatus,
    onMessageError,
    connectedUsersCount
  };
}

export default useWebSocket;