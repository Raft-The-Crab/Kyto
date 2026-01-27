import { useState } from 'react'
import { Download, FileCode, Package } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { apiClient } from '@/services/api'
import { ExportPreviewDialog } from './ExportPreviewDialog'
import { GitHubExportDialog } from './GitHubExportDialog'

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  canvas: any
  settings: any
}

export function ExportDialog({ open, onClose, canvas, settings }: ExportDialogProps) {
  const [language, setLanguage] = useState<'discord.js' | 'discord.py'>('discord.js')
  const [loading, setLoading] = useState(false)
  const [exportData, setExportData] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFiles, setPreviewFiles] = useState<any[]>([])
  const [ghOpen, setGhOpen] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    const response = await apiClient.exportBot(canvas, language, settings)

    if (response.data) {
      setExportData(response.data)
    }
    setLoading(false)
  }

  const handlePreview = async () => {
    setLoading(true)
    const resp = await apiClient.exportPreview(canvas, language, settings)
    if (resp.data && resp.data.files) {
      setPreviewFiles(resp.data.files)
      setPreviewOpen(true)
    }
    setLoading(false)
  }

  const handleDownloadZip = async () => {
    setLoading(true)
    const resp: any = await apiClient.exportZip(canvas, language, settings)
    if (resp && resp.blob) {
      const url = URL.createObjectURL(resp.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kyto-export.zip`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // show error
      console.error('Zip export failed', resp.error)
    }
    setLoading(false)
  }

  const handleDownload = () => {
    if (!exportData) return

    // Create a simple text file with all generated files
    let content = '='.repeat(50) + '\n'
    content += 'KYTO EXPORT\n'
    content += '='.repeat(50) + '\n\n'

    exportData.files.forEach((file: any) => {
      content += `\n\n// FILE: ${file.path}\n`
      content += '='.repeat(50) + '\n'
      content += file.content + '\n'
    })

    content += '\n\n// INSTRUCTIONS\n'
    content += '='.repeat(50) + '\n'
    content += exportData.instructions

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bot-${language}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Bot</DialogTitle>
          <DialogDescription>Generate production-ready code for your Discord bot</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest mb-2 block">
              Target Language
            </label>
            <div className="flex gap-3">
              <Button
                variant={language === 'discord.js' ? 'default' : 'outline'}
                onClick={() => setLanguage('discord.js')}
                className="flex-1"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Discord.js
              </Button>
              <Button
                variant={language === 'discord.py' ? 'default' : 'outline'}
                onClick={() => setLanguage('discord.py')}
                className="flex-1"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Discord.py
              </Button>
            </div>
          </div>

          {/* Export Button */}
          {!exportData && (
            <div className="flex gap-3">
              <Button onClick={handleExport} disabled={loading} size="lg" className="flex-1">
                <Package className="w-5 h-5 mr-2" />
                {loading ? 'Generating...' : 'Generate Code'}
              </Button>
              <Button onClick={handlePreview} disabled={loading} size="lg" variant="outline" className="flex-1">
                <FileCode className="w-5 h-5 mr-2" />
                Preview
              </Button>
            </div>
          )}

          {/* Export Result */}
          {exportData && (
            <div className="space-y-4">
              <div className="bg-muted/20 border-4 border-black dark:border-white rounded-none p-4">
                <h4 className="text-xs font-black uppercase tracking-widest mb-3">
                  Generated Files
                </h4>
                <div className="space-y-2">
                  {exportData.files.map((file: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <FileCode className="w-3 h-3" />
                      <span className="text-xs font-bold font-mono">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={handleDownload} size="lg" className="w-full">
                  <Download className="w-5 h-5 mr-2" />
                  Download Code
                </Button>
                <Button onClick={handleDownloadZip} size="lg" variant="neo" className="w-full">
                  <Download className="w-5 h-5 mr-2" />
                  Download ZIP
                </Button>
                <Button onClick={() => setGhOpen(true)} size="lg" variant="outline" className="w-full">
                  <Download className="w-5 h-5 mr-2" />
                  Export to GitHub
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Export preview dialog */}
      {previewOpen && (
        <ExportPreviewDialog open={previewOpen} onClose={() => setPreviewOpen(false)} files={previewFiles} onDownloadZip={handleDownloadZip} />
      )}

      {ghOpen && (
        <GitHubExportDialog open={ghOpen} onClose={() => setGhOpen(false)} files={(exportData && exportData.files) || []} />
      )}
    </Dialog>
  )
}
