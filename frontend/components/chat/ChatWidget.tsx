'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2,
  User,
  Bot,
  Clock
} from 'lucide-react';
import { ChatSession, ChatMessage } from '@/types';
import { chatApi } from '@/lib/api/chat';
import { useWebSocket } from '@/lib/hooks/useWebSocket';

interface ChatWidgetProps {
  className?: string;
}

export default function ChatWidget({ className }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  const {
    isConnected,
    isConnecting: wsConnecting,
    connectionError,
    connect,
    disconnect,
    joinSession,
    leaveSession,
    sendMessage: sendWSMessage,
    startTyping,
    stopTyping,
    onNewMessage,
    onTyping,
    onSessionUpdate,
    onConnectionStatus,
    onMessageError
  } = useWebSocket({ autoConnect: false });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket event handlers
  useEffect(() => {
    // Handle new messages
    onNewMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // Handle typing indicators
    onTyping((user) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (user.isTyping) {
          newSet.add(user.userId);
        } else {
          newSet.delete(user.userId);
        }
        return newSet;
      });
    });

    // Handle session updates
    onSessionUpdate((data) => {
      if (data.sessionId === currentSession?.id) {
        setCurrentSession(prev => prev ? { ...prev, ...data } : null);
      }
    });

    // Handle connection status
    onConnectionStatus((status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        setErrorMessage(null);
      }
    });

    // Handle message errors
    onMessageError((error) => {
      setErrorMessage(error);
    });
  }, [currentSession?.id, onNewMessage, onTyping, onSessionUpdate, onConnectionStatus, onMessageError]);

  const startNewChat = async () => {
    setIsConnecting(true);
    setErrorMessage(null);
    
    try {
      // First connect to WebSocket
      connect();
      
      // Create new chat session
      const data = await chatApi.createSession({
        subject: 'Customer Support',
      });

      if (data.success && data.data) {
        setCurrentSession(data.data);
        
        // Load initial messages
        const messagesData = await chatApi.getMessages(data.data.id);
        if (messagesData.success) {
          setMessages(messagesData.data || []);
        }
        
        // Join the WebSocket session room
        joinSession(data.data.id);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setErrorMessage('Failed to start chat session');
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession || isLoading || !isConnected) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      // Send via WebSocket for real-time delivery
      sendWSMessage(currentSession.id, messageText);
      
      // Stop typing indicator
      stopTyping(currentSession.id);
      
      setErrorMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Failed to send message');
      // Restore the message on error
      setNewMessage(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Handle typing indicators
    if (currentSession && isConnected) {
      if (value.trim().length > 0) {
        // Start typing indicator
        startTyping(currentSession.id);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          stopTyping(currentSession.id);
        }, 3000);
      } else {
        // Stop typing when input is empty
        stopTyping(currentSession.id);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!currentSession) {
      startNewChat();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    if (currentSession) {
      leaveSession(currentSession.id);
    }
    // Don't disconnect WebSocket completely, just leave the session
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (currentSession) {
        leaveSession(currentSession.id);
      }
      disconnect();
    };
  }, []);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-yellow-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Error';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Connecting...';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMessageIcon = (senderType: string) => {
    switch (senderType) {
      case 'agent':
        return <Bot className="w-4 h-4" />;
      case 'system':
        return <Clock className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={openChat}
            className={`
              fixed bottom-6 right-6 z-50
              w-14 h-14 rounded-full
              bg-gradient-to-r from-banking-deepBlue to-banking-accent
              text-white shadow-lg hover:shadow-xl
              flex items-center justify-center
              transition-all duration-300 hover:scale-110
              ${className}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 480
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`
              fixed bottom-6 right-6 z-50
              w-80 bg-white/90 backdrop-blur-md
              border border-gray-200 rounded-2xl shadow-2xl
              overflow-hidden
              ${className}
            `}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-banking-deepBlue to-banking-accent text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${getConnectionStatusColor()} rounded-full ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}></div>
                <span className="font-medium text-sm">{getConnectionStatusText()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex flex-col h-96">
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {isConnecting ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-6 h-6 border-2 border-banking-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Connecting to support...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Start a conversation with our support team</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`
                            max-w-xs px-3 py-2 rounded-2xl text-sm
                            ${message.senderType === 'user'
                              ? 'bg-banking-accent text-white'
                              : message.senderType === 'system'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-gray-100 text-gray-900'
                            }
                          `}
                        >
                          <div className="flex items-start space-x-2">
                            {message.senderType !== 'user' && (
                              <div className="flex-shrink-0 mt-0.5">
                                {getMessageIcon(message.senderType)}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="whitespace-pre-wrap">{message.messageText}</p>
                              <p className={`text-xs mt-1 opacity-70 ${
                                message.senderType === 'user' ? 'text-white' : 'text-gray-500'
                              }`}>
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {currentSession && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-banking-accent focus:border-transparent text-sm"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isLoading}
                        className="p-2 bg-banking-accent text-white rounded-xl hover:bg-banking-deepBlue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}