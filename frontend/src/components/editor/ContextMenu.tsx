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
      className="fixed z-50 w-64 card-premium shadow-premium-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1 bg-zinc-950/90 backdrop-blur-xl border-white/5"
    >
      <div className="p-2 border-b border-divider/50 mb-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="w-full pl-9 pr-3 py-2 text-[11px] font-bold bg-white/5 rounded-xl outline-none text-foreground placeholder:text-muted-foreground/30 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar p-1">
        {filteredBlocks.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              No results found
            </p>
          </div>
        ) : (
          filteredBlocks.map(def => (
            <button
              key={def.type}
              onClick={() => {
                onAddBlock(def.type)
                onClose()
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 text-muted-foreground transition-all group font-medium text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-glow"
                  style={{ backgroundColor: def.color, boxShadow: `0 0 10px ${def.color}60` }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-foreground group-hover:text-indigo-400 transition-colors uppercase tracking-tight truncate">
                    {def.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 lowercase truncate">
                    {def.category}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500/50" />
            </button>
          ))
        )}
      </div>

      <div className="p-2 border-t border-divider/50 mt-1 bg-black/20">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center text-muted-foreground/30">
          Node Context Engine
        </p>
      </div>
    </div>
  )
}
