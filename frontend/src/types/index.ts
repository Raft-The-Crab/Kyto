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
  | 'events'
  | 'messages'
  | 'components'
  | 'roles'
  | 'channels'
  | 'voice'
  | 'permissions'

export type BlockType =
  // Triggers
  | 'command_slash'
  | 'command_subcommand'
  | 'command_user'
  | 'command_message'
  | 'context_menu_user'
  | 'context_menu_message'
  | 'event_listener'
  | 'event_ready'
  | 'event_message_create'
  | 'event_message_update'
  | 'event_message_delete'
  | 'event_member_join'
  | 'event_member_leave'
  | 'event_member_update'
  | 'event_role_create'
  | 'event_role_delete'
  | 'event_role_update'
  | 'event_channel_create'
  | 'event_channel_delete'
  | 'event_channel_update'
  | 'event_reaction_add'
  | 'event_reaction_remove'
  | 'event_button_click'
  | 'event_select_menu'
  | 'event_modal_submit'
  | 'on_button_click'
  | 'on_select_menu'
  | 'on_modal_submit'

  // Logic
  | 'if_condition'
  | 'for_loop'
  | 'loop'
  | 'wait'
  | 'random'
  | 'error_handler'
  | 'set_variable'
  | 'get_variable'
  | 'math_operation'
  | 'console_log'
  | 'string_manipulation'
  | 'math_advanced'

  // Actions
  | 'send_message'
  | 'edit_message'
  | 'delete_message'
  | 'send_embed'
  | 'add_button'
  | 'add_select_menu'
  | 'show_modal'
  | 'action_reply'
  | 'defer_reply'
  | 'edit_reply'
  | 'follow_up'
  | 'webhook_send'

  // Moderation
  | 'action_role_add'
  | 'action_role_remove'
  | 'action_kick'
  | 'action_ban'
  | 'action_timeout'
  | 'action_purge'
  | 'member_timeout'
  | 'member_add_role'
  | 'member_remove_role'
  | 'voice_mute'

  // Data & API
  | 'http_request'
  | 'parse_json'
  | 'stringify_json'
  | 'database_get'
  | 'database_set'
  | 'database_store'
  | 'database_retrieve'

  // Advanced & Discord API
  | 'voice_join'
  | 'voice_leave'
  | 'voice_mute'
  | 'voice_play_audio'
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
  | 'create_role'
  | 'role_create'
  | 'create_channel'
  | 'delete_channel'
  | 'channel_create'
  | 'check_permissions'
  | 'check_bot_permissions'
  | 'condition_has_role'
  | 'condition_has_permission'
  | 'call_module'

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
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'number'
    | 'boolean'
    | 'color'
    | 'file'
    | 'message'
    | 'options_list'
    | 'module_select'
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

export interface GlobalVariable {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'secret'
  value: string
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
  variables: GlobalVariable[]
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

export type FileType = 'file' | 'folder'

export interface FileNode {
  id: string
  name: string
  type: FileType
  content?: string
  parentId: string | null
  children?: string[] // IDs of children
  isExpanded?: boolean
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
  variables: GlobalVariable[]
  settings: ProjectSettings
  files: Record<string, FileNode> // Virtual File System
  rootFolderId: string
  createdAt: number
  updatedAt: number
}
