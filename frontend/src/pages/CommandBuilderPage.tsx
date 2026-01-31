import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Code2,
  Eye,
  Settings,
  Zap,
  Save,
  Download,
  Share2,
  Grid3x3,
  Layers,
  Database,
  Sparkles,
  Terminal,
  Maximize2,
  Minimize2,
  Play,
} from 'lucide-react'
import { BlockLibrary } from '@/components/editor/BlockLibrary'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import { DiscordPreview } from '@/components/editor/DiscordPreview'
import { CodeEditor } from '@/components/code/CodeEditor'
import { Button } from '@/components/ui/Button'
import { BlockType } from '@/types'
import { useProjectStore } from '@/store/projectStore'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils'
import { AIHelper } from '@/components/editor/AIHelper'
import EditorCanvas from '@/components/editor/EditorCanvas'
import { OnboardingTutorial } from '@/components/editor/OnboardingTutorial'
import { FileExplorer } from '@/components/editor/FileExplorer'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { EditorSync } from '@/components/editor/EditorSync'
import { VariablesPanel } from '@/components/editor/VariablesPanel'
import { AnalyticsPanel } from '@/components/editor/AnalyticsPanel'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type ViewMode = 'visual' | 'code' | 'split'
type LeftPanel = 'blocks' | 'explorer' | 'variables' | 'none'
type RightPanel = 'properties' | 'preview' | 'ai' | 'analytics' | 'none'

export default function CommandBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('visual')
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('blocks')
  const [rightPanel, setRightPanel] = useState<RightPanel>('properties')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const command = useProjectStore(state => state.commands.find(c => c.id === id))
  const updateCommand = useProjectStore(state => state.updateCommand)
  const { selectedBlockId, blocks, connections } = useEditorStore()
  const projectName = useProjectStore(state => state.name)
  const projectLanguage = useProjectStore(state => state.language)
  const setActiveFile = useProjectStore(state => state.setActiveFile)

  // Reset active file to main when entering builder
  useEffect(() => {
    setActiveFile('main')
  }, [setActiveFile])

  // Auto-save functionality
  useEffect(() => {
    if (!command) return

    const autoSaveInterval = setInterval(() => {
      handleSave(true)
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [command, blocks, connections])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      // Ctrl/Cmd + / to toggle code view
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setViewMode(prev => (prev === 'code' ? 'visual' : 'code'))
      }
      // Ctrl/Cmd + B to toggle blocks panel
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setLeftPanel(prev => (prev === 'blocks' ? 'none' : 'blocks'))
      }
      // F11 for fullscreen
      if (e.key === 'F11') {
        e.preventDefault()
        setIsFullscreen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleSave = useCallback(
    async (silent = false) => {
      if (!command) return

      setIsSaving(true)
      try {
        // Simulate save delay
        await new Promise(resolve => setTimeout(resolve, 500))

        updateCommand(command.id, {
          canvas: {
            blocks,
            connections,
            selectedBlockId,
            viewportPosition: { x: 0, y: 0, zoom: 1 },
          },
        })

        setLastSaved(new Date())
        if (!silent) {
          toast.success('Command saved successfully')
        }
      } catch (error) {
        toast.error('Failed to save command')
        console.error(error)
      } finally {
        setIsSaving(false)
      }
    },
    [command, blocks, connections, selectedBlockId, updateCommand]
  )

  const handleExport = () => {
    toast.info('Exporting command...', { duration: 2000 })
    // Export logic here
  }

  const handleTest = () => {
    toast.info('Testing command...', { duration: 2000 })
    // Test logic here
  }

  const handleShare = () => {
    toast.info('Generating share link...', { duration: 2000 })
    // Share logic here
  }

  if (!command) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Terminal className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Command Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This command doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/commands')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Commands
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div
        className={cn(
          'min-h-screen flex flex-col bg-background text-foreground',
          isFullscreen && 'fixed inset-0 z-50 h-screen overflow-hidden',
          'animate-in fade-in duration-500'
        )}
      >
        {/* Top Navigation Bar */}
        <div className="h-14 mx-4 mt-4 mb-2 rounded-2xl border border-border/50 bg-background/90 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link to="/commands">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>

            <div className="h-8 w-px bg-border/50" />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <h1 className="text-sm font-bold truncate max-w-[200px]">/{command.name}</h1>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                {projectName} · {projectLanguage}
              </p>
            </div>

            {/* Save Status */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              {isSaving ? (
                <>
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Saved {lastSaved.toLocaleTimeString([], { timeStyle: 'short' })}</span>
                </>
              ) : null}
            </div>
          </div>

          {/* Center Section - View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted/20 rounded-lg p-1 border border-border/10">
            {['visual', 'code', 'split'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-bold transition-all capitalize',
                  viewMode === mode
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                {mode === 'visual' && <Grid3x3 className="w-3.5 h-3.5 inline mr-1.5" />}
                {mode === 'code' && <Code2 className="w-3.5 h-3.5 inline mr-1.5" />}
                {mode === 'split' && <Layers className="w-3.5 h-3.5 inline mr-1.5" />}
                {mode}
              </button>
            ))}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTest}
              className="gap-2 hidden sm:flex text-muted-foreground hover:text-foreground"
            >
              <Play className="w-3.5 h-3.5" />
              Test
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2 hidden md:flex text-muted-foreground hover:text-foreground"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="gap-2 bg-muted/30 hover:bg-muted/50 border border-border/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            <div className="h-6 w-px bg-border/50 hidden lg:block" />

            {/* Additional Options */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden lg:flex text-muted-foreground hover:text-foreground"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] overflow-hidden">
          {/* Left Sidebar */}
          <AnimatePresence>
            {leftPanel !== 'none' && (
              <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full md:w-80 m-4 rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl flex flex-col shadow-2xl"
              >
                {/* Panel Tabs */}
                <div className="h-12 border-b border-border/50 flex items-center px-3 gap-1 shrink-0 rounded-t-3xl">
                  <PanelTab
                    active={leftPanel === 'blocks'}
                    onClick={() => setLeftPanel('blocks')}
                    icon={Layers}
                    label="Blocks"
                  />
                  <PanelTab
                    active={leftPanel === 'explorer'}
                    onClick={() => setLeftPanel('explorer')}
                    icon={Database}
                    label="Files"
                  />
                  <PanelTab
                    active={leftPanel === 'variables'}
                    onClick={() => setLeftPanel('variables')}
                    icon={Database}
                    label="Variables"
                  />
                  <button
                    onClick={() => setLeftPanel('none')}
                    className="ml-auto p-1.5 hover:bg-muted/20 rounded-lg transition-colors md:hidden"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto">
                  {leftPanel === 'blocks' && (
                    <BlockLibrary onBlockDragStart={setDraggedBlockType} mode="command" />
                  )}
                  {leftPanel === 'explorer' && <FileExplorer />}
                  {leftPanel === 'variables' && <VariablesPanel />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Canvas Area */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {viewMode === 'visual' && (
              <div className="flex-1 relative bg-grid-white/[0.02]">
                <EditorCanvas
                  entityId={id || ''}
                  onBlockDragStart={setDraggedBlockType}
                  draggedBlockType={draggedBlockType}
                />
                <EditorSync id={id || ''} entityType="command" initialData={command.canvas} />
              </div>
            )}

            {viewMode === 'code' && (
              <div className="flex-1 overflow-hidden">
                <CodeEditor />
              </div>
            )}

            {viewMode === 'split' && (
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0.5 bg-border/50">
                <div className="relative overflow-hidden bg-background">
                  <EditorCanvas
                    entityId={id || ''}
                    onBlockDragStart={setDraggedBlockType}
                    draggedBlockType={draggedBlockType}
                  />
                </div>
                <div className="overflow-hidden bg-background">
                  <CodeEditor />
                </div>
              </div>
            )}

            {/* Floating Action Button for Left Panel */}
            {leftPanel === 'none' && (
              <motion.button
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => setLeftPanel('blocks')}
                className="absolute left-4 top-4 p-3 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl shadow-lg shadow-emerald-500/20 z-10 transition-all hover:scale-105 md:hidden"
              >
                <Layers className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* Right Sidebar */}
          <AnimatePresence>
            {rightPanel !== 'none' && (
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full md:w-96 m-4 rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl flex flex-col shadow-2xl"
              >
                {/* Panel Tabs */}
                <div className="h-12 border-b border-border/50 flex items-center px-3 gap-1 shrink-0 rounded-t-3xl">
                  <PanelTab
                    active={rightPanel === 'properties'}
                    onClick={() => setRightPanel('properties')}
                    icon={Settings}
                    label="Properties"
                  />
                  <PanelTab
                    active={rightPanel === 'preview'}
                    onClick={() => setRightPanel('preview')}
                    icon={Eye}
                    label="Preview"
                  />
                  <PanelTab
                    active={rightPanel === 'ai'}
                    onClick={() => setRightPanel('ai')}
                    icon={Sparkles}
                    label="AI"
                  />
                  <PanelTab
                    active={rightPanel === 'analytics'}
                    onClick={() => setRightPanel('analytics')}
                    icon={Zap}
                    label="Analytics"
                  />
                  <button
                    onClick={() => setRightPanel('none')}
                    className="ml-auto p-1.5 hover:bg-muted/20 rounded-lg transition-colors md:hidden"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto">
                  {rightPanel === 'properties' && <PropertiesPanel />}
                  {rightPanel === 'preview' && <DiscordPreview content={command.name} />}
                  {rightPanel === 'ai' && <AIHelper />}
                  {rightPanel === 'analytics' && <AnalyticsPanel />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Action Button for Right Panel */}
          {rightPanel === 'none' && (
            <motion.button
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => setRightPanel('properties')}
              className="absolute right-4 top-4 p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 z-10 transition-all hover:scale-105 md:hidden"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="h-8 border-t border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 text-xs text-muted-foreground shrink-0 z-50">
          <div className="flex items-center gap-4">
            <span className="font-mono">
              {blocks.length} blocks · {connections.length} connections
            </span>
            {selectedBlockId && (
              <>
                <div className="w-px h-4 bg-border/50" />
                <span>Selected: {selectedBlockId}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowOnboarding(true)}
              className="hover:text-emerald-500 transition-colors"
            >
              Show Tutorial
            </button>
            <div className="w-px h-4 bg-border/50" />
            <span className="font-mono">Kyto v2.0.3</span>
          </div>
        </div>

        {/* Onboarding Tutorial */}
        {showOnboarding && <OnboardingTutorial />}
      </div>
    </ErrorBoundary>
  )
}

// Helper component for panel tabs
function PanelTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: any
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
        active
          ? 'bg-muted/30 text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/10'
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  )
}
