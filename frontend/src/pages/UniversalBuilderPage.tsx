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

type ViewMode = 'visual' | 'code'
type LeftTab = 'blocks' | 'explorer' | 'terminal'
type RightTab = 'properties' | 'preview'

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
    { t: 'SYS', m: 'Core engine initialized.', c: 'text-slate-400' },
    { t: 'INFO', m: 'Filesystem mounted.', c: 'text-slate-400' },
    { t: 'INFO', m: 'Transpiler active.', c: 'text-slate-400' },
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
        'text-emerald-400'
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
        addLog(`IDE: Logic saved locally.`, 'STORE', 'text-slate-400')
      }, 1000)
      return () => clearTimeout(timer)
    }
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
    addLog('Initiating deployment sequence...', 'DEPLOY', 'text-amber-400')
    setTimeout(() => addLog('Transpiling visual logic to target source...', 'INFO'), 600)
    setTimeout(() => addLog('Packaging assets and dependencies...', 'INFO'), 1200)
    setTimeout(() => {
      addLog(
        `SUCCESS: ${entity?.name || 'Resource'} pushed to gateway.`,
        'SYNC',
        'text-emerald-400'
      )
      toast.success('Production deployment completed.')
    }, 2000)
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans overflow-hidden transition-colors duration-500">
      <header className="bg-white dark:bg-slate-950 border-b-2 border-black/10 dark:border-slate-800 px-6 py-3 shrink-0 z-20 relative text-black dark:text-white font-bold">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <Link to={isModule ? '/modules' : isEvent ? '/events' : '/commands'}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-2 border-black/10 dark:border-slate-800 shadow-neo-sm hover:translate-y-[-2px] transition-all bg-white dark:bg-slate-900"
              >
                <ArrowLeft className="w-5 h-5 text-slate-900 dark:text-white" />
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black dark:bg-white border-2 border-black/10 dark:border-slate-100 rounded-xl flex items-center justify-center shadow-neo-sm">
                {isModule ? (
                  <Layers className="w-5 h-5 text-white dark:text-black" />
                ) : (
                  <Box className="w-5 h-5 text-white dark:text-black" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Link
                    to={isModule ? '/modules' : isEvent ? '/events' : '/commands'}
                    className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest whitespace-nowrap"
                  >
                    Resources
                  </Link>
                  <span className="text-slate-300 dark:text-slate-700 text-xs">/</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-sm font-black tracking-tight leading-none uppercase text-slate-900 dark:text-white truncate">
                      {entity?.name || 'Workspace'}
                    </h1>
                    <span
                      className={cn(
                        'text-[8px] font-black px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 transition-all uppercase tracking-widest shrink-0',
                        saveStatus === 'saved'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          : 'bg-amber-400 text-black animate-pulse'
                      )}
                    >
                      {saveStatus === 'saved' ? 'SYNCED' : 'SAVING'}
                    </span>
                  </div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60 mt-0.5">
                  {language} • {isModule ? 'Module' : isEvent ? 'Event' : 'Command'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border-2 border-black/10 dark:border-slate-800 shadow-neo-sm">
              <button
                onClick={() => setViewMode('visual')}
                className={cn(
                  'px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all',
                  viewMode === 'visual'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm border border-black/10 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <LayoutTemplate className="w-3.5 h-3.5" /> Designer
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={cn(
                  'px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all',
                  viewMode === 'code'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm border border-black/10 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <Code2 className="w-3.5 h-3.5" /> Source
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            <Button
              size="sm"
              className="gap-2 shadow-neo-sm font-black text-[10px] border-2 border-black/10 dark:border-slate-800 uppercase tracking-widest px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleDeploy}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Deploy Logic
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r-2 border-black/10 dark:border-slate-800 bg-white dark:bg-slate-950 z-10 flex flex-col transition-all">
          <div className="flex border-b-2 border-black/10 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold">
            <TabButton
              active={leftTab === 'explorer'}
              icon={Files}
              onClick={() => setLeftTab('explorer')}
              label="Assets"
            />
            <TabButton
              active={leftTab === 'blocks'}
              icon={LayoutTemplate}
              onClick={() => setLeftTab('blocks')}
              label="Library"
            />
            <TabButton
              active={leftTab === 'terminal'}
              icon={TerminalIcon}
              onClick={() => setLeftTab('terminal')}
              label="Gateway"
            />
          </div>
          <div className="flex-1 overflow-hidden bg-white dark:bg-slate-950">
            {leftTab === 'explorer' && <FileExplorer />}
            {leftTab === 'blocks' && <BlockLibrary onBlockDragStart={setDraggedBlockType} />}
            {leftTab === 'terminal' && (
              <div className="p-4 font-mono text-[10px] bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto custom-scrollbar text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600 mb-4 border-b border-black/10 dark:border-slate-800 pb-2 uppercase tracking-widest font-black">
                  <TerminalIcon className="w-3 h-3" /> Console
                </div>
                {logs.map((L, i) => (
                  <div key={i} className="mb-1 leading-relaxed">
                    <span className="text-slate-400 dark:text-slate-600">[{L.t}]</span>{' '}
                    <span className={cn(L.c)}>{L.m}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 relative bg-white dark:bg-[#0c0c14] overflow-hidden transition-colors">
          {viewMode === 'visual' ? (
            <div className="h-full w-full relative">
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

        <aside className="w-80 border-l-2 border-black/10 dark:border-slate-800 bg-white dark:bg-slate-950 z-10 flex flex-col transition-all">
          <div className="flex border-b-2 border-black/10 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold">
            <TabButton
              active={rightTab === 'properties'}
              icon={Settings}
              onClick={() => setRightTab('properties')}
              label="Configure"
            />
            <TabButton
              active={rightTab === 'preview'}
              icon={MonitorPlay}
              onClick={() => setRightTab('preview')}
              label="Simulator"
            />
          </div>
          <div className="flex-1 overflow-hidden bg-white dark:bg-slate-950">
            {rightTab === 'properties' ? (
              <PropertiesPanel />
            ) : (
              <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/30">
                <div className="p-4 bg-white dark:bg-slate-950 border-b-2 border-black/10 dark:border-slate-800">
                  <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                    <MonitorPlay className="w-3.5 h-3.5 text-indigo-500" /> Real-time Preview
                  </h3>
                </div>
                <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
                  <DiscordPreview content={`Testing endpoint: /${entity?.name || 'logic'}`} />
                </div>
              </div>
            )}
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
        'flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-all border-r border-black/10 dark:border-slate-800 last:border-0 relative group p-1',
        active
          ? 'bg-white dark:bg-slate-950 text-indigo-600'
          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
      )}
    >
      <Icon className={cn('w-4 h-4', active && 'stroke-[3px]')} />
      <span
        className={cn(
          'text-[7px] font-black uppercase tracking-widest',
          active ? 'opacity-100' : 'opacity-60'
        )}
      >
        {label}
      </span>
      {active && (
        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 shadow-[0_-2px_8px_rgba(79,70,229,0.5)]" />
      )}
    </button>
  )
}
