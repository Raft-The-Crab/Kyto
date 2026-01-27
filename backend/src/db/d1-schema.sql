-- D1 SQLite Schema for Kyto

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  data TEXT NOT NULL, -- JSON blob of canvas data
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived INTEGER DEFAULT 0 -- 0 = active, 1 = archived to GitHub
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_archived ON projects(archived);

-- Collaboration sessions (for Durable Objects state persistence)
CREATE TABLE IF NOT EXISTS collab_sessions (
  project_id TEXT PRIMARY KEY,
  active_users INTEGER DEFAULT 0,
  last_activity_at INTEGER NOT NULL
);

-- Analytics/Stats
CREATE TABLE IF NOT EXISTS export_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  language TEXT NOT NULL, -- discord.js or discord.py
  exported_at INTEGER NOT NULL,
  user_id TEXT
);

CREATE INDEX idx_export_stats_project ON export_stats(project_id);
