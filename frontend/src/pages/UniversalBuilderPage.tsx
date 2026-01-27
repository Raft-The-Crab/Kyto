import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Terminal as TerminalIcon,
  ArrowLeft,
  Code2,
  LayoutTemplate,
  Files,
  MonitorPlay,
  ShieldCheck,
  Box,
  Layers,
  Settings,
  Database,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlockLibrary } from '@/components/editor/BlockLibrary'
import { EditorCanvas } from '@/components/editor/EditorCanvas'
import { PropertiesPanel } from '@/components/editor/PropertiesPanel'
import { CodeEditor } from '@/components/code/CodeEditor'
import { Button } from '@/components/ui/Button'
import { BlockType } from '@/types'
import { useProjectStore } from '@/store/projectStore'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { AIHelper } from '@/components/editor/AIHelper'
import { DiscordPreview } from '@/components/editor/DiscordPreview'
import { FileExplorer } from '@/components/editor/FileExplorer'
import { VariableManager } from '@/components/editor/VariableManager'
import { generateCode } from '@/engine/codeGenerator'

type ViewMode = 'visual' | 'code'
type LeftTab = 'blocks' | 'explorer' | 'terminal'
type RightTab = 'properties' | 'preview' | 'analytics'

export default function UniversalBuilderPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('visual')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved')

  const [leftTab, setLeftTab] = useState<LeftTab>('blocks')
  const [rightTab, setRightTab] = useState<RightTab>('properties')

  const [logs, setLogs] = useState<{ t: string; m: string; c?: string }[]>([
    { t: 'SYS', m: 'Core engine initialized.', c: 'text-zinc-500' },
    { t: 'INFO', m: 'Filesystem mounted.', c: 'text-zinc-500' },
  ])

  const { getCommand, getEvent, getModule, updateCommand, updateEvent, updateModule, language } =
    useProjectStore()
  const { blocks, connections, selectedBlockId, viewportPosition, setCanvasState } =
    useEditorStore()

  const isModule = location.pathname.includes('/modules/')
  const isEvent = location.pathname.includes('/events/')

  // Entity resolving logic with absolute return safety
  const getEntity = (): any => {
    if (!id) return null
    if (isModule) {
      const mod = getModule(id)
      return mod || null
    }
    if (isEvent) {
      const evt = getEvent(id)
      return evt || null
    }
    const cmd = getCommand(id)
    if (cmd) return cmd
    return null
  }

  const entity = getEntity()

  const addLog = (m: string, t = 'INFO', c?: string) =>
    setLogs(prev => [...prev.slice(-20), { t, m, c }])

  // EFFECT: Load canvas when entity id changes
  useEffect(() => {
    if (entity?.canvas) {
      setCanvasState(entity.canvas)
      addLog(
        `${isModule ? 'Module' : isEvent ? 'Event' : 'Command'} synchronization complete.`,
        'SYNC',
        'text-emerald-500'
      )
    } else if (id && !entity) {
      navigate('/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // EFFECT: Auto-save back to project store with debounce
  useEffect(() => {
    if (id && blocks.length > 0) {
      setSaveStatus('saving')
      const timer = setTimeout(() => {
        const canvas = { blocks, connections, selectedBlockId, viewportPosition }

        if (isModule) updateModule(id, { canvas })
        else if (isEvent) updateEvent(id, { canvas })
        else updateCommand(id, { canvas })

        setSaveStatus('saved')
        addLog(`IDE: Logic saved locally.`, 'STORE', 'text-zinc-500')
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [
    blocks,
    connections,
    id,
    isModule,
    isEvent,
    updateCommand,
    updateEvent,
    updateModule,
    selectedBlockId,
    viewportPosition,
  ])

  const handleDeploy = () => {
    addLog('Packaging source code...', 'BUILD', 'text-amber-500')

    // Generate Source
    const sourceCode = generateCode(blocks, connections, language as 'discord.js' | 'discord.py')
    const fileName = language === 'discord.js' ? 'index.js' : 'main.py'

    // Create Blob
    const blob = new Blob([sourceCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    // Download Main File
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Download Config
    setTimeout(() => {
      const configName = language === 'discord.js' ? 'package.json' : 'requirements.txt'
      // Minimal config generation
      const configContent =
        language === 'discord.js'
          ? JSON.stringify(
              {
                name: (entity?.name || 'bot').toLowerCase(),
                dependencies: { 'discord.js': '^14.11.0', dotenv: '^16.0.3' },
              },
              null,
              2
            )
          : 'discord.py==2.3.2\npython-dotenv==1.0.0'

      const configBlob = new Blob([configContent], { type: 'text/plain' })
      const configUrl = URL.createObjectURL(configBlob)
      const ca = document.createElement('a')
      ca.href = configUrl
      ca.download = configName
      document.body.appendChild(ca)
      ca.click()
      document.body.removeChild(ca)
      URL.revokeObjectURL(configUrl)

      addLog(`SUCCESS: ${fileName} and ${configName} downloaded.`, 'EXPORT', 'text-emerald-500')
      toast.success('Project source downloaded.')
    }, 500)
  }

  return (
    <div className="h-screen bg-[#09090b] text-white flex flex-col font-sans overflow-hidden">
      {/* PROFESSIONAL BUILDER HEADER */}
      <header className="h-14 bg-[#09090b] border-b border-white/10 flex items-center justify-between px-4 shrink-0 relative z-50">
        <div className="flex items-center gap-4">
          <Link to={isModule ? '/modules' : isEvent ? '/events' : '/commands'}>
            <div className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
            </div>
          </Link>

          <div className="h-6 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              {isModule ? (
                <Layers className="w-4 h-4 text-white" />
              ) : isEvent ? (
                <Zap className="w-4 h-4 text-white" />
              ) : (
                <Box className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none text-white tracking-tight">
                {entity?.name || 'Untitled Logic'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                  {language === 'discord.js' ? 'TypeScript' : 'Python'}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-wider',
                    saveStatus === 'saved' ? 'text-emerald-500' : 'text-amber-500'
                  )}
                >
                  {saveStatus === 'saved' ? 'Synced' : 'Saving...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="bg-white/5 p-1 rounded-lg border border-white/5 flex items-center">
            <button
              onClick={() => setViewMode('visual')}
              className={cn(
                'px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2',
                viewMode === 'visual'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Canvas
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={cn(
                'px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2',
                viewMode === 'code'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Code2 className="w-3.5 h-3.5" /> Code
            </button>
          </div>

          <Button
            size="sm"
            onClick={handleDeploy}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 px-4 rounded-lg shadow-lg shadow-indigo-500/20 border border-indigo-400/20 transition-all hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            Export Logic
          </Button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR (Library) */}
        <aside className="w-72 bg-[#09090b] border-r border-white/10 flex flex-col z-20">
          <div className="flex border-b border-white/10 bg-black/20">
            <TabButton
              active={leftTab === 'blocks'}
              icon={LayoutTemplate}
              onClick={() => setLeftTab('blocks')}
              label="Blocks"
            />
            <TabButton
              active={leftTab === 'explorer'}
              icon={Files}
              onClick={() => setLeftTab('explorer')}
              label="Files"
            />
            <TabButton
              active={leftTab === 'terminal'}
              icon={TerminalIcon}
              onClick={() => setLeftTab('terminal')}
              label="Logs"
            />
          </div>

          <div className="flex-1 overflow-hidden relative">
            {leftTab === 'explorer' && <FileExplorer />}
            {leftTab === 'blocks' && (
              <BlockLibrary
                onBlockDragStart={setDraggedBlockType}
                mode={isModule ? 'module' : isEvent ? 'event' : 'command'}
              />
            )}
            {leftTab === 'terminal' && (
              <div className="p-4 font-mono text-[10px] h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 text-zinc-500 mb-4 border-b border-white/10 pb-2 uppercase tracking-widest font-bold">
                  <TerminalIcon className="w-3 h-3" /> Console Output
                </div>
                {logs.map((L, i) => (
                  <div key={i} className="mb-1.5 leading-relaxed font-medium">
                    <span className="text-zinc-600">[{L.t}]</span>{' '}
                    <span className={cn(L.c)}>{L.m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER CANVAS */}
        <main className="flex-1 relative bg-[#0c0c0e] overflow-hidden">
          {viewMode === 'visual' ? (
            <div className="h-full w-full relative">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.03] pointer-events-none" />
              <EditorCanvas
                entityId={id || 'new'}
                onBlockDragStart={setDraggedBlockType}
                draggedBlockType={draggedBlockType}
              />
              <AIHelper />
            </div>
          ) : (
            <div className="h-full w-full bg-[#1e1e1e] flex flex-col">
              <div className="flex-1 overflow-auto">
                <CodeEditor />
              </div>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR (Inspector) */}
        <aside className="w-80 bg-[#09090b] border-l border-white/10 flex flex-col z-20">
          <div className="flex border-b border-white/10 bg-black/20">
            <TabButton
              active={rightTab === 'properties'}
              icon={Settings}
              onClick={() => setRightTab('properties')}
              label="Config"
            />
            <TabButton
              active={rightTab === 'preview'}
              icon={MonitorPlay}
              onClick={() => setRightTab('preview')}
              label="Simulate"
            />
            <TabButton
              active={rightTab === 'analytics'}
              icon={Database}
              onClick={() => setRightTab('analytics')}
              label="Variables"
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-[#09090b]">
            {rightTab === 'properties' && <PropertiesPanel />}
            {rightTab === 'preview' && (
              <div className="h-full flex flex-col">
                <div className="p-3 bg-white/5 border-b border-white/10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white/70">
                    <MonitorPlay className="w-3.5 h-3.5 text-emerald-500" /> Live Prevention
                  </h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-black/20">
                  <DiscordPreview content={`Testing endpoint: /${entity?.name || 'logic'}`} />
                </div>
              </div>
            )}
            {rightTab === 'analytics' && <VariableManager />}
          </div>
        </aside>
      </div>
    </div>
  )
}

function TabButton({
  active,
  icon: Icon,
  onClick,
  label,
}: {
  active: boolean
  icon: any
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 py-3 flex items-center justify-center gap-2 transition-all border-r border-white/5 last:border-0 relative group hover:bg-white/5',
        active ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-zinc-300'
      )}
    >
      <Icon className={cn('w-4 h-4', active && 'text-indigo-400')} />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_-2px_6px_rgba(99,102,241,0.5)]" />
      )}
    </button>
  )
}
