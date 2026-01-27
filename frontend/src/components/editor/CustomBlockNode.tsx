import { memo } from 'react'
import { Handle, Position, Node, NodeProps } from '@xyflow/react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockType } from '@/types'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

export type CustomNodeData = {
  type: BlockType
  label: string
  properties: Record<string, any>
  isValid: boolean
  errors: string[]
}

export const CustomBlockNode = memo(({ data, selected }: NodeProps<Node<CustomNodeData>>) => {
  const definition = BLOCK_DEFINITIONS[data.type]

  if (!definition) return null

  const IconComponent = Icons[definition.icon as keyof typeof Icons] as React.ComponentType<{
    className?: string
    style?: React.CSSProperties
  }>

  const hasErrors = data.errors?.length > 0

  return (
    <div
      className={cn(
        'relative group min-w-[140px] transition-transform duration-200 ease-out will-change-transform', // Reduced width + smooth transitions
        selected ? 'z-50' : 'z-10'
      )}
    >
      {/* Glow Effect on Selection */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl transition-all duration-300', // rounded-2xl -> rounded-xl
          selected
            ? `shadow-[0_0_25px_-5px] ring-2 ring-indigo-500 opacity-100`
            : 'opacity-0 group-hover:opacity-100 shadow-[0_0_15px_-5px] ring-1 ring-white/20'
        )}
        style={{
          boxShadow: selected ? `0 0 25px -5px ${definition.color}50` : undefined, // Reduced opacity
          borderColor: selected ? definition.color : undefined,
        }}
      />

      <div
        className={cn(
          'relative bg-[#1a1a1f] border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl transition-transform layer-1',
          selected && 'scale-[1.02]'
        )}
      >
        {/* Node Header */}
        <div className="px-2.5 py-1.5 flex items-center gap-2 bg-white/5 border-b border-white/5">
          <div
            className="p-1 rounded-md shadow-inner relative overflow-hidden"
            style={{ backgroundColor: `${definition.color}20` }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundColor: definition.color }}
            />
            {IconComponent && (
              <IconComponent
                className="w-3 h-3 relative z-10"
                style={{ color: definition.color }}
              />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[9px] uppercase tracking-wider text-slate-200 truncate leading-none mb-0.5">
              {definition.label || data.label}
            </h4>
            <p className="text-[7px] font-bold text-slate-500 truncate uppercase leading-none">
              {definition.category}
            </p>
          </div>
          {hasErrors && (
            <Icons.AlertCircle className="w-3 h-3 text-red-500 animate-pulse ml-auto" />
          )}
        </div>

        {/* Node Content Preview */}
        {data.properties && Object.keys(data.properties).length > 0 && (
          <div className="px-2.5 py-1.5 space-y-1 bg-black/20">
            {Object.entries(data.properties)
              .slice(0, 3) // Show one more property since it's smaller
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center gap-3 text-[8px] group/prop"
                >
                  <span className="font-bold text-slate-500 uppercase tracking-widest truncate max-w-[50px]">
                    {key}
                  </span>
                  <span className="text-slate-300 font-mono bg-white/5 px-1 rounded truncate max-w-[70px] border border-white/5 group-hover/prop:border-white/20 transition-colors">
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Input Handle - Moved Outside */}
      {definition.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-2.5! h-2.5! -top-1! bg-slate-400! border-2! border-[#1a1a1f]! hover:bg-white! hover:scale-125 transition-all z-20"
        />
      )}

      {/* Output Handles - Moved Outside */}
      {definition.outputs === 1 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2.5! h-2.5! -bottom-1! bg-slate-400! border-2! border-[#1a1a1f]! hover:bg-white! hover:scale-125 transition-all z-20"
        />
      )}

      {definition.outputs === 2 && (
        <div className="absolute -bottom-1 w-full flex justify-between px-4 z-20">
          {/* True Handle */}
          <div className="relative group/handle">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1a1a1f] border border-indigo-500/30 text-indigo-400 text-[7px] font-black uppercase px-1 py-0.5 rounded opacity-0 group-hover/handle:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              True
            </div>
            <Handle
              type="source"
              position={Position.Bottom}
              id="true"
              className="relative! transform-none! left-auto! w-2.5! h-2.5! bg-indigo-500! border-2! border-[#1a1a1f]! hover:scale-125 transition-all"
            />
          </div>

          {/* False Handle */}
          <div className="relative group/handle">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1a1a1f] border border-rose-500/30 text-rose-400 text-[7px] font-black uppercase px-1 py-0.5 rounded opacity-0 group-hover/handle:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              False
            </div>
            <Handle
              type="source"
              position={Position.Bottom}
              id="false"
              className="relative! transform-none! left-auto! w-2.5! h-2.5! bg-rose-500! border-2! border-[#1a1a1f]! hover:scale-125 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  )
})

CustomBlockNode.displayName = 'CustomBlockNode'
