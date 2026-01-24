import { useState } from 'react'
import { Search, GripVertical, ChevronRight } from 'lucide-react'
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
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-5 border-b-2 border-slate-100">
        <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
          Blocks
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
            {Object.keys(BLOCK_DEFINITIONS).length}
          </span>
        </h2>

        <div className="relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-5 py-3 border-b-2 border-slate-100 overflow-x-auto no-scrollbar mask-gradient">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2',
            activeCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
          )}
        >
          All
        </button>
        {Object.entries(BLOCK_CATEGORIES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as BlockCategory)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2',
              activeCategory === key
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-10 opacity-50">
            <p className="font-bold text-slate-900">No blocks found</p>
            <p className="text-sm">Try a different search</p>
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
                className="group bg-white border-2 border-slate-200 hover:border-indigo-600 rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all hover:shadow-[4px_4px_0px_0px_rgba(79,70,229,0.2)] hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-lg flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: `${block.color}15` }}
                  >
                    {IconComponent && (
                      <IconComponent className="w-5 h-5" style={{ color: block.color }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-slate-900 font-bold text-sm truncate">
                        {block.label}
                      </h3>
                      <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
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
