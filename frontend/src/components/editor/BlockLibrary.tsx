import { useState } from 'react'
import { Search, GripVertical, Box } from 'lucide-react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BLOCK_CATEGORIES } from '@/lib/blocks/categories-export'
import { BlockType, BlockCategory } from '@/types'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockLibraryProps {
  onBlockDragStart: (type: BlockType) => void
  mode: 'command' | 'event' | 'module'
}

export function BlockLibrary({ onBlockDragStart, mode }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<BlockCategory | 'all'>('all')

  const filteredBlocks = Object.values(BLOCK_DEFINITIONS).filter(block => {
    const matchesSearch =
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === 'all' || block.category === activeCategory

    if (mode === 'event' && (block.type === 'command_slash' || block.type === 'command_subcommand'))
      return false
    if (mode === 'command' && block.type === 'event_listener') return false
    // Allow event listeners in modules
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col font-sans bg-slate-900/10">
      {/* Search Section */}
      <div className="px-5 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="relative group">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600 h-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 px-5 py-3 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
        <CategoryButton
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          label="All"
        />
        {BLOCK_CATEGORIES.map(({ id, label }) => (
          <CategoryButton
            key={id}
            active={activeCategory === id}
            onClick={() => setActiveCategory(id as BlockCategory)}
            label={label}
          />
        ))}
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-20 opacity-20 flex flex-col items-center">
            <Box className="w-10 h-10 mb-2" />
            <p className="text-[10px] uppercase font-bold tracking-widest">No Logic Components</p>
          </div>
        ) : (
          filteredBlocks.map(block => {
            const IconComponent = (Icons[block.icon as keyof typeof Icons] ||
              Icons.Box) as React.ComponentType<{ className?: string }>

            return (
              <div
                key={block.type}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('application/reactflow', block.type)
                  e.dataTransfer.effectAllowed = 'move'
                  onBlockDragStart(block.type)
                }}
                className="group relative bg-[#0a0a0a]/40 backdrop-blur-sm border border-white/5 rounded-[24px] p-4 cursor-grab active:cursor-grabbing hover:bg-white/5 hover:border-white/10 transition-all active:scale-[0.98] shadow-sm hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl shrink-0 border border-white/5 bg-black/40 flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-3 shadow-inner"
                    style={{ color: block.color }}
                  >
                    <IconComponent className="w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[13px] font-bold text-slate-200 truncate tracking-tight">
                        {block.label}
                      </h3>
                      <GripVertical className="w-4 h-4 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 font-medium mt-0.5 leading-relaxed">
                      {block.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function CategoryButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-[10px] font-bold transition-all duration-300 border whitespace-nowrap',
        active
          ? 'bg-white text-black border-white shadow-glow-sm'
          : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
      )}
    >
      {label}
    </button>
  )
}
