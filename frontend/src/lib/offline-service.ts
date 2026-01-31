import { Project } from '@/types'
import { ApiWrapper } from './tauri-api'

// Service for managing offline capabilities and local storage persistence
export class OfflineService {
  private static readonly PROJECTS_KEY = 'kyto_projects_v2'
  private static readonly SETTINGS_KEY = 'kyto_settings_v2'
  private static readonly USER_PREFERENCES_KEY = 'kyto_user_preferences_v2'

  // Initialize offline storage
  static async initialize(): Promise<void> {
    // Ensure we have proper initialization of offline storage
    if (!this.getAllProjects()) {
      this.setAllProjects({})
    }

    if (!this.getSettings()) {
      this.setSettings({
        theme: 'dark',
        fontSize: 'medium',
        autoSave: true,
        notifications: true,
      })
    }

    if (!this.getUserPreferences()) {
      this.setUserPreferences({
        lastProjectId: null,
        tourCompleted: false,
        betaFeaturesEnabled: false,
      })
    }
  }

  // Project management
  static getAllProjects(): Record<string, Project> | null {
    try {
      const projectsData = localStorage.getItem(this.PROJECTS_KEY)
      return projectsData ? JSON.parse(projectsData) : null
    } catch (error) {
      console.error('Error reading projects from localStorage:', error)
      return null
    }
  }

  static setAllProjects(projects: Record<string, Project>): void {
    try {
      localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects))
    } catch (error) {
      console.error('Error saving projects to localStorage:', error)
    }
  }

  static getProject(projectId: string): Project | null {
    const projects = this.getAllProjects()
    return projects ? projects[projectId] : null
  }

  static saveProject(project: Project): void {
    try {
      const projects = this.getAllProjects() || {}
      projects[project.id] = project
      this.setAllProjects(projects)
    } catch (error) {
      console.error('Error saving project to localStorage:', error)
    }
  }

  static deleteProject(projectId: string): void {
    try {
      const projects = this.getAllProjects() || {}
      delete projects[projectId]
      this.setAllProjects(projects)
    } catch (error) {
      console.error('Error deleting project from localStorage:', error)
    }
  }

  // Settings management
  static getSettings(): any {
    try {
      const settingsData = localStorage.getItem(this.SETTINGS_KEY)
      return settingsData ? JSON.parse(settingsData) : null
    } catch (error) {
      console.error('Error reading settings from localStorage:', error)
      return null
    }
  }

  static setSettings(settings: any): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings to localStorage:', error)
    }
  }

  // User preferences
  static getUserPreferences(): any {
    try {
      const prefsData = localStorage.getItem(this.USER_PREFERENCES_KEY)
      return prefsData ? JSON.parse(prefsData) : null
    } catch (error) {
      console.error('Error reading user preferences from localStorage:', error)
      return null
    }
  }

  static setUserPreferences(preferences: any): void {
    try {
      localStorage.setItem(this.USER_PREFERENCES_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error('Error saving user preferences to localStorage:', error)
    }
  }

  // Sync with cloud when online
  static async syncWithCloud(): Promise<boolean> {
    try {
      const projects = this.getAllProjects()
      if (!projects) return true

      // Sync each project individually
      for (const projectId in projects) {
        const project = projects[projectId]
        const success = await ApiWrapper.syncWithCloud(projectId, JSON.stringify(project))
        if (!success) {
          console.warn(`Failed to sync project ${projectId} with cloud`)
        }
      }

      return true
    } catch (error) {
      console.error('Error syncing with cloud:', error)
      return false
    }
  }

  // Import projects from file
  static async importProjectsFromFile(file: File): Promise<boolean> {
    try {
      const content = await file.text()
      const importedData = JSON.parse(content)

      // Validate that this is a Kyto project file
      if (importedData.format !== 'kyto-project' && !importedData.projects) {
        throw new Error('Invalid Kyto project file format')
      }

      const existingProjects = this.getAllProjects() || {}
      const importedProjects = importedData.projects || { [importedData.id]: importedData }

      // Merge imported projects with existing ones
      const mergedProjects = { ...existingProjects, ...importedProjects }
      this.setAllProjects(mergedProjects)

      return true
    } catch (error) {
      console.error('Error importing projects from file:', error)
      return false
    }
  }

  // Export projects to file
  static exportProjectsToFile(projectIds?: string[]): Blob {
    try {
      const allProjects = this.getAllProjects() || {}
      let projectsToExport = allProjects

      if (projectIds && projectIds.length > 0) {
        projectsToExport = {}
        for (const id of projectIds) {
          if (allProjects[id]) {
            projectsToExport[id] = allProjects[id]
          }
        }
      }

      const exportData = {
        format: 'kyto-project-bundle',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        projects: projectsToExport,
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      return new Blob([jsonString], { type: 'application/json' })
    } catch (error) {
      console.error('Error exporting projects to file:', error)
      throw error
    }
  }

  // Clear all offline data
  static clearAllData(): void {
    try {
      localStorage.removeItem(this.PROJECTS_KEY)
      localStorage.removeItem(this.SETTINGS_KEY)
      localStorage.removeItem(this.USER_PREFERENCES_KEY)
    } catch (error) {
      console.error('Error clearing offline data:', error)
    }
  }

  // Get storage usage information
  static getStorageInfo(): { used: number; total: number; projectsCount: number } {
    try {
      let used = 0

      // Calculate used storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('kyto_') || key.startsWith('project_'))) {
          const value = localStorage.getItem(key)
          if (value) {
            used += key.length + value.length
          }
        }
      }

      // Estimate total available storage (browser-dependent, typically 5-10MB)
      const total = 10 * 1024 * 1024 // 10MB estimate

      const projects = this.getAllProjects()
      const projectsCount = projects ? Object.keys(projects).length : 0

      return {
        used,
        total,
        projectsCount,
      }
    } catch (error) {
      console.error('Error getting storage info:', error)
      return { used: 0, total: 0, projectsCount: 0 }
    }
  }
}
