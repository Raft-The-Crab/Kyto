import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Code2, Box, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlockLibrary } from '@/components/editor/BlockLibrary'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import { CodeEditor } from '@/components/code/CodeEditor'
import { Button } from '@/components/ui/Button'
import { BlockType } from '@/types'
import { useProjectStore } from '@/store/projectStore'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { AIHelper } from '@/components/editor/AIHelper'
import EditorCanvas from '@/components/editor/EditorCanvas'
import { DiscordPreview } from '@/components/editor/DiscordPreview'
import { VariableManager } from '@/components/editor/VariableManager'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { EditorSync } from '@/components/editor/EditorSync'

type ViewMode = 'visual' | 'code'
type LeftTab = 'blocks' | 'explorer'
type RightTab = 'properties' | 'preview'

export default function EventBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('visual')
  const [leftTab, setLeftTab] = useState<LeftTab>('blocks')
  const [rightTab, setRightTab] = useState<RightTab>('properties')

  const event = useProjectStore(state => state.events.find(e => e.id === id))
  const { selectedBlockId } = useEditorStore()
  const setActiveFile = useProjectStore(state => state.setActiveFile)

  // Reset active file to main when entering builder
  useEffect(() => {
    setActiveFile('main')
  }, [setActiveFile])

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
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground animate-in fade-in duration-700">
      {/* Header */}
      <header className="h-14 mx-4 mt-4 mb-2 rounded-2xl border border-border/50 bg-background/90 backdrop-blur-xl flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-5">
          <Link
            to="/events"
            className="p-2 hover:bg-muted/20 rounded-lg transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/20 uppercase tracking-wider">
                Event
              </span>
              <h1 className="font-semibold text-base tracking-tight text-foreground">
                {event.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted/20 p-1 rounded-lg border border-border/10 mx-4">
            <button
              onClick={() => setViewMode('visual')}
              className={cn(
                'px-3 py-1.5 text-[10px] font-semibold rounded-md transition-all flex items-center gap-2',
                viewMode === 'visual'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Box className="w-3.5 h-3.5" />
              Canvas
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={cn(
                'px-3 py-1.5 text-[10px] font-semibold rounded-md transition-all flex items-center gap-2',
                viewMode === 'code'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          <Button
            size="sm"
            className="h-8 rounded-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-glow"
          >
            Deploy Changes
          </Button>
        </div>
      </header>

      {/* Persistence Engine */}
      <EditorSync id={id || ''} entityType="event" initialData={event.canvas} />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Floating Panel */}
        <div className="absolute left-4 top-24 bottom-4 w-80 rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl z-40 flex flex-col overflow-hidden">
          <div className="flex items-center p-2 border-b border-border/50 gap-1">
            <button
              onClick={() => setLeftTab('blocks')}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors',
                leftTab === 'blocks'
                  ? 'bg-muted/30 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Blocks
            </button>
            <button
              onClick={() => setLeftTab('explorer')}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors',
                leftTab === 'explorer'
                  ? 'bg-muted/30 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Variables
            </button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {leftTab === 'blocks' && (
              <BlockLibrary onBlockDragStart={setDraggedBlockType} mode="event" />
            )}
            {leftTab === 'explorer' && <VariableManager />}
          </div>
        </div>

        {/* Center Canvas / Code */}
        <div className="flex-1 relative bg-grid-white/[0.02]">
          <ErrorBoundary>
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
              <CodeEditor />
            )}
          </ErrorBoundary>
        </div>

        {/* Right Floating Panel */}
        <div className="absolute right-4 top-24 bottom-4 w-80 rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl z-40 flex flex-col overflow-hidden">
          <div className="flex items-center p-2 border-b border-border/50 gap-1 rounded-t-3xl">
            <button
              onClick={() => setRightTab('properties')}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors',
                rightTab === 'properties'
                  ? 'bg-muted/30 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Properties
            </button>
            <button
              onClick={() => setRightTab('preview')}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-colors',
                rightTab === 'preview'
                  ? 'bg-muted/30 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Simulator
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
            <ErrorBoundary>
              {rightTab === 'properties' &&
                (selectedBlockId ? (
                  <PropertiesPanel />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
                    <Radio className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">Select an event block to configure</p>
                  </div>
                ))}
              {rightTab === 'preview' && <DiscordPreview content={event.name} />}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}
