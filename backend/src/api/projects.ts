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

async function dbGetProjectsForUser(userId: string): Promise<Project[]> {
  if (!pgPool) return [];
  const res = await pgPool.query('SELECT project FROM projects WHERE user_id = $1', [userId]);
  return res.rows.map((r: any) => r.project as Project);
}

async function dbGetProject(userId: string, projectId: string): Promise<Project | null> {
  if (!pgPool) return null;
  const res = await pgPool.query('SELECT project FROM projects WHERE user_id = $1 AND id = $2', [userId, projectId]);
  if (res.rowCount === 0) return null;
  return res.rows[0].project as Project;
}

async function dbUpsertProject(userId: string, project: Project) {
  if (!pgPool) return;
  await pgPool.query(
    `INSERT INTO projects (id, user_id, project, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET project = EXCLUDED.project, updated_at = EXCLUDED.updated_at;
    `,
    [project.id, userId, project, project.createdAt, project.updatedAt],
  );
}

async function dbDeleteProject(userId: string, projectId: string) {
  if (!pgPool) return;
  await pgPool.query('DELETE FROM projects WHERE user_id = $1 AND id = $2', [userId, projectId]);
}

// Validation schemas
const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  language: z.enum(["discord.js", "discord.py"]),
  canvas: z.object({
    blocks: z.array(z.any()),
    connections: z.array(z.any()),
    selectedBlockId: z.string().nullable(),
    viewportPosition: z.object({ x: z.number(), y: z.number() }),
  }),
  settings: z.object({
    prefix: z.string(),
    botToken: z.string(),
    clientId: z.string(),
    intents: z.array(z.number()),
  }),
});

// GET /api/projects - List all projects
projectRoutes.get("/", async (c) => {
  try {
    const userId = c.req.header("X-User-ID") || "default";
    if (pgPool) {
      const dbProjects = await dbGetProjectsForUser(userId);
      return c.json({ projects: dbProjects });
    }

    const userProjects: Project[] = [];
    for (const [key, project] of projects.entries()) {
      if (key.startsWith(`user:${userId}:`)) {
        userProjects.push(project);
      }
    }

    return c.json({ projects: userProjects });
  } catch (error) {
    return c.json({ error: "Failed to list projects" }, 500);
  }
});

// GET /api/projects/:id - Get single project
projectRoutes.get("/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    const userId = c.req.header("X-User-ID") || "default";
    const key = `user:${userId}:project:${projectId}`;
    if (pgPool) {
      const project = await dbGetProject(userId, projectId);
      if (!project) return c.json({ error: "Project not found" }, 404);
      return c.json({ project });
    }

    const project = projects.get(key);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ project });
  } catch (error) {
    return c.json({ error: "Failed to load project" }, 500);
  }
});

// POST /api/projects - Create/Update project
projectRoutes.post("/", zValidator("json", projectSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const userId = c.req.header("X-User-ID") || "default";

    const projectId = data.id || crypto.randomUUID();
    const key = `user:${userId}:project:${projectId}`;

    const project: Project = {
      ...data,
      id: projectId,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as Project;

    if (pgPool) {
      await dbUpsertProject(userId, project);
      return c.json({ project });
    }

    projects.set(key, project);

    return c.json({ project });
  } catch (error) {
    return c.json({ error: "Failed to save project" }, 500);
  }
});

// DELETE /api/projects/:id - Delete project
projectRoutes.delete("/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    const userId = c.req.header("X-User-ID") || "default";
    const key = `user:${userId}:project:${projectId}`;

    if (pgPool) {
      await dbDeleteProject(userId, projectId);
      return c.json({ success: true });
    }

    projects.delete(key);

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to delete project" }, 500);
  }
});
