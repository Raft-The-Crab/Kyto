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
        'bg-white dark:bg-black border-4 rounded-none shadow-neo transition-all min-w-[260px] overflow-hidden',
        selected
          ? 'border-primary shadow-neo-lg -translate-x-1 -translate-y-1'
          : 'border-black dark:border-white'
      )}
    >
      {/* Input Handle */}
      {definition.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-5! h-5! bg-secondary! border-4! border-black! rounded-none shadow-neo-sm! hover:scale-110! transition-transform!"
        />
      )}

      {/* Node Header */}
      <div className="px-5 py-4 border-b-4 border-black flex items-center justify-between gap-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-none border-2 border-black bg-white shadow-neo-sm">
            {IconComponent && <IconComponent className="w-4 h-4 text-black" />}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-xs uppercase tracking-tighter truncate">
              {definition.label || data.label}
            </h4>
          </div>
        </div>
        {hasErrors && <Icons.AlertCircle className="w-5 h-5 text-black shrink-0 animate-pulse" />}
      </div>

      {/* Node Content */}
      <div className="px-5 py-4 bg-white dark:bg-zinc-900">
        <p className="text-black dark:text-white text-[10px] font-black leading-tight uppercase opacity-80">
          {definition.description}
        </p>

        {/* Technical Properties */}
        {data.properties && Object.keys(data.properties).length > 0 && (
          <div className="mt-4 space-y-2 border-t-2 border-black pt-3">
            {Object.entries(data.properties)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center gap-4">
                  <span className="text-[9px] font-black text-black/50 dark:text-white/50 uppercase tracking-widest">
                    {key}
                  </span>
                  <span className="text-[10px] font-black text-black dark:text-white truncate border-b-2 border-black/10">
                    {typeof value === 'boolean' ? (value ? 'ACTIVE' : 'VOID') : String(value)}
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
          className="w-5! h-5! bg-accent! border-4! border-black! rounded-none shadow-neo-sm! hover:scale-110! transition-transform!"
        />
      )}

      {definition.outputs === 2 && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="bg-secondary! w-4! h-4! border-3! border-black! rounded-none shadow-neo-sm!"
            style={{ left: '30%' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="bg-destructive! w-4! h-4! border-3! border-black! rounded-none shadow-neo-sm!"
            style={{ left: '70%' }}
          />
        </>
      )}
    </div>
  )
})

CustomBlockNode.displayName = 'CustomBlockNode'
