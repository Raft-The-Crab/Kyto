import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Project } from "../types";
import { Pool } from "pg";

// Initialize Postgres pool if DATABASE_URL provided (Railway)
const DATABASE_URL = process.env.DATABASE_URL;
let pgPool: Pool | null = null;
if (DATABASE_URL) {
  pgPool = new Pool({ connectionString: DATABASE_URL });
}

export const projectRoutes = new Hono();

// In-memory storage fallback
const projects = new Map<string, Project>();

// Logging utility
function log(
  level: "info" | "error" | "warn",
  message: string,
  meta?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(
    `[${timestamp}] [${level.toUpperCase()}] [Projects] ${message}${metaStr}`
  );
}

// Database helper functions with improved error handling
async function dbGetProjectsForUser(userId: string): Promise<Project[]> {
  if (!pgPool) return [];
  try {
    const res = await pgPool.query(
      "SELECT project FROM projects WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId]
    );
    return res.rows.map((r: { project: Project }) => r.project);
  } catch (error) {
    log("error", "Failed to fetch projects from database", {
      userId,
      error: String(error),
    });
    throw error;
  }
}

async function dbGetProject(
  userId: string,
  projectId: string
): Promise<Project | null> {
  if (!pgPool) return null;
  try {
    const res = await pgPool.query(
      "SELECT project FROM projects WHERE user_id = $1 AND id = $2",
      [userId, projectId]
    );
    if (res.rowCount === 0) return null;
    return res.rows[0].project as Project;
  } catch (error) {
    log("error", "Failed to fetch project from database", {
      userId,
      projectId,
      error: String(error),
    });
    throw error;
  }
}

async function dbUpsertProject(
  userId: string,
  project: Project
): Promise<void> {
  if (!pgPool) return;
  try {
    await pgPool.query(
      `INSERT INTO projects (id, user_id, project, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET project = EXCLUDED.project, updated_at = EXCLUDED.updated_at`,
      [
        project.id,
        userId,
        JSON.stringify(project),
        project.createdAt,
        project.updatedAt,
      ]
    );
    log("info", "Project saved", { userId, projectId: project.id });
  } catch (error) {
    log("error", "Failed to save project to database", {
      userId,
      projectId: project.id,
      error: String(error),
    });
    throw error;
  }
}

async function dbDeleteProject(
  userId: string,
  projectId: string
): Promise<void> {
  if (!pgPool) return;
  try {
    await pgPool.query("DELETE FROM projects WHERE user_id = $1 AND id = $2", [
      userId,
      projectId,
    ]);
    log("info", "Project deleted", { userId, projectId });
  } catch (error) {
    log("error", "Failed to delete project from database", {
      userId,
      projectId,
      error: String(error),
    });
    throw error;
  }
}

// Validation schemas with more specific types
const canvasBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.unknown()).optional(),
});

const canvasConnectionSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
});

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name too long"),
  description: z.string().max(500, "Description too long").optional(),
  language: z.enum(["discord.js", "discord.py"]),
  canvas: z.object({
    blocks: z.array(canvasBlockSchema).default([]),
    connections: z.array(canvasConnectionSchema).default([]),
    selectedBlockId: z.string().nullable().optional(),
    viewportPosition: z
      .object({ x: z.number(), y: z.number() })
      .default({ x: 0, y: 0 }),
  }),
  settings: z.object({
    prefix: z.string().max(10).default("!"),
    botToken: z.string().default(""),
    clientId: z.string().default(""),
    intents: z.array(z.union([z.number(), z.string()])).default([]),
  }),
});

// GET /api/projects - List all projects for a user
projectRoutes.get("/", async (c) => {
  const userId = c.req.header("X-User-ID") || "default";

  try {
    if (pgPool) {
      const dbProjects = await dbGetProjectsForUser(userId);
      log("info", "Listed projects from database", {
        userId,
        count: dbProjects.length,
      });
      return c.json({ projects: dbProjects, source: "database" });
    }

    // In-memory fallback
    const userProjects: Project[] = [];
    for (const [key, project] of projects.entries()) {
      if (key.startsWith(`user:${userId}:`)) {
        userProjects.push(project);
      }
    }

    // Sort by updatedAt descending
    userProjects.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    log("info", "Listed projects from memory", {
      userId,
      count: userProjects.length,
    });
    return c.json({ projects: userProjects, source: "memory" });
  } catch (error) {
    log("error", "Failed to list projects", { userId, error: String(error) });
    return c.json({ error: "Failed to list projects. Please try again." }, 500);
  }
});

// GET /api/projects/:id - Get a single project
projectRoutes.get("/:id", async (c) => {
  const projectId = c.req.param("id");
  const userId = c.req.header("X-User-ID") || "default";

  // Validate project ID format
  if (!projectId || projectId.length < 1) {
    return c.json({ error: "Invalid project ID" }, 400);
  }

  try {
    if (pgPool) {
      const project = await dbGetProject(userId, projectId);
      if (!project) {
        log("warn", "Project not found in database", { userId, projectId });
        return c.json({ error: "Project not found" }, 404);
      }
      return c.json({ project });
    }

    // In-memory fallback
    const key = `user:${userId}:project:${projectId}`;
    const project = projects.get(key);

    if (!project) {
      log("warn", "Project not found in memory", { userId, projectId });
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project });
  } catch (error) {
    log("error", "Failed to load project", {
      userId,
      projectId,
      error: String(error),
    });
    return c.json({ error: "Failed to load project. Please try again." }, 500);
  }
});

// POST /api/projects - Create or update a project
projectRoutes.post("/", zValidator("json", projectSchema), async (c) => {
  const userId = c.req.header("X-User-ID") || "default";

  try {
    const data = c.req.valid("json");
    const now = Date.now();
    const projectId = data.id || crypto.randomUUID();
    const key = `user:${userId}:project:${projectId}`;

    // Check if this is an update or create
    const isUpdate = Boolean(data.id);

    const project: Project = {
      ...data,
      id: projectId,
      userId,
      createdAt: isUpdate ? projects.get(key)?.createdAt || now : now,
      updatedAt: now,
    } as Project;

    if (pgPool) {
      await dbUpsertProject(userId, project);
      return c.json({ project, created: !isUpdate });
    }

    // In-memory fallback
    projects.set(key, project);
    log("info", "Project saved to memory", { userId, projectId, isUpdate });

    return c.json({ project, created: !isUpdate });
  } catch (error) {
    log("error", "Failed to save project", { userId, error: String(error) });
    return c.json({ error: "Failed to save project. Please try again." }, 500);
  }
});

// DELETE /api/projects/:id - Delete a project
projectRoutes.delete("/:id", async (c) => {
  const projectId = c.req.param("id");
  const userId = c.req.header("X-User-ID") || "default";

  // Validate project ID
  if (!projectId || projectId.length < 1) {
    return c.json({ error: "Invalid project ID" }, 400);
  }

  try {
    if (pgPool) {
      await dbDeleteProject(userId, projectId);
      return c.json({ success: true, message: "Project deleted successfully" });
    }

    // In-memory fallback
    const key = `user:${userId}:project:${projectId}`;
    const existed = projects.has(key);
    projects.delete(key);

    log("info", "Project deleted from memory", { userId, projectId, existed });
    return c.json({
      success: true,
      message: existed ? "Project deleted successfully" : "Project not found",
    });
  } catch (error) {
    log("error", "Failed to delete project", {
      userId,
      projectId,
      error: String(error),
    });
    return c.json(
      { error: "Failed to delete project. Please try again." },
      500
    );
  }
});

// GET /api/projects/stats - Get project statistics for a user
projectRoutes.get("/stats/summary", async (c) => {
  const userId = c.req.header("X-User-ID") || "default";

  try {
    let projectCount = 0;
    let totalBlocks = 0;
    let totalConnections = 0;

    if (pgPool) {
      const dbProjects = await dbGetProjectsForUser(userId);
      projectCount = dbProjects.length;
      for (const p of dbProjects) {
        totalBlocks += p.canvas?.blocks?.length || 0;
        totalConnections += p.canvas?.connections?.length || 0;
      }
    } else {
      for (const [key, project] of projects.entries()) {
        if (key.startsWith(`user:${userId}:`)) {
          projectCount++;
          totalBlocks += project.canvas?.blocks?.length || 0;
          totalConnections += project.canvas?.connections?.length || 0;
        }
      }
    }

    return c.json({
      stats: {
        projectCount,
        totalBlocks,
        totalConnections,
        storageType: pgPool ? "database" : "memory",
      },
    });
  } catch (error) {
    log("error", "Failed to get project stats", {
      userId,
      error: String(error),
    });
    return c.json({ error: "Failed to get statistics" }, 500);
  }
});
