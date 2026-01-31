import { Editor } from '@monaco-editor/react'
import { useEditorStore } from '@/store/editorStore'
import { useProjectStore } from '@/store/projectStore'
import { generateCode } from '@/engine/codeGenerator'
import { useMemo, useState } from 'react'
import { FileCode, Settings, FileKey, Package, Copy, Download, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CodeEditorProps {
  readOnly?: boolean
}

type FileTab = 'main' | 'settings' | 'env' | 'pkg'

export function CodeEditor({ readOnly = false }: CodeEditorProps) {
  const { blocks, connections } = useEditorStore()
  const { language, settings, activeFileId, name, description, setActiveFile } = useProjectStore()
  const [copied, setCopied] = useState(false)

  const content = useMemo(() => {
    try {
      switch (activeFileId) {
        case 'main':
          if (!blocks || blocks.length === 0)
            return generateCode([], [], language as 'discord.js' | 'discord.py')
          return generateCode(blocks, connections, language as 'discord.js' | 'discord.py')
        case 'settings':
          return JSON.stringify(
            {
              name: name || 'Untitled',
              description: description || '',
              language: language || 'discord.js',
              settings: {
                prefix: settings?.prefix || '!',
                intents: settings?.intents || [],
                clientId: settings?.clientId || '',
              },
            },
            null,
            2
          )
        case 'env':
          return `DISCORD_TOKEN=${settings?.botToken || 'YOUR_TOKEN_HERE'}\nCLIENT_ID=${settings?.clientId || 'YOUR_CLIENT_ID'}\nPREFIX=${settings?.prefix || '!'}`
        case 'pkg':
          if (language === 'discord.js') {
            return JSON.stringify(
              {
                name: (name || 'bot').toLowerCase().replace(/\s+/g, '-'),
                version: '1.0.0',
                description: description || '',
                main: 'index.js',
                dependencies: {
                  'discord.js': '^14.13.0',
                  dotenv: '^16.3.1',
                },
              },
              null,
              2
            )
          } else {
            return `discord.py==2.3.2\npython-dotenv==1.0.0`
          }
        default:
          return '// Select a file to view content'
      }
    } catch (error) {
      console.error('Error generating code:', error)
      return `// Error generating code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }, [activeFileId, blocks, connections, language, settings, name, description])

  const editorLanguage = useMemo(() => {
    if (!activeFileId) return 'text'
    if (activeFileId === 'settings' || (activeFileId === 'pkg' && language === 'discord.js'))
      return 'json'
    if (activeFileId === 'env' || (activeFileId === 'pkg' && language === 'discord.py'))
      return 'plaintext'
    if (activeFileId === 'main') return language === 'discord.js' ? 'javascript' : 'python'
    return 'text'
  }, [activeFileId, language])

  const fileTabs: Array<{ id: FileTab; label: string; icon: typeof FileCode }> = [
    { id: 'main', label: language === 'discord.js' ? 'index.js' : 'main.py', icon: FileCode },
    { id: 'settings', label: 'settings.json', icon: Settings },
    { id: 'env', label: '.env', icon: FileKey },
    {
      id: 'pkg',
      label: language === 'discord.js' ? 'package.json' : 'requirements.txt',
      icon: Package,
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handleDownload = () => {
    const filename = fileTabs.find(t => t.id === activeFileId)?.label || 'code.txt'
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}`)
  }

  return (
    <div className="h-full w-full bg-[#1e1e1e] flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="h-12 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-4 shrink-0">
        {/* File Tabs */}
        <div className="flex items-center gap-1">
          {fileTabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeFileId === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFile(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                  isActive
                    ? 'bg-[#1e1e1e] text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={editorLanguage}
          value={content}
          theme="vs-dark"
          options={{
            minimap: {
              enabled: true,
              side: 'right',
              renderCharacters: false,
              maxColumn: 60,
              scale: 1,
            },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            readOnly: readOnly,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            automaticLayout: true,
            lineNumbers: 'on',
            selectionHighlight: true,
            occurrencesHighlight: 'singleFile',
            matchBrackets: 'always',
            bracketPairColorization: {
              enabled: true,
            },
            renderLineHighlight: 'all',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: true,
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
            lineHeight: 22,
            letterSpacing: 0.5,
            glyphMargin: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',
            unfoldOnClickAfterEndOfLine: true,
            links: true,
            colorDecorators: true,
            contextmenu: true,
            mouseWheelZoom: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            suggest: {
              showWords: true,
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showKeywords: true,
              showSnippets: true,
            },
            wordWrap: 'off',
            wrappingIndent: 'indent',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            trimAutoWhitespace: true,
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            guides: {
              indentation: true,
              highlightActiveIndentation: true,
              bracketPairs: true,
            },
            stickyScroll: {
              enabled: true,
            },
          }}
          onChange={value => {
            if (activeFileId === 'main' && value && !readOnly) {
              useProjectStore.getState().updateFileContent(activeFileId, value)
            }
          }}
        />
      </div>
    </div>
  )
}
