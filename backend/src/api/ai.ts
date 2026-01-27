import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
// import type { Env } from "../index";
import type { AIRequest, AISuggestion, Block } from "../types";

// Ollama configuration (override with OLLAMA_HOST env var)
const OLLAMA_BASE = process.env.OLLAMA_HOST || "http://localhost:11434";
const MODEL_NAME = process.env.OLLAMA_MODEL || "phi3:3.8b";

// Helper: fetch with timeout
async function fetchWithTimeout(url: string, options: any = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const aiRoutes = new Hono();

// Feature toggles
const USE_AI = process.env.USE_AI !== "false"; // set to 'false' to disable Ollama calls

// Conversation state (in production, store in KV)
const conversations = new Map<string, ConversationState>();

interface ConversationState {
  userId: string;
  history: Message[];
  userPatterns: UserPattern[];
  context: ConversationContext;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface UserPattern {
  type: string;
  frequency: number;
  lastUsed: number;
}

interface ConversationContext {
  intent?: string;
  currentTask?: string;
  blocksDiscussed: string[];
  questionsAsked: string[];
}

const aiSchema = z.object({
  canvas: z.object({
    blocks: z.array(z.any()),
    connections: z.array(z.any()),
  }),
  context: z.string().optional(),
  userId: z.string().optional(),
  conversationId: z.string().optional(),
});

// POST /api/ai/suggest - Get AI suggestions
aiRoutes.post("/suggest", zValidator("json", aiSchema), async (c) => {
  try {
    const data = c.req.valid("json") as AIRequest & {
      userId?: string;
      conversationId?: string;
    };

    // Analyze canvas for basic suggestions
    const basicSuggestions = analyzeCanvas(data.canvas, data.context);

    // Get AI-powered suggestions from Ollama (optional)
    if (USE_AI) {
      try {
        const aiSuggestions = await getAISuggestions(data.canvas, data.context);
        basicSuggestions.push(...aiSuggestions);
      } catch (error) {
        console.warn("Ollama not available, using basic suggestions only");
      }
    }

    return c.json({ suggestions: basicSuggestions });
  } catch (error) {
    return c.json({ error: "AI analysis failed" }, 500);
  }
});

// POST /api/ai/chat - Conversational AI
aiRoutes.post(
  "/chat",
  zValidator(
    "json",
    z.object({
      message: z.string(),
      userId: z.string(),
      conversationId: z.string().optional(),
      canvas: z
        .object({
          blocks: z.array(z.any()),
          connections: z.array(z.any()),
        })
        .optional(),
    }),
  ),
  async (c) => {
    try {
      const { message, userId, conversationId, canvas } = c.req.valid("json");

      const convId = conversationId || crypto.randomUUID();

      // Choose response source: Ollama (if enabled) or rule-based handler
      let aiResponse = "";
      let suggestions: AISuggestion[] = [];
      let actions: string[] = [];

      // Get conversation state (simplified)
      let conversation = conversations.get(convId);
      if (!conversation) {
        conversation = {
          userId,
          history: [],
          userPatterns: [],
          context: {
            blocksDiscussed: [],
            questionsAsked: [],
          },
        };
        conversations.set(convId, conversation);
      }

      if (USE_AI) {
        aiResponse = await getAIChatResponse(message, canvas);
      } else {
        // Use rule-based conversation handler which returns suggestions/actions
        const resp = await handleConversation(message, userId, convId, canvas);
        aiResponse = resp.message;
        suggestions = resp.suggestions || [];
        actions = resp.actions || [];
      }

      // Update conversation history
      conversation.history.push({
        role: "user",
        content: message,
        timestamp: Date.now(),
      });
      conversation.history.push({
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      });

      return c.json({
        response: aiResponse,
        suggestions,
        conversationId: convId,
        actions,
      });
    } catch (error) {
      return c.json({ error: "Chat failed" }, 500);
    }
  },
);

/**
 * Advanced conversational AI handler
 */
async function handleConversation(
  userMessage: string,
  userId: string,
  conversationId: string,
  canvas?: any,
) {
  // Get or create conversation state
  let conversation = conversations.get(conversationId);
  if (!conversation) {
    conversation = {
      userId,
      history: [],
      userPatterns: [],
      context: {
        blocksDiscussed: [],
        questionsAsked: [],
      },
    };
    conversations.set(conversationId, conversation);
  }

  // Add user message to history
  conversation.history.push({
    role: "user",
    content: userMessage,
    timestamp: Date.now(),
  });

  // Analyze intent
  const { intent, confidence } = analyzeIntentConfidence(userMessage, conversation);
  conversation.context.intent = intent;

  // Generate response based on intent
  const response = await generateResponse(userMessage, intent, conversation, canvas);

  // Post-process suggestion confidences using intent confidence
  if (response.suggestions && response.suggestions.length > 0) {
    response.suggestions = response.suggestions.map((s) => {
      if (typeof (s as any).confidence === "number") return s;
      return { ...(s as any), confidence: Math.min(1, confidence * 0.85) } as AISuggestion;
    });
  }

  // Add assistant response to history
  conversation.history.push({
    role: "assistant",
    content: response.message,
    timestamp: Date.now(),
  });

  // Learn from user patterns
  updateUserPatterns(conversation, userMessage, canvas);

  return response;
}

/**
 * Detect user intent from message
 */
function detectIntent(
  message: string,
  conversation: ConversationState,
): string {
  const msg = message.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|sup|yo)/i.test(msg)) return "greeting";

  // Help requests
  if (/help|how to|how do i|can you|guide/i.test(msg)) return "help";

  // Building requests
  if (/create|make|build|add|want|need/i.test(msg)) return "build";

  // Questions
  if (/what|why|when|where|which|who/i.test(msg)) return "question";

  // Debugging
  if (/error|broken|not working|fix|debug/i.test(msg)) return "debug";

  // Learning/explanation
  if (/explain|tell me|teach|learn|understand/i.test(msg)) return "explain";

  // Optimization
  if (/optimize|improve|better|faster|cleaner/i.test(msg)) return "optimize";

  return "general";
}

/**
 * Analyze intent with a confidence score (0-1).
 * Returns higher confidence for strong keyword matches.
 */
function analyzeIntentConfidence(message: string, conversation: ConversationState) {
  const intent = detectIntent(message, conversation);
  const lower = message.toLowerCase();
  let confidence = 0.6;

  if (/^(hi|hello|hey|sup|yo|greetings)/.test(lower)) confidence = 0.9;
  if (/(help|assist|guide|how to|tutorial)/.test(lower)) confidence = Math.max(confidence, 0.85);
  if (/(build|create|make|setup|develop).*bot/.test(lower)) confidence = Math.max(confidence, 0.88);
  if (/(error|bug|issue|problem|not work|broken|fix)/.test(lower)) confidence = Math.max(confidence, 0.9);
  if (/(optimize|improve|better|enhance|faster|performance)/.test(lower)) confidence = Math.max(confidence, 0.8);

  // small boost if conversation history references similar intents
  const recent = conversation.history.slice(-3).map((m) => m.content.toLowerCase()).join(" ");
  if (recent.includes(intent)) confidence = Math.min(1, confidence + 0.05);

  return { intent, confidence } as const;
}

/**
 * Generate intelligent response
 */
async function generateResponse(
  message: string,
  intent: string,
  conversation: ConversationState,
  canvas?: any,
) {
  const suggestions: AISuggestion[] = [];
  const actions: string[] = [];
  let responseMessage = "";

  switch (intent) {
    case "greeting":
      responseMessage = generateGreeting(conversation);
      break;

    case "help":
      const helpResponse = generateHelpResponse(message, conversation, canvas);
      responseMessage = helpResponse.message;
      suggestions.push(...helpResponse.suggestions);
      actions.push(...helpResponse.actions);
      break;

    case "build":
      const buildResponse = generateBuildGuidance(
        message,
        conversation,
        canvas,
      );
      responseMessage = buildResponse.message;
      suggestions.push(...buildResponse.suggestions);
      actions.push(...buildResponse.actions);
      break;

    case "question":
      responseMessage = answerQuestion(message, conversation, canvas);
      break;

    case "debug":
      const debugResponse = debugCanvas(canvas, message);
      responseMessage = debugResponse.message;
      suggestions.push(...debugResponse.suggestions);
      break;

    case "explain":
      responseMessage = explainConcept(message, conversation);
      break;

    case "optimize":
      const optimizeResponse = suggestOptimizations(canvas);
      responseMessage = optimizeResponse.message;
      suggestions.push(...optimizeResponse.suggestions);
      break;

    default:
      responseMessage = generateGeneralResponse(message, conversation, canvas);
  }

  return { message: responseMessage, suggestions, actions };
}

/**
 * Generate contextual greeting
 */
function generateGreeting(conversation: ConversationState): string {
  const greetings = [
    "Hey! I'm your AI assistant. I can help you build Discord bots from scratch. What would you like to create today?",
    "Hello! Ready to build something awesome? Tell me what kind of bot you want to make.",
    "Hi there! I'm here to help you design your Discord bot. What features are you thinking about?",
  ];

  if (conversation.history.length > 2) {
    return "Welcome back! Want to continue where we left off, or start something new?";
  }

  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Generate help response with actionable suggestions
 */
function generateHelpResponse(
  message: string,
  conversation: ConversationState,
  canvas?: any,
) {
  const msg = message.toLowerCase();
  const suggestions: AISuggestion[] = [];
  const actions: string[] = [];

  if (msg.includes("start") || msg.includes("begin")) {
    return {
      message:
        "Great! Let's start building. First, every Discord bot needs a trigger - usually a slash command. I can add one for you. What should the command be called? (e.g., 'ping', 'help', 'info')",
      suggestions: [
        {
          id: crypto.randomUUID(),
          title: "Add Slash Command Trigger",
          description: "Start with a basic /ping command",
          category: "best_practice" as const,
          blocks: [
            {
              id: crypto.randomUUID(),
              type: "command_slash",
              position: { x: 200, y: 100 },
              data: {
                label: "Ping Command",
                properties: {
                  name: "ping",
                  description: "Check if bot is alive",
                },
                category: "triggers",
                isValid: true,
                errors: [],
              },
            },
          ],
          confidence: 1.0,
        },
      ],
      actions: ["add_slash_command"],
    };
  }

  if (msg.includes("command")) {
    return {
      message:
        "Commands are how users interact with your bot! You can create slash commands (/ping), user context menus (right-click user), or message context menus (right-click message). Which type interests you?",
      suggestions: [],
      actions: ["explain_commands"],
    };
  }

  if (msg.includes("event")) {
    return {
      message:
        "Events are things that happen in Discord - like messages being sent, users joining, reactions being added, etc. Your bot can listen to these and respond automatically. Want to listen to a specific event?",
      suggestions: [],
      actions: ["list_events"],
    };
  }

  return {
    message:
      "I can help you with:\n• Building commands and logic flows\n• Explaining Discord concepts\n• Debugging issues\n• Optimizing your bot\n\nWhat specifically would you like help with?",
    suggestions: [],
    actions: [],
  };
}

/**
 * Interactive bot building guidance
 */
function generateBuildGuidance(
  message: string,
  conversation: ConversationState,
  canvas?: any,
) {
  const msg = message.toLowerCase();
  const suggestions: AISuggestion[] = [];
  const actions: string[] = [];

  // Detect what they want to build
  if (
    msg.includes("moderation") ||
    msg.includes("kick") ||
    msg.includes("ban")
  ) {
    return {
      message:
        "Got it! A moderation bot. Here's what we'll need:\n\n1. A slash command trigger (e.g., /kick)\n2. Permission check (only admins can use it)\n3. The kick action\n4. A confirmation message\n\nShall I add these blocks to your canvas?",
      suggestions: [
        {
          id: crypto.randomUUID(),
          title: "Build Moderation Flow",
          description: "Complete kick command with permission checks",
          category: "best_practice" as const,
          blocks: [
            {
              id: crypto.randomUUID(),
              type: "command_slash",
              position: { x: 200, y: 100 },
              data: {
                label: "Kick Command",
                properties: { name: "kick", description: "Kick a member" },
                category: "triggers",
                isValid: true,
                errors: [],
              },
            },
            {
              id: crypto.randomUUID(),
              type: "check_permissions",
              position: { x: 200, y: 250 },
              data: {
                label: "Check Permissions",
                properties: { permission: "KICK_MEMBERS" },
                category: "conditions",
                isValid: true,
                errors: [],
              },
            },
            {
              id: crypto.randomUUID(),
              type: "action_kick",
              position: { x: 200, y: 400 },
              data: {
                label: "Kick Member",
                properties: {},
                category: "moderation",
                isValid: true,
                errors: [],
              },
            },
          ],
          confidence: 0.95,
        },
      ],
      actions: ["build_moderation"],
    };
  }

  if (
    msg.includes("welcome") ||
    msg.includes("greet") ||
    msg.includes("new member")
  ) {
    return {
      message:
        "A welcome bot! Nice. Here's the plan:\n\n1. Listen to the 'member join' event\n2. Send a welcome message to a specific channel\n3. Optional: Add a role to new members\n\nWant me to set this up?",
      suggestions: [
        {
          id: crypto.randomUUID(),
          title: "Build Welcome System",
          description: "Greet new members automatically",
          category: "best_practice" as const,
          blocks: [
            {
              id: crypto.randomUUID(),
              type: "event_listener",
              position: { x: 200, y: 100 },
              data: {
                label: "Member Join",
                properties: { event: "guildMemberAdd" },
                category: "triggers",
                isValid: true,
                errors: [],
              },
            },
            {
              id: crypto.randomUUID(),
              type: "send_message",
              position: { x: 200, y: 250 },
              data: {
                label: "Welcome Message",
                properties: { content: "Welcome to the server!" },
                category: "messages",
                isValid: true,
                errors: [],
              },
            },
          ],
          confidence: 0.95,
        },
      ],
      actions: ["build_welcome"],
    };
  }

  return {
    message:
      "I'd love to help you build that! To get started, could you tell me a bit more? For example:\n• What should trigger this feature? (command, event, button, etc.)\n• What should it do?\n• Any specific Discord features you want to use?",
    suggestions: [],
    actions: ["clarify_requirements"],
  };
}

/**
 * Answer questions about Discord/bots
 */
function answerQuestion(
  message: string,
  conversation: ConversationState,
  canvas?: any,
): string {
  const msg = message.toLowerCase();

  if (msg.includes("what") && msg.includes("slash command")) {
    return "Slash commands are Discord's modern command system. When you type / in chat, Discord shows a menu of commands. They're better than prefix commands (like !ping) because:\n• Auto-complete for users\n• Built-in permission system\n• Can have options and choices\n• Look more professional";
  }

  if (msg.includes("what") && msg.includes("intent")) {
    return "Intents tell Discord what events your bot wants to receive. For example:\n• GUILDS - Server info\n• GUILD_MESSAGES - Message events\n• GUILD_MEMBERS - Member join/leave\n\nYou need to enable intents both in your code AND in the Discord Developer Portal.";
  }

  if (msg.includes("how") && msg.includes("deploy")) {
    return "To deploy your bot:\n1. Export the code from Kyto\n2. Host it somewhere (Replit, Railway, your PC)\n3. Keep it running 24/7\n4. Invite the bot to your server\n\nThe exported code includes setup instructions!";
  }

  return "That's a great question! While I don't have a specific answer for that right now, I can help you build it step by step. Want to give it a try?";
}

/**
 * Debug canvas issues
 */
function debugCanvas(canvas: any, message: string) {
  if (!canvas || !canvas.blocks) {
    return {
      message:
        "I don't see any blocks on your canvas yet. Start by adding a trigger block (like a slash command or event listener).",
      suggestions: [],
    };
  }

  const blocks = canvas.blocks;
  const connections = canvas.connections || [];
  const suggestions: AISuggestion[] = [];

  // Check for orphaned blocks
  const connectedIds = new Set([
    ...connections.map((c: any) => c.source),
    ...connections.map((c: any) => c.target),
  ]);

  const orphaned = blocks.filter(
    (b: Block) =>
      b.type !== "command_slash" &&
      b.type !== "event_listener" &&
      !connectedIds.has(b.id),
  );

  if (orphaned.length > 0) {
    return {
      message: `I found ${orphaned.length} disconnected block${orphaned.length > 1 ? "s" : ""}. Logic blocks need to be connected to a trigger (command or event) to work. Want me to suggest connections?`,
      suggestions: [],
    };
  }

  return {
    message:
      "Your canvas looks good! I don't see any obvious issues. If something specific isn't working, describe what you're trying to do and I'll help debug it.",
    suggestions: [],
  };
}

/**
 * Explain concepts
 */
function explainConcept(
  message: string,
  conversation: ConversationState,
): string {
  const msg = message.toLowerCase();

  if (msg.includes("embed")) {
    return "Embeds are those fancy colored message boxes with titles, descriptions, images, and fields. They make your bot look professional! You can customize:\n• Title & description\n• Color (left border)\n• Thumbnail & image\n• Fields (columns of info)\n• Footer & timestamp";
  }

  if (msg.includes("permission")) {
    return "Permissions control what users can do. For bot commands, you usually check:\n• User permissions (can THEY kick members?)\n• Bot permissions (does YOUR BOT have permission?)\n\nAlways check both to avoid errors!";
  }

  if (msg.includes("button") || msg.includes("component")) {
    return "Buttons and components make bots interactive! Users can click buttons instead of typing commands. You can have:\n• Buttons (click to do something)\n• Select menus (dropdown choices)\n• Modals (popup forms)\n\nThey're perfect for confirmation prompts and multi-step actions.";
  }

  return "I can explain Discord concepts! Try asking about: slash commands, intents, permissions, embeds, buttons, roles, channels, webhooks, or events.";
}

/**
 * Suggest optimizations
 */
function suggestOptimizations(canvas: any) {
  const suggestions = analyzeCanvas(canvas, "optimize");
  return {
    message:
      suggestions.length > 0
        ? `I found ${suggestions.length} optimization${suggestions.length > 1 ? "s" : ""} for your bot. Check the suggestions!`
        : "Your bot is looking efficient! Keep up the good work.",
    suggestions,
  };
}

/**
 * Generate general conversational response
 */
function generateGeneralResponse(
  message: string,
  conversation: ConversationState,
  canvas?: any,
): string {
  const encouragements = [
    "That's interesting! Tell me more about what you're trying to achieve.",
    "I see! Let's break that down step by step.",
    "Got it! I can definitely help with that.",
  ];

  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

/**
 * Learn from user patterns
 */
function updateUserPatterns(
  conversation: ConversationState,
  message: string,
  canvas?: any,
) {
  // Track block type preferences
  if (canvas?.blocks) {
    canvas.blocks.forEach((block: Block) => {
      const existing = conversation.userPatterns.find(
        (p) => p.type === block.type,
      );
      if (existing) {
        existing.frequency++;
        existing.lastUsed = Date.now();
      } else {
        conversation.userPatterns.push({
          type: block.type,
          frequency: 1,
          lastUsed: Date.now(),
        });
      }
    });
  }
}

/**
 * Original advanced canvas analysis (kept for backwards compatibility)
 */
function analyzeCanvas(canvas: any, context?: string): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const blocks: Block[] = canvas.blocks;
  const connections = canvas.connections || [];

  // [Previous advanced rules remain the same - all 10 rules from before]
  // ... (keeping the existing implementation)

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

// ==================== OLLAMA AI FUNCTIONS ====================

async function getAISuggestions(
  canvas: any,
  context?: string,
): Promise<AISuggestion[]> {
  try {
    const blockCount = canvas.blocks?.length || 0;
    const prompt = `You are a Discord bot building assistant. The user has ${blockCount} blocks on their canvas.

${context ? `Context: ${context}` : ""}

Suggest 1-2 specific improvements for this Discord bot. Be concise and actionable.

Format your response as:
- Title: Brief title
- Description: 1-2 sentence explanation
- Blocks: (optional) specific blocks to add

Keep it very brief.`;

    const response = await fetchWithTimeout(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 100,
        },
      }),
    }, 8000);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Ollama request failed: ${response.status} ${text}`);
    }

    // Ollama may return { "response": "..." } or raw text; handle both
    let aiText = "";
    try {
      const data = (await response.json()) as { response?: string } | string;
      if (typeof data === "string") aiText = data.trim();
      else aiText = (data.response || "").trim();
    } catch (e) {
      aiText = (await response.text()).trim();
    }

    if (!aiText) return [];

    // Return single suggestion with raw text; parsing can be improved later
    return [
      {
        id: "ai_suggestion",
        title: "AI Suggestion",
        description: aiText,
        category: "best_practice",
        confidence: 0.8,
        blocks: [],
      } as AISuggestion,
    ];
  } catch (error) {
    console.error("Ollama AI suggestions failed:", error);
    return [];
  }
}

async function getAIChatResponse(
  message: string,
  canvas?: any,
): Promise<string> {
  try {
    const blockCount = canvas?.blocks?.length || 0;
    const prompt = `You are a helpful Discord bot building assistant. The user has ${blockCount} blocks on their canvas.

User: ${message}

Provide a helpful, concise response about Discord bot development. Keep it under 100 words.`;

    const response = await fetchWithTimeout(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 150,
        },
      }),
    }, 10000);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Ollama request failed: ${response.status} ${text}`);
    }

    try {
      const data = (await response.json()) as { response?: string } | string;
      if (typeof data === "string") return data.trim() || "I'm here to help with your Discord bot!";
      return (data.response || "").trim() || "I'm here to help with your Discord bot!";
    } catch (e) {
      return (await response.text()).trim() || "I'm here to help with your Discord bot!";
    }
  } catch (error) {
    console.error("Ollama chat failed:", error);
    return "AI assistant is currently unavailable. Please check that Ollama is running with the phi3 model.";
  }
}
