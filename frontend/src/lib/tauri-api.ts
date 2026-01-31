import { invoke } from '@tauri-apps/api/tauri'
import { listen, Event } from '@tauri-apps/api/event'

// Type definitions for Tauri commands
export interface ProjectData {
  id: string
  name: string
  description: string
  language: 'discord.js' | 'discord.py'
  canvas: any
  settings: any
  createdAt: number
  updatedAt: number
}

// Tauri API wrapper for desktop functionality
export class TauriApi {
  // Project management
  static async saveProject(projectId: string, projectData: string): Promise<void> {
    try {
      await invoke('save_project', { projectId, projectData })
    } catch (error) {
      console.error('Error saving project:', error)
      throw error
    }
  }

  static async loadProject(projectId: string): Promise<string> {
    try {
      return await invoke('load_project', { projectId })
    } catch (error) {
      console.error('Error loading project:', error)
      throw error
    }
  }

  static async listProjects(): Promise<string[]> {
    try {
      return await invoke('list_projects')
    } catch (error) {
      console.error('Error listing projects:', error)
      throw error
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      await invoke('delete_project', { projectId })
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  // Backend server control
  static async startBackendServer(): Promise<number> {
    try {
      return await invoke('start_backend_server')
    } catch (error) {
      console.error('Error starting backend server:', error)
      throw error
    }
  }

  static async stopBackendServer(): Promise<void> {
    try {
      await invoke('stop_backend_server')
    } catch (error) {
      console.error('Error stopping backend server:', error)
      throw error
    }
  }

  // Offline data management
  static async getOfflineData(): Promise<Record<string, string>> {
    try {
      return await invoke('get_offline_data')
    } catch (error) {
      console.error('Error getting offline data:', error)
      throw error
    }
  }

  // Sync with cloud
  static async syncWithCloud(projectId: string, projectData: string): Promise<boolean> {
    try {
      return await invoke('sync_with_cloud', { projectId, projectData })
    } catch (error) {
      console.error('Error syncing with cloud:', error)
      throw error
    }
  }

  // Utility function
  static async greet(name: string): Promise<string> {
    try {
      return await invoke('greet', { name })
    } catch (error) {
      console.error('Error calling greet:', error)
      throw error
    }
  }

  // Listen for events
  static async listenForEvent<T>(
    eventName: string,
    handler: (event: Event<T>) => void
  ): Promise<() => void> {
    try {
      return await listen(eventName, handler)
    } catch (error) {
      console.error(`Error listening for event ${eventName}:`, error)
      throw error
    }
  }
}

// Check if we're running in Tauri environment
export function isTauri(): boolean {
  return window.__TAURI_INTERNALS__ !== undefined
}

// Wrapper functions that conditionally use Tauri or web APIs
export class ApiWrapper {
  static async saveProject(projectId: string, projectData: string): Promise<void> {
    if (isTauri()) {
      return TauriApi.saveProject(projectId, projectData)
    } else {
      // Fallback to web API
      return fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: projectId, ...JSON.parse(projectData) }),
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
    }
  }

  static async loadProject(projectId: string): Promise<string> {
    if (isTauri()) {
      return TauriApi.loadProject(projectId)
    } else {
      // Fallback to web API
      return fetch(`/api/projects/${projectId}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => JSON.stringify(data.project))
    }
  }

  static async listProjects(): Promise<string[]> {
    if (isTauri()) {
      return TauriApi.listProjects()
    } else {
      // Fallback to web API
      return fetch('/api/projects')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then(data => data.projects.map((p: any) => p.id))
    }
  }

  static async getOfflineData(): Promise<Record<string, string>> {
    if (isTauri()) {
      return TauriApi.getOfflineData()
    } else {
      // For web version, return data from localStorage
      const projects: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('project:')) {
          projects[key] = localStorage.getItem(key) || ''
        }
      }
      return projects
    }
  }
}
