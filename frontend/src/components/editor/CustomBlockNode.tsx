import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import { BlockType } from '@/types'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomNodeData {
  type: BlockType
  label: string
  properties: Record<string, unknown>
  isValid: boolean
  errors: string[]
}

export const CustomBlockNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const definition = BLOCK_DEFINITIONS[data.type]
  if (!definition) return null

  const IconComponent = Icons[definition.icon as keyof typeof Icons] as React.ComponentType<{
    className?: string
  }>

  const hasErrors = data.errors.length > 0

  return (
    <div
      className={cn(
        'bg-slate-800 border-2 rounded-lg shadow-lg min-w-[220px] transition-all',
        selected ? 'border-indigo-500 shadow-indigo-500/50' : 'border-slate-700',
        hasErrors && 'border-red-500'
      )}
    >
      {/* Input Handle */}
      {definition.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-indigo-500 !w-3 !h-3 !border-2 !border-slate-900"
        />
      )}

      {/* Node Header */}
      <div
        className="px-4 py-3 border-b border-slate-700 flex items-center gap-3"
        style={{ backgroundColor: `${definition.color}15` }}
      >
        {IconComponent && (
          <IconComponent className="w-5 h-5" style={{ color: definition.color }} />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm truncate">{definition.label}</h4>
        </div>
        {hasErrors && (
          <Icons.AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        )}
      </div>

      {/* Node Content */}
      <div className="px-4 py-3">
        <p className="text-slate-400 text-xs leading-relaxed">{definition.description}</p>

        {/* Show key properties if set */}
        {Object.keys(data.properties).length > 0 && (
          <div className="mt-2 space-y-1">
            {Object.entries(data.properties).slice(0, 2).map(([key, value]) => (
              <div key={key} className="text-xs">
                <span className="text-slate-500">{key}:</span>{' '}
                <span className="text-slate-300 truncate">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Output Handle(s) */}
      {definition.outputs === 1 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-indigo-500 !w-3 !h-3 !border-2 !border-slate-900"
        />
      )}
      
      {definition.outputs === 2 && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!bg-green-500 !w-3 !h-3 !border-2 !border-slate-900"
            style={{ left: '33%' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!bg-red-500 !w-3 !h-3 !border-2 !border-slate-900"
            style={{ left: '66%' }}
          />
        </>
      )}
    </div>
  )
})

CustomBlockNode.displayName = 'CustomBlockNode'
