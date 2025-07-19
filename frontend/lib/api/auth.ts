import { apiClient, ApiResponse } from './client';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
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
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  accountType: 'personal' | 'business';
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginResponse {
  success: boolean;
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  expiresAt: number;
}

export interface MeResponse {
  user: AuthUser;
}

export interface RefreshResponse {
  success: boolean;
  expiresAt: number;
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    // Store tokens in localStorage for cross-origin authentication
    if (response.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
    }
    
    return response;
  },

  // Register new user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register', userData);
  },

  // Get current user
  async me(): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/auth/me');
  },

  // Refresh access token
  async refresh(): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>('/auth/refresh');
  },

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/auth/logout');
  },
};

export default authApi;