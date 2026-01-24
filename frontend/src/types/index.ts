// Core block types for the visual editor
export type BlockCategory = 'actions' | 'conditions' | 'variables' | 'replies' | 'advanced'

export type BlockType =
  | 'send_message'
  | 'edit_message'
  | 'send_embed'
  | 'add_button'
  | 'add_select_menu'
  | 'edit_component'
  | 'delete_message'
  | 'if_condition'
  | 'wait'
  | 'set_variable'
  | 'error_handler'

export interface BlockConnection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface BlockData {
  id: string
  type: BlockType
  label: string
  category: BlockCategory
  
  // Block-specific properties
  properties: Record<string, unknown>
  
  // Validation state
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface CanvasBlock {
  id: string
  type: BlockType
  position: { x: number; y: number }
  data: BlockData
}

export interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  category: BlockCategory
  icon: string
  color: string
  
  // Input/output connection points
  inputs: number
  outputs: number
  
  // Property schema
  properties: BlockProperty[]
}

export interface BlockProperty {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'color' | 'message'
  required: boolean
  defaultValue?: unknown
  options?: { label: string; value: string }[]
  placeholder?: string
  helperText?: string
}

// Canvas state
export interface CanvasState {
  blocks: CanvasBlock[]
  connections: BlockConnection[]
  selectedBlockId: string | null
  viewportPosition: { x: number; y: number; zoom: number }
}

// Command/Event/Module types
export type CommandType = 'slash' | 'message' | 'user' | 'autocomplete'

export interface SlashCommandOption {
  id: string
  name: string
  description: string
  type: 'string' | 'integer' | 'boolean' | 'user' | 'channel' | 'role'
  required: boolean
  choices?: { name: string; value: string }[]
}

export interface Command {
  id: string
  type: CommandType
  name: string
  description: string
  options: SlashCommandOption[]
  canvas: CanvasState
  createdAt: number
  updatedAt: number
}

export interface EventListener {
  id: string
  eventType: string
  name: string
  description: string
  canvas: CanvasState
  createdAt: number
  updatedAt: number
}

export interface Module {
  id: string
  name: string
  description: string
  commands: Command[]
  events: EventListener[]
  canvas: CanvasState
  createdAt: number
  updatedAt: number
}

// Project types
export interface Project {
  id: string
  name: string
  description: string
  language: 'discord.js' | 'discord.py'
  version: string
  
  commands: Command[]
  events: EventListener[]
  modules: Module[]
  
  settings: ProjectSettings
  
  createdAt: number
  updatedAt: number
}

export interface ProjectSettings {
  botToken?: string
  clientId?: string
  intents: string[]
  permissions: string[]
  prefix?: string
}
