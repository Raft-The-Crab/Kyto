import { Hono } from "hono";
import { DurableObject } from "cloudflare:workers";

// Define the shape of our room state
interface RoomState {
  participants: Map<string, WebSocket>;
  data: any;
}

// Durable Object class for collaboration rooms
export class CollaborationRoom extends DurableObject {
  private state: RoomState;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.state = {
      participants: new Map(),
      data: {},
    };

    // Retrieve any stored state
    ctx.blockConcurrencyWhile(async () => {
      const stored = await ctx.storage.get<RoomState>("state");
      if (stored) {
        this.state = stored;
      }
    });
  }

  // Handle WebSocket connections
  async fetch(request: Request) {
    const url = new URL(request.url);
    const upgradeHeader = request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    // Accept the WebSocket connection
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    // Add the new participant
    const clientId = url.searchParams.get("clientId") || crypto.randomUUID();
    this.state.participants.set(clientId, server);

    // Set up the WebSocket event handlers
    server.addEventListener("message", async (event) => {
      // Broadcast the message to all other participants
      for (const [id, participant] of this.state.participants) {
        if (id !== clientId) {
          try {
            participant.send(event.data);
          } catch (e) {
            // Remove broken connections
            this.state.participants.delete(id);
          }
        }
      }
    });

    server.addEventListener("close", async () => {
      // Remove the participant when they disconnect
      this.state.participants.delete(clientId);
      await this.saveState();
    });

    server.addEventListener("error", async (error) => {
      console.error("WebSocket error in room:", error);
      this.state.participants.delete(clientId);
      await this.saveState();
    });

    // Accept the connection
    this.state.participants.set(clientId, server);
    await this.saveState();

    return new Response(null, { status: 101, webSocket: client });
  }

  // Save the room state to durable storage
  private async saveState() {
    await this.ctx.storage.put("state", this.state);
  }

  // Get room info
  async getInfo() {
    return {
      participantCount: this.state.participants.size,
      participants: Array.from(this.state.participants.keys()),
    };
  }
}

// Export a factory function to create room IDs
export function createRoomId(roomName: string): DurableObjectId {
  // Use the room name to create a consistent ID
  return ROOM_NAMESPACE.idFromName(roomName);
}
