import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Command, EventListener, Module } from '@/types'
import { generateId } from '@/lib/utils'

interface ProjectState {
  commands: Command[]
  events: EventListener[]
  modules: Module[]
  currentProjectId: string | null
  
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

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      commands: [],
      events: [],
      modules: [],
      currentProjectId: null,

      // Commands
      createCommand: () => {
        const id = generateId('cmd')
        const newCommand: Command = {
          id,
          type: 'slash',
          name: 'New Command',
          description: 'A new slash command',
          options: [],
          canvas: {
            blocks: [],
            connections: [],
            selectedBlockId: null,
            viewportPosition: { x: 0, y: 0, zoom: 1 },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        
        set(state => ({
          commands: [...state.commands, newCommand],
        }))
        
        return id
      },

      deleteCommand: id => {
        set(state => ({
          commands: state.commands.filter(cmd => cmd.id !== id),
        }))
      },

      getCommand: id => {
        return get().commands.find(cmd => cmd.id === id)
      },

      updateCommand: (id, updates) => {
        set(state => ({
          commands: state.commands.map(cmd =>
            cmd.id === id ? { ...cmd, ...updates, updatedAt: Date.now() } : cmd
          ),
        }))
      },

      // Events
      createEvent: () => {
        const id = generateId('evt')
        const newEvent: EventListener = {
          id,
          eventType: 'messageCreate',
          name: 'New Event',
          description: 'A new event listener',
          canvas: {
            blocks: [],
            connections: [],
            selectedBlockId: null,
            viewportPosition: { x: 0, y: 0, zoom: 1 },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        
        set(state => ({
          events: [...state.events, newEvent],
        }))
        
        return id
      },

      deleteEvent: id => {
        set(state => ({
          events: state.events.filter(evt => evt.id !== id),
        }))
      },

      getEvent: id => {
        return get().events.find(evt => evt.id === id)
      },

      updateEvent: (id, updates) => {
        set(state => ({
          events: state.events.map(evt =>
            evt.id === id ? { ...evt, ...updates, updatedAt: Date.now() } : evt
          ),
        }))
      },

      // Modules
      createModule: () => {
        const id = generateId('mod')
        const newModule: Module = {
          id,
          name: 'New Module',
          description: 'A new module',
          commands: [],
          events: [],
          canvas: {
            blocks: [],
            connections: [],
            selectedBlockId: null,
            viewportPosition: { x: 0, y: 0, zoom: 1 },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        
        set(state => ({
          modules: [...state.modules, newModule],
        }))
        
        return id
      },

      deleteModule: id => {
        set(state => ({
          modules: state.modules.filter(mod => mod.id !== id),
        }))
      },

      getModule: id => {
        return get().modules.find(mod => mod.id === id)
      },

      updateModule: (id, updates) => {
        set(state => ({
          modules: state.modules.map(mod =>
            mod.id === id ? { ...mod, ...updates, updatedAt: Date.now() } : mod
          ),
        }))
      },
    }),
    {
      name: 'botify-project-storage',
    }
  )
)
