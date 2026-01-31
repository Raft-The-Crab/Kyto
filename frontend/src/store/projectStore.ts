import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Command,
  EventListener,
  Module,
  Project,
  ProjectSettings,
  CanvasBlock,
  GlobalVariable,
  FileNode,
  DeploymentConfig,
  GitConfig,
} from '@/types'
import { generateId } from '@/lib/utils'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { ApiWrapper } from '@/lib/tauri-api'

interface ProjectState {
  // Workspace State
  projects: Record<string, Project>
  activeProjectId: string

  // Global Metadata (Proxy to active project)
  name: string
  description: string
  language: 'discord.js' | 'discord.py'
  settings: ProjectSettings

  // Active Project Data
  commands: Command[]
  events: EventListener[]
  modules: Module[]
  variables: GlobalVariable[]

  // UI State
  activeFileId: string

  // Workspace Actions
  createProject: (name: string, language: 'discord.js' | 'discord.py') => string | null
  switchProject: (projectId: string) => void
  deleteProject: (projectId: string) => void
  updateProjectMetadata: (id: string, updates: Partial<Project>) => void

  // Internal Helpers
  _updateActive: (updater: (project: Project) => Partial<Project>) => void
  _ensureActiveProject: () => string

  // Metadata Actions (Active Project)
  updateMetadata: (
    updates: Partial<{ name: string; description: string; language: 'discord.js' | 'discord.py' }>
  ) => void
  updateSettings: (updates: Partial<ProjectSettings>) => void
  setActiveFile: (id: string) => void

  // Commands
  createCommand: () => string
  deleteCommand: (id: string) => void
  getCommand: (id: string) => Command | undefined
  updateCommand: (id: string, updates: Partial<Command>) => void

  // Events
  createEvent: () => string
  deleteEvent: (id: string) => void
  getEvent: (id: string) => EventListener | undefined
  updateEvent: (id: string, updates: Partial<EventListener>) => void

  // Variables
  createVariable: (
    name: string,
    type: 'string' | 'number' | 'boolean' | 'secret',
    value: string
  ) => void
  deleteVariable: (id: string) => void
  updateVariable: (id: string, updates: Partial<GlobalVariable>) => void

  // Modules
  createModule: () => string
  deleteModule: (id: string) => void
  getModule: (id: string) => Module | undefined
  updateModule: (id: string, updates: Partial<Module>) => void

  // File System
  createFile: (parentId: string, name: string, content?: string) => string
  createFolder: (parentId: string, name: string) => string
  deleteNode: (id: string) => void
  renameNode: (id: string, newName: string) => void
  updateFileContent: (id: string, content: string) => void
  toggleFolder: (id: string) => void

  // Deployment & Hosting
  updateDeployment: (updates: Partial<DeploymentConfig>) => void
  updateGit: (updates: Partial<GitConfig>) => void

  // Tauri/Offline functionality
  saveProjectToDisk: (projectId?: string) => Promise<void>
  loadProjectFromDisk: (projectId: string) => Promise<void>
  listProjectsFromDisk: () => Promise<string[]>
  syncWithCloud: (projectId?: string) => Promise<boolean>
}

const createInitialProject = (id: string, name: string): Project => ({
  id,
  name,
  description: 'Built with Kyto',
  language: 'discord.js',
  version: '1.0.0',
  commands: [],
  events: [],
  modules: [],
  variables: [],
  settings: {
    botToken: '',
    clientId: '',
    prefix: '!',
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    permissions: [],
  },
  files: {
    root: {
      id: 'root',
      name: 'root',
      type: 'folder',
      parentId: null,
      children: ['main', 'utils'],
      isExpanded: true,
    },
    main: {
      id: 'main',
      name: 'index.js',
      type: 'file',
      parentId: 'root',
      content: '// Main Bot Entry\n',
    },
    utils: {
      id: 'utils',
      name: 'utils',
      type: 'folder',
      parentId: 'root',
      children: [],
      isExpanded: false,
    },
  },
  rootFolderId: 'root',
  deployment: {
    provider: 'local',
    status: 'stopped',
    environment: {},
  },
  git: {
    enabled: false,
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Initial Workspace State
      projects: {},
      activeProjectId: '',

      // Computed properties
      name: 'My Awesome Bot',
      description: 'Built with Kyto',
      language: 'discord.js',
      settings: {
        botToken: '',
        clientId: '',
        prefix: '!',
        intents: ['Guilds', 'GuildMessages', 'MessageContent'],
        permissions: [],
      },
      commands: [],
      events: [],
      modules: [],
      variables: [], // Initialize proxy state
      activeFileId: 'main',

      // Workspace Actions
      createProject: (name, language) => {
        const state = get()
        if (Object.keys(state.projects).length >= 8) {
          return null // Enforce 8 bot limit
        }

        const id = generateId('proj')
        const newProject = createInitialProject(id, name)
        newProject.language = language

        set(state => ({
          projects: { ...state.projects, [id]: newProject },
          activeProjectId: id,
          // Update proxy state immediately
          name: newProject.name,
          description: newProject.description,
          language: newProject.language,
          settings: newProject.settings,
          commands: [],
          events: [],
          modules: [],
          variables: [],
        }))
        return id
      },

      switchProject: projectId => {
        const project = get().projects[projectId]
        if (!project) return

        set({
          activeProjectId: projectId,
          name: project.name,
          description: project.description,
          language: project.language,
          settings: project.settings,
          commands: project.commands,
          events: project.events,
          modules: project.modules,
          variables: project.variables || [], // Handle legacy projects
        })
      },

      deleteProject: projectId => {
        const { projects, activeProjectId } = get()
        if (Object.keys(projects).length <= 1) return

        const newProjects = { ...projects }
        delete newProjects[projectId]

        let newActiveId = activeProjectId
        if (activeProjectId === projectId) {
          newActiveId = Object.keys(newProjects)[0] as string
        }

        const project = newProjects[newActiveId]
        if (!project) return

        set({
          projects: newProjects,
          activeProjectId: newActiveId,
          name: project.name,
          description: project.description,
          language: project.language,
          settings: project.settings,
          commands: project.commands,
          events: project.events,
          modules: project.modules,
          variables: project.variables || [],
        })
      },

      updateProjectMetadata: (id, updates) => {
        set(state => {
          const project = state.projects[id]
          if (!project) return state

          const updatedProject = { ...project, ...updates, updatedAt: Date.now() }

          if (state.activeProjectId === id) {
            // Need to manually pick updates to sync with proxy state to avoid type errors
            const { name, description, language } = updates
            return {
              projects: { ...state.projects, [id]: updatedProject },
              name,
              description,
              language,
            }
          }

          return {
            projects: { ...state.projects, [id]: updatedProject },
          }
        })
      },

      _updateActive: updater => {
        set(state => {
          const activeId = state.activeProjectId
          const project = state.projects[activeId]
          if (!project) return state

          const updates = updater(project)
          const updatedProject = { ...project, ...updates, updatedAt: Date.now() }

          return {
            projects: { ...state.projects, [activeId]: updatedProject },
            ...updates, // Sync proxy state
          }
        })
      },

      updateMetadata: updates => {
        get()._updateActive(() => updates)
      },

      updateSettings: updates => {
        get()._updateActive(project => ({
          settings: { ...project.settings, ...updates },
        }))
      },

      setActiveFile: (id: string) => set({ activeFileId: id }),

      _ensureActiveProject: () => {
        const state = get()
        if (state.activeProjectId && state.projects[state.activeProjectId]) {
          return state.activeProjectId
        }

        // Create initial project if none exists
        const id = generateId('proj')
        const newProject = createInitialProject(id, 'My Awesome Bot')
        set(state => ({
          projects: { ...state.projects, [id]: newProject },
          activeProjectId: id,
          name: newProject.name,
          description: newProject.description,
          language: newProject.language,
          settings: newProject.settings,
          commands: [],
          events: [],
          modules: [],
          variables: [],
        }))
        return id
      },

      // Commands
      createCommand: () => {
        get()._ensureActiveProject()
        const id = generateId('cmd')
        const triggerId = generateId('block')
        const replyId = generateId('block')
        const errorHandlerId = generateId('block')
        const errorEmbedId = generateId('block')
        const edgeId = generateId('edge')
        const errorEdgeId = generateId('edge')
        const errorEmbedEdgeId = generateId('edge')

        const triggerDef = BLOCK_DEFINITIONS['command_slash']
        const replyDef = BLOCK_DEFINITIONS['action_reply']
        const errorHandlerDef = BLOCK_DEFINITIONS['error_handler']
        const errorEmbedDef = BLOCK_DEFINITIONS['send_embed']

        if (!triggerDef || !replyDef || !errorHandlerDef || !errorEmbedDef) {
          console.error('Missing block definitions for command creation')
          return ''
        }

        const triggerBlock: CanvasBlock = {
          id: triggerId,
          type: 'command_slash',
          position: { x: 100, y: 100 },
          data: {
            id: triggerId,
            type: 'command_slash',
            label: triggerDef.label,
            category: 'triggers',
            properties: { name: 'ping', description: 'Replies with Pong!' },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const replyBlock: CanvasBlock = {
          id: replyId,
          type: 'action_reply',
          position: { x: 500, y: 100 },
          data: {
            id: replyId,
            type: 'action_reply',
            label: replyDef.label,
            category: replyDef.category,
            properties: { content: 'Pong! 🏓', ephemeral: false, tts: false },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const errorHandlerBlock: CanvasBlock = {
          id: errorHandlerId,
          type: 'error_handler',
          position: { x: 300, y: 300 },
          data: {
            id: errorHandlerId,
            type: 'error_handler',
            label: errorHandlerDef.label,
            category: errorHandlerDef.category,
            properties: { logToConsole: true },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const errorEmbedBlock: CanvasBlock = {
          id: errorEmbedId,
          type: 'send_embed',
          position: { x: 600, y: 300 },
          data: {
            id: errorEmbedId,
            type: 'send_embed',
            label: errorEmbedDef.label,
            category: errorEmbedDef.category,
            properties: {
              title: 'Command Error',
              description: 'Something went wrong while running this command.',
              color: '#EF4444',
              timestamp: true,
            },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const connections = [
          {
            id: edgeId,
            source: triggerId,
            target: replyId,
            sourceHandle: 'output',
            targetHandle: 'input',
          },
          {
            id: errorEdgeId,
            source: replyId, // Error handler should connect from the action that might fail, not the trigger
            target: errorHandlerId,
            sourceHandle: 'output',
            targetHandle: 'input',
          },
          {
            id: errorEmbedEdgeId,
            source: errorHandlerId,
            target: errorEmbedId,
            sourceHandle: 'output',
            targetHandle: 'input',
          },
        ]

        const newCommand: Command = {
          id,
          type: 'slash',
          name: 'ping',
          description: 'A new slash command',
          options: [],
          canvas: {
            blocks: [triggerBlock, replyBlock, errorHandlerBlock, errorEmbedBlock],
            connections,
            selectedBlockId: triggerId,
            viewportPosition: { x: 0, y: 0, zoom: 1 },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        get()._updateActive(project => ({
          commands: [...project.commands, newCommand],
        }))

        return id
      },

      deleteCommand: id => {
        get()._updateActive(project => ({
          commands: project.commands.filter(cmd => cmd.id !== id),
        }))
      },

      getCommand: id => {
        return get().commands.find(cmd => cmd.id === id)
      },

      updateCommand: (id, updates) => {
        get()._updateActive(project => ({
          commands: project.commands.map(cmd =>
            cmd.id === id ? { ...cmd, ...updates, updatedAt: Date.now() } : cmd
          ),
        }))
      },

      // Events
      createEvent: () => {
        get()._ensureActiveProject()
        const id = generateId('evt')
        const triggerId = generateId('block')
        const replyId = generateId('block')
        const errorHandlerId = generateId('block')
        const errorEmbedId = generateId('block')
        const edgeId = generateId('edge')
        const errorEdgeId = generateId('edge')
        const errorEmbedEdgeId = generateId('edge')

        const triggerDef = BLOCK_DEFINITIONS['event_listener']
        const replyDef = BLOCK_DEFINITIONS['send_message']
        const errorHandlerDef = BLOCK_DEFINITIONS['error_handler']
        const errorEmbedDef = BLOCK_DEFINITIONS['send_embed']

        if (!triggerDef || !replyDef || !errorHandlerDef || !errorEmbedDef) {
          console.error('Missing block definitions for event creation')
          return ''
        }

        const triggerBlock: CanvasBlock = {
          id: triggerId,
          type: 'event_listener',
          position: { x: 100, y: 100 },
          data: {
            id: triggerId,
            type: 'event_listener',
            label: triggerDef.label,
            category: 'triggers',
            properties: { event: 'messageCreate' },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const replyBlock: CanvasBlock = {
          id: replyId,
          type: 'send_message',
          position: { x: 300, y: 100 },
          data: {
            id: replyId,
            type: 'send_message',
            label: replyDef.label,
            category: replyDef.category,
            properties: { content: 'I saw that!', channel_id: 'auto' },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const errorHandlerBlock: CanvasBlock = {
          id: errorHandlerId,
          type: 'error_handler',
          position: { x: 300, y: 250 },
          data: {
            id: errorHandlerId,
            type: 'error_handler',
            label: errorHandlerDef.label,
            category: errorHandlerDef.category,
            properties: { logToConsole: true },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const errorEmbedBlock: CanvasBlock = {
          id: errorEmbedId,
          type: 'send_embed',
          position: { x: 500, y: 250 },
          data: {
            id: errorEmbedId,
            type: 'send_embed',
            label: errorEmbedDef.label,
            category: errorEmbedDef.category,
            properties: {
              title: 'Event Error',
              description: 'Something went wrong while processing the event.',
              color: '#EF4444',
              timestamp: true,
            },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const connections = [
          {
            id: edgeId,
            source: triggerId,
            target: replyId,
            sourceHandle: 'output',
            targetHandle: 'input',
          },
          {
            id: errorEdgeId,
            source: replyId, // Error handler should connect from the action that might fail
            target: errorHandlerId,
            sourceHandle: 'output',
            targetHandle: 'input',
          },
          {
            id: errorEmbedEdgeId,
            source: errorHandlerId,
            target: errorEmbedId,
            sourceHandle: 'output',
            targetHandle: 'input',
          },
        ]

        const newEvent: EventListener = {
          id,
          eventType: 'messageCreate',
          name: 'New Event',
          description: 'A new event listener',
          canvas: {
            blocks: [triggerBlock, replyBlock, errorHandlerBlock, errorEmbedBlock],
            connections,
            selectedBlockId: triggerId,
            viewportPosition: { x: 0, y: 0, zoom: 1 },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        get()._updateActive(project => ({
          events: [...project.events, newEvent],
        }))

        return id
      },

      deleteEvent: id => {
        get()._updateActive(project => ({
          events: project.events.filter(evt => evt.id !== id),
        }))
      },

      getEvent: id => {
        return get().events.find(evt => evt.id === id)
      },

      updateEvent: (id, updates) => {
        get()._updateActive(project => ({
          events: project.events.map(evt =>
            evt.id === id ? { ...evt, ...updates, updatedAt: Date.now() } : evt
          ),
        }))
      },

      // Variables
      createVariable: (name, type, value) => {
        const id = generateId('var')
        get()._updateActive(project => ({
          variables: [...(project.variables || []), { id, name, type, value }],
        }))
      },

      deleteVariable: id => {
        get()._updateActive(project => ({
          variables: (project.variables || []).filter(v => v.id !== id),
        }))
      },

      updateVariable: (id, updates) => {
        get()._updateActive(project => ({
          variables: (project.variables || []).map(v => (v.id === id ? { ...v, ...updates } : v)),
        }))
      },

      // Modules
      createModule: () => {
        get()._ensureActiveProject()
        const id = generateId('mod')

        const newModule: Module = {
          id,
          name: 'New Module',
          description: 'A new module',
          commands: [],
          events: [],
          canvas: {
            blocks: [], // Start with empty canvas for modules - users can add blocks as needed
            connections: [],
            selectedBlockId: null,
            viewportPosition: { x: 0, y: 0, zoom: 1 },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        get()._updateActive(project => ({
          modules: [...project.modules, newModule],
        }))

        return id
      },

      deleteModule: id => {
        get()._updateActive(project => ({
          modules: project.modules.filter(mod => mod.id !== id),
        }))
      },

      getModule: id => {
        return get().modules.find(mod => mod.id === id)
      },

      updateModule: (id, updates) => {
        get()._updateActive(project => ({
          modules: project.modules.map(mod =>
            mod.id === id ? { ...mod, ...updates, updatedAt: Date.now() } : mod
          ),
        }))
      },

      // File System Implementation
      createFile: (parentId, name, content = '') => {
        const id = generateId('file')
        get()._updateActive(project => {
          const newFile: FileNode = {
            id: id as string,
            name,
            type: 'file',
            content,
            parentId,
          }

          const files = { ...project.files }
          files[id] = newFile

          // Update parent
          if (files[parentId]) {
            const parent = { ...files[parentId] }
            parent.children = [...(parent.children || []), id]
            files[parentId] = parent
          }

          return { files }
        })
        return id
      },

      createFolder: (parentId, name) => {
        const id = generateId('folder')
        get()._updateActive(project => {
          const newFolder: FileNode = {
            id: id as string,
            name,
            type: 'folder',
            parentId,
            children: [],
            isExpanded: true,
          }

          const files = { ...project.files }
          files[id] = newFolder

          // Update parent
          if (files[parentId]) {
            const parent = { ...files[parentId] }
            parent.children = [...(parent.children || []), id]
            files[parentId] = parent
          }

          return { files }
        })
        return id
      },

      deleteNode: id => {
        get()._updateActive(project => {
          const files = { ...project.files }
          const node = files[id]
          if (!node || !node.parentId) return {} // Can't delete root

          // Remove from parent
          const parentNode = files[node.parentId]
          if (parentNode) {
            const parent = { ...parentNode }
            parent.children = (parent.children || []).filter(childId => childId !== id)
            files[node.parentId] = parent
          }

          // Recursive delete helper
          const deleteRecursive = (nodeId: string) => {
            const n = files[nodeId]
            if (!n) return
            if (n.children) {
              n.children.forEach(deleteRecursive)
            }
            delete files[nodeId]
          }

          deleteRecursive(id)
          return { files }
        })
      },

      renameNode: (id, newName) => {
        get()._updateActive(project => {
          const files = { ...project.files }
          if (files[id]) {
            files[id] = { ...files[id], name: newName }
          }
          return { files }
        })
      },

      updateFileContent: (id, content) => {
        get()._updateActive(project => {
          const files = { ...project.files }
          if (files[id]) {
            files[id] = { ...files[id], content }
          }
          return { files }
        })
      },

      toggleFolder: id => {
        get()._updateActive(project => {
          const files = { ...project.files }
          if (files[id]) {
            files[id] = { ...files[id], isExpanded: !files[id].isExpanded }
          }
          return { files }
        })
      },

      updateDeployment: updates => {
        get()._updateActive(project => ({
          deployment: { ...project.deployment, ...updates },
        }))
      },

      updateGit: updates => {
        get()._updateActive(project => ({
          git: { ...project.git, ...updates } as GitConfig,
        }))
      },

      // Tauri/Offline functionality
      saveProjectToDisk: async (projectId?: string) => {
        const state = get()
        const id = projectId || state.activeProjectId
        const project = state.projects[id]

        if (!project) {
          throw new Error(`Project with id ${id} not found`)
        }

        try {
          const projectData = JSON.stringify(project)
          await ApiWrapper.saveProject(id, projectData)
        } catch (error) {
          console.error('Error saving project to disk:', error)
          // Fallback to localStorage if Tauri fails
          localStorage.setItem(`project_${id}`, JSON.stringify(project))
        }
      },

      loadProjectFromDisk: async (projectId: string) => {
        try {
          const projectData = await ApiWrapper.loadProject(projectId)
          const project = JSON.parse(projectData)

          set(state => ({
            projects: { ...state.projects, [projectId]: project },
            activeProjectId: projectId,
            name: project.name,
            description: project.description,
            language: project.language,
            settings: project.settings,
            commands: project.commands,
            events: project.events,
            modules: project.modules,
            variables: project.variables || [],
          }))
        } catch (error) {
          console.error('Error loading project from disk:', error)
          // Fallback to localStorage if Tauri fails
          const storedProject = localStorage.getItem(`project_${projectId}`)
          if (storedProject) {
            const project = JSON.parse(storedProject)

            set(state => ({
              projects: { ...state.projects, [projectId]: project },
              activeProjectId: projectId,
              name: project.name,
              description: project.description,
              language: project.language,
              settings: project.settings,
              commands: project.commands,
              events: project.events,
              modules: project.modules,
              variables: project.variables || [],
            }))
          }
        }
      },

      listProjectsFromDisk: async (): Promise<string[]> => {
        try {
          return await ApiWrapper.listProjects()
        } catch (error) {
          console.error('Error listing projects from disk:', error)
          // Fallback to localStorage
          const projectIds: string[] = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith('project_')) {
              projectIds.push(key.replace('project_', ''))
            }
          }
          return projectIds
        }
      },

      syncWithCloud: async (projectId?: string): Promise<boolean> => {
        const state = get()
        const id = projectId || state.activeProjectId
        const project = state.projects[id]

        if (!project) {
          throw new Error(`Project with id ${id} not found`)
        }

        try {
          const projectData = JSON.stringify(project)
          return await ApiWrapper.syncWithCloud(id, projectData)
        } catch (error) {
          console.error('Error syncing project with cloud:', error)
          return false
        }
      },
    }),
    {
      name: 'kyto-workspace-storage-v2',
      onRehydrateStorage: () => state => {
        if (state && state.projects && state.activeProjectId) {
          const active = state.projects[state.activeProjectId]
          if (active) {
            state.name = active.name
            state.description = active.description
            state.language = active.language
            state.settings = active.settings as any
            state.commands = active.commands
            state.events = active.events
            state.modules = active.modules
            state.variables = active.variables || []
            // Hydrate files or init default
            if (!active.files) {
              // Migration for old projects
              const rootId = 'root'
              const mainId = 'main_file'

              const files: Record<string, FileNode> = {
                [rootId]: {
                  id: rootId,
                  name: 'root',
                  type: 'folder',
                  parentId: null,
                  children: [mainId],
                  isExpanded: true,
                },
                [mainId]: {
                  id: mainId,
                  name: active.language === 'discord.js' ? 'index.js' : 'bot.py',
                  type: 'file',
                  parentId: rootId,
                  content: '// Main Bot Entry\n',
                },
              }

              const project = state.projects[state.activeProjectId]
              if (project) {
                project.files = files
                project.rootFolderId = rootId
              }
            }
          }
        }
      },
    }
  )
)
