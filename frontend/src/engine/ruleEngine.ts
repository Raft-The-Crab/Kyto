export type RuleTrigger =
  | 'message_contains'
  | 'message_equals'
  | 'message_regex'
  | 'user_join'
  | 'user_leave'
  | 'message_delete'
  | 'reaction_add'
  | 'button_click'
  | 'select_menu'
  | 'modal_submit'
  | 'role_add'
  | 'role_remove'
  | 'channel_create'
  | 'ai_intent';

export type RuleAction =
  | 'send_reply'
  | 'send_message'
  | 'send_dm'
  | 'send_embed'
  | 'add_role'
  | 'remove_role'
  | 'delete_message'
  | 'kick_user'
  | 'ban_user'
  | 'timeout_user'
  | 'create_thread'
  | 'pin_message'
  | 'add_reaction';

export interface Rule {
  id: string;
  name: string;
  trigger: {
    type: RuleTrigger;
    value: string;
    options?: Record<string, any>;
  };
  conditions?: {
    type: 'permission' | 'role' | 'channel' | 'user';
    value: string;
  }[];
  actions: {
    type: RuleAction;
    properties: Record<string, any>;
  }[];
  enabled: boolean;
}

export class RuleEngine {
  /**
   * Evaluate a message/event against all rules
   */
  static evaluate(
    input: string,
    rules: Rule[],
    context?: {
      userId?: string;
      channelId?: string;
      roles?: string[];
      permissions?: string[];
    }
  ): RuleAction[] | null {
    const matchingRules = rules.filter((rule) => {
      if (!rule.enabled) return false;

      // Check trigger
      const triggerMatches = this.evaluateTrigger(rule.trigger, input, context);
      if (!triggerMatches) return false;

      // Check conditions
      if (rule.conditions && rule.conditions.length > 0) {
        return rule.conditions.every((condition) =>
          this.evaluateCondition(condition, context)
        );
      }

      return true;
    });

    if (matchingRules.length === 0) return null;

    // Consolidate all actions from matching rules
    return matchingRules.flatMap((rule) => rule.actions.map((a) => a.type));
  }

  /**
   * Evaluate a single trigger
   */
  private static evaluateTrigger(
    trigger: Rule['trigger'],
    input: string,
    _context?: any
  ): boolean {
    const msg = input.toLowerCase();

    switch (trigger.type) {
      case 'message_contains':
        return msg.includes(trigger.value.toLowerCase());

      case 'message_equals':
        return msg === trigger.value.toLowerCase();

      case 'message_regex':
        try {
          const regex = new RegExp(trigger.value, 'i');
          return regex.test(input);
        } catch {
          return false;
        }

      case 'user_join':
      case 'user_leave':
      case 'message_delete':
      case 'reaction_add':
      case 'button_click':
      case 'select_menu':
      case 'modal_submit':
      case 'role_add':
      case 'role_remove':
      case 'channel_create':
        // These are event-based, always match if the event type is correct
        return true;

      case 'ai_intent':
        // Enhanced AI intent matching
        const intentKeywords: Record<string, string[]> = {
          spam: ['spam', 'flood', 'repeat', 'advertising', 'scam'],
          toxic: ['toxic', 'harassment', 'abuse', 'insult', 'threat'],
          raid: ['raid', 'attack', 'mass join', 'bot'],
          help: ['help', 'support', 'stuck', 'question'],
          greeting: ['hi', 'hello', 'hey', 'greetings'],
        };

        for (const [intent, keywords] of Object.entries(intentKeywords)) {
          if (keywords.some((k) => msg.includes(k))) {
            return trigger.value === intent || trigger.value === 'any';
          }
        }

        // Fallback: long messages might be spam
        if (input.length > 200) {
          return trigger.value === 'spam' || trigger.value === 'any';
        }

        return false;

      default:
        return false;
    }
  }

  /**
   * Evaluate a condition
   */
  private static evaluateCondition(
    condition: NonNullable<Rule['conditions']>[0],
    context?: any
  ): boolean {
    if (!context) return false;

    switch (condition.type) {
      case 'permission':
        return context.permissions?.includes(condition.value) ?? false;

      case 'role':
        return context.roles?.includes(condition.value) ?? false;

      case 'channel':
        return context.channelId === condition.value;

      case 'user':
        return context.userId === condition.value;

      default:
        return false;
    }
  }

  /**
   * Simulate rule response for testing
   */
  static simulateResponse(
    input: string,
    rules: Rule[],
    context?: any
  ): string {
    const actions = this.evaluate(input, rules, context);
    if (!actions) return 'No rules matched this input.';

    const actionDescriptions: Record<RuleAction, string> = {
      send_reply: 'Reply to message',
      send_message: 'Send message to channel',
      send_dm: 'Send private message to user',
      send_embed: 'Send embedded message',
      add_role: 'Add role to user',
      remove_role: 'Remove role from user',
      delete_message: 'Delete message',
      kick_user: 'Kick user from server',
      ban_user: 'Ban user from server',
      timeout_user: 'Timeout user',
      create_thread: 'Create thread',
      pin_message: 'Pin message',
      add_reaction: 'Add reaction',
    };

    const descriptions = actions.map((a) => actionDescriptions[a] || a);
    return `[Simulation] Triggered actions:\n${descriptions.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}`;
  }

  /**
   * Get available triggers with descriptions
   */
  static getAvailableTriggers(): { type: RuleTrigger; description: string }[] {
    return [
      { type: 'message_contains', description: 'Message contains text' },
      { type: 'message_equals', description: 'Message equals exact text' },
      { type: 'message_regex', description: 'Message matches regex pattern' },
      { type: 'user_join', description: 'User joins server' },
      { type: 'user_leave', description: 'User leaves server' },
      { type: 'message_delete', description: 'Message is deleted' },
      { type: 'reaction_add', description: 'Reaction added to message' },
      { type: 'button_click', description: 'Button is clicked' },
      { type: 'select_menu', description: 'Select menu used' },
      { type: 'modal_submit', description: 'Modal form submitted' },
      { type: 'role_add', description: 'Role added to user' },
      { type: 'role_remove', description: 'Role removed from user' },
      { type: 'channel_create', description: 'Channel created' },
      { type: 'ai_intent', description: 'AI detects intent' },
    ];
  }

  /**
   * Get available actions with descriptions
   */
  static getAvailableActions(): { type: RuleAction; description: string }[] {
    return [
      { type: 'send_reply', description: 'Reply to interaction' },
      { type: 'send_message', description: 'Send message to channel' },
      { type: 'send_dm', description: 'Send private message' },
      { type: 'send_embed', description: 'Send rich embed message' },
      { type: 'add_role', description: 'Add role to user' },
      { type: 'remove_role', description: 'Remove role from user' },
      { type: 'delete_message', description: 'Delete message' },
      { type: 'kick_user', description: 'Kick user from server' },
      { type: 'ban_user', description: 'Ban user from server' },
      { type: 'timeout_user', description: 'Timeout user' },
      { type: 'create_thread', description: 'Create thread' },
      { type: 'pin_message', description: 'Pin message' },
      { type: 'add_reaction', description: 'React to message' },
    ];
  }
}
