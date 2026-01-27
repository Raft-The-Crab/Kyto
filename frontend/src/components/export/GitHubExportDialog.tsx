import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { commitFilesToRepo } from '@/services/github'

interface Props {
  open: boolean
  onClose: () => void
  files: Array<{ path: string; content: string }>
}

export function GitHubExportDialog({ open, onClose, files }: Props) {
  const [token, setToken] = useState('')
  const [repo, setRepo] = useState('') // owner/repo
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setMessage(null)

    try {
      if (!token || !repo) {
        setMessage('Provide a token and repository in the format owner/repo')
        setLoading(false)
        return
      }

      const [owner, repoName] = repo.split('/')
      if (!owner || !repoName) {
        setMessage('Repository must be owner/repo')
        setLoading(false)
        return
      }

      const toCommit = files.map((f) => ({ path: f.path, content: f.content }))
      const res = await commitFilesToRepo(token.trim(), owner.trim(), repoName.trim(), toCommit)

      if (res.success) {
        setMessage('Exported to GitHub successfully!')
      } else {
        setMessage(`Failed: ${res.details}`)
      }
    } catch (err: any) {
      setMessage(`Error: ${String(err)}`)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export to GitHub</DialogTitle>
          <DialogDescription>Paste a personal access token (repo scope) and target repo (owner/repo).</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div>
            <label className="text-xs font-bold uppercase">Personal Access Token</label>
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_..." />
          </div>

          <div>
            <label className="text-xs font-bold uppercase">Target Repository</label>
            <Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="owner/repo" />
          </div>

          {message && <div className="text-sm text-yellow-400 font-bold">{message}</div>}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleSubmit} disabled={loading || files.length === 0}>
              {loading ? 'Exporting...' : 'Export to GitHub'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}