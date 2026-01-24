import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Zap, ArrowLeft, Settings, Save, LayoutTemplate, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlockLibrary } from '@/components/editor/BlockLibrary'
import { EditorCanvas } from '@/components/editor/EditorCanvas'
import { PropertiesPanel } from '@/components/editor/PropertiesPanel'
import { CodeEditor } from '@/components/code/CodeEditor'
import { BlockType } from '@/types'
import { useProjectStore } from '@/store/projectStore'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils'

type ViewMode = 'visual' | 'code'

export default function EventsBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('visual')
  
  const { getEvent } = useProjectStore()
  const { blocks, clearCanvas } = useEditorStore()

  const event = id ? getEvent(id) : null

  useEffect(() => {
    if (id && !event) {
      navigate('/events')
    }
  }, [id, event, navigate])

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b-2 border-slate-900 px-6 py-4 flex-shrink-0 z-20 shadow-sm relative">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <Link to="/events" className="p-2.5 bg-white border-2 border-slate-900 rounded-xl text-slate-900 hover:bg-yellow-400 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all">
              <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 border-2 border-slate-900 rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <Zap className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">{event?.name || 'Loading...'}</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Event Builder</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-xl border-2 border-slate-900">
            <button
              onClick={() => setViewMode('visual')}
              className={cn("px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all", viewMode === 'visual' ? "bg-white text-emerald-600 shadow-md border-2 border-emerald-600" : "text-slate-500 hover:text-slate-900")}
            >
              <LayoutTemplate className="w-4 h-4 text-inherit stroke-[2.5px]" />
              Visual
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={cn("px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all", viewMode === 'code' ? "bg-white text-emerald-600 shadow-md border-2 border-emerald-600" : "text-slate-500 hover:text-slate-900")}
            >
              <Code2 className="w-4 h-4 text-inherit stroke-[2.5px]" />
              Code
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center gap-2">
              <Settings className="w-4 h-4 stroke-[2.5px]" /> Settings
            </button>
            <button className="px-5 py-2.5 bg-emerald-600 border-2 border-slate-900 text-white font-bold rounded-xl hover:bg-emerald-500 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center gap-2">
              <Save className="w-4 h-4 stroke-[2.5px]" /> Save Changes
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'visual' ? (
          <>
            <div className="w-80 border-r-2 border-slate-900 bg-white">
                <BlockLibrary onBlockDragStart={setDraggedBlockType} />
            </div>
            <div className="flex-1 relative bg-slate-50">
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <EditorCanvas onBlockDragStart={setDraggedBlockType} draggedBlockType={draggedBlockType} />
            </div>
            <div className="w-80 border-l-2 border-slate-900 bg-white">
                <PropertiesPanel />
            </div>
          </>
        ) : (
          <div className="flex-1 bg-[#1e1e1e] flex"><div className="flex-1"><CodeEditor /></div></div>
        )}
      </div>
    </div>
  )
}
