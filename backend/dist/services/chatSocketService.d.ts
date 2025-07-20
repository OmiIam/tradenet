import { Server } from 'socket.io';
export interface ChatSocketEvents {
    join_session: (sessionId: number) => void;
    leave_session: (sessionId: number) => void;
    send_message: (data: {
        sessionId: number;
        messageText: string;
    }) => void;
    typing_start: (sessionId: number) => void;
    typing_stop: (sessionId: number) => void;
    update_agent_status: (status: 'online' | 'busy' | 'offline') => void;
    new_message: (message: any) => void;
    message_error: (error: string) => void;
    user_typing: (data: {
        userId: number;
        userName: string;
        isTyping: boolean;
    }) => void;
    session_updated: (session: any) => void;
    agent_status_changed: (data: {
        agentId: number;
        status: string;
    }) => void;
    connection_status: (status: 'connected' | 'disconnected' | 'error') => void;
}
declare class ChatSocketService {
    private io;
    private connectedUsers;
    private sessionRooms;
    private typingUsers;
    constructor(io: Server);
    private setupSocketHandlers;
    private handleUserConnection;
    private setupEventHandlers;
    private handleTypingStart;
    private handleTypingStop;
    private updateAgentStatus;
    private handleUserDisconnection;
    getConnectedUsersCount(): number;
    getActiveSessionsCount(): number;
    isUserConnected(userId: number): boolean;
    notifySessionUpdate(sessionId: number, updateData: any): void;
}
export default ChatSocketService;
//# sourceMappingURL=chatSocketService.d.ts.map