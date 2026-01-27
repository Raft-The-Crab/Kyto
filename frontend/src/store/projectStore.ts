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
} from '@/types'
import { generateId } from '@/lib/utils'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'

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

  // Internal Helper
  _updateActive: (updater: (project: Project) => Partial<Project>) => void

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

      // Commands
      createCommand: () => {
        const id = generateId('cmd')
        const triggerId = generateId('block')
        const definition = BLOCK_DEFINITIONS['command_slash']

        const initialBlock: CanvasBlock = {
          id: triggerId,
          type: 'command_slash',
          position: { x: 250, y: 150 },
          data: {
            id: triggerId,
            type: 'command_slash',
            label: definition.label,
            category: 'triggers',
            properties: { name: 'ping', description: 'Replies with Pong!' },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const newCommand: Command = {
          id,
          type: 'slash',
          name: 'New Command',
          description: 'A new slash command',
          options: [],
          canvas: {
            blocks: [initialBlock],
            connections: [],
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
        const id = generateId('evt')
        const triggerId = generateId('block')
        const definition = BLOCK_DEFINITIONS['event_listener']

        const initialBlock: CanvasBlock = {
          id: triggerId,
          type: 'event_listener',
          position: { x: 250, y: 150 },
          data: {
            id: triggerId,
            type: 'event_listener',
            label: definition.label,
            category: 'triggers',
            properties: { event: 'messageCreate' },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const newEvent: EventListener = {
          id,
          eventType: 'messageCreate',
          name: 'New Event',
          description: 'A new event listener',
          canvas: {
            blocks: [initialBlock],
            connections: [],
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
        const id = generateId('mod')
        const triggerId = generateId('block')

        const initialBlock: CanvasBlock = {
          id: triggerId,
          type: 'command_slash',
          position: { x: 250, y: 150 },
          data: {
            id: triggerId,
            type: 'command_slash',
            label: 'Module Entry',
            category: 'triggers',
            properties: { name: 'mod_cmd', description: 'Module main command' },
            isValid: true,
            errors: [],
            warnings: [],
          },
        }

        const newModule: Module = {
          id,
          name: 'New Module',
          description: 'A new module',
          commands: [],
          events: [],
          canvas: {
            blocks: [initialBlock],
            connections: [],
            selectedBlockId: triggerId,
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
    }),
    {
      name: 'kyto-workspace-storage-v1',
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
