import { describe, it, beforeEach, expect, vi } from 'vitest';
import { ProjectService, DatabaseAdapter } from '../../src/services/project-service';
import { Project } from '../../src/types';

// Mock database adapter
class MockDatabaseAdapter implements DatabaseAdapter {
  private projects: Map<string, Project> = new Map();

  async connect(): Promise<void> {}
  async disconnect(): Promise<void> {}

  async getProject(userId: string, projectId: string): Promise<Project | null> {
    const project = Array.from(this.projects.values()).find(p => p.id === projectId && p.userId === userId);
    return project || null;
  }

  async saveProject(userId: string, project: Project): Promise<void> {
    this.projects.set(project.id, { ...project, userId });
  }

  async listProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    const project = await this.getProject(userId, projectId);
    if (project) {
      this.projects.delete(projectId);
    }
  }

  async getProjectStats(userId: string): Promise<{ projectCount: number; totalBlocks: number; totalConnections: number; }> {
    const projects = await this.listProjects(userId);
    return {
      projectCount: projects.length,
      totalBlocks: projects.reduce((acc, proj) => acc + (proj.canvas?.blocks?.length || 0), 0),
      totalConnections: projects.reduce((acc, proj) => acc + (proj.canvas?.connections?.length || 0), 0)
    };
  }
}

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockDb: MockDatabaseAdapter;

  beforeEach(() => {
    mockDb = new MockDatabaseAdapter();
    projectService = new ProjectService(mockDb);
  });

  describe('createProject', () => {
    it('should create a new project with correct properties', async () => {
      const userId = 'user123';
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
        language: 'discord.js' as const
      };

      const result = await projectService.createProject(userId, projectData);

      expect(result).toHaveProperty('id');
      expect(result.id).toBeTruthy();
      expect(result.userId).toBe(userId);
      expect(result.name).toBe('Test Project');
      expect(result.description).toBe('A test project');
      expect(result.language).toBe('discord.js');
      expect(result.createdAt).toBeLessThanOrEqual(Date.now());
      expect(result.updatedAt).toBeLessThanOrEqual(Date.now());
    });

    it('should save the project to the database', async () => {
      const userId = 'user123';
      const projectData = {
        name: 'Test Project',
        language: 'discord.js' as const
      };

      const result = await projectService.createProject(userId, projectData);

      const savedProject = await mockDb.getProject(userId, result.id);
      expect(savedProject).not.toBeNull();
      expect(savedProject!.name).toBe('Test Project');
    });
  });

  describe('getProject', () => {
    it('should retrieve an existing project', async () => {
      const userId = 'user123';
      const projectData = {
        id: 'project123',
        name: 'Test Project',
        language: 'discord.js' as const
      };

      // First save a project
      await mockDb.saveProject(userId, projectData as Project);

      const result = await projectService.getProject(userId, 'project123');

      expect(result).not.toBeNull();
      expect(result!.id).toBe('project123');
      expect(result!.name).toBe('Test Project');
    });

    it('should return null for non-existent project', async () => {
      const result = await projectService.getProject('user123', 'nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const userId = 'user123';
      const initialProject = {
        id: 'project123',
        name: 'Old Name',
        description: 'Old Description',
        language: 'discord.js' as const,
        userId,
        createdAt: Date.now() - 1000,
        updatedAt: Date.now() - 1000
      };

      // Save initial project
      await mockDb.saveProject(userId, initialProject as Project);

      // Update the project
      const updates = { name: 'New Name', description: 'New Description' };
      const result = await projectService.updateProject(userId, 'project123', updates);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('New Name');
      expect(result!.description).toBe('New Description');
      expect(result!.updatedAt).toBeGreaterThan(initialProject.updatedAt);
    });

    it('should return null for non-existent project', async () => {
      const result = await projectService.updateProject('user123', 'nonexistent', { name: 'New Name' });

      expect(result).toBeNull();
    });
  });

  describe('listProjects', () => {
    it('should return all projects for a user', async () => {
      const userId = 'user123';
      
      // Create multiple projects
      await mockDb.saveProject(userId, {
        id: 'project1',
        name: 'Project 1',
        language: 'discord.js' as const,
        userId
      } as Project);
      
      await mockDb.saveProject(userId, {
        id: 'project2',
        name: 'Project 2',
        language: 'discord.js' as const,
        userId
      } as Project);

      const result = await projectService.listProjects(userId);

      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toContain('project1');
      expect(result.map(p => p.id)).toContain('project2');
    });

    it('should only return projects for the specified user', async () => {
      const user1 = 'user1';
      const user2 = 'user2';
      
      // Create projects for different users
      await mockDb.saveProject(user1, {
        id: 'project1',
        name: 'Project 1',
        language: 'discord.js' as const,
        userId: user1
      } as Project);
      
      await mockDb.saveProject(user2, {
        id: 'project2',
        name: 'Project 2',
        language: 'discord.js' as const,
        userId: user2
      } as Project);

      const user1Projects = await projectService.listProjects(user1);
      const user2Projects = await projectService.listProjects(user2);

      expect(user1Projects).toHaveLength(1);
      expect(user1Projects[0].id).toBe('project1');
      
      expect(user2Projects).toHaveLength(1);
      expect(user2Projects[0].id).toBe('project2');
    });
  });

  describe('deleteProject', () => {
    it('should delete an existing project', async () => {
      const userId = 'user123';
      const project = {
        id: 'project123',
        name: 'Test Project',
        language: 'discord.js' as const,
        userId
      };

      // Save and then delete the project
      await mockDb.saveProject(userId, project as Project);
      const deleted = await projectService.deleteProject(userId, 'project123');

      expect(deleted).toBe(true);
      
      const retrieved = await projectService.getProject(userId, 'project123');
      expect(retrieved).toBeNull();
    });

    it('should return false for non-existent project', async () => {
      const deleted = await projectService.deleteProject('user123', 'nonexistent');

      expect(deleted).toBe(false);
    });
  });

  describe('getProjectStats', () => {
    it('should return correct project statistics', async () => {
      const userId = 'user123';
      
      // Create a project with canvas data
      await mockDb.saveProject(userId, {
        id: 'project1',
        name: 'Test Project',
        language: 'discord.js' as const,
        userId,
        canvas: {
          blocks: [{ id: 'block1', type: 'test', position: { x: 0, y: 0 } }, { id: 'block2', type: 'test', position: { x: 0, y: 0 } }],
          connections: [{ id: 'conn1', source: 'block1', target: 'block2' }]
        }
      } as Project);

      const stats = await projectService.getProjectStats(userId);

      expect(stats).toEqual({
        projectCount: 1,
        totalBlocks: 2,
        totalConnections: 1
      });
    });
  });
});