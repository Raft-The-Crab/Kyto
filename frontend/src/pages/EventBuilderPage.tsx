import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Code2, Box, Database, Radio } from 'lucide-react'
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
import { AIHelper } from '@/components/editor/AIHelper'
import { DiscordPreview } from '@/components/editor/DiscordPreview'
import { VariableManager } from '@/components/editor/VariableManager'

type ViewMode = 'visual' | 'code'
type LeftTab = 'blocks' | 'explorer'
type RightTab = 'properties' | 'preview'

export default function EventBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('visual')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved')

  const [leftTab, setLeftTab] = useState<LeftTab>('blocks')
  const [rightTab, setRightTab] = useState<RightTab>('properties')

  const event = useProjectStore(state => state.events.find(e => e.id === id))
  const projectName = useProjectStore(state => state.name)

  // Editor State
  const { selectedBlockId } = useEditorStore()

  if (!event) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground animate-in fade-in duration-500">
      {/* Header */}
      <header className="h-14 border-b border-white/10 glass-panel z-50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/events" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Event Listener
              </span>
              <h1 className="font-bold text-lg leading-none">{event.name}</h1>
            </div>
            <span className="text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-[300px]">
              {projectName} • ID: {id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5 mx-4">
            <button
              onClick={() => setViewMode('visual')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2',
                viewMode === 'visual'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-white'
              )}
            >
              <Box className="w-3.5 h-3.5" />
              Canvas
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2',
                viewMode === 'code'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-white'
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          <Button
            variant={saveStatus === 'saved' ? 'secondary' : 'default'}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => {
              setSaveStatus('saving')
              setTimeout(() => setSaveStatus('saved'), 500)
            }}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Tabs) */}
        <div className="w-16 border-r border-white/10 glass-panel flex flex-col items-center py-4 gap-4 z-40">
          <button
            onClick={() => setLeftTab('blocks')}
            className={cn(
              'p-3 rounded-xl transition-all relative group',
              leftTab === 'blocks'
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                : 'text-muted-foreground hover:bg-white/5'
            )}
          >
            <Box className="w-6 h-6" />
          </button>
          <button
            onClick={() => setLeftTab('explorer')}
            className={cn(
              'p-3 rounded-xl transition-all relative group',
              leftTab === 'explorer'
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                : 'text-muted-foreground hover:bg-white/5'
            )}
          >
            <Database className="w-6 h-6" />
          </button>
        </div>

        {/* Left Panel Content */}
        <div className="w-80 border-r border-white/10 bg-slate-900/40 relative flex flex-col">
          {leftTab === 'blocks' && (
            <BlockLibrary onBlockDragStart={setDraggedBlockType} mode="event" />
          )}
          {leftTab === 'explorer' && <VariableManager />}
        </div>

        {/* Center Canvas / Code */}
        <div className="flex-1 relative bg-slate-950/50">
          {viewMode === 'visual' ? (
            <>
              <EditorCanvas
                entityId={id || ''}
                onBlockDragStart={setDraggedBlockType}
                draggedBlockType={draggedBlockType}
              />
              <div className="absolute bottom-6 right-6 z-30">
                <AIHelper />
              </div>
            </>
          ) : (
            <CodeEditor readOnly />
          )}
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l border-white/10 glass-panel flex flex-col">
          <div className="flex items-center p-2 border-b border-white/10 gap-1">
            <button
              onClick={() => setRightTab('properties')}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors',
                rightTab === 'properties'
                  ? 'bg-white/10 text-white'
                  : 'text-muted-foreground hover:text-white'
              )}
            >
              Properties
            </button>
            <button
              onClick={() => setRightTab('preview')}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors',
                rightTab === 'preview'
                  ? 'bg-white/10 text-white'
                  : 'text-muted-foreground hover:text-white'
              )}
            >
              Simulator
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {rightTab === 'properties' &&
              (selectedBlockId ? (
                <PropertiesPanel />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                  <Radio className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Select an event block to configure</p>
                </div>
              ))}
            {rightTab === 'preview' && <DiscordPreview content={event.name} />}
          </div>
        </div>
      </div>
    </div>
  )
}
