import { Hono } from "hono";
import { cors } from "hono/cors";
import { projectRoutes } from "./api/projects.js";
import { exportRoutes } from "./api/export.js";
import { aiRoutes } from "./api/ai.js";

export interface Env {
  PROJECTS_KV: KVNamespace;
  COLLABORATION: DurableObjectNamespace;
}

const app = new Hono<{ Bindings: Env }>();

// CORS for frontend
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000", "https://botify.app"],
    credentials: true,
  }),
);

// Health check
app.get("/", (c) =>
  c.json({
    status: "ok",
    service: "Botify Backend",
    version: "1.0.0",
  }),
);

// API Routes
app.route("/api/projects", projectRoutes);
app.route("/api/export", exportRoutes);
app.route("/api/ai", aiRoutes);

// Collaboration WebSocket (handled by Durable Object)
app.get("/collab/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const upgradeHeader = c.req.header("Upgrade");

  if (upgradeHeader !== "websocket") {
    return c.text("Expected WebSocket", 400);
  }

  const id = c.env.COLLABORATION.idFromName(projectId);
  const stub = c.env.COLLABORATION.get(id);

  return stub.fetch(c.req.raw);
});

export default app;

// Export Durable Object for collaboration
export { CollaborationRoom } from "./collab/room.js";
