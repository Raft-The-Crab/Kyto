export const TEMPLATES = [
  {
    id: 'moderation-bot',
    name: 'Moderation System',
    description: 'Complete moderation suite with Kick, Ban, and Mute commands.',
    icon: 'Shield',
    color: 'emerald',
    language: 'discord.js',
    rating: 4.8,
    downloads: '2.5k',
    commands: [
      {
        name: 'kick',
        description: 'Kick a user from the server',
        blocks: [
          {
            type: 'command_slash',
            properties: { name: 'kick', description: 'Kick a user' },
            position: { x: 100, y: 100 },
          },
          {
            type: 'action_kick',
            properties: { reason: 'Violated rules' },
            position: { x: 400, y: 100 },
          },
          {
            type: 'action_reply',
            properties: { content: 'User has been kicked.', ephemeral: true },
            position: { x: 700, y: 100 },
          },
        ],
        connections: [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
        ],
      },
      {
        name: 'ban',
        description: 'Ban a user from the server',
        blocks: [
          {
            type: 'command_slash',
            properties: { name: 'ban', description: 'Ban a user' },
            position: { x: 100, y: 100 },
          },
          {
            type: 'action_ban',
            properties: { reason: 'Severe violation' },
            position: { x: 400, y: 100 },
          },
          {
            type: 'action_reply',
            properties: { content: 'User has been banned.', ephemeral: false },
            position: { x: 700, y: 100 },
          },
        ],
        connections: [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
        ],
      },
    ],
  },
  {
    id: 'economy-bot',
    name: 'Economy System',
    description: 'Currency system with Work, Balance, and Shop commands.',
    icon: 'Coins',
    color: 'amber',
    language: 'discord.js',
    rating: 4.9,
    downloads: '8.2k',
    commands: [
      {
        name: 'work',
        description: 'Earn coins by working',
        blocks: [
          {
            type: 'command_slash',
            properties: { name: 'work', description: 'Go to work' },
            position: { x: 100, y: 100 },
          },
          {
            type: 'random',
            properties: {},
            position: { x: 400, y: 100 },
          },
          {
            type: 'database_set',
            properties: {},
            position: { x: 700, y: 100 },
          },
          {
            type: 'action_reply',
            properties: { content: 'You worked and earned coins!', ephemeral: false },
            position: { x: 1000, y: 100 },
          },
        ],
        connections: [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
          { source: 2, target: 3 },
        ],
      },
      {
        name: 'balance',
        description: 'Check your wallet',
        blocks: [
          {
            type: 'command_slash',
            properties: { name: 'balance', description: 'Check balance' },
            position: { x: 100, y: 100 },
          },
          {
            type: 'database_get',
            properties: {},
            position: { x: 400, y: 100 },
          },
          {
            type: 'action_reply',
            properties: { content: 'Your balance is: ${balance}', ephemeral: true },
            position: { x: 700, y: 100 },
          },
        ],
        connections: [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
        ],
      },
    ],
  },
  {
    id: 'tickets-bot',
    name: 'Ticket System',
    description: 'Advanced support ticket system with buttons and channels.',
    icon: 'Ticket',
    color: 'indigo',
    language: 'discord.js',
    rating: 4.7,
    downloads: '1.1k',
    commands: [
      {
        name: 'setup-tickets',
        description: 'Create the ticket panel',
        blocks: [
          {
            type: 'command_slash',
            properties: { name: 'setup', description: 'Setup tickets' },
            position: { x: 100, y: 100 },
          },
          {
            type: 'send_embed',
            properties: {
              title: 'Support',
              description: 'Click below to open a ticket',
              color: '#5865F2',
            },
            position: { x: 400, y: 100 },
          },
          {
            type: 'add_button',
            properties: { label: 'Open Ticket', style: '1', customId: 'ticket_create' },
            position: { x: 700, y: 100 },
          },
        ],
        connections: [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
        ],
      },
    ],
  },
] as const
