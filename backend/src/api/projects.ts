import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../index";
import type { Project } from "../types";

export const projectRoutes = new Hono<{ Bindings: Env }>();

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
    const projectsList = await c.env.PROJECTS_KV.list({
      prefix: `user:${userId}:`,
    });

    const projects: Project[] = [];
    for (const key of projectsList.keys) {
      const project = await c.env.PROJECTS_KV.get(key.name, "json");
      if (project) projects.push(project as Project);
    }

    return c.json({ projects });
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

    const project = await c.env.PROJECTS_KV.get(key, "json");

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

    await c.env.PROJECTS_KV.put(key, JSON.stringify(project));

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

    await c.env.PROJECTS_KV.delete(key);

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to delete project" }, 500);
  }
});
