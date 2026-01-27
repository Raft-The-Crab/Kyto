import { create } from 'zustand'
import { CanvasBlock, BlockConnection, BlockType, CanvasState } from '@/types'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'

interface EditorState extends CanvasState {
  // Undo/Redo
  history: CanvasState[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean

  // Actions
  addBlock: (type: BlockType, position: { x: number; y: number }) => void
  removeBlock: (id: string) => void
  updateBlock: (id: string, updates: Partial<CanvasBlock>) => void
  selectBlock: (id: string | null) => void

  addConnection: (connection: BlockConnection) => void
  removeConnection: (id: string) => void

  updateViewport: (position: { x: number; y: number; zoom: number }) => void

  // Helpers
  getBlockById: (id: string) => CanvasBlock | undefined
  clearCanvas: () => void
  duplicateBlock: (id: string) => void
  undo: () => void
  redo: () => void
  setCanvasState: (newState: Partial<CanvasState>) => void
  saveState: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  connections: [],
  selectedBlockId: null,
  viewportPosition: { x: 0, y: 0, zoom: 1 },
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  // Helper to save state for undo/redo
  saveState: () => {
    const state = get()
    const currentState = {
      blocks: state.blocks,
      connections: state.connections,
      selectedBlockId: state.selectedBlockId,
      viewportPosition: state.viewportPosition,
    }
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(currentState)
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false,
    })
  },

  addBlock: (type, position) => {
    const definition = BLOCK_DEFINITIONS[type]
    if (!definition) return

    const id = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const defaultProperties: Record<string, unknown> = {}
    definition.properties.forEach(prop => {
      if (prop.defaultValue !== undefined) {
        defaultProperties[prop.key] = prop.defaultValue
      }
    })

    const newBlock: CanvasBlock = {
      id,
      type,
      position,
      data: {
        id,
        type,
        label: definition.label,
        category: definition.category,
        properties: defaultProperties,
        isValid: true,
        errors: [],
        warnings: [],
      },
    }

    set(state => ({
      blocks: [...state.blocks, newBlock],
      selectedBlockId: id,
    }))

    get().saveState()
  },

  removeBlock: id => {
    set(state => ({
      blocks: state.blocks.filter(block => block.id !== id),
      connections: state.connections.filter(conn => conn.source !== id && conn.target !== id),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
    }))
    get().saveState()
  },

  updateBlock: (id, updates) => {
    set(state => ({
      blocks: state.blocks.map(block => {
        if (block.id !== id) return block

        const newBlock = { ...block, ...updates }
        if (updates.data) {
          newBlock.data = { ...block.data, ...updates.data }
        }
        return newBlock
      }),
    }))
  },

  selectBlock: id => {
    set({ selectedBlockId: id })
  },

  addConnection: connection => {
    set(state => ({
      connections: [...state.connections, connection],
    }))
  },

  removeConnection: id => {
    set(state => ({
      connections: state.connections.filter(conn => conn.id !== id),
    }))
  },

  updateViewport: position => {
    set({ viewportPosition: position })
  },

  getBlockById: id => {
    return get().blocks.find(block => block.id === id)
  },

  clearCanvas: () => {
    set({
      blocks: [],
      connections: [],
      selectedBlockId: null,
    })
  },

  duplicateBlock: id => {
    const block = get().getBlockById(id)
    if (!block) return

    const newId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newBlock: CanvasBlock = {
      ...block,
      id: newId,
      position: {
        x: block.position.x + 50,
        y: block.position.y + 50,
      },
      data: {
        ...block.data,
        id: newId,
      },
    }

    set(state => ({
      blocks: [...state.blocks, newBlock],
      selectedBlockId: newId,
    }))
  },

  setCanvasState: newState => {
    set({
      blocks: newState.blocks || [],
      connections: newState.connections || [],
      selectedBlockId: newState.selectedBlockId || null,
      viewportPosition: newState.viewportPosition || { x: 0, y: 0, zoom: 1 },
    })
  },

  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const prevState = state.history[state.historyIndex - 1]
      set({
        ...prevState,
        historyIndex: state.historyIndex - 1,
        canUndo: state.historyIndex - 1 > 0,
        canRedo: true,
      })
    }
  },

  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1]
      set({
        ...nextState,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: state.historyIndex + 1 < state.history.length - 1,
      })
    }
  },
}))
