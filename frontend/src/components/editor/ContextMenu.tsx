import { useEffect, useState, useRef } from 'react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockType } from '@/types'
import { Search, ChevronRight } from 'lucide-react'

interface ContextMenuProps {
  position: { x: number; y: number } | null
  onClose: () => void
  onAddBlock: (type: BlockType) => void
}

export function ContextMenu({ position, onClose, onAddBlock }: ContextMenuProps) {
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  if (!position) return null

  // Filter blocks based on search
  const filteredBlocks = Object.values(BLOCK_DEFINITIONS).filter(def =>
    def.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-50 w-64 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="p-2 border-b border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Add block..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-slate-100 dark:focus:bg-slate-700 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[300px] p-1 custom-scrollbar">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            No blocks found
          </div>
        ) : (
          filteredBlocks.map(def => (
            <button
              key={def.type}
              onClick={() => onAddBlock(def.type)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: def.color, boxShadow: `0 0 8px ${def.color}40` }}
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {def.label}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
