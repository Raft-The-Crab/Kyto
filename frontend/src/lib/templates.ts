import { CanvasState } from '@/types'

export interface BotTemplate {
  id: string
  name: string
  description: string
  category: 'moderation' | 'utility' | 'fun' | 'social' | 'ai'
  downloads: string
  rating: number
  canvas: CanvasState
}

export const TEMPLATES: BotTemplate[] = [
  {
    id: 'tpl_welcome',
    name: 'Welcome Suite Pro',
    description:
      'Greets new members with beautiful embeds and assigns starter roles automatically.',
    category: 'social',
    downloads: '14.2k',
    rating: 4.9,
    canvas: {
      blocks: [],
      connections: [],
      selectedBlockId: null,
      viewportPosition: { x: 0, y: 0, zoom: 1 },
    },
  },
  {
    id: 'tpl_mod',
    name: 'Advanced Moderation',
    description:
      'Slash commands for ban, kick, and mute with built-in audit logging and reason checks.',
    category: 'moderation',
    downloads: '8.4k',
    rating: 4.8,
    canvas: {
      blocks: [],
      connections: [],
      selectedBlockId: null,
      viewportPosition: { x: 0, y: 0, zoom: 1 },
    },
  },
  {
    id: 'tpl_economy',
    name: 'Global Economy',
    description: 'Work, daily, and balance commands using global variables for persistence.',
    category: 'fun',
    downloads: '6.1k',
    rating: 4.7,
    canvas: {
      blocks: [],
      connections: [],
      selectedBlockId: null,
      viewportPosition: { x: 0, y: 0, zoom: 1 },
    },
  },
  {
    id: 'tpl_ai_chat',
    name: 'GPT-4 Chat Bridge',
    description: 'Integrates OpenAI API into Discord for smart, contextual conversations.',
    category: 'ai',
    downloads: '2.5k',
    rating: 5.0,
    canvas: {
      blocks: [],
      connections: [],
      selectedBlockId: null,
      viewportPosition: { x: 0, y: 0, zoom: 1 },
    },
  },
  {
    id: 'tpl_ticket',
    name: 'Ticket Support Logic',
    description: 'Creation of persistent support channels with closure and transcript archiving.',
    category: 'utility',
    downloads: '4.9k',
    rating: 4.6,
    canvas: {
      blocks: [],
      connections: [],
      selectedBlockId: null,
      viewportPosition: { x: 0, y: 0, zoom: 1 },
    },
  },
  {
    id: 'tpl_crypto',
    name: 'Crypto & Stock Price',
    description: 'Real-time price lookups using external CoinGecko and Yahoo Finance APIs.',
    category: 'utility',
    downloads: '3.1k',
    rating: 4.5,
    canvas: {
      blocks: [],
      connections: [],
      selectedBlockId: null,
      viewportPosition: { x: 0, y: 0, zoom: 1 },
    },
  },
]
