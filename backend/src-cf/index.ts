// Cloudflare Workers entry point
import { Hono } from "hono";
import { cors } from "hono/cors";
import { projectRoutes } from "./api/projects-cf";
import { exportRoutes } from "./api/export";
import { aiRoutes } from "./api/ai";
import { autoGenRoutes } from "./api/autoGen";
import { analyticsRoutes } from "./api/analytics";

// Create the main app
const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://kyto.dev",
      "https://kyto.pages.dev",
      "https://*.tauri.localhost", // Tauri apps
    ],
    credentials: true,
  })
);

// Health check
app.get("/", (c) => {
  return c.json({
    status: "ok",
    service: "Kyto Backend - Cloudflare Workers",
    version: "2.0.3",
    ai: "Rule-based + SLM",
    features: ["projects", "ai", "export", "collaboration", "auto-generate"],
  });
});

// API Routes
app.route("/api/projects", projectRoutes);
app.route("/api/export", exportRoutes);
app.route("/api/ai", aiRoutes);
app.route("/api/auto-gen", autoGenRoutes); // Fixed duplicate route
app.route("/api/analytics", analyticsRoutes);

// Export the worker
export default app;

// Define the environment type
declare global {
  interface Env {
    // D1 Database binding
    DB: D1Database;
    // Durable Objects
    COLLAB_ROOM: DurableObjectNamespace;
    // Environment variables
    ENVIRONMENT: string;
    // Add other bindings as needed
  }
}
