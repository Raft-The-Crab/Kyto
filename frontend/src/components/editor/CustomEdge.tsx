import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react'
import { X } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { removeConnection } = useEditorStore()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: 'rgba(255, 255, 255, 0.08)',
          filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.05))',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            onClick={e => {
              e.stopPropagation()
              removeConnection(id)
            }}
            className="w-6 h-6 bg-slate-900 border border-white/20 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all cursor-pointer shadow-xl"
            aria-label="Delete connection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
