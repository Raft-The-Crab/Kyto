// @ts-nocheck
/**
 * Multi-Tier Storage Service for Tauri
 * Free-tier architecture: LocalDB → MongoDB 1 → MongoDB 2 → GitHub → Cleanup
 *
 * Storage Limits:
 * - LocalDB (SQLite): Unlimited (local disk)
 * - MongoDB Account 1: 512MB free tier
 * - MongoDB Account 2: 512MB free tier
 * - GitHub Private Repo: Unlimited
 */

// import { MongoClient } from 'mongodb'
// import { Octokit } from '@octokit/rest'

interface Project {
  id: string
  name: string
  data: unknown
  createdAt: number
  updatedAt: number
  size: number // bytes
}

interface StorageConfig {
  mongodb1: {
    uri: string
    database: string
    maxSize: number // 400MB (80% of 512MB)
  }
  mongodb2: {
    uri: string
    database: string
    maxSize: number // 400MB (80% of 512MB)
  }
  github: {
    token: string
    owner: string
    repo: string
  }
}

export class MultiTierStorage {
  private config: StorageConfig
  // private mongo1: MongoClient
  // private mongo2: MongoClient
  // private github: Octokit

  constructor(config: StorageConfig) {
    this.config = config
    // this.mongo1 = new MongoClient(config.mongodb1.uri)
    // this.mongo2 = new MongoClient(config.mongodb2.uri)
    // this.github = new Octokit({ auth: config.github.token })
  }

  /**
   * Save project with automatic tier management
   */
  async saveProject(project: Project): Promise<void> {
    // 1. Always save to LocalDB first (handled by Tauri SQLite)
    // This is the primary storage, always available offline

    // 2. Sync to cloud tiers when online
    if (navigator.onLine) {
      await this.syncToCloud(project)
    }
  }

  /**
   * Sync project to cloud tiers
   */
  private async syncToCloud(project: Project): Promise<void> {
    try {
      // Try MongoDB 1 first
      const db1 = this.mongo1.db(this.config.mongodb1.database)
      const collection1 = db1.collection('projects')

      await collection1.updateOne({ id: project.id }, { $set: project }, { upsert: true })

      // Check if MongoDB 1 needs archival
      const usage1 = await this.getMongoUsage(this.mongo1, this.config.mongodb1.database)

      if (usage1 > this.config.mongodb1.maxSize) {
        console.log('[Storage] MongoDB 1 full, migrating to MongoDB 2...')
        await this.migrateToMongo2()
      }
    } catch (error) {
      console.error('[Storage] Failed to sync to MongoDB 1:', error)
    }
  }

  /**
   * Migrate oldest data from MongoDB 1 to MongoDB 2
   */
  private async migrateToMongo2(): Promise<void> {
    const db1 = this.mongo1.db(this.config.mongodb1.database)
    const db2 = this.mongo2.db(this.config.mongodb2.database)

    // Get oldest 50% of projects from MongoDB 1
    const oldProjects = await db1
      .collection('projects')
      .find()
      .sort({ updatedAt: 1 })
      .limit((await db1.collection('projects').countDocuments()) / 2)
      .toArray()

    // Move to MongoDB 2
    if (oldProjects.length > 0) {
      await db2.collection('projects').insertMany(oldProjects)
      await db1.collection('projects').deleteMany({
        id: { $in: oldProjects.map((p: Project) => p.id) },
      })

      console.log(`[Storage] Migrated ${oldProjects.length} projects to MongoDB 2`)
    }

    // Check if MongoDB 2 also needs archival
    const usage2 = await this.getMongoUsage(this.mongo2, this.config.mongodb2.database)

    if (usage2 > this.config.mongodb2.maxSize) {
      console.log('[Storage] MongoDB 2 full, archiving to GitHub...')
      await this.archiveToGitHub()
    }
  }

  /**
   * Archive oldest data from MongoDB 2 to GitHub
   */
  private async archiveToGitHub(): Promise<void> {
    const db2 = this.mongo2.db(this.config.mongodb2.database)

    // Get oldest 50% of projects
    const archiveProjects = await db2
      .collection('projects')
      .find()
      .sort({ updatedAt: 1 })
      .limit((await db2.collection('projects').countDocuments()) / 2)
      .toArray()

    if (archiveProjects.length === 0) return

    // Create archive file
    const archiveName = `archive_${Date.now()}.json`
    const archiveContent = JSON.stringify(archiveProjects, null, 2)
    const encodedContent = Buffer.from(archiveContent).toString('base64')

    try {
      // Push to GitHub
      await this.github.repos.createOrUpdateFileContents({
        owner: this.config.github.owner,
        repo: this.config.github.repo,
        path: `archives/${archiveName}`,
        message: `Archive ${archiveProjects.length} projects`,
        content: encodedContent,
      })

      // Delete archived projects from MongoDB 2
      await db2.collection('projects').deleteMany({
        id: { $in: archiveProjects.map((p: Project) => p.id) },
      })

      console.log(`[Storage] Archived ${archiveProjects.length} projects to GitHub`)
    } catch (error) {
      console.error('[Storage] Failed to archive to GitHub:', error)
    }
  }

  /**
   * Get current storage usage for a MongoDB instance
   */
  private async getMongoUsage(client: MongoClient, dbName: string): Promise<number> {
    const db = client.db(dbName)
    const stats = await db.stats()
    return stats.dataSize || 0
  }

  /**
   * Load project (tries all tiers)
   */
  async loadProject(id: string): Promise<Project | null> {
    // 1. Try LocalDB first (fastest, always available)
    // (handled by Tauri SQLite layer)

    // 2. Try MongoDB 1
    try {
      const db1 = this.mongo1.db(this.config.mongodb1.database)
      const project = await db1.collection('projects').findOne({ id })
      if (project) return project as Project
    } catch (error) {
      console.error('[Storage] MongoDB 1 lookup failed:', error)
    }

    // 3. Try MongoDB 2
    try {
      const db2 = this.mongo2.db(this.config.mongodb2.database)
      const project = await db2.collection('projects').findOne({ id })
      if (project) return project as Project
    } catch (error) {
      console.error('[Storage] MongoDB 2 lookup failed:', error)
    }

    // 4. Check GitHub archives (slowest, rarely needed)
    try {
      const archives = await this.github.repos.getContent({
        owner: this.config.github.owner,
        repo: this.config.github.repo,
        path: 'archives',
      })

      if (Array.isArray(archives.data)) {
        for (const file of archives.data) {
          const content = await this.github.repos.getContent({
            owner: this.config.github.owner,
            repo: this.config.github.repo,
            path: file.path,
          })

          if ('content' in content.data) {
            const decoded = Buffer.from(content.data.content, 'base64').toString()
            const projects: Project[] = JSON.parse(decoded)
            const found = projects.find(p => p.id === id)
            if (found) return found
          }
        }
      }
    } catch (error) {
      console.error('[Storage] GitHub archive search failed:', error)
    }

    return null
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    const usage1 = await this.getMongoUsage(this.mongo1, this.config.mongodb1.database)
    const usage2 = await this.getMongoUsage(this.mongo2, this.config.mongodb2.database)

    return {
      mongodb1: {
        used: usage1,
        total: this.config.mongodb1.maxSize,
        percentage: (usage1 / this.config.mongodb1.maxSize) * 100,
      },
      mongodb2: {
        used: usage2,
        total: this.config.mongodb2.maxSize,
        percentage: (usage2 / this.config.mongodb2.maxSize) * 100,
      },
      github: {
        archived: 'Unlimited',
      },
    }
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    await this.mongo1.close()
    await this.mongo2.close()
  }
}
