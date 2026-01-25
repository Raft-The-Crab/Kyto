import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Command, EventListener, Module, Project, ProjectSettings, CanvasBlock } from '@/types'
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

  // Modules
  createModule: () => string
  deleteModule: (id: string) => void
  getModule: (id: string) => Module | undefined
  updateModule: (id: string, updates: Partial<Module>) => void
}

const DEFAULT_PROJECT_ID = 'default-bot'

const createInitialProject = (id: string, name: string): Project => ({
  id,
  name,
  description: 'Built with Botify',
  language: 'discord.js',
  version: '1.0.0',
  commands: [],
  events: [],
  modules: [],
  settings: {
    botToken: '',
    clientId: '',
    prefix: '!',
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    permissions: [],
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // Initial Workspace State
      projects: {
        [DEFAULT_PROJECT_ID]: createInitialProject(DEFAULT_PROJECT_ID, 'My Awesome Bot'),
      },
      activeProjectId: DEFAULT_PROJECT_ID,

      // Computed properties (These are getters in usage, but initialized for hydration consistency)
      name: 'My Awesome Bot',
      description: 'Built with Botify',
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
        })
      },

      deleteProject: projectId => {
        const { projects, activeProjectId } = get()
        if (Object.keys(projects).length <= 1) return // Prevent deleting last project

        const newProjects = { ...projects }
        delete newProjects[projectId]

        // If deleting active project, switch to another one
        let newActiveId = activeProjectId
        if (activeProjectId === projectId) {
          newActiveId = Object.keys(newProjects)[0] as string
        }

        const project = newProjects[newActiveId]
        if (!project) return // Should never happen given length check, but satisfies TS

        set({
          projects: newProjects,
          activeProjectId: newActiveId,
          // Sync proxy state
          name: project.name,
          description: project.description,
          language: project.language,
          settings: project.settings,
          commands: project.commands,
          events: project.events,
          modules: project.modules,
        })
      },

      updateProjectMetadata: (id, updates) => {
        set(state => {
          const project = state.projects[id]
          if (!project) return state

          const updatedProject = { ...project, ...updates, updatedAt: Date.now() }

          // If updating active project, sync proxy state
          if (state.activeProjectId === id) {
            // Need to manually pick updates to sync with proxy state to avoid type errors
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { commands, events, modules, settings, ...metaUpdates } = updates
            return {
              projects: { ...state.projects, [id]: updatedProject },
              ...metaUpdates,
            }
          }

          return {
            projects: { ...state.projects, [id]: updatedProject },
          }
        })
      },

      // Helper to update active project state
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

      // Metadata Actions
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

      // Modules
      createModule: () => {
        const id = generateId('mod')
        const triggerId = generateId('block')
        const definition = BLOCK_DEFINITIONS['command_slash']

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
    }),
    {
      name: 'botify-workspace-storage', // Renamed to force fresh state for new schema
      onRehydrateStorage: () => state => {
        // Hydration fix: Ensure proxy state matches active project on load
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
          }
        }
      },
    }
  )
)
