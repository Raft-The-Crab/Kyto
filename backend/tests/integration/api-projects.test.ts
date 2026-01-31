import { describe, it, beforeAll, afterAll, expect, vi } from "vitest";
import { Hono } from "hono";
import { projectRoutes } from "../../src/api/projects";
import { Project } from "../../src/types";
import { Pool } from "pg";

// Mock database connection for tests
const mockProjects: Project[] = [];

// Mock the Pool class
const mockQuery = vi.fn();
const mockPool = {
  query: mockQuery,
  end: vi.fn(),
} as unknown as Pool;

// Mock the pgPool in the projects file
vi.mock("pg", () => ({
  Pool: vi.fn(() => mockPool),
}));

describe("Integration Tests - API Endpoints", () => {
  let app: Hono;
  let userId: string;

  beforeAll(() => {
    // Initialize the app with routes
    app = new Hono();
    app.route("/api/projects", projectRoutes);

    userId = "test-user-123";
  });

  afterAll(() => {
    // Clean up mocks
    vi.resetAllMocks();
  });

  describe("GET /api/projects", () => {
    it("should return a list of projects for a user", async () => {
      // Mock the database response
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            project: {
              id: "project-1",
              name: "Test Project 1",
              description: "A test project",
              language: "discord.js",
              userId,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          },
        ],
      });

      const req = new Request("http://localhost/api/projects", {
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("projects");
      expect(Array.isArray(data.projects)).toBe(true);
      expect(data.projects).toHaveLength(1);
      expect(data.projects[0]).toHaveProperty("id");
      expect(data.projects[0].id).toBe("project-1");
    });

    it("should return an empty list if no projects exist", async () => {
      // Mock empty database response
      mockQuery.mockResolvedValueOnce({
        rows: [],
      });

      const req = new Request("http://localhost/api/projects", {
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("projects");
      expect(data.projects).toHaveLength(0);
    });
  });

  describe("GET /api/projects/:id", () => {
    it("should return a specific project", async () => {
      const projectId = "project-123";

      // Mock the database response
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            project: {
              id: projectId,
              name: "Specific Project",
              description: "A specific project",
              language: "discord.js",
              userId,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          },
        ],
      });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("project");
      expect(data.project.id).toBe(projectId);
      expect(data.project.name).toBe("Specific Project");
    });

    it("should return 404 if project not found", async () => {
      const projectId = "nonexistent-project";

      // Mock empty database response
      mockQuery.mockResolvedValueOnce({
        rowCount: 0,
        rows: [],
      });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    it("should return 400 if invalid project ID", async () => {
      const req = new Request("http://localhost/api/projects/", {
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });
  });

  describe("POST /api/projects", () => {
    it("should create a new project", async () => {
      const newProjectData = {
        name: "New Test Project",
        description: "A brand new project",
        language: "discord.js",
        settings: {
          prefix: "!",
          botToken: "fake-token",
          clientId: "fake-client-id",
          intents: ["Guilds", "GuildMessages"],
        },
      };

      // Mock the database insert
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
      });

      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        headers: {
          "X-User-ID": userId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProjectData),
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("project");
      expect(data.project).toHaveProperty("id");
      expect(data.project.name).toBe("New Test Project");
      expect(data.project.userId).toBe(userId);
      expect(data.created).toBe(true);
    });

    it("should update an existing project", async () => {
      const existingProject = {
        id: "existing-project",
        name: "Updated Project Name",
        description: "Updated description",
        language: "discord.py",
        settings: {
          prefix: "/",
          botToken: "fake-token",
          clientId: "fake-client-id",
          intents: ["Guilds"],
        },
      };

      // Mock the database update
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
      });

      const req = new Request("http://localhost/api/projects", {
        method: "POST",
        headers: {
          "X-User-ID": userId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(existingProject),
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("project");
      expect(data.project.id).toBe("existing-project");
      expect(data.project.name).toBe("Updated Project Name");
      expect(data.created).toBe(false); // Should be false for updates
    });
  });

  describe("DELETE /api/projects/:id", () => {
    it("should delete an existing project", async () => {
      const projectId = "project-to-delete";

      // Mock the database delete
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
      });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("success");
      expect(data.success).toBe(true);
      expect(data).toHaveProperty("message");
      expect(data.message).toBe("Project deleted successfully");
    });

    it("should return 404 if trying to delete non-existent project", async () => {
      const projectId = "nonexistent-project";

      // Mock zero rows affected
      mockQuery.mockResolvedValueOnce({
        rowCount: 0,
      });

      const req = new Request(`http://localhost/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });

    it("should return 400 if invalid project ID", async () => {
      const req = new Request("http://localhost/api/projects/", {
        method: "DELETE",
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty("error");
    });
  });

  describe("GET /api/projects/stats/summary", () => {
    it("should return project statistics", async () => {
      // Mock the database response for stats query
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            project_count: 5,
            total_blocks: 23,
            total_connections: 18,
          },
        ],
      });

      const req = new Request("http://localhost/api/projects/stats/summary", {
        headers: {
          "X-User-ID": userId,
        },
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("stats");
      expect(data.stats).toHaveProperty("projectCount");
      expect(data.stats).toHaveProperty("totalBlocks");
      expect(data.stats).toHaveProperty("totalConnections");
      expect(data.stats.projectCount).toBe(5);
      expect(data.stats.totalBlocks).toBe(23);
      expect(data.stats.totalConnections).toBe(18);
    });
  });
});
