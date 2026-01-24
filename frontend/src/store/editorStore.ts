import { create } from 'zustand'
import { CanvasBlock, BlockConnection, BlockType, CanvasState } from '@/types'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'

interface EditorState extends CanvasState {
  // Actions
  addBlock: (type: BlockType, position: { x: number; y: number }) => void
  removeBlock: (id: string) => void
  updateBlock: (id: string, data: Partial<CanvasBlock['data']>) => void
  selectBlock: (id: string | null) => void
  
  addConnection: (connection: BlockConnection) => void
  removeConnection: (id: string) => void
  
  updateViewport: (position: { x: number; y: number; zoom: number }) => void
  
  // Helpers
  getBlockById: (id: string) => CanvasBlock | undefined
  clearCanvas: () => void
  duplicateBlock: (id: string) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  connections: [],
  selectedBlockId: null,
  viewportPosition: { x: 0, y: 0, zoom: 1 },

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
  },

  removeBlock: id => {
    set(state => ({
      blocks: state.blocks.filter(block => block.id !== id),
      connections: state.connections.filter(
        conn => conn.source !== id && conn.target !== id
      ),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
    }))
  },

  updateBlock: (id, data) => {
    set(state => ({
      blocks: state.blocks.map(block =>
        block.id === id
          ? {
              ...block,
              data: {
                ...block.data,
                ...data,
              },
            }
          : block
      ),
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
}))
