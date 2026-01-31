export const BOT_PATTERNS = {
  moderation: {
    label: 'Moderation System',
    description: 'A complete moderation system with kick, ban, and permission checks.',
    blocks: [
      {
        type: 'command_slash',
        properties: { name: 'kick', description: 'Kick a member' },
        offset: { x: 0, y: 0 },
      },
      {
        type: 'check_permissions',
        properties: { permission: 'KickMembers' },
        offset: { x: 250, y: 0 },
      },
      {
        type: 'action_kick',
        properties: { reason: 'Kicked by moderator' },
        offset: { x: 500, y: -50 },
      },
      {
        type: 'action_reply',
        properties: { content: 'Member kicked!', ephemeral: true },
        offset: { x: 500, y: 50 },
      },
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2, handle: 'true' },
      { from: 1, to: 3, handle: 'false' },
    ],
  },
  welcome: {
    label: 'Welcome Bot',
    description: 'Greet new members and assign a starting role.',
    blocks: [
      { type: 'event_member_join', properties: {}, offset: { x: 0, y: 0 } },
      {
        type: 'send_message',
        properties: { content: 'Welcome to the server, {{user}}!' },
        offset: { x: 250, y: 0 },
      },
      { type: 'action_role_add', properties: { role_name: 'Member' }, offset: { x: 500, y: 0 } },
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
    ],
  },
  ai_chat: {
    label: 'AI Chat Bot',
    description: 'An AI-powered chat bot that responds to messages.',
    blocks: [
      { type: 'event_message_create', properties: {}, offset: { x: 0, y: 0 } },
      {
        type: 'condition_check',
        properties: { condition: '!message.author.bot' },
        offset: { x: 250, y: 0 },
      },
      {
        type: 'ai_response',
        properties: { prompt: '{{message.content}}' },
        offset: { x: 500, y: 0 },
      },
      {
        type: 'action_reply',
        properties: { content: '{{ai.response}}' },
        offset: { x: 750, y: 0 },
      },
    ],
    connections: [
      { from: 0, to: 1 },
      { from: 1, to: 2, handle: 'true' },
      { from: 2, to: 3 },
    ],
  },
}
