export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
  variant?: 'primary' | 'secondary';
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface BankingStats {
  customers: string;
  transactions: string;
  security: string;
  uptime: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
    };
  };
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// New interfaces for additional pages
export interface AccountType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  minimumBalance: string;
  interestRate?: string;
  monthlyFee?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  email?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'general' | 'support' | 'loans' | 'accounts' | 'other';
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  interestRate: string;
  terms: string[];
  requirements: string[];
}

export interface CreditCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  rewards: string;
  annualFee: string;
  aprRange: string;
  benefits: string[];
}

export interface SecurityFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

export interface InvestmentProduct {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  riskLevel: 'low' | 'medium' | 'high';
  minimumInvestment: string;
  expectedReturn: string;
  features: string[];
}

// Enhanced Banking System Types

// User and Authentication Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  accountType: 'personal' | 'business';
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  accountType: 'personal' | 'business';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  accountType?: 'personal' | 'business';
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

// Account Types
export interface Account {
  id: number;
  userId: number;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business' | 'cd';
  accountName: string;
  balance: number;
  availableBalance: number;
  interestRate: number;
  minimumBalance: number;
  monthlyFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountSummary {
  id: number;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business' | 'cd';
  accountName: string;
  balance: number;
  availableBalance: number;
}

export interface AccountTypeConfig {
  id: number;
  typeName: string;
  displayName: string;
  description: string;
  minBalance: number;
  monthlyFee: number;
  interestRate: number;
  isActive: boolean;
}

// Transaction Types
export interface Transaction {
  id: number;
  accountId: number;
  transactionType: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest' | 'adjustment';
  amount: number;
  balanceAfter: number;
  description: string;
  referenceNumber?: string;
  payeeId?: number;
  payeeName?: string;
  category: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  notes?: string;
  transactionDate: string;
  createdAt: string;
  createdBy?: number;
  accountName?: string;
}

export interface CreateTransaction {
  accountId: number;
  transactionType: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest' | 'adjustment';
  amount: number;
  description: string;
  payeeId?: number;
  category?: string;
  notes?: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
  transactionType?: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest' | 'adjustment';
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export interface TransactionCategory {
  id: number;
  categoryName: string;
  displayName: string;
  icon: string;
  color: string;
  isSystem: boolean;
  isActive: boolean;
}

// Payee Types
export interface Payee {
  id: number;
  userId: number;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  payeeType: 'person' | 'business' | 'utility' | 'government';
  phone?: string;
  email?: string;
  address?: string;
  memo?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayee {
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  payeeType?: 'person' | 'business' | 'utility' | 'government';
  phone?: string;
  email?: string;
  address?: string;
  memo?: string;
}

// Dashboard Types
export interface DashboardOverview {
  user: AuthUser;
  accounts: AccountSummary[];
  totalBalance: number;
  recentTransactions: Transaction[];
  monthlySpending: number;
  monthlyIncome: number;
  pendingTransactions: number;
}

export interface AccountDetails {
  account: Account;
  transactions: Transaction[];
  monthlyTransactions: Transaction[];
  categories: { [key: string]: number };
}

// Admin Types
export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  accountType: 'personal' | 'business';
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  accountCount: number;
  totalBalance: number;
}

export interface AdminAccount {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business' | 'cd';
  accountName: string;
  balance: number;
  availableBalance: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminTransaction extends Transaction {
  userName: string;
  userEmail: string;
  accountName: string;
  accountNumber: string;
}

export interface AdminPayee extends Payee {
  userName: string;
  userEmail: string;
}

export interface AdminLog {
  id: number;
  adminId: number;
  adminName: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: number;
  oldValues?: any;
  newValues?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface BalanceUpdate {
  accountId: number;
  newBalance: number;
  reason: string;
}

export interface TransactionUpdate {
  description?: string;
  category?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface TransferForm {
  fromAccountId: number;
  toAccountId?: number;
  payeeId?: number;
  amount: number;
  description: string;
  category?: string;
  scheduledDate?: string;
}

export interface PayeeForm {
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  payeeType: 'person' | 'business' | 'utility' | 'government';
  phone?: string;
  email?: string;
  address?: string;
  memo?: string;
}

// Chart and Analytics Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyBalance {
  month: string;
  balance: number;
  income: number;
  expenses: number;
}

// Settings Types
export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  statementPreference: 'email' | 'mail' | 'both';
  language: string;
  timezone: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  trustedDevices: TrustedDevice[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastUsed: string;
  ipAddress: string;
  location: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

// Error Types
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationError {
  errors: FormError[];
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  accountId?: number;
  userId?: number;
  status?: string;
  type?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Chat Support Types
export interface ChatSession {
  id: number;
  userId: number;
  agentId?: number;
  status: 'waiting' | 'active' | 'resolved' | 'closed';
  subject?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface ChatMessage {
  id: number;
  sessionId: number;
  senderId: number;
  senderType: 'user' | 'agent' | 'system';
  messageText: string;
  messageType: 'text' | 'system' | 'file';
  isRead: boolean;
  createdAt: string;
}

export interface ChatAgentStatus {
  id: number;
  agentId: number;
  status: 'online' | 'busy' | 'offline';
  maxConcurrentChats: number;
  currentChatCount: number;
  lastActivity: string;
}

export interface CreateChatSession {
  subject?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SendChatMessage {
  sessionId: number;
  messageText: string;
}

export interface ChatNotification {
  id: string;
  sessionId: number;
  type: 'new_message' | 'agent_joined' | 'session_closed';
  message: string;
  timestamp: string;
}

// Export existing interfaces for backward compatibility