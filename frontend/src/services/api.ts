export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

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
    let userId = localStorage.getItem('kyto_user_id')
    if (!userId) {
      userId = crypto.randomUUID()
      localStorage.setItem('kyto_user_id', userId)
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
    return this.request<{ projects: unknown[] }>('/api/projects')
  }

  async getProject(id: string) {
    return this.request<{ project: unknown }>(`/api/projects/${id}`)
  }

  async saveProject(project: unknown) {
    return this.request<{ project: unknown }>('/api/projects', {
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
  async getAISuggestions(canvas: unknown, context?: string) {
    return this.request<{ suggestions: unknown[] }>('/api/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({ canvas, context }),
    })
  }

  // Export API
  async exportBot(canvas: unknown, language: 'discord.js' | 'discord.py', settings: unknown) {
    return this.request<{ files: unknown[]; dependencies: unknown; instructions: string }>(
      '/api/export',
      {
        method: 'POST',
        body: JSON.stringify({ canvas, language, settings }),
      }
    )
  }

  // Preview export (returns files with issues and preview snippets)
  async exportPreview(canvas: unknown, language: 'discord.js' | 'discord.py', settings: unknown) {
    return this.request<{ files: unknown[] }>(`/api/export?preview=true`, {
      method: 'POST',
      body: JSON.stringify({ canvas, language, settings }),
    })
  }

  // Request backend to generate a ZIP and return as blob
  async exportZip(canvas: unknown, language: 'discord.js' | 'discord.py', settings: unknown) {
    try {
      const response = await fetch(`${API_BASE}/api/export?format=zip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.userId,
        },
        body: JSON.stringify({ canvas, language, settings }),
      })

      if (!response.ok) {
        const err = await response.text()
        return { error: err }
      }

      const blob = await response.blob()
      return { blob }
    } catch (error) {
      console.error('Export zip failed:', error)
      return { error: 'Network error' }
    }
  }
}

export const apiClient = new ApiClient()
