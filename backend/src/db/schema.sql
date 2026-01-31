-- Kyto D1 Database Schema

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL DEFAULT 'discord.js',
    project_data TEXT NOT NULL, -- JSON serialized project data
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);

-- Collaboration rooms table
CREATE TABLE IF NOT EXISTS collab_rooms (
    room_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

-- Analytics data table
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT,
    created_at INTEGER NOT NULL
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_event ON analytics(user_id, event_type);