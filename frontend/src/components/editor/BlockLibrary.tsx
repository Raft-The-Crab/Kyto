import { useState } from 'react'
import { Search, GripVertical, Box, X, Layers } from 'lucide-react'
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

    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col bg-[#0b0b0e] border-r border-white/5 font-sans">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 bg-[#0b0b0e]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
            <Layers className="w-4 h-4 text-indigo-500" />
            Library
          </h2>
          <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {Object.keys(BLOCK_DEFINITIONS).length}
          </span>
        </div>

        <div className="relative group">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-black/20 border border-white/5 rounded-xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 py-3 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center opacity-40">
            <Box className="w-10 h-10 text-slate-500 mb-3" />
            <p className="text-xs font-medium text-slate-500">No components found</p>
          </div>
        ) : (
          filteredBlocks.map(block => {
            const IconComponent = (Icons[block.icon as keyof typeof Icons] ||
              Icons.Box) as React.ComponentType<{ className?: string; style?: any }>

            return (
              <div
                key={block.type}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('application/reactflow', block.type)
                  e.dataTransfer.effectAllowed = 'move'
                  onBlockDragStart(block.type)
                }}
                className="group relative bg-[#121215] border border-white/5 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-indigo-500/30 hover:bg-white/5 transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Side Accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: block.color }}
                />

                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg shrink-0 border border-white/5 shadow-inner bg-black/20"
                    style={{ color: block.color }}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-slate-200 font-bold text-xs truncate group-hover:text-white transition-colors">
                        {block.label}
                      </h3>
                      <GripVertical className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-slate-500 text-[10px] leading-tight line-clamp-2 mt-0.5 font-medium group-hover:text-slate-400 transition-colors">
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
        'px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap',
        active
          ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white'
          : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5'
      )}
    >
      {label}
    </button>
  )
}
