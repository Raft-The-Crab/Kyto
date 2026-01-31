import { Block, BlockConnection, BlockType } from '@/types'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { pipeline, env } from '@xenova/transformers'
import { BOT_PATTERNS } from './prompts'

// Configure environment for browser
env.allowLocalModels = false
env.useBrowserCache = true

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
    blocks?: Array<{ type: string; properties: Record<string, unknown> }>
  }>
}

export interface AIResponse {
  message: string
  suggestions?: Array<{
    id: string
    title: string
    description: string
    blocks: Array<{ type: string; properties: Record<string, unknown> }>
  }>
  quickActions?: string[]
  pendingAction?: {
    id: string
    description: string
    action: () => void
    blocks?: Array<{ type: string; properties: Record<string, unknown> }>
  }
}

export interface StoreActions {
  addBlock: (
    type: BlockType,
    position: { x: number; y: number },
    properties?: Record<string, unknown>
  ) => void
  removeBlock: (id: string) => void
  updateBlock: (id: string, updates: Record<string, unknown>) => void
  addConnection: (connection: BlockConnection) => void
  removeConnection: (id: string) => void
  clearCanvas: () => void
  duplicateBlock: (id: string) => void
  undo: () => void
  redo: () => void
}

// ==================== ADVANCED AI ENGINE ====================

export class AdvancedAI {
  private context: ConversationContext
  private classifier: any = null
  private loading = false

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

  async loadModel() {
    if (this.classifier || this.loading) return
    this.loading = true
    try {
      this.classifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-mnli',
        { quantized: true }
      )
      console.log('AI Model loaded successfully')
    } catch (error) {
      console.error('Failed to load AI model:', error)
    } finally {
      this.loading = false
    }
  }

  // ==================== INTENT CLASSIFICATION ====================

  private async classifyIntent(message: string): Promise<Intent> {
    const lower = message.toLowerCase()

    if (this.classifier) {
      try {
        const result = await this.classifier(message)
        console.log('NLI Result:', result)
      } catch (e) {
        console.warn('Transformer classification failed')
      }
    }

    if (/(create|add|make|put|build) (a |an )?(\w+)( (block|command|event|system))?/i.test(lower))
      return 'build_bot'
    if (/(how|what|explain|tell me|what is) (a |an )?(\w+)/i.test(lower)) return 'explain'
    if (/(fix|broken|not working|error|bug|debug)/i.test(lower)) return 'debug'
    if (/(better|faster|optimize|improve|best way)/i.test(lower)) return 'optimize'
    if (/(hello|hi|hey|greetings|sup|yo)/i.test(lower)) return 'greeting'
    if (/(help|assist|guide)/i.test(lower)) return 'help'

    return 'unknown'
  }

  // ==================== CONTEXT ANALYSIS ====================

  updateCanvasContext(blocks: Block[], connections: BlockConnection[]) {
    this.context.canvasAnalysis = {
      blockCount: blocks.length,
      hasErrors: blocks.some(b => b.data.errors.length > 0),
      missingComponents: this.detectMissingComponents(blocks, connections),
    }

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
    if (!hasTrigger && blocks.length > 0) missing.push('trigger')
    if (!hasAction && hasTrigger) missing.push('action')
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

  autoConnectBlocks(blocks: Block[], connections: BlockConnection[], storeActions: StoreActions) {
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
      const definition = BLOCK_DEFINITIONS[block.type]
      if (definition) {
        const defaults: Record<string, unknown> = {}
        definition.properties.forEach(prop => {
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

  // ==================== GENERATIVE LOGIC ====================

  private handlePatternMatch(lower: string): AIResponse | null {
    for (const [key, pattern] of Object.entries(BOT_PATTERNS)) {
      if (lower.includes(key.replace('_', ' ')) || lower.includes(key)) {
        return {
          message: `I can build a **${pattern.label}** for you! ${pattern.description} Shall I proceed?`,
          pendingAction: {
            id: `pattern_${key}_${Date.now()}`,
            description: `Build ${pattern.label}`,
            blocks: pattern.blocks,
            action: () => {
              // Action logic handled by AIHelper
            },
          },
        }
      }
    }
    return null
  }

  // ==================== SMART RESPONSE GENERATION ====================

  async generateResponse(
    userMessage: string,
    blocks: Block[],
    connections: BlockConnection[],
    storeActions: StoreActions
  ): Promise<AIResponse> {
    const lower = userMessage.toLowerCase()

    this.context.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    })

    this.updateCanvasContext(blocks, connections)
    const intent = await this.classifyIntent(userMessage)
    this.context.currentIntent = intent

    // Try pattern matching first for "build" intent
    if (intent === 'build_bot') {
      const patternMatch = this.handlePatternMatch(lower)
      if (patternMatch) {
        this.context.pendingActions.push({
          id: patternMatch.pendingAction!.id,
          description: patternMatch.pendingAction!.description,
          action: patternMatch.pendingAction!.action,
          timestamp: Date.now(),
          blocks: patternMatch.pendingAction!.blocks,
        })
        return patternMatch
      }
    }

    let response: AIResponse
    switch (intent) {
      case 'greeting':
        response = this.handleGreeting()
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

    this.context.messages.push({
      role: 'assistant',
      content: response.message,
      timestamp: Date.now(),
    })

    if (blocks.length > 5 && connections.length === 0) {
      this.autoConnectBlocks(blocks, connections, storeActions)
    }

    this.fillDefaultValues(blocks, storeActions)

    return response
  }

  // ==================== HANDLERS ====================

  private handleGreeting(): AIResponse {
    return {
      message: 'Hey! I am your Kyto AI Assistant. What shall we build today?',
      quickActions: ['Build a moderation bot', 'Create a welcome system', 'Explain slash commands'],
    }
  }

  private handleHelp(): AIResponse {
    return {
      message:
        'I can help you build, debug, and optimize your Discord bots. Try asking "make a moderation system" or "how do I handle errors?"',
      quickActions: ['Show examples', 'Debug my canvas', 'Optimize performance'],
    }
  }

  private handleDebug(blocks: Block[], connections: BlockConnection[]): AIResponse {
    const issues: string[] = []
    const connectedIds = new Set([
      ...connections.map(c => c.source),
      ...connections.map(c => c.target),
    ])
    const orphans = blocks.filter(b => b.data.category !== 'triggers' && !connectedIds.has(b.id))

    if (orphans.length > 0) issues.push(`Found ${orphans.length} orphaned blocks.`)
    if (!blocks.some(b => b.data.category === 'triggers') && blocks.length > 0)
      issues.push("You're missing a trigger block!")

    return {
      message:
        issues.length > 0
          ? `I found some issues:\n- ${issues.join('\n- ')}`
          : 'Everything looks perfectly connected! 🚀',
      quickActions: ['Auto-arrange', 'Check for optimizations'],
    }
  }

  private handleOptimize(blocks: Block[], _connections: BlockConnection[]): AIResponse {
    const suggestions: string[] = []
    if (!blocks.some(b => b.type === 'error_handler') && blocks.length > 3)
      suggestions.push('Add an error handler to prevent bot crashes.')
    if (
      blocks.some(b => b.data.category === 'moderation') &&
      !blocks.some(b => b.type === 'check_permissions')
    )
      suggestions.push('Security: Add permission checks before mod actions.')

    return {
      message:
        suggestions.length > 0
          ? `Optimizations recommended:\n- ${suggestions.join('\n- ')}`
          : 'Your bot is highly optimized! ⚡',
      quickActions: ['Explain error handling', 'Add permission check'],
    }
  }

  private handleExplain(_message: string): AIResponse {
    const lower = _message.toLowerCase()
    if (lower.includes('slash'))
      return {
        message: 'Slash commands are built-in Discord commands that show up when you type `/`.',
      }
    if (lower.includes('permission'))
      return {
        message: 'Permissions control what users can do, like kicking or managing messages.',
      }
    return {
      message: 'I can explain Discord terms! Ask about slash commands, permissions, or embeds.',
    }
  }

  private handleQuestion(_message: string): AIResponse {
    return {
      message:
        "That's a good question! In Kyto, you connect blocks to define logic. What specific part are you curious about?",
    }
  }

  private handleUnknown(_message: string): AIResponse {
    return {
      message:
        "I'm not sure about that one, but I can help you build your bot! Try saying 'create a welcome bot'.",
    }
  }
}
