import { useState } from 'react'
import { Search, GripVertical } from 'lucide-react'
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
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <Icons.Box className="w-5 h-5 text-indigo-400" />
          Blocks
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all',
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          )}
        >
          All
        </button>
        {Object.entries(BLOCK_CATEGORIES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as BlockCategory)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all',
              activeCategory === key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No blocks found</p>
          </div>
        ) : (
          filteredBlocks.map(block => {
            const IconComponent = Icons[block.icon as keyof typeof Icons] as React.ComponentType<{
              className?: string
            }>

            return (
              <div
                key={block.type}
                draggable
                onDragStart={() => onBlockDragStart(block.type)}
                className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/50 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-md flex-shrink-0"
                    style={{ backgroundColor: `${block.color}15` }}
                  >
                    {IconComponent && (
                      <IconComponent className="w-4 h-4" style={{ color: block.color }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {block.label}
                      </h3>
                      <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {block.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
