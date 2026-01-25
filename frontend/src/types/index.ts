// Core block types for the visual editor
export type BlockCategory =
  | 'actions'
  | 'conditions'
  | 'variables'
  | 'replies'
  | 'advanced'
  | 'triggers'
  | 'logic'
  | 'moderation'
  | 'data'

export type BlockType =
  // Triggers
  | 'command_slash'
  | 'command_sub'
  | 'event_listener'
  | 'on_button_click'
  | 'on_select_menu'
  | 'on_modal_submit'
  | 'command_user'
  | 'command_message'

  // Logic
  | 'if_condition'
  | 'for_loop'
  | 'wait'
  | 'error_handler'
  | 'set_variable'
  | 'get_variable'
  | 'math_operation'

  // Actions
  | 'send_message'
  | 'edit_message'
  | 'delete_message'
  | 'send_embed'
  | 'add_button'
  | 'add_select_menu'
  | 'show_modal'
  | 'action_reply'

  // Moderation
  | 'action_role_add'
  | 'action_role_remove'
  | 'action_kick'
  | 'action_ban'
  | 'action_timeout'

  // Data & API
  | 'http_request'
  | 'parse_json'
  | 'stringify_json'
  | 'database_get'
  | 'database_set'

  // Advanced & Discord API
  | 'voice_join'
  | 'voice_leave'
  | 'voice_mute'
  | 'thread_create'
  | 'thread_join'
  | 'thread_archive'
  | 'automod_alert'
  | 'automod_rule_create'
  | 'event_schedule'
  | 'event_cancel'
  | 'stage_start'
  | 'stage_end'
  | 'invite_create'
  | 'sticker_send'
  | 'emoji_add'
  | 'role_create'
  | 'channel_create'
  | 'member_timeout'

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
  properties: Record<string, any>
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface Block {
  id: string
  type: BlockType
  position: { x: number; y: number }
  data: BlockData
  measured?: { width: number; height: number }
}

export type CanvasBlock = Block

export interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  category: BlockCategory
  icon: string
  color: string
  inputs: number
  outputs: number
  properties: BlockProperty[]
}

export interface BlockProperty {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'color' | 'message' | 'options_list'
  required: boolean
  defaultValue?: unknown
  options?: { label: string; value: string }[]
  placeholder?: string
  helperText?: string
}

export interface CanvasState {
  blocks: CanvasBlock[]
  connections: BlockConnection[]
  selectedBlockId: string | null
  viewportPosition: { x: number; y: number; zoom: number }
}

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
  canvas: CanvasState // Global canvas for the whole module
  createdAt: number
  updatedAt: number
}

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
