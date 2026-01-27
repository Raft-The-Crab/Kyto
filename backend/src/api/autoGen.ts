import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const autoGenRoutes = new Hono();

// ==================== TYPES ====================

interface GeneratedBlock {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    properties: Record<string, any>;
    category: string;
    isValid: boolean;
    errors: string[];
  };
}

interface GeneratedConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface GeneratedFlow {
  blocks: GeneratedBlock[];
  connections: GeneratedConnection[];
  description: string;
}

// ==================== COMMAND TEMPLATES ====================

const COMMAND_TEMPLATES: Record<string, () => GeneratedFlow> = {
  ping: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "Ping Command", {
        name: "ping",
        description: "Check if bot is online",
      }),
      createBlock("action_reply", { x: 200, y: 250 }, "Reply Pong", {
        content: "🏓 Pong! Bot is alive!",
        ephemeral: false,
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Simple ping command to check if bot is working",
  }),

  help: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "Help Command", {
        name: "help",
        description: "Show available commands",
      }),
      createBlock("send_embed", { x: 200, y: 250 }, "Help Embed", {
        title: "📚 Bot Help",
        description: "Here are the available commands:",
        color: "#5865F2",
        fields: [
          { name: "/help", value: "Shows this message" },
          { name: "/ping", value: "Check if bot is online" },
        ],
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Help command showing all available features",
  }),

  kick: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "Kick Command", {
        name: "kick",
        description: "Kick a member from the server",
        options: [
          { name: "user", type: "USER", required: true },
          { name: "reason", type: "STRING", required: false },
        ],
      }),
      createBlock("check_permissions", { x: 200, y: 230 }, "Check Admin", {
        permission: "KICK_MEMBERS",
      }),
      createBlock("action_kick", { x: 100, y: 360 }, "Kick User", {
        reason: "{reason}",
      }),
      createBlock("action_reply", { x: 100, y: 490 }, "Success Reply", {
        content: "✅ Successfully kicked {user}",
        ephemeral: true,
      }),
      createBlock("action_reply", { x: 300, y: 360 }, "No Permission", {
        content: "❌ You don't have permission to kick members",
        ephemeral: true,
      }),
    ],
    connections: [
      { id: "c1", source: "block_0", target: "block_1" },
      { id: "c2", source: "block_1", target: "block_2", sourceHandle: "true" },
      { id: "c3", source: "block_2", target: "block_3" },
      { id: "c4", source: "block_1", target: "block_4", sourceHandle: "false" },
    ],
    description: "Moderation kick command with permission check",
  }),

  ban: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "Ban Command", {
        name: "ban",
        description: "Ban a member from the server",
        options: [
          { name: "user", type: "USER", required: true },
          { name: "reason", type: "STRING", required: false },
          { name: "delete_days", type: "INTEGER", required: false },
        ],
      }),
      createBlock("check_permissions", { x: 200, y: 230 }, "Check Admin", {
        permission: "BAN_MEMBERS",
      }),
      createBlock("action_ban", { x: 100, y: 360 }, "Ban User", {
        reason: "{reason}",
        delete_message_days: "{delete_days}",
      }),
      createBlock("action_reply", { x: 100, y: 490 }, "Success Reply", {
        content: "🔨 Successfully banned {user}",
        ephemeral: true,
      }),
      createBlock("action_reply", { x: 300, y: 360 }, "No Permission", {
        content: "❌ You don't have permission to ban members",
        ephemeral: true,
      }),
    ],
    connections: [
      { id: "c1", source: "block_0", target: "block_1" },
      { id: "c2", source: "block_1", target: "block_2", sourceHandle: "true" },
      { id: "c3", source: "block_2", target: "block_3" },
      { id: "c4", source: "block_1", target: "block_4", sourceHandle: "false" },
    ],
    description: "Moderation ban command with permission check",
  }),

  timeout: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "Timeout Command", {
        name: "timeout",
        description: "Timeout a member",
        options: [
          { name: "user", type: "USER", required: true },
          { name: "duration", type: "INTEGER", required: true },
          { name: "reason", type: "STRING", required: false },
        ],
      }),
      createBlock("check_permissions", { x: 200, y: 230 }, "Check Mod", {
        permission: "MODERATE_MEMBERS",
      }),
      createBlock("action_timeout", { x: 100, y: 360 }, "Timeout User", {
        duration: "{duration}",
        reason: "{reason}",
      }),
      createBlock("action_reply", { x: 100, y: 490 }, "Success Reply", {
        content: "⏰ Timed out {user} for {duration} minutes",
        ephemeral: true,
      }),
    ],
    connections: [
      { id: "c1", source: "block_0", target: "block_1" },
      { id: "c2", source: "block_1", target: "block_2", sourceHandle: "true" },
      { id: "c3", source: "block_2", target: "block_3" },
    ],
    description: "Timeout command for temporary mutes",
  }),

  userinfo: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "User Info", {
        name: "userinfo",
        description: "Get information about a user",
        options: [{ name: "user", type: "USER", required: false }],
      }),
      createBlock("send_embed", { x: 200, y: 250 }, "User Embed", {
        title: "👤 User Information",
        fields: [
          { name: "Username", value: "{user.username}", inline: true },
          { name: "ID", value: "{user.id}", inline: true },
          { name: "Joined Server", value: "{user.joinedAt}", inline: true },
          { name: "Account Created", value: "{user.createdAt}", inline: true },
        ],
        thumbnail: "{user.avatar}",
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Show information about a user",
  }),

  serverinfo: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "Server Info", {
        name: "serverinfo",
        description: "Get information about the server",
      }),
      createBlock("send_embed", { x: 200, y: 250 }, "Server Embed", {
        title: "🏠 Server Information",
        fields: [
          { name: "Name", value: "{server.name}", inline: true },
          { name: "Members", value: "{server.memberCount}", inline: true },
          { name: "Created", value: "{server.createdAt}", inline: true },
          { name: "Owner", value: "{server.owner}", inline: true },
        ],
        thumbnail: "{server.icon}",
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Show server information",
  }),

  avatar: () => ({
    blocks: [
      createBlock("command_slash", { x: 200, y: 100 }, "Avatar Command", {
        name: "avatar",
        description: "Get a user's avatar",
        options: [{ name: "user", type: "USER", required: false }],
      }),
      createBlock("send_embed", { x: 200, y: 250 }, "Avatar Embed", {
        title: "🖼️ Avatar",
        image: "{user.avatar}",
        color: "#5865F2",
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Display user's avatar image",
  }),
};

// ==================== EVENT TEMPLATES ====================

const EVENT_TEMPLATES: Record<string, () => GeneratedFlow> = {
  welcome: () => ({
    blocks: [
      createBlock("event_listener", { x: 200, y: 100 }, "Member Join", {
        event: "guildMemberAdd",
      }),
      createBlock("send_message", { x: 200, y: 250 }, "Welcome Message", {
        channel_id: "{settings.welcomeChannel}",
        content: "👋 Welcome to the server, {member.mention}! We're glad to have you here.",
      }),
      createBlock("action_add_role", { x: 200, y: 400 }, "Add Member Role", {
        role_id: "{settings.memberRole}",
      }),
    ],
    connections: [
      { id: "c1", source: "block_0", target: "block_1" },
      { id: "c2", source: "block_1", target: "block_2" },
    ],
    description: "Welcome new members with a message and role",
  }),

  goodbye: () => ({
    blocks: [
      createBlock("event_listener", { x: 200, y: 100 }, "Member Leave", {
        event: "guildMemberRemove",
      }),
      createBlock("send_message", { x: 200, y: 250 }, "Goodbye Message", {
        channel_id: "{settings.logChannel}",
        content: "👋 {member.username} has left the server.",
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Send goodbye message when member leaves",
  }),

  autorole: () => ({
    blocks: [
      createBlock("event_listener", { x: 200, y: 100 }, "Member Join", {
        event: "guildMemberAdd",
      }),
      createBlock("action_add_role", { x: 200, y: 250 }, "Auto Role", {
        role_id: "{settings.autoRole}",
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Automatically assign role to new members",
  }),

  messagelog: () => ({
    blocks: [
      createBlock("event_listener", { x: 200, y: 100 }, "Message Delete", {
        event: "messageDelete",
      }),
      createBlock("send_embed", { x: 200, y: 250 }, "Log Embed", {
        title: "🗑️ Message Deleted",
        channel_id: "{settings.logChannel}",
        fields: [
          { name: "Author", value: "{message.author}", inline: true },
          { name: "Channel", value: "{message.channel}", inline: true },
          { name: "Content", value: "{message.content}" },
        ],
        color: "#FF6B6B",
      }),
    ],
    connections: [{ id: "c1", source: "block_0", target: "block_1" }],
    description: "Log deleted messages to a channel",
  }),

  antiSpam: () => ({
    blocks: [
      createBlock("event_listener", { x: 200, y: 100 }, "Message Create", {
        event: "messageCreate",
      }),
      createBlock("condition_spam_check", { x: 200, y: 230 }, "Spam Check", {
        max_messages: 5,
        time_window: 5000,
      }),
      createBlock("action_timeout", { x: 100, y: 360 }, "Timeout Spammer", {
        duration: 5,
        reason: "Spam detected",
      }),
      createBlock("action_delete_message", { x: 100, y: 490 }, "Delete Messages", {}),
    ],
    connections: [
      { id: "c1", source: "block_0", target: "block_1" },
      { id: "c2", source: "block_1", target: "block_2", sourceHandle: "true" },
      { id: "c3", source: "block_2", target: "block_3" },
    ],
    description: "Detect and timeout spammers automatically",
  }),
};

// ==================== HELPERS ====================

let blockCounter = 0;

function createBlock(
  type: string,
  position: { x: number; y: number },
  label: string,
  properties: Record<string, any> = {}
): GeneratedBlock {
  const categories: Record<string, string> = {
    command_slash: "triggers",
    event_listener: "triggers",
    send_message: "messages",
    send_embed: "messages",
    action_reply: "messages",
    action_kick: "moderation",
    action_ban: "moderation",
    action_timeout: "moderation",
    action_add_role: "roles",
    action_remove_role: "roles",
    action_delete_message: "moderation",
    check_permissions: "conditions",
    condition_spam_check: "conditions",
  };

  const block: GeneratedBlock = {
    id: `block_${blockCounter++}`,
    type,
    position,
    data: {
      label,
      properties,
      category: categories[type] || "logic",
      isValid: true,
      errors: [],
    },
  };

  return block;
}

function resetBlockCounter() {
  blockCounter = 0;
}

// ==================== INTENT DETECTION ====================

interface ParsedIntent {
  type: "command" | "event" | "module" | "unknown";
  name: string;
  features: string[];
  confidence: number;
}

function parseUserIntent(message: string): ParsedIntent {
  const msg = message.toLowerCase();
  
  // Command detection patterns
  const commandPatterns: Record<string, { keywords: string[]; features: string[] }> = {
    ping: { keywords: ["ping", "pong", "alive", "online", "status"], features: [] },
    help: { keywords: ["help", "commands", "list commands"], features: [] },
    kick: { keywords: ["kick", "remove user", "kick member"], features: ["permission_check", "moderation"] },
    ban: { keywords: ["ban", "ban user", "ban member"], features: ["permission_check", "moderation"] },
    timeout: { keywords: ["timeout", "mute", "temp mute", "silence"], features: ["permission_check", "moderation"] },
    userinfo: { keywords: ["userinfo", "user info", "whois", "user profile"], features: ["embed"] },
    serverinfo: { keywords: ["serverinfo", "server info", "guild info"], features: ["embed"] },
    avatar: { keywords: ["avatar", "pfp", "profile picture"], features: ["embed"] },
  };

  // Event detection patterns
  const eventPatterns: Record<string, { keywords: string[]; features: string[] }> = {
    welcome: { keywords: ["welcome", "greet", "new member", "join message"], features: ["auto_role"] },
    goodbye: { keywords: ["goodbye", "leave message", "farewell", "bye"], features: [] },
    autorole: { keywords: ["autorole", "auto role", "automatic role"], features: [] },
    messagelog: { keywords: ["log", "message log", "deleted messages", "audit"], features: ["embed"] },
    antiSpam: { keywords: ["anti spam", "anti-spam", "spam protection", "spam filter"], features: ["moderation"] },
  };

  // Check for command matches
  for (const [name, pattern] of Object.entries(commandPatterns)) {
    for (const keyword of pattern.keywords) {
      if (msg.includes(keyword)) {
        return {
          type: "command",
          name,
          features: pattern.features,
          confidence: 0.9,
        };
      }
    }
  }

  // Check for event matches
  for (const [name, pattern] of Object.entries(eventPatterns)) {
    for (const keyword of pattern.keywords) {
      if (msg.includes(keyword)) {
        return {
          type: "event",
          name,
          features: pattern.features,
          confidence: 0.9,
        };
      }
    }
  }

  return {
    type: "unknown",
    name: "",
    features: [],
    confidence: 0,
  };
}

// ==================== API ROUTES ====================

const generateSchema = z.object({
  message: z.string(),
  context: z.string().optional(),
});

// POST /api/ai/generate - Auto-generate commands from natural language
autoGenRoutes.post("/generate", zValidator("json", generateSchema), async (c) => {
  try {
    const { message, context } = c.req.valid("json");
    
    resetBlockCounter();
    const intent = parseUserIntent(message);
    
    if (intent.type === "unknown") {
      return c.json({
        success: false,
        message: "I couldn't understand what you want to create. Try something like:\n• 'Create a ping command'\n• 'Make a welcome message'\n• 'Add kick command with permissions'\n• 'Set up anti-spam'",
        suggestions: [
          { name: "ping", description: "Simple ping/pong command" },
          { name: "help", description: "Help command with embed" },
          { name: "kick", description: "Kick command with permission check" },
          { name: "welcome", description: "Welcome message for new members" },
        ],
      });
    }
    
    let flow: GeneratedFlow | null = null;
    
    if (intent.type === "command" && COMMAND_TEMPLATES[intent.name]) {
      flow = COMMAND_TEMPLATES[intent.name]();
    } else if (intent.type === "event" && EVENT_TEMPLATES[intent.name]) {
      flow = EVENT_TEMPLATES[intent.name]();
    }
    
    if (!flow) {
      return c.json({
        success: false,
        message: `I understand you want a ${intent.type} called "${intent.name}", but I don't have a template for it yet.`,
      });
    }
    
    return c.json({
      success: true,
      flow,
      intent,
      message: `Generated ${intent.type}: ${flow.description}`,
    });
  } catch (error) {
    console.error("[AutoGen] Error:", error);
    return c.json({ success: false, error: "Generation failed" }, 500);
  }
});

// GET /api/ai/templates - List all available templates
autoGenRoutes.get("/templates", async (c) => {
  return c.json({
    commands: Object.keys(COMMAND_TEMPLATES).map(name => ({
      name,
      description: COMMAND_TEMPLATES[name]().description,
    })),
    events: Object.keys(EVENT_TEMPLATES).map(name => ({
      name,
      description: EVENT_TEMPLATES[name]().description,
    })),
  });
});
