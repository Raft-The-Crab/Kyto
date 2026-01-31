import { Block, BlockConnection } from '@/types'

export type RuleCategory = 'optimization' | 'security' | 'logic' | 'style' | 'accessibility'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface AnalysisResult {
  ruleId: string
  title: string
  description: string
  category: RuleCategory
  severity: Severity
  blockIds: string[]
  fixSuggestion?: string
}

export class HeuristicEngine {
  analyze(blocks: Block[], connections: BlockConnection[]): AnalysisResult[] {
    const results: AnalysisResult[] = []

    // 1. CHECK: Orphaned Blocks (Logic Gaps)
    const connectedSourceIds = new Set(connections.map(c => c.source))
    const connectedTargetIds = new Set(connections.map(c => c.target))

    blocks.forEach(block => {
      // Ignore trigger blocks, they don't need inputs
      if (block.data.category === 'triggers') return

      if (!connectedTargetIds.has(block.id)) {
        results.push({
          ruleId: 'orphaned-block',
          title: 'Unconnected Logic Block',
          description: `The block "${block.data.label}" is floating and won't execute.`,
          category: 'logic',
          severity: 'high',
          blockIds: [block.id],
          fixSuggestion: 'Connect a previous block to this one',
        })
      }
    })

    // 2. CHECK: Dead Ends (Missing Responses)
    blocks.forEach(block => {
      if (block.data.category === 'triggers' && !connectedSourceIds.has(block.id)) {
        results.push({
          ruleId: 'dead-end-trigger',
          title: 'Trigger Does Nothing',
          description: `The trigger "${block.data.label}" starts the flow but leads nowhere.`,
          category: 'logic',
          severity: 'medium',
          blockIds: [block.id],
          fixSuggestion: 'Add an action block (like Send Message) after this trigger',
        })
      }
    })

    // 3. CHECK: Infinite Loops (Optimization)
    // Basic cycle detection could be here, strict checks usually complex
    // Simple check: Self-referencing loops
    connections.forEach(conn => {
      if (conn.source === conn.target) {
        results.push({
          ruleId: 'infinite-loop-self',
          title: 'Infinite Loop Detected',
          description: 'A block connects to itself immediately.',
          category: 'optimization',
          severity: 'critical',
          blockIds: [conn.source],
          fixSuggestion: 'Remove the connection feeding back into the same block',
        })
      }
    })

    // 4. CHECK: Missing Permissions for Mod Actions (Security)
    const modBlocks = blocks.filter(b => b.data.category === 'moderation')
    const hasPermCheck = blocks.some(
      b => b.type === 'check_permissions' || b.type === 'check_bot_permissions'
    )

    if (modBlocks.length > 0 && !hasPermCheck) {
      results.push({
        ruleId: 'missing-perm-check',
        title: 'Unsafe Moderation Command',
        description: 'You have kick/ban actions but no permission checks.',
        category: 'security',
        severity: 'critical',
        blockIds: modBlocks.map(b => b.id),
        fixSuggestion: 'Add a "Check Permissions" block before the moderation action',
      })
    }

    // 5. CHECK: Ephemeral Replies (Style/Privacy)
    const replyBlocks = blocks.filter(b => b.type === 'action_reply')
    replyBlocks.forEach(block => {
      if (!block.data.properties['ephemeral']) {
        results.push({
          ruleId: 'public-reply-spam',
          title: 'Public Reply Considerations',
          description: 'This reply is public. Frequent usage might spam chat.',
          category: 'style',
          severity: 'low',
          blockIds: [block.id],
          fixSuggestion: 'Consider enabling "Ephemeral" (Hidden) property for utility commands',
        })
      }
    })

    // 6. CHECK: Hardcoded Values (Flexibility)
    const sendBlocks = blocks.filter(b => b.type === 'send_message')
    sendBlocks.forEach(block => {
      const channelId = block.data.properties['channel_id']
      if (channelId && /^\d+$/.test(channelId)) {
        // If it looks like a hardcoded ID
        results.push({
          ruleId: 'hardcoded-channel',
          title: 'Hardcoded Channel ID',
          description: 'Using a fixed Channel ID means this only works in one server/channel.',
          category: 'optimization',
          severity: 'medium',
          blockIds: [block.id],
          fixSuggestion: 'Use a variable or Option input for Channel ID to make it dynamic',
        })
      }
    })

    // 7. CHECK: Heavy Database Usage (Optimization)
    const dbBlocks = blocks.filter(b => b.data.category === 'data')
    if (dbBlocks.length > 5) {
      results.push({
        ruleId: 'heavy-db-usage',
        title: 'High Database Load',
        description: 'Many database operations detected in one flow.',
        category: 'optimization',
        severity: 'medium',
        blockIds: [],
        fixSuggestion:
          'Try to combine read/writes or use local variables if persistence is not needed',
      })
    }

    return results
  }
}
