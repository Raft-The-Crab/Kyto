export type RuleTrigger = 'message_contains' | 'message_equals' | 'user_join' | 'ai_intent'
export type RuleAction = 'send_reply' | 'add_role' | 'delete_message' | 'kick_user'

export interface Rule {
  id: string
  name: string
  trigger: {
    type: RuleTrigger
    value: string
  }
  actions: {
    type: RuleAction
    properties: Record<string, any>
  }[]
  enabled: boolean
}

export class RuleEngine {
  static evaluate(message: string, rules: Rule[]): RuleAction[] | null {
    const matchingRules = rules.filter(rule => {
      if (!rule.enabled) return false

      switch (rule.trigger.type) {
        case 'message_contains':
          return message.toLowerCase().includes(rule.trigger.value.toLowerCase())
        case 'message_equals':
          return message.toLowerCase() === rule.trigger.value.toLowerCase()
        case 'ai_intent':
          // Mock AI intent matching for now
          return message.length > 5
        default:
          return false
      }
    })

    if (matchingRules.length === 0) return null

    // Consolidate all actions from matching rules
    return matchingRules.flatMap(rule => rule.actions.map(a => a.type))
  }

  static simulateResponse(message: string, rules: Rule[]): string {
    const actions = this.evaluate(message, rules)
    if (!actions) return 'No rules matched this input.'

    return `[Simulation] The following actions would trigger: ${actions.join(', ')}`
  }
}
