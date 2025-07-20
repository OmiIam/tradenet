import { ChatSession, ChatMessage, CreateChatSession, SendChatMessage, ApiResponse } from '@/types';

class ChatAPI {
  private baseUrl = '/api/chat';

  // Session operations
  async createSession(data: CreateChatSession): Promise<ApiResponse<ChatSession>> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async getUserSessions(): Promise<ApiResponse<ChatSession[]>> {
    const response = await fetch(`${this.baseUrl}/sessions`, {
      credentials: 'include',
    });

    return response.json();
  }

  async getSession(sessionId: number): Promise<ApiResponse<ChatSession>> {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
      credentials: 'include',
    });

    return response.json();
  }

  // Message operations
  async getMessages(sessionId: number): Promise<ApiResponse<ChatMessage[]>> {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}/messages`, {
      credentials: 'include',
    });

    return response.json();
  }

  async sendMessage(sessionId: number, messageText: string): Promise<ApiResponse<ChatMessage>> {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageText }),
      credentials: 'include',
    });

    return response.json();
  }

  // Admin operations
  async getActiveSessions(): Promise<ApiResponse<ChatSession[]>> {
    const response = await fetch(`${this.baseUrl}/admin/sessions`, {
      credentials: 'include',
    });

    return response.json();
  }

  async updateSession(sessionId: number, updates: Partial<ChatSession>): Promise<ApiResponse<ChatSession>> {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
      credentials: 'include',
    });

    return response.json();
  }

  async updateAgentStatus(status: 'online' | 'busy' | 'offline'): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseUrl}/admin/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
      credentials: 'include',
    });

    return response.json();
  }
}

export const chatApi = new ChatAPI();
export default chatApi;