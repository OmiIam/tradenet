export interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    account_type: 'personal' | 'business';
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface Account {
    id: number;
    user_id: number;
    account_number: string;
    account_type: 'checking' | 'savings' | 'business' | 'cd';
    account_name: string;
    balance: number;
    available_balance: number;
    interest_rate: number;
    minimum_balance: number;
    monthly_fee: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface Transaction {
    id: number;
    account_id: number;
    transaction_type: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest' | 'adjustment';
    amount: number;
    balance_after: number;
    description: string;
    reference_number?: string;
    payee_id?: number;
    category: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    notes?: string;
    transaction_date: string;
    created_at: string;
    created_by?: number;
}
export interface Payee {
    id: number;
    user_id: number;
    name: string;
    account_number?: string;
    routing_number?: string;
    bank_name?: string;
    payee_type: 'person' | 'business' | 'utility' | 'government';
    phone?: string;
    email?: string;
    address?: string;
    memo?: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface ChatSession {
    id: number;
    user_id: number;
    agent_id?: number;
    status: 'waiting' | 'active' | 'resolved' | 'closed';
    subject?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
    closed_at?: string;
}
export interface ChatMessage {
    id: number;
    session_id: number;
    sender_id: number;
    sender_type: 'user' | 'agent' | 'system';
    message_text: string;
    message_type: 'text' | 'system' | 'file';
    is_read: boolean;
    created_at: string;
}
export interface ChatAgentStatus {
    id: number;
    agent_id: number;
    status: 'online' | 'busy' | 'offline';
    max_concurrent_chats: number;
    current_chat_count: number;
    last_activity: string;
}
export declare class DatabaseService {
    private db;
    constructor();
    createUser(userData: Partial<User>): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    updateUser(id: number, userData: Partial<User>): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    createAccount(accountData: Partial<Account>): Promise<Account>;
    getAccountById(id: number): Promise<Account | null>;
    getAccountsByUserId(userId: number): Promise<Account[]>;
    updateAccountBalance(accountId: number, newBalance: number): Promise<Account | null>;
    getAllAccounts(): Promise<Account[]>;
    createTransaction(transactionData: Partial<Transaction>): Promise<Transaction>;
    getTransactionById(id: number): Promise<Transaction | null>;
    getTransactionsByAccountId(accountId: number, limit?: number): Promise<Transaction[]>;
    getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]>;
    getAllTransactions(): Promise<Transaction[]>;
    createPayee(payeeData: Partial<Payee>): Promise<Payee>;
    getPayeeById(id: number): Promise<Payee | null>;
    getPayeesByUserId(userId: number): Promise<Payee[]>;
    getAllPayees(): Promise<Payee[]>;
    updatePayee(id: number, updates: Partial<Payee>): Promise<Payee | null>;
    getTotalBalance(userId: number): Promise<number>;
    getPendingTransactionsCount(userId: number): Promise<number>;
    createChatSession(userId: number, subject?: string): Promise<ChatSession>;
    getChatSession(sessionId: number): Promise<ChatSession | null>;
    getUserChatSessions(userId: number): Promise<ChatSession[]>;
    getActiveChatSessions(): Promise<ChatSession[]>;
    updateChatSession(sessionId: number, updates: Partial<ChatSession>): Promise<ChatSession | null>;
    addChatMessage(sessionId: number, senderId: number, senderType: string, messageText: string): Promise<ChatMessage>;
    getChatMessage(messageId: number): Promise<ChatMessage | null>;
    getChatMessages(sessionId: number): Promise<ChatMessage[]>;
    markMessagesAsRead(sessionId: number, userId: number): Promise<void>;
    getUnreadMessageCount(sessionId: number, userId: number): Promise<number>;
    updateAgentStatus(agentId: number, status: string): Promise<void>;
    getAvailableAgents(): Promise<ChatAgentStatus[]>;
    initializeTestData(): Promise<void>;
}
declare const _default: DatabaseService;
export default _default;
//# sourceMappingURL=database.d.ts.map