import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Project } from "../types";

export const projectRoutes = new Hono<{ Bindings: Env }>();

// Logging utility for Cloudflare Workers
function log(
  level: "info" | "error" | "warn",
  message: string,
  meta?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(
    `[${timestamp}] [${level.toUpperCase()}] [Projects-CF] ${message}${metaStr}`
  );
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

// Helper to get user ID from header or default
function getUserId(c: any): string {
  return c.req.header("X-User-ID") || "default";
}

// GET /api/projects - List all projects for a user
projectRoutes.get("/", async (c) => {
  const userId = getUserId(c);

  try {
    // Query D1 database for user's projects
    const results = await c.env.DB.prepare(
      `SELECT id, name, description, language, created_at, updated_at 
       FROM projects 
       WHERE user_id = ? AND deleted_at IS NULL 
       ORDER BY updated_at DESC`
    )
      .bind(userId)
      .all();

    const projects = results.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      language: row.language,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    log("info", "Listed projects from D1", {
      userId,
      count: projects.length,
    });

    return c.json({ projects, source: "d1" });
  } catch (error) {
    log("error", "Failed to list projects", { userId, error: String(error) });
    return c.json({ error: "Failed to list projects. Please try again." }, 500);
  }
});

// GET /api/projects/:id - Get a single project
projectRoutes.get("/:id", async (c) => {
  const projectId = c.req.param("id");
  const userId = getUserId(c);

  // Validate project ID format
  if (!projectId || projectId.length < 1) {
    return c.json({ error: "Invalid project ID" }, 400);
  }

  try {
    // Query D1 database for the specific project
    const result = await c.env.DB.prepare(
      `SELECT project_data FROM projects 
       WHERE id = ? AND user_id = ? AND deleted_at IS NULL`
    )
      .bind(projectId, userId)
      .first();

    if (!result) {
      log("warn", "Project not found in D1", { userId, projectId });
      return c.json({ error: "Project not found" }, 404);
    }

    const project = JSON.parse(result.project_data as string);

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
  const userId = getUserId(c);

  try {
    const data = c.req.valid("json");
    const now = Date.now();
    const projectId = data.id || crypto.randomUUID();
    const isUpdate = Boolean(data.id);

    // Prepare the project data to store
    const projectToStore = {
      ...data,
      id: projectId,
      userId,
      createdAt: isUpdate ? undefined : now, // Will be set by DB if new
      updatedAt: now,
    };

    // Serialize the project data for storage
    const projectData = JSON.stringify(projectToStore);

    if (isUpdate) {
      // Update existing project
      await c.env.DB.prepare(
        `UPDATE projects 
         SET name = ?, description = ?, language = ?, project_data = ?, updated_at = ?
         WHERE id = ? AND user_id = ?`
      )
        .bind(
          projectToStore.name,
          projectToStore.description,
          projectToStore.language,
          projectData,
          now,
          projectId,
          userId
        )
        .run();
    } else {
      // Insert new project
      await c.env.DB.prepare(
        `INSERT INTO projects (id, user_id, name, description, language, project_data, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          projectId,
          userId,
          projectToStore.name,
          projectToStore.description,
          projectToStore.language,
          projectData,
          now,
          now
        )
        .run();
    }

    log("info", "Project saved to D1", { userId, projectId, isUpdate });

    return c.json({ project: projectToStore, created: !isUpdate });
  } catch (error) {
    log("error", "Failed to save project", { userId, error: String(error) });
    return c.json({ error: "Failed to save project. Please try again." }, 500);
  }
});

// DELETE /api/projects/:id - Delete a project
projectRoutes.delete("/:id", async (c) => {
  const projectId = c.req.param("id");
  const userId = getUserId(c);

  // Validate project ID
  if (!projectId || projectId.length < 1) {
    return c.json({ error: "Invalid project ID" }, 400);
  }

  try {
    // Soft delete by setting deleted_at
    const result = await c.env.DB.prepare(
      `UPDATE projects 
       SET deleted_at = ?
       WHERE id = ? AND user_id = ? AND deleted_at IS NULL`
    )
      .bind(Date.now(), projectId, userId)
      .run();

    if (result.meta.changes === 0) {
      log("warn", "Project not found for deletion", { userId, projectId });
      return c.json({ error: "Project not found" }, 404);
    }

    log("info", "Project soft-deleted in D1", { userId, projectId });
    return c.json({
      success: true,
      message: "Project deleted successfully",
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

// GET /api/projects/stats/summary - Get project statistics for a user
projectRoutes.get("/stats/summary", async (c) => {
  const userId = getUserId(c);

  try {
    // Get project count and stats from D1
    const countResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as project_count,
              SUM(CASE WHEN project_data LIKE '%"blocks"%'
                   THEN (SELECT COUNT(*) FROM json_each(json_extract(project_data, '$.canvas.blocks')))
                   ELSE 0 END) as total_blocks,
              SUM(CASE WHEN project_data LIKE '%"connections"%'
                   THEN (SELECT COUNT(*) FROM json_each(json_extract(project_data, '$.canvas.connections')))
                   ELSE 0 END) as total_connections
       FROM projects 
       WHERE user_id = ? AND deleted_at IS NULL`
    )
      .bind(userId)
      .first();

    const stats = {
      projectCount: Number(countResult?.project_count || 0),
      totalBlocks: Number(countResult?.total_blocks || 0),
      totalConnections: Number(countResult?.total_connections || 0),
      storageType: "d1",
    };

    log("info", "Retrieved project stats from D1", {
      userId,
      stats,
    });

    return c.json({ stats });
  } catch (error) {
    log("error", "Failed to get project stats", {
      userId,
      error: String(error),
    });
    return c.json({ error: "Failed to get statistics" }, 500);
  }
});
