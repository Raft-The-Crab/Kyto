import { useState } from 'react'
import { Search, GripVertical, Box } from 'lucide-react'
import { BLOCK_DEFINITIONS, BLOCK_CATEGORIES } from '@/lib/blocks/definitions'
import { BlockType, BlockCategory } from '@/types'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockLibraryProps {
  onBlockDragStart: (type: BlockType) => void
}

export function BlockLibrary({ onBlockDragStart }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<BlockCategory | 'all'>('all')

  const filteredBlocks = Object.values(BLOCK_DEFINITIONS).filter(block => {
    const matchesSearch =
      block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === 'all' || block.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden transition-colors border-r dark:border-slate-800">
      {/* Sidebar Header */}
      <div className="p-5 border-b-2 border-black/10 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
          Library
          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-lg font-black uppercase tracking-widest border border-black/10">
            {Object.keys(BLOCK_DEFINITIONS).length}
          </span>
        </h2>

        <div className="relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Filter components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-black placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:-translate-y-px transition-all shadow-neo-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 py-3 border-b-2 border-slate-900 dark:border-slate-800 overflow-x-auto no-scrollbar bg-white dark:bg-slate-950">
        <CategoryButton
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          label="All"
        />
        {Object.entries(BLOCK_CATEGORIES).map(([key, { label }]) => (
          <CategoryButton
            key={key}
            active={activeCategory === key}
            onClick={() => setActiveCategory(key as BlockCategory)}
            label={label}
          />
        ))}
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar pb-24">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-10 opacity-50 flex flex-col items-center">
            <Box className="w-8 h-8 text-slate-400 mb-2" />
            <p className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest">
              No results found
            </p>
          </div>
        ) : (
          filteredBlocks.map(block => {
            const IconComponent = (Icons[block.icon as keyof typeof Icons] ||
              Icons.Box) as React.ComponentType<{
              className?: string
              style?: React.CSSProperties
            }>

            return (
              <div
                key={block.type}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('application/reactflow', block.type)
                  e.dataTransfer.effectAllowed = 'move'
                  onBlockDragStart(block.type)
                }}
                className="group bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 rounded-2xl p-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-neo-sm hover:translate-y-[-2px] relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div
                  className="absolute top-0 left-0 w-1.5 h-full opacity-100 shadow-[2px_0_8px_rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: block.color }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-xl shrink-0 border-2 border-black/10 dark:border-slate-800 shadow-neo-sm"
                    style={{ backgroundColor: `${block.color}15` }}
                  >
                    {IconComponent && (
                      <IconComponent
                        className="w-5 h-5 transition-transform group-hover:scale-110"
                        style={{ color: block.color }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-slate-900 dark:text-white font-black text-sm truncate tracking-tight">
                        {block.label}
                      </h3>
                      <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] font-bold leading-relaxed line-clamp-2 uppercase tracking-wide">
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
        'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2',
        active
          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-neo-sm'
          : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-400'
      )}
    >
      {label}
    </button>
  )
}
