const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private userId: string

  constructor() {
    this.userId = this.getUserId()
  }

  private getUserId(): string {
    let userId = localStorage.getItem('botify_user_id')
    if (!userId) {
      userId = crypto.randomUUID()
      localStorage.setItem('botify_user_id', userId)
    }
    return userId
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.userId,
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Request failed' }
      }

      return { data }
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error' }
    }
  }

  // Projects API
  async listProjects() {
    return this.request<{ projects: any[] }>('/api/projects')
  }

  async getProject(id: string) {
    return this.request<{ project: any }>(`/api/projects/${id}`)
  }

  async saveProject(project: any) {
    return this.request<{ project: any }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    })
  }

  async deleteProject(id: string) {
    return this.request<{ success: boolean }>(`/api/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // AI Assistant API
  async getAISuggestions(canvas: any, context?: string) {
    return this.request<{ suggestions: any[] }>('/api/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({ canvas, context }),
    })
  }

  // Export API
  async exportBot(canvas: any, language: 'discord.js' | 'discord.py', settings: any) {
    return this.request<{ files: any[]; dependencies: any; instructions: string }>('/api/export', {
      method: 'POST',
      body: JSON.stringify({ canvas, language, settings }),
    })
  }
}

export const apiClient = new ApiClient()
