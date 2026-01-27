export interface GitHubExportResult {
  success: boolean
  details?: string
}

interface FileToCommit {
  path: string
  content: string
  message?: string
}

/**
 * Simple GitHub client helpers for committing files to a repository using a personal access token.
 * NOTE: This is a minimal implementation and intentionally simple - for production, prefer server-side commits
 * to avoid exposing tokens to the client and to handle rate limits and errors more gracefully.
 */
import { API_BASE } from './api'

export async function commitFilesToRepo(
  token: string,
  owner: string,
  repo: string,
  files: FileToCommit[],
  defaultBranch = 'main',
  message?: string,
): Promise<GitHubExportResult> {
  if (!token || !owner || !repo || !files || files.length === 0) {
    return { success: false, details: 'Missing parameters' }
  }

  const payload = {
    token,
    owner,
    repo,
    branch: defaultBranch,
    message,
    files: files.map(f => ({ path: f.path, content: f.content })),
  }

  try {
    const res = await fetch(`${API_BASE}/api/export/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      return { success: false, details: `Server error: ${text}` }
    }

    const json = await res.json()
    if (json && json.success) return { success: true }

    return { success: false, details: json.error || JSON.stringify(json) }
  } catch (err: any) {
    return { success: false, details: String(err) }
  }
}
