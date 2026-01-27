import { Block, BlockConnection, BlockType } from '@/types'

// ==================== TYPES ====================

export type Intent =
  | 'greeting'
  | 'help'
  | 'build_bot'
  | 'explain'
  | 'debug'
  | 'optimize'
  | 'question'
  | 'unknown'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ConversationContext {
  messages: Message[]
  currentIntent: Intent
  userPreferences: {
    preferredBlocks: string[]
    language: 'javascript' | 'python'
    experienceLevel: 'beginner' | 'intermediate' | 'expert'
  }
  canvasAnalysis: {
    blockCount: number
    hasErrors: boolean
    missingComponents: string[]
  }
  pendingActions: Array<{
    id: string
    description: string
    action: () => void
    timestamp: number
  }>
}

export interface AIResponse {
  message: string
  suggestions?: Array<{
    id: string
    title: string
    description: string
    blocks: Array<{ type: string; properties: Record<string, any> }>
  }>
  quickActions?: string[]
  pendingAction?: {
    id: string
    description: string
    action: () => void
  }
}

export interface StoreActions {
  addBlock: (
    type: BlockType,
    position: { x: number; y: number },
    properties?: Record<string, any>
  ) => void
  removeBlock: (id: string) => void
  updateBlock: (id: string, updates: any) => void
  addConnection: (connection: any) => void
  removeConnection: (id: string) => void
  clearCanvas: () => void
  duplicateBlock: (id: string) => void
  undo: () => void
  redo: () => void
}

// ==================== ADVANCED AI ENGINE ====================

export class AdvancedAI {
  private context: ConversationContext

  constructor() {
    this.context = {
      messages: [],
      currentIntent: 'unknown',
      userPreferences: {
        preferredBlocks: [],
        language: 'javascript',
        experienceLevel: 'beginner',
      },
      canvasAnalysis: {
        blockCount: 0,
        hasErrors: false,
        missingComponents: [],
      },
      pendingActions: [],
    }
  }

  // ==================== INTENT CLASSIFICATION ====================

  private classifyIntent(message: string): Intent {
    const lower = message.toLowerCase()

    // Greeting patterns
    if (/^(hi|hello|hey|sup|yo|greetings)/.test(lower)) return 'greeting'

    // Build patterns
    if (/(build|create|make|setup|develop).*bot/.test(lower)) return 'build_bot'
    if (/(add|insert|put|include|create) (a |an )?(\w+)/.test(lower)) return 'build_bot'

    // Help patterns
    if (/(help|assist|guide|how to|tutorial)/.test(lower)) return 'help'
    if (/^(what|how|why|when|where)/.test(lower)) return 'question'

    // Debug patterns
    if (/(error|bug|issue|problem|not work|broken|fix)/.test(lower)) return 'debug'
    if (/(debug|troubleshoot|diagnose)/.test(lower)) return 'debug'

    // Optimize patterns
    if (/(optimize|improve|better|enhance|faster|performance)/.test(lower)) return 'optimize'

    // Explain patterns
    if (/(what is|explain|describe|tell me about)/.test(lower)) return 'explain'

    return 'unknown'
  }

  // ==================== CONTEXT ANALYSIS ====================

  updateCanvasContext(blocks: Block[], connections: BlockConnection[]) {
    this.context.canvasAnalysis = {
      blockCount: blocks.length,
      hasErrors: blocks.some(b => b.data.errors.length > 0),
      missingComponents: this.detectMissingComponents(blocks, connections),
    }

    // Learn user preferences
    blocks.forEach(block => {
      if (!this.context.userPreferences.preferredBlocks.includes(block.type)) {
        this.context.userPreferences.preferredBlocks.push(block.type)
      }
    })
  }

  private detectMissingComponents(blocks: Block[], _connections: BlockConnection[]): string[] {
    const missing: string[] = []

    const hasTrigger = blocks.some(b => b.data.category === 'triggers')
    const hasAction = blocks.some(b => b.data.category === 'actions')
    const hasErrorHandler = blocks.some(b => b.type === 'error_handler')

    if (!hasTrigger && blocks.length > 0) missing.push('trigger')
    if (!hasAction && hasTrigger) missing.push('action')
    if (blocks.length > 3 && !hasErrorHandler) missing.push('error_handler')

    return missing
  }

  // ==================== ACTION EXECUTION ====================

  executePendingAction(actionId: string): boolean {
    const action = this.context.pendingActions.find(a => a.id === actionId)
    if (action) {
      action.action()
      this.context.pendingActions = this.context.pendingActions.filter(a => a.id !== actionId)
      return true
    }
    return false
  }

  getPendingActions() {
    return this.context.pendingActions
  }

  // ==================== PROACTIVE CANVAS MANIPULATION ====================

  autoArrangeBlocks(blocks: Block[], _connections: BlockConnection[], storeActions: StoreActions) {
    // Simple auto-arrangement: arrange in a grid
    blocks.forEach((block, index) => {
      const row = Math.floor(index / 4)
      const col = index % 4
      storeActions.updateBlock(block.id, {
        position: { x: col * 200 + 100, y: row * 150 + 100 },
      })
    })
  }

  autoConnectBlocks(blocks: Block[], connections: BlockConnection[], storeActions: StoreActions) {
    // Auto-connect triggers to actions
    const triggers = blocks.filter(b => b.data.category === 'triggers')
    const actions = blocks.filter(b => b.data.category === 'actions')

    triggers.forEach(trigger => {
      actions.forEach(action => {
        if (!connections.some(c => c.source === trigger.id && c.target === action.id)) {
          storeActions.addConnection({
            id: `auto_${trigger.id}_${action.id}`,
            source: trigger.id,
            target: action.id,
            sourceHandle: 'output_0',
            targetHandle: 'input_0',
          })
        }
      })
    })
  }

  fillDefaultValues(blocks: Block[], storeActions: StoreActions) {
    blocks.forEach(block => {
      const definition = (globalThis as any).BLOCK_DEFINITIONS?.[block.type]
      if (definition) {
        const defaults: Record<string, any> = {}
        definition.properties.forEach((prop: any) => {
          if (prop.defaultValue !== undefined && block.data.properties[prop.key] === undefined) {
            defaults[prop.key] = prop.defaultValue
          }
        })
        if (Object.keys(defaults).length > 0) {
          storeActions.updateBlock(block.id, {
            data: { properties: { ...block.data.properties, ...defaults } },
          })
        }
      }
    })
  }

  // ==================== NATURAL LANGUAGE PARSING ====================

  parseBlockFromMessage(
    message: string
  ): { type: BlockType; properties: Record<string, any> } | null {
    const lower = message.toLowerCase()

    // Parse slash command
    const slashMatch = message.match(/\/(\w+)/)
    if (slashMatch) {
      return {
        type: 'command_slash' as BlockType,
        properties: {
          name: slashMatch[1],
          description: `/${slashMatch[1]} command`,
        },
      }
    }

    // Parse kick command
    if (lower.includes('kick')) {
      return {
        type: 'action_kick' as BlockType,
        properties: {
          reason: 'Kicked by moderator',
        },
      }
    }

    // Parse ban command
    if (lower.includes('ban')) {
      return {
        type: 'action_ban' as BlockType,
        properties: {
          reason: 'Banned by moderator',
        },
      }
    }

    return null
  }

  // ==================== CONTEXT-AWARE SUGGESTIONS ====================

  generateContextSuggestions(
    blocks: Block[],
    _connections: BlockConnection[]
  ): AIResponse['suggestions'] {
    const suggestions: AIResponse['suggestions'] = []

    const hasKick = blocks.some(b => b.type === 'action_kick')
    const hasPermissionCheck = blocks.some(b => b.type === 'check_permissions')

    if (hasKick && !hasPermissionCheck) {
      suggestions.push({
        id: 'add_permission_check',
        title: 'Add Permission Check',
        description: 'Your kick command needs permission validation',
        blocks: [
          {
            type: 'check_permissions',
            properties: { permission: 'KICK_MEMBERS' },
          },
        ],
      })
    }

    const hasTrigger = blocks.some(b => b.data.category === 'triggers')
    if (!hasTrigger && blocks.length > 0) {
      suggestions.push({
        id: 'add_trigger',
        title: 'Add a Trigger',
        description: 'Your bot needs a trigger to start',
        blocks: [
          {
            type: 'command_slash',
            properties: { name: 'hello', description: 'A simple hello command' },
          },
        ],
      })
    }

    return suggestions
  }

  // ==================== SMART RESPONSE GENERATION ====================

  async generateResponse(
    userMessage: string,
    blocks: Block[],
    connections: BlockConnection[],
    storeActions: StoreActions
  ): Promise<AIResponse> {
    // Update context
    this.context.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    })

    this.updateCanvasContext(blocks, connections)
    const intent = this.classifyIntent(userMessage)
    this.context.currentIntent = intent

    let response: AIResponse

    switch (intent) {
      case 'greeting':
        response = this.handleGreeting()
        break
      case 'build_bot':
        response = this.handleBuildBot(userMessage, blocks)
        break
      case 'help':
        response = this.handleHelp()
        break
      case 'debug':
        response = this.handleDebug(blocks, connections)
        break
      case 'optimize':
        response = this.handleOptimize(blocks, connections)
        break
      case 'explain':
        response = this.handleExplain(userMessage)
        break
      case 'question':
        response = this.handleQuestion(userMessage)
        break
      default:
        response = this.handleUnknown(userMessage)
    }

    // Add to message history
    this.context.messages.push({
      role: 'assistant',
      content: response.message,
      timestamp: Date.now(),
    })

    // Proactive canvas manipulation
    if (blocks.length > 5 && connections.length === 0) {
      this.autoConnectBlocks(blocks, connections, storeActions)
    }

    this.fillDefaultValues(blocks, storeActions)

    // Add context-aware suggestions
    const contextSuggestions = this.generateContextSuggestions(blocks, connections)
    if (contextSuggestions && contextSuggestions.length > 0) {
      response.suggestions = [...(response.suggestions || []), ...contextSuggestions]
    }

    // Parse natural language for block creation
    const parsedBlock = this.parseBlockFromMessage(userMessage)
    if (parsedBlock) {
      const actionId = `create_${parsedBlock.type}_${Date.now()}`
      response.pendingAction = {
        id: actionId,
        description: `Create a ${parsedBlock.type} block`,
        action: () => {
          storeActions.addBlock(
            parsedBlock.type,
            { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
            parsedBlock.properties
          )
        },
      }
      this.context.pendingActions.push({
        id: actionId,
        description: response.pendingAction.description,
        action: response.pendingAction.action,
        timestamp: Date.now(),
      })
    }

    return response
  }

  // ==================== INTENT HANDLERS ====================

  private handleGreeting(): AIResponse {
    const greetings = [
      'Hey! 👋 Ready to build something awesome?',
      'Hi there! What bot are we creating today?',
      "Hello! I'm here to help you build the perfect Discord bot. What's your vision?",
      "Hey! Let's make an amazing bot together. What do you need?",
    ]

    return {
      message: greetings[Math.floor(Math.random() * greetings.length)] as string,
      quickActions: [
        'Build a moderation bot',
        'Create a welcome system',
        'Make a music bot',
        'Show me the basics',
      ],
    }
  }

  private handleBuildBot(message: string, _blocks: Block[]): AIResponse {
    const lower = message.toLowerCase()

    // Detect bot type
    if (/moderation|mod|kick|ban/.test(lower)) {
      return {
        message:
          'Perfect! A moderation bot needs a few key components:\n\n' +
          '1. **Slash Command** (e.g., /kick, /ban)\n' +
          '2. **Permission Check** (admin/moderator only)\n' +
          '3. **Mod Action** (kick/ban/timeout)\n' +
          '4. **Confirmation Message**\n\n' +
          'Want me to add these blocks to your canvas?',
        suggestions: [
          {
            id: 'mod-bot',
            title: 'Moderation Bot Template',
            description: 'Complete kick command with permissions',
            blocks: [
              {
                type: 'command_slash' as const,
                properties: { name: 'kick', description: 'Kick a member' },
              },
              { type: 'check_permissions' as const, properties: { permission: 'KICK_MEMBERS' } },
              { type: 'action_kick' as const, properties: { reason: 'Kicked by moderator' } },
              {
                type: 'action_reply' as const,
                properties: { content: 'Member kicked successfully!', ephemeral: true },
              },
            ],
          },
        ],
        quickActions: ['Add template', 'Customize it', 'Show me another example'],
      }
    }

    if (/welcome|greet|join/.test(lower)) {
      return {
        message:
          "A welcome bot! Great choice for community building. Here's what you need:\n\n" +
          '1. **Member Join Event** (triggers when someone joins)\n' +
          '2. **Send Message** (to welcome channel)\n' +
          '3. **Add Role** (optional: auto-role)\n\n' +
          'Sound good?',
        suggestions: [
          {
            id: 'welcome-bot',
            title: 'Welcome Bot Template',
            description: 'Greet new members with style',
            blocks: [
              { type: 'event_member_join' as const, properties: {} },
              {
                type: 'send_message' as const,
                properties: { content: 'Welcome {{user}}! Glad to have you here!' },
              },
              { type: 'member_add_role' as const, properties: { role: 'Member' } },
            ],
          },
        ],
      }
    }

    // Generic build response
    return {
      message:
        "I'm ready to help you build that bot! Can you tell me more about what you want it to do?\n\n" +
        'For example:\n' +
        '- What should trigger it? (slash command, message, user joining, etc.)\n' +
        '- What actions should it perform?\n' +
        '- Any special requirements?',
      quickActions: ['Add a slash command', 'Add an event listener', 'Show popular templates'],
    }
  }

  private handleHelp(): AIResponse {
    return {
      message:
        "I'm here to help! Here's what I can do:\n\n" +
        "🤖 **Build Bots**: Tell me what you want, I'll guide you step-by-step\n" +
        "🐛 **Debug Issues**: Describe the problem, I'll analyze your canvas\n" +
        "⚡ **Optimize**: I'll suggest improvements for better performance\n" +
        '📚 **Explain**: Ask about any block or Discord concept\n\n' +
        'What would you like help with?',
      quickActions: [
        'How do slash commands work?',
        "What's the best way to handle errors?",
        'Show me moderation examples',
        'Explain permissions',
      ],
    }
  }

  private handleDebug(blocks: Block[], connections: BlockConnection[]): AIResponse {
    const issues: string[] = []

    // Check for orphaned blocks
    const connectedIds = new Set([
      ...connections.map(c => c.source),
      ...connections.map(c => c.target),
    ])

    const orphans = blocks.filter(b => b.data.category !== 'triggers' && !connectedIds.has(b.id))

    if (orphans.length > 0) {
      issues.push(`🔴 **${orphans.length} orphaned block(s)** - not connected to anything`)
    }

    // Check for missing triggers
    const triggers = blocks.filter(b => b.data.category === 'triggers')
    if (triggers.length === 0 && blocks.length > 0) {
      issues.push("🔴 **No trigger found** - your bot won't start without one")
    }

    // Check for dead ends
    const deadEnds = triggers.filter(t => !connections.some(c => c.source === t.id))
    if (deadEnds.length > 0) {
      issues.push(`⚠️ **${deadEnds.length} trigger(s) lead nowhere** - add actions after them`)
    }

    if (issues.length === 0) {
      return {
        message:
          "✅ **Looking good!** I don't see any major issues with your setup.\n\n" +
          'Want me to suggest some optimizations or best practices?',
        quickActions: ['Optimize my bot', 'Add error handling', 'Show best practices'],
      }
    }

    return {
      message:
        'I found some issues:\n\n' + issues.join('\n\n') + '\n\n' + 'Want me to help fix these?',
      quickActions: ['Fix automatically', 'Guide me through fixes', 'Explain the issues'],
    }
  }

  private handleOptimize(blocks: Block[], _connections: BlockConnection[]): AIResponse {
    const suggestions: string[] = []

    // Check for error handling
    const hasErrorHandler = blocks.some(b => b.type === 'error_handler')
    if (!hasErrorHandler && blocks.length > 3) {
      suggestions.push('➕ **Add error handling** - Prevent crashes with try/catch blocks')
    }

    // Check for permission checks before mod actions
    const modBlocks = blocks.filter(b => b.data.category === 'moderation')
    const hasPermCheck = blocks.some(b => b.type === 'check_permissions')
    if (modBlocks.length > 0 && !hasPermCheck) {
      suggestions.push('🔒 **Add permission checks** - Secure your moderation commands')
    }

    // Check for ephemeral replies
    const replies = blocks.filter(b => b.type === 'action_reply')
    const nonEphemeral = replies.filter(b => !b.data.properties.ephemeral)
    if (nonEphemeral.length > 0) {
      suggestions.push('👁️ **Use ephemeral replies** - Keep utility responses private')
    }

    if (suggestions.length === 0) {
      return {
        message:
          '🌟 **Your bot looks well-optimized!**\n\n' +
          "You're following best practices. Great job!",
        quickActions: ['What else can I improve?', 'Show advanced features'],
      }
    }

    return {
      message: 'Here are some optimization suggestions:\n\n' + suggestions.join('\n\n'),
      quickActions: ['Apply all suggestions', 'Tell me more', 'Show one at a time'],
    }
  }

  private handleExplain(message: string): AIResponse {
    const lower = message.toLowerCase()

    const topics: Record<string, string> = {
      'slash command':
        "**Slash Commands** are Discord's modern way of handling bot commands.\n\n" +
        'They:\n' +
        "✅ Show up in Discord's UI\n" +
        '✅ Have built-in validation\n' +
        '✅ Support options (string, number, user, etc.)\n' +
        '✅ Can be restricted by permissions\n\n' +
        'Use the `/` block to create one!',

      permission:
        '**Permissions** control who can use commands or perform actions.\n\n' +
        'Common ones:\n' +
        '- `ADMINISTRATOR` - Full control\n' +
        '- `KICK_MEMBERS` - Kick users\n' +
        '- `BAN_MEMBERS` - Ban users\n' +
        '- `MANAGE_MESSAGES` - Delete messages\n\n' +
        'Always check permissions before mod actions!',

      event:
        '**Events** are triggers that fire when something happens in Discord.\n\n' +
        'Examples:\n' +
        '- `messageCreate` - New message sent\n' +
        '- `guildMemberAdd` - User joins server\n' +
        '- `interactionCreate` - Button/menu used\n\n' +
        'Use Event Listener blocks to handle them!',

      embed:
        '**Embeds** are rich, formatted messages.\n\n' +
        'They can have:\n' +
        '- Colored side bar\n' +
        '- Title & description\n' +
        '- Fields (key-value pairs)\n' +
        '- Images & thumbnails\n' +
        '- Footer text\n\n' +
        'Perfect for status updates and announcements!',
    }

    for (const [key, explanation] of Object.entries(topics)) {
      if (lower.includes(key.toLowerCase())) {
        return {
          message: explanation,
          quickActions: ['Show me an example', 'What else can I learn?', 'Add this to my bot'],
        }
      }
    }

    return {
      message:
        'I can explain Discord concepts, blocks, and best practices!\n\n' +
        'Try asking about:\n' +
        '- Slash commands\n' +
        '- Permissions\n' +
        '- Events\n' +
        '- Embeds\n' +
        '- Error handling\n\n' +
        'What would you like to know?',
      quickActions: ['Explain slash commands', 'What are permissions?', 'How do events work?'],
    }
  }

  private handleQuestion(message: string): AIResponse {
    // Simple keyword-based QA
    const lower = message.toLowerCase()

    if (/how (do|to|can)/.test(lower)) {
      return {
        message:
          'Great question! The best way to learn is by doing.\n\n' +
          'Would you like me to:\n' +
          '1. Show you a step-by-step guide\n' +
          '2. Build an example together\n' +
          '3. Explain the concept first',
        quickActions: ['Step-by-step guide', 'Build example', 'Explain first'],
      }
    }

    return {
      message:
        'Interesting question! Can you give me a bit more context?\n\n' +
        'For example:\n' +
        '- What are you trying to achieve?\n' +
        '- What have you tried so far?\n' +
        '- Is this about a specific block or concept?',
      quickActions: ["I'm stuck on...", 'I want to build...', 'Help me understand...'],
    }
  }

  private handleUnknown(_message: string): AIResponse {
    return {
      message:
        "I'm not quite sure what you're asking, but I'm here to help!\n\n" +
        'Could you rephrase that? You can ask me to:\n' +
        '- Build something ("make a moderation bot")\n' +
        '- Debug issues ("my bot isn\'t working")\n' +
        '- Explain concepts ("what are slash commands?")\n' +
        '- Optimize your bot ("make it better")',
      quickActions: ['Show me what I can do', 'Build a bot', 'Fix my bot', 'Teach me'],
    }
  }

  // ==================== UTILITY ====================

  getConversationHistory(): Message[] {
    return this.context.messages
  }

  resetConversation(): void {
    this.context.messages = []
    this.context.currentIntent = 'unknown'
  }
}
