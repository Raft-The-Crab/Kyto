import { Editor } from '@monaco-editor/react'
import { useEditorStore } from '@/store/editorStore'
import { useProjectStore } from '@/store/projectStore'
import { generateCode } from '@/engine/codeGenerator'
import { useMemo } from 'react'

interface CodeEditorProps {
  readOnly?: boolean
}

export function CodeEditor({ readOnly = false }: CodeEditorProps) {
  const { blocks, connections } = useEditorStore()
  const { language, settings, activeFileId, name, description } = useProjectStore()

  const content = useMemo(() => {
    try {
      switch (activeFileId) {
        case 'main':
          if (!blocks) return '// No blocks found'
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
      console.error('Code Generation Error:', error)
      return '// Error generating code. Please check console.'
    }
  }, [activeFileId, blocks, language, settings, name, description])

  const editorLanguage = useMemo(() => {
    if (!activeFileId) return 'text'
    if (activeFileId === 'settings' || (activeFileId === 'pkg' && language === 'discord.js'))
      return 'json'
    if (activeFileId === 'env' || (activeFileId === 'pkg' && language === 'discord.py'))
      return 'ini'
    if (activeFileId === 'main') return language === 'discord.js' ? 'javascript' : 'python'
    return 'text'
  }, [activeFileId, language])

  return (
    <div className="h-full w-full bg-[#1e1e1e] border-l border-black/10 animate-in fade-in duration-500 overflow-hidden">
      <Editor
        height="100%"
        language={editorLanguage}
        value={content}
        theme="vs-dark"
        options={{
          minimap: { enabled: true, side: 'right', renderCharacters: false, maxColumn: 40 },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          readOnly: readOnly || activeFileId !== 'main',
          scrollBeyondLastLine: false,
          padding: { top: 24, bottom: 24 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          automaticLayout: true,
          lineNumbers: 'on',
          selectionHighlight: true,
          matchBrackets: 'always',
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          lineHeight: 20,
          letterSpacing: 0.5,
          glyphMargin: false,
          folding: true,
        }}
      />
    </div>
  )
}
