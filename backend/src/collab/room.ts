import type { CollabMessage, CollabOperation, User } from "../types";

export class CollaborationRoom {
  state: DurableObjectState;
  sessions: Map<WebSocket, User>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Map();
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    // Check user limit (max 2 users per project)
    if (this.sessions.size >= 2) {
      return new Response("Room is full (max 2 users)", { status: 403 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    await this.handleSession(server, request);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleSession(websocket: WebSocket, request: Request) {
    websocket.accept();

    const userId =
      new URL(request.url).searchParams.get("userId") || crypto.randomUUID();
    const user: User = {
      id: userId,
      name: `User ${userId.slice(0, 4)}`,
    };

    this.sessions.set(websocket, user);

    // Send current users to new user
    this.send(websocket, {
      type: "join",
      userId: user.id,
      data: {
        users: Array.from(this.sessions.values()),
      },
    });

    // Broadcast new user to others
    this.broadcast(
      {
        type: "join",
        userId: user.id,
        data: { user },
      },
      websocket,
    );

    websocket.addEventListener("message", (event) => {
      try {
        const message: CollabMessage = JSON.parse(event.data as string);
        this.handleMessage(websocket, message);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });

    websocket.addEventListener("close", () => {
      this.sessions.delete(websocket);
      this.broadcast({
        type: "leave",
        userId: user.id,
      });
    });
  }

  handleMessage(websocket: WebSocket, message: CollabMessage) {
    const user = this.sessions.get(websocket);
    if (!user) return;

    switch (message.type) {
      case "operation":
        // Broadcast operation to all other users
        this.broadcast(
          {
            ...message,
            userId: user.id,
          },
          websocket,
        );
        break;

      case "cursor":
        // Update user cursor and broadcast
        user.cursor = message.data;
        this.broadcast(
          {
            type: "cursor",
            userId: user.id,
            data: message.data,
          },
          websocket,
        );
        break;

      case "sync":
        // Sync full canvas state
        this.broadcast(message, websocket);
        break;
    }
  }

  broadcast(message: CollabMessage, exclude?: WebSocket) {
    for (const [ws, user] of this.sessions) {
      if (ws !== exclude) {
        this.send(ws, message);
      }
    }
  }

  send(websocket: WebSocket, message: CollabMessage) {
    try {
      websocket.send(JSON.stringify(message));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
}
