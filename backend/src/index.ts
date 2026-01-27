import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { projectRoutes } from "./api/projects.js";
import { exportRoutes } from "./api/export.js";
import { aiRoutes } from "./api/ai.js";
import { autoGenRoutes } from "./api/autoGen.js";
import { setupCollabWebSocket } from "./collab/room.js";

const app = new Hono();

// CORS for frontend
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://kyto.app",
      "https://kyto.pages.dev",
    ],
    credentials: true,
  }),
);

// Health check
app.get("/", (c) =>
  c.json({
    status: "ok",
    service: "Kyto Backend",
    version: "1.0.0",
    ai: "Rule-based + SLM",
    features: ["projects", "ai", "export", "collaboration", "auto-generate"],
  }),
);

// API Routes
app.route("/api/projects", projectRoutes);
app.route("/api/export", exportRoutes);
app.route("/api/ai", aiRoutes);
app.route("/api/ai", autoGenRoutes);

// Server setup with WebSocket support
const port = Number(process.env.PORT) || 8787;

if (process.env.NODE_ENV === "production") {
  const server = serve({ fetch: app.fetch, port });
  setupCollabWebSocket(server);
  console.log(`[Kyto] Production server running on port ${port}`);
} else {
  const server = serve({ fetch: app.fetch, port });
  setupCollabWebSocket(server);
  console.log(`[Kyto] Development server running on http://localhost:${port}`);
}

export default app;

