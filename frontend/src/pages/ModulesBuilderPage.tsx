import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Package, ArrowLeft, Settings, Save, LayoutTemplate, Code2 } from 'lucide-react'
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

type ViewMode = 'visual' | 'code'

export default function ModulesBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('visual')

  const { getModule } = useProjectStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {} = useEditorStore()

  const moduleData = id ? getModule(id) : null

  useEffect(() => {
    if (id && !moduleData) {
      navigate('/modules')
    }
  }, [id, moduleData, navigate])

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-900 px-6 py-4 shrink-0 z-20 shadow-sm relative">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <Link to="/modules">
              <Button variant="outline" size="icon" className="rounded-xl shadow-neo-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 border-2 border-slate-900 rounded-xl flex items-center justify-center shadow-neo-sm">
                <Package className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                  {moduleData?.name || 'Loading...'}
                </h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Module Builder
                </p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-xl border-2 border-slate-900 shadow-neo-sm">
            <button
              onClick={() => setViewMode('visual')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2 transition-all',
                viewMode === 'visual'
                  ? 'bg-white text-purple-600 shadow-sm border-2 border-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <LayoutTemplate className="w-4 h-4 text-inherit stroke-[2.5px]" />
              Visual
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2 transition-all',
                viewMode === 'code'
                  ? 'bg-white text-purple-600 shadow-sm border-2 border-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Code2 className="w-4 h-4 text-inherit stroke-[2.5px]" />
              Code
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 rounded-xl font-black">
              <Settings className="w-4 h-4 stroke-[2.5px]" />
              Config
            </Button>
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-neo-sm font-black">
              <Save className="w-4 h-4 stroke-[2.5px]" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'visual' ? (
          <>
            <div className="w-80 border-r-2 border-slate-900 bg-white z-10">
              <BlockLibrary onBlockDragStart={setDraggedBlockType} />
            </div>
            <div className="flex-1 relative bg-slate-50">
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <EditorCanvas
                onBlockDragStart={setDraggedBlockType}
                draggedBlockType={draggedBlockType}
              />
            </div>
            <div className="w-80 border-l-2 border-slate-900 bg-white z-10">
              <PropertiesPanel />
            </div>
          </>
        ) : (
          <div className="flex-1 bg-[#1e1e1e] flex overflow-hidden">
            <div className="flex-1 h-full w-full">
              <CodeEditor />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
