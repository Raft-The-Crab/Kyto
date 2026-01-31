// ============================================================================
// Kyto - Enhanced Type Definitions
// Full Discord.js v14+ and Discord.py 2.0+ Support
// ============================================================================

// ============================================================================
// BLOCK CATEGORIES - Expanded for complete Discord API coverage
// ============================================================================

export type BlockCategory =
  // Core Categories
  | 'triggers'
  | 'events'
  | 'actions'
  | 'logic'
  | 'conditions'
  | 'variables'
  | 'data'
  // Discord-Specific Categories
  | 'messages'
  | 'embeds'
  | 'components'
  | 'moderation'
  | 'roles'
  | 'channels'
  | 'voice'
  | 'threads'
  | 'permissions'
  | 'members'
  | 'replies'
  | 'guild'
  | 'webhooks'
  | 'interactions'
  | 'automod'
  | 'scheduled_events'
  | 'stickers'
  | 'emojis'
  | 'invites'
  | 'integrations'
  // Advanced Categories
  | 'advanced'
  | 'api'
  | 'database'
  | 'utilities'
  | 'debugging'
  | 'custom'

// ============================================================================
// BLOCK TYPES - Complete Discord API Coverage
// ============================================================================

export type BlockType =
  // ==================== TRIGGERS ====================
  | 'command_slash'
  | 'command_subcommand'
  | 'command_subcommand_group'
  | 'command_user'
  | 'command_message'
  | 'context_menu_user'
  | 'context_menu_message'
  | 'autocomplete_handler'
  | 'autocomplete_handler'
  | 'prefix_command'
  | 'context_menu_user'
  | 'context_menu_message'
  | 'autocomplete_handler'
  | 'prefix_command'
  | 'check_permissions'
  | 'check_bot_permissions'
  | 'event_listener'
  | 'member_timeout'
  | 'automod_alert'
  | 'event_schedule'
  | 'role_create'
  | 'channel_create'
  | 'string_manipulation'
  | 'math_advanced'
  | 'webhook_send'
  | 'voice_join'
  | 'voice_leave'
  | 'thread_create'

  // ==================== EVENTS - Messages ====================
  | 'event_ready'
  | 'event_message_create'
  | 'event_message_update'
  | 'event_message_delete'
  | 'event_message_bulk_delete'
  | 'event_message_reaction_add'
  | 'event_message_reaction_remove'
  | 'event_message_reaction_remove_all'
  | 'event_message_reaction_remove_emoji'
  | 'event_typing_start'
  | 'event_message_poll_vote_add'
  | 'event_message_poll_vote_remove'

  // ==================== EVENTS - Guild Members ====================
  | 'event_member_join'
  | 'event_member_leave'
  | 'event_member_update'
  | 'event_member_available'
  | 'event_members_chunk'
  | 'event_user_update'
  | 'event_presence_update'

  // ==================== EVENTS - Guild ====================
  | 'event_guild_create'
  | 'event_guild_update'
  | 'event_guild_delete'
  | 'event_guild_unavailable'
  | 'event_guild_integrations_update'
  | 'event_guild_ban_add'
  | 'event_guild_ban_remove'
  | 'event_guild_emojis_update'
  | 'event_guild_stickers_update'
  | 'event_guild_audit_log_entry_create'

  // ==================== EVENTS - Channels ====================
  | 'event_channel_create'
  | 'event_channel_update'
  | 'event_channel_delete'
  | 'event_channel_pins_update'

  // ==================== EVENTS - Threads ====================
  | 'event_thread_create'
  | 'event_thread_update'
  | 'event_thread_delete'
  | 'event_thread_list_sync'
  | 'event_thread_member_update'
  | 'event_thread_members_update'

  // ==================== EVENTS - Roles ====================
  | 'event_role_create'
  | 'event_role_update'
  | 'event_role_delete'

  // ==================== EVENTS - Interactions ====================
  | 'event_interaction_create'
  | 'event_button_click'
  | 'event_select_menu'
  | 'event_modal_submit'
  | 'event_autocomplete'
  | 'on_button_click'
  | 'on_select_menu'
  | 'on_modal_submit'
  | 'on_autocomplete'

  // ==================== EVENTS - Voice ====================
  | 'event_voice_state_update'
  | 'event_voice_server_update'
  | 'event_voice_channel_effect_send'

  // ==================== EVENTS - Stage ====================
  | 'event_stage_instance_create'
  | 'event_stage_instance_update'
  | 'event_stage_instance_delete'

  // ==================== EVENTS - Scheduled Events ====================
  | 'event_scheduled_event_create'
  | 'event_scheduled_event_update'
  | 'event_scheduled_event_delete'
  | 'event_scheduled_event_user_add'
  | 'event_scheduled_event_user_remove'

  // ==================== EVENTS - Invites ====================
  | 'event_invite_create'
  | 'event_invite_delete'

  // ==================== EVENTS - AutoMod ====================
  | 'event_automod_rule_create'
  | 'event_automod_rule_update'
  | 'event_automod_rule_delete'
  | 'event_automod_action_execution'

  // ==================== EVENTS - Webhooks ====================
  | 'event_webhooks_update'

  // ==================== EVENTS - Application ====================
  | 'event_application_command_permissions_update'
  | 'event_entitlement_create'
  | 'event_entitlement_update'
  | 'event_entitlement_delete'

  // ==================== EVENTS - Other ====================
  | 'event_shard_ready'
  | 'event_shard_disconnect'
  | 'event_shard_reconnecting'
  | 'event_shard_resume'
  | 'event_shard_error'
  | 'event_error'
  | 'event_warn'
  | 'event_debug'
  | 'event_rate_limit'
  | 'event_invalidated'
  | 'event_cache_sweep'

  // ==================== ACTIONS - Replies & Messages ====================
  | 'action_reply'
  | 'action_reply_ephemeral'
  | 'action_defer_reply'
  | 'action_defer_update'
  | 'action_reply'
  | 'action_defer_reply'
  | 'edit_reply'
  | 'follow_up'
  | 'send_embed'
  | 'add_button'
  | 'add_link_button'
  | 'send_message'
  | 'send_embed'
  | 'send_embed_builder'
  | 'edit_message'
  | 'delete_message'
  | 'action_delete_reply'
  | 'bulk_delete_messages'
  | 'pin_message'
  | 'unpin_message'
  | 'crosspost_message'
  | 'fetch_message'
  | 'fetch_messages'
  | 'start_typing'

  // ==================== ACTIONS - Reactions ====================
  | 'add_reaction'
  | 'remove_reaction'
  | 'remove_all_reactions'
  | 'remove_all_reactions_emoji'
  | 'fetch_reactions'

  // ==================== ACTIONS - Components ====================
  | 'add_button'
  | 'add_link_button'
  | 'add_select_menu'
  | 'add_string_select'
  | 'add_user_select'
  | 'add_role_select'
  | 'add_mentionable_select'
  | 'add_channel_select'
  | 'show_modal'
  | 'add_text_input'
  | 'add_action_row'
  | 'disable_components'
  | 'update_components'

  // ==================== ACTIONS - Embeds ====================
  | 'create_embed'
  | 'set_embed_title'
  | 'set_embed_description'
  | 'set_embed_color'
  | 'set_embed_author'
  | 'set_embed_footer'
  | 'set_embed_image'
  | 'action_edit_reply'
  | 'action_follow_up'
  | 'set_embed_thumbnail'
  | 'add_embed_field'
  | 'set_embed_timestamp'
  | 'set_embed_url'

  // ==================== ACTIONS - Moderation ====================
  | 'action_ban'
  | 'action_unban'
  | 'action_kick'
  | 'action_timeout'
  | 'action_remove_timeout'
  | 'action_warn'
  | 'action_purge'
  | 'action_slowmode'
  | 'action_lock_channel'
  | 'action_unlock_channel'
  | 'action_mute'
  | 'action_unmute'
  | 'action_deafen'
  | 'action_undeafen'
  | 'action_move_member'
  | 'action_disconnect_member'
  | 'fetch_audit_logs'
  | 'fetch_bans'

  // ==================== ACTIONS - Roles ====================
  | 'action_role_add'
  | 'action_role_remove'
  | 'action_role_toggle'
  | 'create_role'
  | 'delete_role'
  | 'edit_role'
  | 'set_role_position'
  | 'set_role_permissions'
  | 'set_role_color'
  | 'set_role_hoist'
  | 'set_role_mentionable'
  | 'set_role_icon'
  | 'fetch_roles'

  // ==================== ACTIONS - Channels ====================
  | 'create_channel'
  | 'create_text_channel'
  | 'create_voice_channel'
  | 'create_category'
  | 'create_announcement_channel'
  | 'create_stage_channel'
  | 'create_forum_channel'
  | 'delete_channel'
  | 'edit_channel'
  | 'set_channel_name'
  | 'set_channel_topic'
  | 'set_channel_position'
  | 'set_channel_parent'
  | 'set_channel_permissions'
  | 'set_channel_nsfw'
  | 'set_channel_rate_limit'
  | 'clone_channel'
  | 'fetch_channel'
  | 'fetch_channels'

  // ==================== ACTIONS - Threads ====================
  | 'thread_create'
  | 'thread_create_from_message'
  | 'thread_join'
  | 'thread_leave'
  | 'thread_archive'
  | 'thread_unarchive'
  | 'thread_lock'
  | 'thread_unlock'
  | 'thread_edit'
  | 'thread_delete'
  | 'thread_add_member'
  | 'thread_remove_member'
  | 'thread_fetch_members'
  | 'forum_post_create'
  | 'forum_post_edit'

  // ==================== ACTIONS - Voice ====================
  | 'voice_join'
  | 'voice_leave'
  | 'voice_move'
  | 'voice_mute_member'
  | 'voice_unmute_member'
  | 'voice_deafen_member'
  | 'voice_undeafen_member'
  | 'voice_set_bitrate'
  | 'voice_set_user_limit'
  | 'voice_set_region'
  | 'voice_play_audio'
  | 'voice_pause'
  | 'voice_resume'
  | 'voice_stop'
  | 'voice_set_volume'
  | 'voice_queue_add'
  | 'voice_queue_skip'
  | 'voice_queue_clear'

  // ==================== ACTIONS - Stage ====================
  | 'stage_start'
  | 'stage_end'
  | 'stage_edit'
  | 'stage_request_to_speak'
  | 'stage_set_speaker'
  | 'stage_move_to_audience'

  // ==================== ACTIONS - Members ====================
  | 'fetch_member'
  | 'fetch_members'
  | 'set_nickname'
  | 'dm_member'
  | 'fetch_member_permissions'

  // ==================== ACTIONS - Guild ====================
  | 'edit_guild'
  | 'set_guild_name'
  | 'set_guild_icon'
  | 'set_guild_banner'
  | 'set_guild_splash'
  | 'set_guild_afk_channel'
  | 'set_guild_system_channel'
  | 'fetch_guild'
  | 'fetch_guild_preview'
  | 'leave_guild'

  // ==================== ACTIONS - Webhooks ====================
  | 'webhook_create'
  | 'webhook_delete'
  | 'webhook_edit'
  | 'webhook_send'
  | 'webhook_edit_message'
  | 'webhook_delete_message'
  | 'webhook_fetch'
  | 'webhook_fetch_all'

  // ==================== ACTIONS - Invites ====================
  | 'invite_create'
  | 'invite_delete'
  | 'invite_fetch'
  | 'invite_fetch_all'

  // ==================== ACTIONS - Emojis ====================
  | 'emoji_create'
  | 'emoji_delete'
  | 'emoji_edit'
  | 'emoji_fetch'
  | 'emoji_fetch_all'

  // ==================== ACTIONS - Stickers ====================
  | 'sticker_create'
  | 'sticker_delete'
  | 'sticker_edit'
  | 'sticker_fetch'
  | 'sticker_send'

  // ==================== ACTIONS - AutoMod ====================
  | 'automod_rule_create'
  | 'automod_rule_delete'
  | 'automod_rule_edit'
  | 'automod_rule_enable'
  | 'automod_rule_disable'
  | 'automod_fetch_rules'

  // ==================== ACTIONS - Scheduled Events ====================
  | 'scheduled_event_create'
  | 'scheduled_event_delete'
  | 'scheduled_event_edit'
  | 'scheduled_event_start'
  | 'scheduled_event_end'
  | 'scheduled_event_fetch'
  | 'scheduled_event_fetch_users'

  // ==================== LOGIC ====================
  | 'if_condition'
  | 'if_else'
  | 'else_if'
  | 'switch_case'
  | 'for_loop'
  | 'for_each'
  | 'while_loop'
  | 'do_while'
  | 'break_loop'
  | 'continue_loop'
  | 'return_value'
  | 'try_catch'
  | 'throw_error'
  | 'wait'
  | 'wait_for_event'
  | 'wait_for_message'
  | 'wait_for_reaction'
  | 'wait_for_interaction'
  | 'random_number'
  | 'random_choice'
  | 'random_shuffle'
  | 'parallel_execute'
  | 'sequence_execute'

  // ==================== CONDITIONS ====================
  | 'condition_equals'
  | 'condition_not_equals'
  | 'condition_greater_than'
  | 'condition_less_than'
  | 'condition_greater_or_equal'
  | 'condition_less_or_equal'
  | 'condition_contains'
  | 'condition_starts_with'
  | 'condition_ends_with'
  | 'condition_matches_regex'
  | 'condition_is_empty'
  | 'condition_is_null'
  | 'condition_is_number'
  | 'condition_is_string'
  | 'condition_is_array'
  | 'condition_is_object'
  | 'condition_and'
  | 'condition_or'
  | 'condition_not'
  | 'condition_has_role'
  | 'condition_has_permission'
  | 'condition_is_owner'
  | 'condition_is_admin'
  | 'condition_is_bot'
  | 'condition_is_human'
  | 'condition_in_voice'
  | 'condition_in_channel'
  | 'condition_in_category'
  | 'condition_channel_type'
  | 'condition_user_has_nitro'
  | 'condition_server_boosting'

  // ==================== VARIABLES ====================
  | 'set_variable'
  | 'get_variable'
  | 'delete_variable'
  | 'increment_variable'
  | 'decrement_variable'
  | 'set_global_variable'
  | 'get_global_variable'
  | 'set_user_variable'
  | 'get_user_variable'
  | 'set_server_variable'
  | 'get_server_variable'
  | 'set_channel_variable'
  | 'get_channel_variable'
  | 'variable_exists'
  | 'list_variables'

  // ==================== DATA & STRINGS ====================
  | 'string_concat'
  | 'string_split'
  | 'string_join'
  | 'string_replace'
  | 'string_replace_all'
  | 'string_to_upper'
  | 'string_to_lower'
  | 'string_capitalize'
  | 'string_trim'
  | 'string_substring'
  | 'string_length'
  | 'string_reverse'
  | 'string_repeat'
  | 'string_pad_start'
  | 'string_pad_end'
  | 'string_includes'
  | 'string_index_of'
  | 'string_char_at'
  | 'string_format'
  | 'string_template'
  | 'regex_match'
  | 'regex_replace'
  | 'regex_test'
  | 'regex_extract'

  // ==================== DATA & MATH ====================
  | 'math_add'
  | 'math_subtract'
  | 'math_multiply'
  | 'math_divide'
  | 'math_modulo'
  | 'math_power'
  | 'math_sqrt'
  | 'math_abs'
  | 'math_round'
  | 'math_floor'
  | 'math_ceil'
  | 'math_min'
  | 'math_max'
  | 'math_clamp'
  | 'math_sin'
  | 'math_cos'
  | 'math_tan'
  | 'math_log'
  | 'math_exp'
  | 'math_random'
  | 'math_parse_int'
  | 'math_parse_float'
  | 'math_to_fixed'
  | 'math_is_nan'
  | 'math_is_finite'

  // ==================== DATA & ARRAYS ====================
  | 'array_create'
  | 'array_push'
  | 'array_pop'
  | 'array_shift'
  | 'array_unshift'
  | 'array_splice'
  | 'array_slice'
  | 'array_concat'
  | 'array_join'
  | 'array_reverse'
  | 'array_sort'
  | 'array_filter'
  | 'array_map'
  | 'array_reduce'
  | 'array_find'
  | 'array_find_index'
  | 'array_includes'
  | 'array_index_of'
  | 'array_every'
  | 'array_some'
  | 'array_flat'
  | 'array_unique'
  | 'array_length'
  | 'array_at'
  | 'array_fill'

  // ==================== DATA & OBJECTS ====================
  | 'object_create'
  | 'object_get'
  | 'object_set'
  | 'object_delete'
  | 'object_has'
  | 'object_keys'
  | 'object_values'
  | 'object_entries'
  | 'object_assign'
  | 'object_merge'
  | 'object_freeze'
  | 'object_clone'

  // ==================== DATA & JSON ====================
  | 'json_parse'
  | 'json_stringify'
  | 'json_path'

  // ==================== DATA & DATE/TIME ====================
  | 'date_now'
  | 'date_create'
  | 'date_parse'
  | 'date_format'
  | 'date_add'
  | 'date_subtract'
  | 'date_diff'
  | 'date_get_year'
  | 'date_get_month'
  | 'date_get_day'
  | 'date_get_hours'
  | 'date_get_minutes'
  | 'date_get_seconds'
  | 'date_get_milliseconds'
  | 'date_get_day_of_week'
  | 'date_get_timestamp'
  | 'date_to_discord_timestamp'
  | 'date_to_iso_string'
  | 'date_to_locale_string'

  // ==================== API & HTTP ====================
  | 'http_request'
  | 'http_get'
  | 'http_post'
  | 'http_put'
  | 'http_patch'
  | 'http_delete'
  | 'http_head'
  | 'http_set_header'
  | 'http_set_body'
  | 'http_set_query'
  | 'http_set_timeout'
  | 'http_parse_response'
  | 'api_discord'
  | 'api_rest'
  | 'api_graphql'

  // ==================== DATABASE ====================
  | 'database_connect'
  | 'database_disconnect'
  | 'database_query'
  | 'database_insert'
  | 'database_update'
  | 'database_delete'
  | 'database_find'
  | 'database_find_one'
  | 'database_count'
  | 'database_aggregate'
  | 'database_create_table'
  | 'database_drop_table'
  | 'database_transaction_start'
  | 'database_transaction_commit'
  | 'database_transaction_rollback'
  // Key-Value Store
  | 'kv_get'
  | 'kv_set'
  | 'kv_delete'
  | 'kv_has'
  | 'kv_list'
  | 'kv_clear'

  // ==================== UTILITIES ====================
  | 'console_log'
  | 'console_warn'
  | 'console_error'
  | 'console_debug'
  | 'console_table'
  | 'console_time'
  | 'console_time_end'
  | 'comment'
  | 'generate_id'
  | 'generate_uuid'
  | 'generate_snowflake'
  | 'encode_base64'
  | 'decode_base64'
  | 'encode_url'
  | 'decode_url'
  | 'hash_md5'
  | 'hash_sha256'
  | 'encrypt'
  | 'decrypt'
  | 'convert_to_number'
  | 'convert_to_string'
  | 'convert_to_boolean'
  | 'convert_to_array'
  | 'convert_to_object'

  // ==================== ADVANCED ====================
  | 'call_module'
  | 'call_function'
  | 'define_function'
  | 'create_collector'
  | 'create_message_collector'
  | 'create_reaction_collector'
  | 'create_interaction_collector'
  | 'create_awaited_message'
  | 'create_awaited_reaction'
  | 'create_paginator'
  | 'create_menu_paginator'
  | 'create_confirmation'
  | 'create_poll'
  | 'schedule_task'
  | 'cancel_scheduled_task'
  | 'emit_event'
  | 'listen_event'
  | 'rate_limit_check'
  | 'cooldown_set'
  | 'cooldown_check'
  | 'cooldown_reset'
  | 'cache_get'
  | 'cache_set'
  | 'cache_delete'
  | 'cache_clear'
  | 'eval_code'
  | 'exec_shell'

  // ==================== ERROR HANDLING ====================
  | 'error_handler'
  | 'error_catch'
  | 'error_throw'
  | 'error_log'
  | 'error_notify'

// ============================================================================
// BLOCK INTERFACES
// ============================================================================

export interface BlockConnection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  type?: 'default' | 'success' | 'error' | 'true' | 'false'
  animated?: boolean
  label?: string
  style?: Record<string, any>
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
  notes?: string
  disabled?: boolean
  breakpoint?: boolean
  collapsed?: boolean
}

export interface Block {
  id: string
  type: BlockType
  position: { x: number; y: number }
  data: BlockData
  measured?: { width: number; height: number }
  selected?: boolean
  dragging?: boolean
  parentId?: string
  extent?: 'parent' | [number, number, number, number]
  expandParent?: boolean
  zIndex?: number
}

export type CanvasBlock = Block

// ============================================================================
// PROPERTY TYPES - Enhanced with more input types
// ============================================================================

export type PropertyType =
  | 'text'
  | 'textarea'
  | 'code'
  | 'markdown'
  | 'select'
  | 'multi_select'
  | 'number'
  | 'slider'
  | 'boolean'
  | 'switch'
  | 'color'
  | 'file'
  | 'image'
  | 'url'
  | 'email'
  | 'password'
  | 'date'
  | 'time'
  | 'datetime'
  | 'duration'
  | 'json'
  | 'array'
  | 'object'
  | 'key_value'
  | 'options_list'
  | 'embed_builder'
  | 'component_builder'
  | 'permission_select'
  | 'channel_select'
  | 'role_select'
  | 'user_select'
  | 'emoji_select'
  | 'module_select'
  | 'variable_select'
  | 'expression'
  | 'regex'
  | 'snowflake'
  | 'mention'

export interface PropertyValidation {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string | RegExp
  custom?: (value: any, props: Record<string, any>) => string | null
  asyncValidator?: (value: any) => Promise<string | null>
}

export interface PropertyOption {
  label: string
  value: string
  description?: string
  icon?: string
  disabled?: boolean
  group?: string
}

export interface BlockProperty {
  key: string
  label: string
  type: PropertyType
  required?: boolean
  defaultValue?: unknown
  options?: PropertyOption[]
  placeholder?: string
  helperText?: string
  validation?: PropertyValidation
  showIf?: (props: Record<string, any>) => boolean
  hideIf?: (props: Record<string, any>) => boolean
  disabled?: boolean
  readOnly?: boolean
  group?: string
  order?: number
  width?: 'full' | 'half' | 'third' | 'quarter'
  languageHint?: {
    js?: string
    py?: string
  }
  examples?: string[]
  deprecated?: boolean
  deprecatedMessage?: string
  experimental?: boolean
  premium?: boolean
}

// ============================================================================
// BLOCK DEFINITION - Enhanced with validation and language support
// ============================================================================

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
  // New enhanced fields
  version?: string
  deprecated?: boolean
  deprecatedMessage?: string
  experimental?: boolean
  premium?: boolean
  tags?: string[]
  aliases?: string[]
  documentation?: string
  examples?: BlockExample[]
  validation?: (props: Record<string, any>) => ValidationResult
  transform?: {
    toJs?: (props: Record<string, any>) => string
    toPy?: (props: Record<string, any>) => string
  }
  handles?: {
    inputs?: HandleDefinition[]
    outputs?: HandleDefinition[]
  }
  minWidth?: number
  maxWidth?: number
  resizable?: boolean
  deletable?: boolean
  copyable?: boolean
  connectable?: boolean
}

export interface HandleDefinition {
  id: string
  label: string
  type: 'default' | 'success' | 'error' | 'true' | 'false' | 'loop'
  position?: 'top' | 'right' | 'bottom' | 'left'
  required?: boolean
  multiple?: boolean
  accepts?: BlockType[]
}

export interface BlockExample {
  title: string
  description?: string
  properties: Record<string, any>
  code?: {
    js?: string
    py?: string
  }
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  property?: string
  message: string
  code?: string
}

export interface ValidationWarning {
  property?: string
  message: string
  code?: string
}

// ============================================================================
// CATEGORY DEFINITION
// ============================================================================

export interface CategoryDefinition {
  id: BlockCategory
  label: string
  description?: string
  icon: string
  color: string
  order?: number
  collapsed?: boolean
  hidden?: boolean
  subcategories?: CategoryDefinition[]
}

// ============================================================================
// CANVAS STATE
// ============================================================================

export interface CanvasState {
  blocks: CanvasBlock[]
  connections: BlockConnection[]
  selectedBlockId: string | null
  selectedBlockIds?: string[]
  viewportPosition: { x: number; y: number; zoom: number }
  snapToGrid?: boolean
  gridSize?: number
  showMiniMap?: boolean
  showControls?: boolean
  readOnly?: boolean
}

export interface CanvasHistory {
  past: CanvasState[]
  present: CanvasState
  future: CanvasState[]
}

// ============================================================================
// COMMANDS
// ============================================================================

export type CommandType =
  | 'slash'
  | 'message'
  | 'user'
  | 'autocomplete'
  | 'context_user'
  | 'context_message'

export type SlashCommandOptionType =
  | 'string'
  | 'integer'
  | 'number'
  | 'boolean'
  | 'user'
  | 'channel'
  | 'role'
  | 'mentionable'
  | 'attachment'
  | 'subcommand'
  | 'subcommand_group'

export interface SlashCommandChoice {
  name: string
  value: string | number
  nameLocalizations?: Record<string, string>
}

export interface SlashCommandOption {
  id: string
  name: string
  description: string
  type: SlashCommandOptionType
  required: boolean
  choices?: SlashCommandChoice[]
  options?: SlashCommandOption[] // For subcommands
  minValue?: number
  maxValue?: number
  minLength?: number
  maxLength?: number
  autocomplete?: boolean
  channelTypes?: ChannelType[]
  nameLocalizations?: Record<string, string>
  descriptionLocalizations?: Record<string, string>
}

export type ChannelType =
  | 'GUILD_TEXT'
  | 'DM'
  | 'GUILD_VOICE'
  | 'GROUP_DM'
  | 'GUILD_CATEGORY'
  | 'GUILD_ANNOUNCEMENT'
  | 'ANNOUNCEMENT_THREAD'
  | 'PUBLIC_THREAD'
  | 'PRIVATE_THREAD'
  | 'GUILD_STAGE_VOICE'
  | 'GUILD_DIRECTORY'
  | 'GUILD_FORUM'
  | 'GUILD_MEDIA'

export interface Command {
  id: string
  type: CommandType
  name: string
  description: string
  version?: string
  options: SlashCommandOption[]
  canvas: CanvasState
  // Enhanced fields
  permissions?: string[]
  defaultMemberPermissions?: string
  dmPermission?: boolean
  nsfw?: boolean
  cooldown?: number
  cooldownScope?: 'user' | 'channel' | 'guild' | 'global'
  enabled?: boolean
  guildOnly?: boolean
  ownerOnly?: boolean
  tags?: string[]
  category?: string
  aliases?: string[]
  usage?: string
  examples?: string[]
  notes?: string
  createdAt: number
  updatedAt: number
}

// ============================================================================
// EVENTS
// ============================================================================

export interface EventListener {
  id: string
  eventType: string
  name: string
  description: string
  version?: string
  canvas: CanvasState
  // Enhanced fields
  enabled?: boolean
  once?: boolean
  priority?: number
  filter?: string
  condition?: string
  throttle?: number
  debounce?: number
  tags?: string[]
  notes?: string
  createdAt: number
  updatedAt: number
}

// ============================================================================
// MODULES
// ============================================================================

export interface Module {
  id: string
  name: string
  description: string
  version?: string
  commands: Command[]
  events: EventListener[]
  canvas: CanvasState
  // Enhanced fields
  enabled?: boolean
  dependencies?: string[]
  exports?: ModuleExport[]
  imports?: ModuleImport[]
  settings?: ModuleSetting[]
  tags?: string[]
  author?: string
  license?: string
  repository?: string
  icon?: string
  color?: string
  createdAt: number
  updatedAt: number
}

export interface ModuleExport {
  name: string
  type: 'function' | 'variable' | 'constant'
  description?: string
}

export interface ModuleImport {
  moduleId: string
  exports: string[]
}

export interface ModuleSetting {
  key: string
  label: string
  type: PropertyType
  defaultValue?: any
  description?: string
  required?: boolean
}

// ============================================================================
// VARIABLES
// ============================================================================

export type VariableType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'secret' | 'json'
export type VariableScope = 'local' | 'global' | 'user' | 'server' | 'channel'

export interface GlobalVariable {
  id: string
  name: string
  type: VariableType
  value: string
  scope?: VariableScope
  description?: string
  encrypted?: boolean
  readOnly?: boolean
  persistent?: boolean
  defaultValue?: any
  validation?: PropertyValidation
  createdAt?: number
  updatedAt?: number
}

// ============================================================================
// PROJECT SETTINGS
// ============================================================================

export interface ProjectSettings {
  // Bot Configuration
  botToken?: string
  clientId?: string
  guildId?: string // For development
  prefix?: string

  // Intents & Permissions
  intents: string[]
  permissions: string[]
  partials?: string[]

  // Features
  sharding?: boolean
  shardCount?: number

  // Development
  debugMode?: boolean
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'verbose'

  // Database
  databaseType?: 'none' | 'sqlite' | 'mongodb' | 'postgresql' | 'mysql' | 'redis'
  databaseUrl?: string

  // API
  apiEnabled?: boolean
  apiPort?: number
  apiKey?: string

  // Presence
  presenceStatus?: 'online' | 'idle' | 'dnd' | 'invisible'
  presenceActivity?: {
    type: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'COMPETING' | 'CUSTOM'
    name: string
    url?: string
  }

  // Rate Limiting
  rateLimitEnabled?: boolean
  rateLimitMessages?: number
  rateLimitInterval?: number

  // Error Handling
  errorWebhook?: string
  errorDmOwner?: boolean

  // Deployment
  deployCommands?: 'global' | 'guild' | 'both'
  autoRestart?: boolean

  // Customization
  embedColor?: string
  footerText?: string
  footerIcon?: string
}

// ============================================================================
// FILE SYSTEM
// ============================================================================

export type FileType = 'file' | 'folder'
export type FileLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'text'

export interface FileNode {
  id: string
  name: string
  type: FileType
  content?: string
  parentId: string | null
  children?: string[]
  isExpanded?: boolean
  // Enhanced fields
  language?: FileLanguage
  readOnly?: boolean
  hidden?: boolean
  icon?: string
  modified?: boolean
  size?: number
  createdAt?: number
  updatedAt?: number
}

// ============================================================================
// PROJECT
// ============================================================================

export type ProjectLanguage = 'discord.js' | 'discord.py'
export type ProjectStatus = 'draft' | 'development' | 'testing' | 'production' | 'archived'

export interface Project {
  id: string
  name: string
  description: string
  language: ProjectLanguage
  version: string
  commands: Command[]
  events: EventListener[]
  modules: Module[]
  variables: GlobalVariable[]
  settings: ProjectSettings
  files: Record<string, FileNode>
  rootFolderId: string
  // Enhanced fields
  status?: ProjectStatus
  icon?: string
  color?: string
  tags?: string[]
  collaborators?: Collaborator[]
  git?: GitConfig
  deployment?: DeploymentConfig
  analytics?: ProjectAnalytics
  backups?: ProjectBackup[]
  createdAt: number
  updatedAt: number
  lastOpenedAt?: number
}

export interface Collaborator {
  id: string
  userId: string
  username: string
  avatar?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  joinedAt: number
  lastActiveAt?: number
}

export interface GitConfig {
  enabled: boolean
  repository?: string
  branch?: string
  autoCommit?: boolean
  autoPush?: boolean
}

export interface DeploymentConfig {
  provider?: 'railway' | 'heroku' | 'vercel' | 'aws' | 'gcp' | 'azure' | 'vps' | 'local'
  url?: string
  status?: 'deployed' | 'deploying' | 'failed' | 'stopped'
  lastDeployedAt?: number
  environment?: Record<string, string>
}

export interface ProjectAnalytics {
  totalCommands: number
  totalEvents: number
  totalModules: number
  totalBlocks: number
  totalConnections: number
  lastEditedAt: number
  editCount: number
}

export interface ProjectBackup {
  id: string
  name: string
  description?: string
  createdAt: number
  size: number
  automatic?: boolean
}

// ============================================================================
// COLLABORATION
// ============================================================================

export interface CollaborationCursor {
  id: string
  userId: string
  username: string
  color: string
  position: { x: number; y: number }
  selection?: string[]
  lastUpdate: number
}

export interface CollaborationMessage {
  id: string
  type: 'join' | 'leave' | 'cursor' | 'selection' | 'edit' | 'chat' | 'sync'
  userId: string
  username: string
  data?: any
  timestamp: number
}

// ============================================================================
// AI ASSISTANT
// ============================================================================

export interface AISuggestion {
  id: string
  type: 'block' | 'connection' | 'optimization' | 'error_fix' | 'best_practice' | 'feature'
  title: string
  description: string
  confidence: number
  category?: string
  blocks?: Block[]
  connections?: BlockConnection[]
  code?: {
    js?: string
    py?: string
  }
  appliedAt?: number
  dismissedAt?: number
}

export interface AIConversation {
  id: string
  messages: AIMessage[]
  context?: AIContext
  createdAt: number
  updatedAt: number
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  suggestions?: AISuggestion[]
}

export interface AIContext {
  projectId?: string
  commandId?: string
  eventId?: string
  moduleId?: string
  selectedBlocks?: string[]
  canvasState?: CanvasState
}

// ============================================================================
// EXPORT
// ============================================================================

export interface ExportOptions {
  language: ProjectLanguage
  format: 'zip' | 'folder' | 'single_file'
  minify?: boolean
  comments?: boolean
  typescript?: boolean
  eslint?: boolean
  prettier?: boolean
  readme?: boolean
  dockerfile?: boolean
  docker_compose?: boolean
  env_example?: boolean
  package_manager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry'
}

export interface ExportResult {
  success: boolean
  files: ExportFile[]
  dependencies: Record<string, string>
  devDependencies?: Record<string, string>
  instructions: string
  warnings?: string[]
  errors?: string[]
}

export interface ExportFile {
  path: string
  content: string
  language?: FileLanguage
  size?: number
}

// ============================================================================
// TEMPLATES
// ============================================================================

export interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  language: ProjectLanguage
  tags: string[]
  author: string
  version: string
  downloads?: number
  rating?: number
  commands: Command[]
  events: EventListener[]
  modules: Module[]
  variables: GlobalVariable[]
  preview?: string
  createdAt: number
  updatedAt: number
}

// ============================================================================
// MARKETPLACE
// ============================================================================

export interface MarketplaceItem {
  id: string
  type: 'template' | 'module' | 'block' | 'theme'
  name: string
  description: string
  author: MarketplaceAuthor
  version: string
  downloads: number
  rating: number
  ratingCount: number
  price: number
  currency: string
  tags: string[]
  images: string[]
  readme?: string
  changelog?: string
  dependencies?: string[]
  compatibility?: {
    minVersion?: string
    maxVersion?: string
    languages?: ProjectLanguage[]
  }
  createdAt: number
  updatedAt: number
}

export interface MarketplaceAuthor {
  id: string
  username: string
  displayName: string
  avatar?: string
  verified?: boolean
}

// ============================================================================
// USER & AUTH
// ============================================================================

export interface User {
  id: string
  username: string
  email: string
  displayName?: string
  avatar?: string
  role: 'user' | 'pro' | 'admin'
  plan: 'free' | 'pro' | 'enterprise'
  preferences: UserPreferences
  createdAt: number
  updatedAt: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  accentColor?: string
  language: string
  timezone?: string
  notifications: {
    email: boolean
    push: boolean
    updates: boolean
    tips: boolean
  }
  editor: {
    fontSize: number
    tabSize: number
    wordWrap: boolean
    minimap: boolean
    lineNumbers: boolean
    autoSave: boolean
    autoSaveInterval: number
  }
  canvas: {
    snapToGrid: boolean
    gridSize: number
    showMiniMap: boolean
    animatedEdges: boolean
    connectionLineType: 'bezier' | 'step' | 'smoothstep' | 'straight'
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  action?: {
    label: string
    url?: string
    onClick?: () => void
  }
  createdAt: number
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Nullable<T> = T | null

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
