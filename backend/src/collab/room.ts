import { WebSocket, WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';

// ==================== TYPES ====================

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  ws: WebSocket;
}

export interface CollabOperation {
  type: 'add_block' | 'remove_block' | 'move_block' | 'update_block' | 'add_connection' | 'remove_connection';
  data: any;
  userId: string;
  timestamp: number;
}

export interface CollabMessage {
  type: 'join' | 'leave' | 'cursor' | 'operation' | 'sync' | 'users';
  data: any;
  userId?: string;
}

// ==================== COLLABORATION ROOM ====================

export class CollaborationRoom {
  private users: Map<string, CollabUser> = new Map();
  private operations: CollabOperation[] = [];
  private projectId: string;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  join(userId: string, userName: string, ws: WebSocket): CollabUser {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const user: CollabUser = {
      id: userId,
      name: userName || `User ${this.users.size + 1}`,
      color: colors[this.users.size % colors.length],
      ws,
    };
    
    this.users.set(userId, user);
    
    // Notify all users of the new join
    this.broadcast({
      type: 'join',
      data: {
        user: { id: user.id, name: user.name, color: user.color },
        users: this.getUserList(),
      },
    }, userId);

    // Send current state to the new user
    ws.send(JSON.stringify({
      type: 'sync',
      data: {
        users: this.getUserList(),
        operations: this.operations.slice(-100), // Last 100 operations
      },
    }));

    return user;
  }

  leave(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      this.users.delete(userId);
      this.broadcast({
        type: 'leave',
        data: {
          userId,
          users: this.getUserList(),
        },
      });
    }
  }

  updateCursor(userId: string, position: { x: number; y: number }): void {
    const user = this.users.get(userId);
    if (user) {
      user.cursor = position;
      this.broadcast({
        type: 'cursor',
        data: {
          userId,
          position,
          color: user.color,
          name: user.name,
        },
      }, userId);
    }
  }

  applyOperation(userId: string, operation: Omit<CollabOperation, 'userId' | 'timestamp'>): void {
    const fullOperation: CollabOperation = {
      ...operation,
      userId,
      timestamp: Date.now(),
    };
    
    this.operations.push(fullOperation);
    
    // Keep only last 1000 operations
    if (this.operations.length > 1000) {
      this.operations = this.operations.slice(-1000);
    }

    this.broadcast({
      type: 'operation',
      data: fullOperation,
    }, userId);
  }

  private getUserList(): Array<{ id: string; name: string; color: string; cursor?: { x: number; y: number } }> {
    return Array.from(this.users.values()).map(u => ({
      id: u.id,
      name: u.name,
      color: u.color,
      cursor: u.cursor,
    }));
  }

  private broadcast(message: CollabMessage, excludeUserId?: string): void {
    const data = JSON.stringify(message);
    this.users.forEach((user, id) => {
      if (id !== excludeUserId && user.ws.readyState === WebSocket.OPEN) {
        user.ws.send(data);
      }
    });
  }

  get isEmpty(): boolean {
    return this.users.size === 0;
  }
}

// ==================== ROOM MANAGER ====================

const rooms: Map<string, CollaborationRoom> = new Map();

export function getOrCreateRoom(projectId: string): CollaborationRoom {
  let room = rooms.get(projectId);
  if (!room) {
    room = new CollaborationRoom(projectId);
    rooms.set(projectId, room);
  }
  return room;
}

export function cleanupRoom(projectId: string): void {
  const room = rooms.get(projectId);
  if (room?.isEmpty) {
    rooms.delete(projectId);
  }
}

// ==================== WEBSOCKET HANDLER ====================

export function handleCollabConnection(
  ws: WebSocket,
  req: IncomingMessage,
  projectId: string
): void {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId') || crypto.randomUUID();
  const userName = url.searchParams.get('userName') || '';
  
  const room = getOrCreateRoom(projectId);
  const user = room.join(userId, userName, ws);
  
  console.log(`[Collab] User ${user.name} joined room ${projectId}`);

  ws.on('message', (data: Buffer | string) => {
    try {
      const message: CollabMessage = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'cursor':
          room.updateCursor(userId, message.data);
          break;
          
        case 'operation':
          room.applyOperation(userId, message.data);
          break;
          
        default:
          console.warn(`[Collab] Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('[Collab] Failed to parse message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`[Collab] User ${user.name} left room ${projectId}`);
    room.leave(userId);
    cleanupRoom(projectId);
  });

  ws.on('error', (error: Error) => {
    console.error(`[Collab] WebSocket error for user ${userId}:`, error);
  });
}

// ==================== EXPRESS/HONO WEBSOCKET UPGRADE ====================

export function setupCollabWebSocket(server: any): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request: IncomingMessage, socket: any, head: Buffer) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const match = url.pathname.match(/^\/collab\/([a-zA-Z0-9-]+)$/);
    
    if (match) {
      const projectId = match[1];
      wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        handleCollabConnection(ws, request, projectId);
      });
    } else {
      socket.destroy();
    }
  });

  console.log('[Collab] WebSocket server ready for collaboration');
  return wss;
}
