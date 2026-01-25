// Project Management
export interface Project {
  id: string;
  name: string;
  description: string;
  language: "discord.js" | "discord.py";
  canvas: CanvasState;
  settings: ProjectSettings;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface CanvasState {
  blocks: Block[];
  connections: Connection[];
  selectedBlockId: string | null;
  viewportPosition: { x: number; y: number };
}

export interface Block {
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

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface ProjectSettings {
  prefix: string;
  botToken: string;
  clientId: string;
  intents: number[];
}

// Collaboration
export interface User {
  id: string;
  name: string;
  cursor?: { x: number; y: number };
}

export interface CollabOperation {
  type:
    | "add_block"
    | "update_block"
    | "delete_block"
    | "add_connection"
    | "delete_connection";
  payload: any;
  timestamp: number;
  userId: string;
}

export interface CollabMessage {
  type: "join" | "leave" | "sync" | "cursor" | "operation";
  userId?: string;
  data?: any;
}

// AI Assistant
export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  category: "optimization" | "error_handling" | "best_practice";
  blocks?: Block[];
  connections?: Connection[];
  confidence: number;
}

export interface AIRequest {
  canvas: CanvasState;
  context?: string;
}

// Export
export interface ExportRequest {
  canvas: CanvasState;
  language: "discord.js" | "discord.py";
  settings: ProjectSettings;
}

export interface ExportResponse {
  files: ExportFile[];
  dependencies: Record<string, string>;
  instructions: string;
}

export interface ExportFile {
  path: string;
  content: string;
}
