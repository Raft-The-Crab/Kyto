import { useState } from 'react'
import { Terminal, Plus, Home, Settings, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlockLibrary } from '@/components/editor/BlockLibrary'
import { EditorCanvas } from '@/components/editor/EditorCanvas'
import { PropertiesPanel } from '@/components/editor/PropertiesPanel'
import { BlockType } from '@/types'

export default function CommandsBuilderPage() {
  const [draggedBlockType, setDraggedBlockType] = useState<BlockType | null>(null)

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-white"
            >
              <Home className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6 text-indigo-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Commands & Subcommands</h1>
                <p className="text-xs text-slate-400">Build slash commands visually</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all">
              <Settings className="w-4 h-4" />
              Settings
            </button>

            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-all">
              <Save className="w-4 h-4" />
              Save
            </button>

            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" />
              New Command
            </button>

            <Link
              to="/marketplace"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all"
            >
              Marketplace
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Block Library Sidebar */}
        <BlockLibrary onBlockDragStart={setDraggedBlockType} />

        {/* Canvas Area */}
        <EditorCanvas onBlockDragStart={setDraggedBlockType} draggedBlockType={draggedBlockType} />

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  )
}
