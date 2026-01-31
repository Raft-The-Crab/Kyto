import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockType } from '@/types'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

export type CustomNodeData = {
  type: BlockType
  label: string
  properties: Record<string, unknown>
  isValid: boolean
  errors: string[]
}

export const CustomBlockNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as CustomNodeData
  const definition = BLOCK_DEFINITIONS[nodeData.type]

  if (!definition) return null

  const IconComponent = Icons[definition.icon as keyof typeof Icons] as React.ComponentType<{
    className?: string
  }>

  const hasErrors = nodeData.errors?.length > 0

  return (
    <div
      className={cn(
        'relative group min-w-[180px] transition-all duration-500 ease-out',
        selected ? 'z-50 scale-105' : 'z-10 hover:scale-[1.02]'
      )}
    >
      {/* Dynamic Glow - Softer and Spread out */}
      <div
        className={cn(
          'absolute -inset-1 rounded-[40px] blur-3xl opacity-0 transition-opacity duration-700',
          selected ? 'opacity-30' : 'group-hover:opacity-15'
        )}
        style={{ backgroundColor: definition.color }}
      />

      <div
        className={cn(
          'relative bg-[#0a0a0a]/90 backdrop-blur-2xl border-2 rounded-[32px] overflow-hidden transition-all duration-300 shadow-2xl',
          selected
            ? 'border-white/20 ring-1 ring-white/20'
            : 'border-white/5 group-hover:border-white/10'
        )}
      >
        {/* Node Header - Organic */}
        <div className="px-5 py-4 flex items-center gap-3.5 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-black/40 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500"
            style={{ color: definition.color }}
          >
            {IconComponent && (
              <IconComponent className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold text-slate-100 truncate leading-none tracking-tight mb-1">
              {definition.label || nodeData.label}
            </h3>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: definition.color }}
              />
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                {definition.category}
              </p>
            </div>
          </div>
          {hasErrors && (
            <div className="ml-auto w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-pulse">
              <Icons.AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>

        {/* Node Content Preview - Cleaner */}
        {nodeData.properties && Object.keys(nodeData.properties).length > 0 && (
          <div className="px-5 py-4 space-y-2.5 bg-black/20">
            {Object.entries(nodeData.properties)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center gap-3 group/item">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate group-hover/item:text-slate-400 transition-colors">
                    {key}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[100px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 group-hover/item:border-white/10 transition-colors">
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Handles - Organic Pills */}
      {definition.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-4! h-4! bg-slate-900! border-[3px]! border-slate-400! hover:border-emerald-400! hover:scale-125 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        />
      )}

      {definition.outputs === 1 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-4! h-4! bg-slate-900! border-[3px]! border-slate-500! hover:border-emerald-500! hover:scale-125 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        />
      )}

      {definition.outputs === 2 && (
        <div className="absolute -bottom-2 w-full flex justify-between px-8">
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="relative! transform-none! left-auto! w-4! h-4! bg-slate-900! border-[3px]! border-emerald-500! hover:scale-125 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="relative! transform-none! left-auto! w-4! h-4! bg-slate-900! border-[3px]! border-red-500! hover:scale-125 transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)]"
          />
        </div>
      )}
    </div>
  )
})

CustomBlockNode.displayName = 'CustomBlockNode'
