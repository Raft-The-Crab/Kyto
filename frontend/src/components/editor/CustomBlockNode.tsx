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
        'bg-white dark:bg-slate-900 border-2 rounded-2xl shadow-neo-sm transition-all min-w-[240px] overflow-hidden',
        selected
          ? 'border-indigo-600 dark:border-indigo-400 shadow-neo scale-[1.02]'
          : 'border-slate-900 dark:border-slate-700',
        data.type === 'command_slash' &&
          'border-indigo-600 dark:border-indigo-500 ring-4 ring-indigo-500/10'
      )}
    >
      {/* Input Handle */}
      {definition.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-4! h-4! bg-indigo-500! border-2! border-white! dark:border-slate-900! shadow-neo-sm! hover:scale-125! transition-transform!"
        />
      )}

      {/* Node Header */}
      <div className="px-5 py-4 border-b-2 border-slate-900 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg border-2 border-slate-900 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-neo-sm">
            {IconComponent && (
              <IconComponent className="w-4 h-4" style={{ color: definition.color }} />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest truncate">
              {data.type === 'command_slash' ? 'Slash Trigger' : definition.label || data.label}
            </h4>
            {data.type === 'command_slash' && (
              <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 leading-none mt-1 uppercase tracking-tighter">
                Core Entity
              </p>
            )}
          </div>
        </div>
        {hasErrors && <Icons.AlertCircle className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />}
      </div>

      {/* Node Content */}
      <div className="px-4 py-3">
        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
          {definition.description}
        </p>

        {/* Show key properties if set */}
        {data.properties && Object.keys(data.properties).length > 0 && (
          <div className="mt-2 space-y-1">
            {Object.entries(data.properties)
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="text-slate-400 dark:text-slate-500">{key}:</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300 font-bold truncate">
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
          className="w-4! h-4! bg-indigo-500! border-2! border-white! dark:border-slate-900! shadow-neo-sm! hover:scale-125! transition-transform!"
        />
      )}

      {definition.outputs === 2 && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="bg-green-500! w-3! h-3! border-2! border-slate-900!"
            style={{ left: '33%' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="bg-red-500! w-3! h-3! border-2! border-slate-900!"
            style={{ left: '66%' }}
          />
        </>
      )}
    </div>
  )
})

CustomBlockNode.displayName = 'CustomBlockNode'
