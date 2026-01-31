// Kyto Backend Architecture Documentation
//
// This document outlines the enhanced architecture for the Kyto backend
// organized to support multiple deployment targets (Node.js, Cloudflare Workers)

/**
 * Core Architecture Principles:
 *
 * 1. Abstraction Layer: Common interfaces that work across all environments
 * 2. Adapter Pattern: Environment-specific implementations
 * 3. Dependency Injection: Configurable backend services
 * 4. Modular Design: Separated concerns with clear boundaries
 */

// 1. ABSTRACTIONS (Common Interfaces)
// ===================================
// Define common interfaces that all environments must implement

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<any>;
  getProject(userId: string, projectId: string): Promise<Project | null>;
  saveProject(userId: string, project: Project): Promise<void>;
  listProjects(userId: string): Promise<Project[]>;
  deleteProject(userId: string, projectId: string): Promise<void>;
}

export interface StorageAdapter {
  save(key: string, value: any): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}

export interface CollaborationAdapter {
  createRoom(roomId: string): Promise<CollaborationRoom>;
  joinRoom(roomId: string, userId: string): Promise<void>;
  leaveRoom(roomId: string, userId: string): Promise<void>;
  broadcast(
    roomId: string,
    message: any,
    excludeUserId?: string
  ): Promise<void>;
}

export interface AnalyticsAdapter {
  trackEvent(userId: string, event: AnalyticsEvent): Promise<void>;
  getAnalytics(userId: string, timeRange: TimeRange): Promise<AnalyticsData>;
}

// 2. ADAPTER IMPLEMENTATIONS
// ==========================
// Environment-specific implementations

// Node.js PostgreSQL adapter
export class PostgreSQLAdapter implements DatabaseAdapter {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async connect(): Promise<void> {
    // Already handled by Pool
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }

  // Implementation details...
}

// Cloudflare D1 adapter
export class D1Adapter implements DatabaseAdapter {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async connect(): Promise<void> {
    // D1 is connectionless
  }

  async disconnect(): Promise<void> {
    // Not applicable for D1
  }

  // Implementation details...
}

// 3. SERVICE LAYER
// ================
// Business logic that uses adapters

export class ProjectService {
  constructor(private db: DatabaseAdapter) {}

  async createProject(
    userId: string,
    projectData: Partial<Project>
  ): Promise<Project> {
    const project = {
      ...projectData,
      id: crypto.randomUUID(),
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as Project;

    await this.db.saveProject(userId, project);
    return project;
  }

  async getProject(userId: string, projectId: string): Promise<Project | null> {
    return await this.db.getProject(userId, projectId);
  }

  async updateProject(
    userId: string,
    projectId: string,
    updates: Partial<Project>
  ): Promise<Project | null> {
    const project = await this.db.getProject(userId, projectId);
    if (!project) return null;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: Date.now(),
    };

    await this.db.saveProject(userId, updatedProject);
    return updatedProject;
  }
}

export class CollaborationService {
  constructor(private collabAdapter: CollaborationAdapter) {}

  async createCollaborationSession(
    projectId: string,
    userId: string
  ): Promise<string> {
    const roomId = `project-${projectId}`;
    await this.collabAdapter.joinRoom(roomId, userId);
    return roomId;
  }
}

// 4. CONTROLLER LAYER
// ===================
// Framework-agnostic controllers that use services

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  async handleGetProjects(userId: string) {
    try {
      const projects = await this.projectService.listProjects(userId);
      return { success: true, data: { projects } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async handleCreateProject(userId: string, projectData: any) {
    try {
      const project = await this.projectService.createProject(
        userId,
        projectData
      );
      return { success: true, data: { project } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// 5. FRAMEWORK ADAPTERS
// =====================
// Framework-specific implementations (Hono, Express, Cloudflare Workers)

// For Hono (Node.js)
export function createHonoProjectRoutes(projectController: ProjectController) {
  const router = new Hono();

  router.get("/", async (c) => {
    const userId = c.req.header("X-User-ID") || "default";
    const result = await projectController.handleGetProjects(userId);

    if (result.success) {
      return c.json(result.data);
    } else {
      return c.json({ error: result.error }, 500);
    }
  });

  return router;
}

// For Cloudflare Workers
export function createWorkerProjectRoutes(
  projectController: ProjectController
) {
  return {
    async fetch(request: Request, env: Env, ctx: ExecutionContext) {
      const url = new URL(request.url);
      const userId = request.headers.get("X-User-ID") || "default";

      if (request.method === "GET" && url.pathname.endsWith("/api/projects")) {
        const result = await projectController.handleGetProjects(userId);

        if (result.success) {
          return new Response(JSON.stringify(result.data), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      return new Response("Not Found", { status: 404 });
    },
  };
}

// 6. DEPENDENCY INJECTION CONTAINER
// =================================
// Centralized configuration based on environment

export class DIContainer {
  static create(env: "node" | "cloudflare" | "tauri", config: any) {
    let dbAdapter: DatabaseAdapter;

    switch (env) {
      case "node":
        dbAdapter = new PostgreSQLAdapter(config.databaseUrl);
        break;
      case "cloudflare":
        dbAdapter = new D1Adapter(config.db as D1Database);
        break;
      case "tauri":
        // For Tauri, we might use a different storage mechanism
        dbAdapter = new TauriDatabaseAdapter(config.storagePath);
        break;
      default:
        throw new Error(`Unsupported environment: ${env}`);
    }

    // Create services with their dependencies
    const projectService = new ProjectService(dbAdapter);
    const projectController = new ProjectController(projectService);

    return {
      projectService,
      projectController,
      dbAdapter,
    };
  }
}

// 7. CONFIGURATION MANAGEMENT
// ===========================
// Environment-aware configuration

export interface AppConfig {
  environment: "development" | "staging" | "production";
  database: {
    type: "postgresql" | "d1" | "sqlite" | "tauri-storage";
    url?: string;
    binding?: string; // For Cloudflare D1
  };
  features: {
    collaboration: boolean;
    analytics: boolean;
    ai: boolean;
  };
  limits: {
    maxProjectsPerUser: number;
    maxStoragePerUser: number; // in MB
    maxCollaboratorsPerProject: number;
  };
}

export class ConfigService {
  static load(): AppConfig {
    const env = process.env.NODE_ENV || "development";

    return {
      environment: env as any,
      database: {
        type: (process.env.DB_TYPE as any) || "postgresql",
        url: process.env.DATABASE_URL,
        binding: process.env.D1_BINDING_NAME,
      },
      features: {
        collaboration: process.env.FEATURE_COLLABORATION !== "false",
        analytics: process.env.FEATURE_ANALYTICS !== "false",
        ai: process.env.FEATURE_AI !== "false",
      },
      limits: {
        maxProjectsPerUser: parseInt(
          process.env.MAX_PROJECTS_PER_USER || "10",
          10
        ),
        maxStoragePerUser: parseInt(
          process.env.MAX_STORAGE_PER_USER || "100",
          10
        ),
        maxCollaboratorsPerProject: parseInt(
          process.env.MAX_COLLABORATORS || "5",
          10
        ),
      },
    };
  }
}
