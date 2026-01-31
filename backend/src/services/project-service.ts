import { Project } from "../types";

export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getProject(userId: string, projectId: string): Promise<Project | null>;
  saveProject(userId: string, project: Project): Promise<void>;
  listProjects(userId: string): Promise<Project[]>;
  deleteProject(userId: string, projectId: string): Promise<void>;
  getProjectStats(userId: string): Promise<{
    projectCount: number;
    totalBlocks: number;
    totalConnections: number;
  }>;
}

export abstract class BaseService {
  protected log(
    level: "info" | "error" | "warn",
    message: string,
    meta?: Record<string, unknown>
  ): void {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.log(
      `[${timestamp}] [${level.toUpperCase()}] [${
        this.constructor.name
      }] ${message}${metaStr}`
    );
  }
}

export class ProjectService extends BaseService {
  constructor(private db: DatabaseAdapter) {
    super();
  }

  async createProject(
    userId: string,
    projectData: Partial<Project>
  ): Promise<Project> {
    try {
      const project = {
        ...projectData,
        id: crypto.randomUUID ? crypto.randomUUID() : this.generateId(), // Fallback for environments without crypto
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Project;

      await this.db.saveProject(userId, project);
      this.log("info", "Project created", { userId, projectId: project.id });

      return project;
    } catch (error) {
      this.log("error", "Failed to create project", {
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async getProject(userId: string, projectId: string): Promise<Project | null> {
    try {
      const project = await this.db.getProject(userId, projectId);
      if (project) {
        this.log("info", "Project retrieved", { userId, projectId });
      } else {
        this.log("warn", "Project not found", { userId, projectId });
      }
      return project;
    } catch (error) {
      this.log("error", "Failed to get project", {
        userId,
        projectId,
        error: error.message,
      });
      throw error;
    }
  }

  async updateProject(
    userId: string,
    projectId: string,
    updates: Partial<Project>
  ): Promise<Project | null> {
    try {
      const project = await this.db.getProject(userId, projectId);
      if (!project) {
        return null;
      }

      const updatedProject = {
        ...project,
        ...updates,
        updatedAt: Date.now(),
      };

      await this.db.saveProject(userId, updatedProject);
      this.log("info", "Project updated", { userId, projectId });

      return updatedProject;
    } catch (error) {
      this.log("error", "Failed to update project", {
        userId,
        projectId,
        error: error.message,
      });
      throw error;
    }
  }

  async listProjects(userId: string): Promise<Project[]> {
    try {
      const projects = await this.db.listProjects(userId);
      this.log("info", "Projects listed", { userId, count: projects.length });
      return projects;
    } catch (error) {
      this.log("error", "Failed to list projects", {
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    try {
      await this.db.deleteProject(userId, projectId);
      this.log("info", "Project deleted", { userId, projectId });
      return true;
    } catch (error) {
      this.log("error", "Failed to delete project", {
        userId,
        projectId,
        error: error.message,
      });
      return false;
    }
  }

  async getProjectStats(userId: string) {
    try {
      const stats = await this.db.getProjectStats(userId);
      this.log("info", "Project stats retrieved", { userId, stats });
      return stats;
    } catch (error) {
      this.log("error", "Failed to get project stats", {
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  private generateId(): string {
    // Simple UUID v4 generator for environments without crypto
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
