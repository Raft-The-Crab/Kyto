import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../index";
import type { AIRequest, AISuggestion, Block } from "../types";

export const aiRoutes = new Hono<{ Bindings: Env }>();

const aiSchema = z.object({
  canvas: z.object({
    blocks: z.array(z.any()),
    connections: z.array(z.any()),
  }),
  context: z.string().optional(),
});

// POST /api/ai/suggest - Get AI suggestions
aiRoutes.post("/suggest", zValidator("json", aiSchema), async (c) => {
  try {
    const data = c.req.valid("json") as AIRequest;
    const suggestions = analyzeCanvas(data.canvas, data.context);

    return c.json({ suggestions });
  } catch (error) {
    return c.json({ error: "AI analysis failed" }, 500);
  }
});

function analyzeCanvas(canvas: any, context?: string): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const blocks: Block[] = canvas.blocks;
  const connections = canvas.connections || [];

  // Advanced Rule 1: Missing error handling (context-aware)
  const replyBlocks = blocks.filter((b) =>
    ["action_reply", "send_message"].includes(b.type),
  );
  const hasErrorHandler = blocks.some((b) => b.type === "error_handler");

  if (replyBlocks.length > 0 && !hasErrorHandler) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Add Error Handling",
      description:
        "Production bots should gracefully handle failures. Add a try-catch pattern to prevent crashes when Discord API calls fail.",
      category: "error_handling",
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "error_handler",
          position: { x: 100, y: 200 },
          data: {
            label: "Error Handler",
            properties: { message: "Something went wrong! Please try again." },
            category: "error",
            isValid: true,
            errors: [],
          },
        },
      ],
      confidence: 0.95,
    });
  }

  // Advanced Rule 2: Slash command registration reminder
  const slashCommands = blocks.filter((b) => b.type === "command_slash");
  if (slashCommands.length > 0 && !context?.includes("registered")) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Register Slash Commands",
      description:
        "Slash commands must be registered with Discord before they work. Use the Discord Developer Portal or a deployment script to register these commands.",
      category: "best_practice",
      confidence: 1.0,
    });
  }

  // Advanced Rule 3: Detect inefficient patterns
  const waitBlocks = blocks.filter((b) => b.type === "wait");
  const longWaits = waitBlocks.filter(
    (b) => (b.data.properties.duration || 0) > 5,
  );

  if (longWaits.length > 0) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Optimize Delays",
      description: `You have ${longWaits.length} delay${longWaits.length > 1 ? "s" : ""} longer than 5 seconds. Consider using scheduled tasks or webhooks instead of blocking the bot.`,
      category: "optimization",
      confidence: 0.8,
    });
  }

  // Advanced Rule 4: Permission checks for moderation
  const hasPermissionCheck = blocks.some((b) => b.type === "check_permissions");
  const moderationBlocks = blocks.filter((b) =>
    ["action_kick", "action_ban", "member_timeout"].includes(b.type),
  );

  if (moderationBlocks.length > 0 && !hasPermissionCheck) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Add Permission Validation",
      description:
        "Moderation commands should verify both bot AND user permissions before execution. This prevents unauthorized actions and improves security.",
      category: "error_handling",
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "check_permissions",
          position: { x: 50, y: 150 },
          data: {
            label: "Check Permissions",
            properties: { permission: "KICK_MEMBERS" },
            category: "conditions",
            isValid: true,
            errors: [],
          },
        },
      ],
      confidence: 0.98,
    });
  }

  // Advanced Rule 5: Detect orphaned blocks (no connections)
  const connectedBlockIds = new Set([
    ...connections.map((c: any) => c.source),
    ...connections.map((c: any) => c.target),
  ]);

  const orphanedBlocks = blocks.filter(
    (b) =>
      b.type !== "command_slash" &&
      b.type !== "event_listener" &&
      !connectedBlockIds.has(b.id),
  );

  if (orphanedBlocks.length > 0) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Connect Isolated Blocks",
      description: `You have ${orphanedBlocks.length} block${orphanedBlocks.length > 1 ? "s" : ""} that aren't connected to any logic flow. Connect them or remove them to clean up your canvas.`,
      category: "optimization",
      confidence: 0.7,
    });
  }

  // Advanced Rule 6: Detect missing rate limiting for commands
  const publicCommands = blocks.filter((b) => b.type === "command_slash");
  const hasRateLimit = blocks.some((b) => b.type === "rate_limiter");

  if (publicCommands.length > 2 && !hasRateLimit) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Add Rate Limiting",
      description:
        "Protect your bot from spam by adding rate limits to commands. This prevents users from overwhelming your bot with rapid requests.",
      category: "best_practice",
      confidence: 0.75,
    });
  }

  // Advanced Rule 7: Embed optimization
  const embedBlocks = blocks.filter((b) => b.type === "send_embed");
  const largeEmbeds = embedBlocks.filter((b) => {
    const desc = b.data.properties.description || "";
    return desc.length > 2048; // Discord's embed description limit
  });

  if (largeEmbeds.length > 0) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Embed Size Warning",
      description:
        "One or more embeds exceed Discord's 2048 character limit for descriptions. Split long text into multiple embeds or use fields.",
      category: "error_handling",
      confidence: 1.0,
    });
  }

  // Advanced Rule 8: Voice channel logic validation
  const voiceJoin = blocks.some((b) => b.type === "voice_join");
  const voiceLeave = blocks.some((b) => b.type === "voice_leave");

  if (voiceJoin && !voiceLeave) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Add Voice Disconnect Logic",
      description:
        "Your bot joins voice channels but never leaves. Add a disconnect command to prevent your bot from staying in channels indefinitely.",
      category: "best_practice",
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "voice_leave",
          position: { x: 250, y: 200 },
          data: {
            label: "Leave Voice",
            properties: {},
            category: "voice",
            isValid: true,
            errors: [],
          },
        },
      ],
      confidence: 0.85,
    });
  }

  // Advanced Rule 9: Database usage detection
  const hasVariables = blocks.some((b) => b.type === "set_variable");
  const hasDatabase = blocks.some((b) => b.type === "database_store");

  if (hasVariables && blocks.length > 10 && !hasDatabase) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Consider Persistent Storage",
      description:
        "Your bot uses variables for data. For production bots, consider using a database to persist data across restarts.",
      category: "best_practice",
      confidence: 0.6,
    });
  }

  // Advanced Rule 10: Context-aware suggestions based on user input
  if (context?.toLowerCase().includes("help")) {
    suggestions.push({
      id: crypto.randomUUID(),
      title: "Getting Started",
      description:
        'Start by adding a Slash Command trigger, then connect action blocks like "Reply" or "Send Message" to create your first bot response.',
      category: "best_practice",
      confidence: 1.0,
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
