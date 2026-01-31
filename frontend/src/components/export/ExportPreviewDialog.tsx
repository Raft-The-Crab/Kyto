import { useEffect, useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Copy, Download } from 'lucide-react'
import { toast } from 'sonner'

interface ExportPreviewDialogProps {
  open: boolean
  onClose: () => void
  files: Array<{ path: string; size: number; preview: string; issues?: string[] }>
  onDownloadZip?: () => void
}

function getLanguageFromPath(path: string) {
  if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript'
  if (path.endsWith('.js') || path.endsWith('.mjs')) return 'javascript'
  if (path.endsWith('.py')) return 'python'
  if (path.endsWith('.json')) return 'json'
  return 'plaintext'
}

export function ExportPreviewDialog({
  open,
  onClose,
  files,
  onDownloadZip,
}: ExportPreviewDialogProps) {
  const [active, setActive] = useState<string | null>(files[0]?.path ?? null)
  const [editorTheme, setEditorTheme] = useState<string>(
    () => localStorage.getItem('kyto_monaco_theme') || 'vs-dark'
  )

  useEffect(() => {
    if (files.length > 0) setActive(files[0]?.path ?? null)
  }, [files])

  const current = files.find(f => f.path === active) ?? null

  const onCopy = useCallback(async () => {
    if (!current) return
    try {
      await navigator.clipboard.writeText(current.preview)
      toast.success('Copied to clipboard')
    } catch (e) {
      toast.error('Unable to copy')
    }
  }, [current])

  const onDownload = useCallback(() => {
    if (!current) return
    const blob = new Blob([current.preview], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = current.path.split('/').pop() || 'file.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [current])

  const toggleTheme = useCallback(() => {
    const next = editorTheme === 'vs-dark' ? 'light' : 'vs-dark'
    setEditorTheme(next)
    try {
      localStorage.setItem('kyto_monaco_theme', next)
    } catch (e) {}
  }, [editorTheme])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 w-full">
            <div>
              <DialogTitle>Export Preview</DialogTitle>
              <DialogDescription>
                Preview generated files and quick validation issues
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={onCopy}
                variant="outline"
                aria-label="Copy file to clipboard"
              >
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
              <Button
                type="button"
                onClick={onDownload}
                variant="outline"
                aria-label="Download file"
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button
                type="button"
                onClick={toggleTheme}
                variant="outline"
                aria-label="Toggle editor theme"
              >
                {editorTheme === 'vs-dark' ? 'Dark' : 'Light'}
              </Button>
              {onDownloadZip && (
                <Button
                  type="button"
                  onClick={onDownloadZip}
                  variant="premium"
                  aria-label="Download all files as ZIP"
                >
                  <Download className="w-4 h-4 mr-2" /> Download ZIP
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="w-1/3 bg-muted/10 p-4 rounded-lg border-2 border-black overflow-auto max-h-[60vh]">
            {files.map(f => (
              <button
                key={f.path}
                onClick={() => setActive(f.path)}
                className={`w-full text-left py-2 px-2 rounded ${f.path === active ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <div className="text-xs font-bold font-mono">{f.path}</div>
                <div className="text-[10px] opacity-70">{f.size} bytes</div>
              </button>
            ))}
          </div>

          <div className="flex-1 bg-muted/10 p-4 rounded-lg border-2 border-black max-h-[60vh] overflow-hidden">
            {!current && <p className="text-sm">No file selected</p>}
            {current && (
              <div className="h-[60vh] flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">{current.path}</div>
                    {current.issues && current.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {current.issues.map((i, idx) => (
                          <div key={idx} className="text-xs text-yellow-400 font-bold">
                            ⚠ {i}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-auto rounded">
                  <Editor
                    height="100%"
                    defaultLanguage={getLanguageFromPath(current.path)}
                    defaultValue={current.preview}
                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12 }}
                    theme={editorTheme}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
