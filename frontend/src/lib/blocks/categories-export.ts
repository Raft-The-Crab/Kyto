import { BlockCategory } from '@/types'

// Export categories for the block library
export const BLOCK_CATEGORIES: Array<{
  id: BlockCategory
  label: string
  icon: string
  color: string
}> = [
  { id: 'triggers', label: 'Triggers', icon: 'Zap', color: '#8B5CF6' },
  { id: 'events', label: 'Events', icon: 'Radio', color: '#10B981' },
  { id: 'messages', label: 'Messages', icon: 'Send', color: '#3B82F6' },
  { id: 'components', label: 'Components', icon: 'Layout', color: '#EC4899' },
  { id: 'moderation', label: 'Moderation', icon: 'Shield', color: '#EF4444' },
  { id: 'roles', label: 'Roles', icon: 'Users', color: '#F59E0B' },
  { id: 'channels', label: 'Channels', icon: 'Hash', color: '#8B5CF6' },
  { id: 'voice', label: 'Voice', icon: 'Mic', color: '#06B6D4' },
  { id: 'logic', label: 'Logic', icon: 'GitBranch', color: '#6366F1' },
  { id: 'data', label: 'Data', icon: 'Database', color: '#14B8A6' },
  { id: 'permissions', label: 'Permissions', icon: 'Lock', color: '#F59E0B' },
  { id: 'advanced', label: 'Advanced', icon: 'Zap', color: '#8B5CF6' },
  { id: 'actions', label: 'Actions', icon: 'Play', color: '#3B82F6' },
  { id: 'conditions', label: 'Conditions', icon: 'GitBranch', color: '#6366F1' },
  { id: 'variables', label: 'Variables', icon: 'Database', color: '#14B8A6' },
  { id: 'replies', label: 'Replies', icon: 'Reply', color: '#3B82F6' },
]
