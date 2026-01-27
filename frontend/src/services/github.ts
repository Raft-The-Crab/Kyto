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
export async function commitFilesToRepo(
  token: string,
  owner: string,
  repo: string,
  files: FileToCommit[],
  defaultBranch = 'main',
): Promise<GitHubExportResult> {
  if (!token || !owner || !repo || !files || files.length === 0) {
    return { success: false, details: 'Missing parameters' }
  }

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  }

  // Ensure repo exists: attempt to get it, else create under authenticated user
  const repoUrl = `https://api.github.com/repos/${owner}/${repo}`
  let repoResp = await fetch(repoUrl, { headers })

  if (repoResp.status === 404) {
    // Create repo under authenticated user (owner must match authenticated user)
    const createResp = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: repo, auto_init: false, private: false }),
    })

    if (!createResp.ok) {
      const text = await createResp.text()
      return { success: false, details: `Failed to create repo: ${text}` }
    }
  } else if (!repoResp.ok) {
    const text = await repoResp.text()
    return { success: false, details: `Failed to access repo: ${text}` }
  }

  // For each file, PUT to /repos/:owner/:repo/contents/:path
  for (const f of files) {
    const path = f.path
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`

    // Check if file exists to use proper method
    const getResp = await fetch(url, { headers })
    let sha: string | undefined
    if (getResp.ok) {
      const json = await getResp.json()
      sha = json.sha
    }

    const payload: any = {
      message: f.message || `Add ${path} via Kyto export`,
      content: btoa(unescape(encodeURIComponent(f.content))), // base64
      branch: defaultBranch,
    }

    if (sha) payload.sha = sha

    const putResp = await fetch(url, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!putResp.ok) {
      const text = await putResp.text()
      return { success: false, details: `Failed to write ${path}: ${text}` }
    }
  }

  return { success: true }
}
