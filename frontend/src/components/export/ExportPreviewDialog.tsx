import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface ExportPreviewDialogProps {
  open: boolean
  onClose: () => void
  files: Array<{ path: string; size: number; preview: string; issues?: string[] }>
}

export function ExportPreviewDialog({ open, onClose, files }: ExportPreviewDialogProps) {
  const [active, setActive] = useState<string | null>(files[0]?.path ?? null)

  useEffect(() => {
    if (files.length > 0) setActive(files[0]?.path ?? null)
  }, [files])

  const current = files.find((f) => f.path === active) ?? null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export Preview</DialogTitle>
          <DialogDescription>Preview generated files and quick validation issues</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="w-1/3 bg-muted/10 p-4 rounded-lg border-2 border-black overflow-auto max-h-[60vh]">
            {files.map((f) => (
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

          <div className="flex-1 bg-muted/10 p-4 rounded-lg border-2 border-black max-h-[60vh] overflow-auto">
            {!current && <p className="text-sm">No file selected</p>}
            {current && (
              <>
                <div className="mb-3">
                  <div className="text-xs font-bold">{current.path}</div>
                  {current.issues && current.issues.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {current.issues.map((i, idx) => (
                        <div key={idx} className="text-xs text-yellow-400 font-bold">⚠ {i}</div>
                      ))}
                    </div>
                  )}
                </div>
                <pre className="text-xs whitespace-pre-wrap font-mono bg-white dark:bg-black p-3 rounded">{current.preview}</pre>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}