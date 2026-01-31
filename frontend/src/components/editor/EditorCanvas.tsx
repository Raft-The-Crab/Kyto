import { useCallback, useEffect, DragEvent, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  Panel,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
} from '@xyflow/react'
import { CustomBlockNode, CustomNodeData } from './CustomBlockNode'
import { CustomEdge } from './CustomEdge'
import { ContextMenu } from './ContextMenu'
import { useEditorStore } from '@/store/editorStore'
import { Block, BlockConnection, BlockType } from '@/types'
import { BLOCK_DEFINITIONS } from '@/lib/blocks/definitions'
import * as Icons from 'lucide-react'

const nodeTypes: NodeTypes = {
  customBlock: CustomBlockNode as any,
}

const edgeTypes = {
  custom: CustomEdge,
}

interface EditorCanvasProps {
  entityId: string
  onBlockDragStart: (type: BlockType | null) => void
  draggedBlockType: BlockType | null
}

function EditorCanvasInner({ entityId, onBlockDragStart, draggedBlockType }: EditorCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { screenToFlowPosition, fitView } = useReactFlow()

  const lastStoreBlocks = useRef<string>('')
  const lastStoreConnections = useRef<string>('')

  const [snapToGrid] = useState<boolean>(true)

  const {
    blocks,
    connections,
    updateBlock,
    addBlock,
    removeBlock,
    selectBlock,
    selectedBlockId,
    updateViewport,
    addConnection,
    removeConnection,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorStore()

  // --- HARD RESET (On Entity Change) ---
  useEffect(() => {
    const flowNodes: Node<CustomNodeData>[] = (blocks as Block[]).map(block => {
      const def = BLOCK_DEFINITIONS[block.type]
      const data = block.data || {}

      return {
        id: block.id,
        type: 'customBlock',
        position: block.position || { x: 0, y: 0 },
        data: {
          type: block.type,
          label: data.label || def?.label || block.type,
          properties: data.properties || {},
          isValid: data.isValid ?? true,
          errors: data.errors || [],
        },
        selected: block.id === selectedBlockId,
      }
    })

    const flowEdges = (connections as BlockConnection[]).map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      type: 'custom',
      animated: true,
    }))

    setNodes(flowNodes)
    setEdges(flowEdges)

    lastStoreBlocks.current = JSON.stringify(blocks)
    lastStoreConnections.current = JSON.stringify(connections)

    // Only fit view on initial entity load or if it's the first render
    if (nodes.length === 0 && flowNodes.length > 0) {
      const timer = setTimeout(() => fitView({ padding: 0.2, duration: 400, maxZoom: 1 }), 50)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [entityId]) // Re-run only when entityId changes (hard reset)

  // --- REACTIVE STORE SYNC ---
  useEffect(() => {
    const storeBlocksString = JSON.stringify(blocks)
    if (storeBlocksString !== lastStoreBlocks.current) {
      setNodes(prev => {
        return (blocks as Block[]).map(block => {
          const existing = prev.find(p => p.id === block.id)
          const def = BLOCK_DEFINITIONS[block.type]
          const data = block.data || {}

          return {
            id: block.id,
            type: 'customBlock',
            position: existing ? existing.position : block.position || { x: 0, y: 0 },
            data: {
              type: block.type,
              label: data.label || def?.label || block.type,
              properties: data.properties || {},
              isValid: data.isValid ?? true,
              errors: data.errors || [],
            },
            selected: block.id === selectedBlockId,
          }
        })
      })
      lastStoreBlocks.current = storeBlocksString
    }
  }, [blocks, selectedBlockId, setNodes])

  useEffect(() => {
    const storeConnString = JSON.stringify(connections)
    if (storeConnString !== lastStoreConnections.current) {
      const flowEdges = (connections as BlockConnection[]).map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        type: 'custom',
        animated: true,
      }))
      setEdges(flowEdges)
      lastStoreConnections.current = storeConnString
    }
  }, [connections, setEdges])

  const handleNodesChange: OnNodesChange<Node<CustomNodeData>> = useCallback(
    changes => {
      onNodesChange(changes)
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          const snap = (v: number) => Math.round(v / 8) * 8
          const newPos = snapToGrid
            ? { x: snap(change.position.x), y: snap(change.position.y) }
            : change.position
          updateBlock(change.id, { position: newPos })
        }
        if (change.type === 'select') {
          selectBlock(change.selected ? change.id : null)
        }
        if (change.type === 'remove') {
          removeBlock(change.id)
        }
      })
    },
    [onNodesChange, snapToGrid, updateBlock, selectBlock, removeBlock]
  )

  const handleEdgesChange: OnEdgesChange = useCallback(
    changes => {
      onEdgesChange(changes)
      changes.forEach(change => {
        if (change.type === 'remove') {
          removeConnection(change.id)
        }
      })
    },
    [onEdgesChange, removeConnection]
  )

  const onConnect: OnConnect = useCallback(
    params => {
      const id = `edge_${Date.now()}`
      const conn: BlockConnection = {
        id,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      }
      addConnection(conn)
      setEdges(eds => addEdge({ ...params, id, type: 'custom', animated: true }, eds))
    },
    [addConnection, setEdges]
  )

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const type =
        draggedBlockType || (event.dataTransfer.getData('application/reactflow') as BlockType)
      if (!type) return

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
      addBlock(type, { x: position.x - 80, y: position.y - 20 })
      onBlockDragStart(null)
    },
    [draggedBlockType, addBlock, onBlockDragStart, screenToFlowPosition]
  )

  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }, [])

  const onAddFromMenu = useCallback(
    (type: BlockType) => {
      if (!menuPosition) return
      const position = screenToFlowPosition(menuPosition)
      addBlock(type, position)
      setMenuPosition(null)
    },
    [menuPosition, addBlock, screenToFlowPosition]
  )

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden isolate">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onContextMenu={onPaneContextMenu}
        onMoveEnd={(_, viewport) => updateViewport(viewport)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.05}
        maxZoom={4}
        className="flex-1"
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={40}
          size={1}
          color="rgba(16, 185, 129, 0.03)"
          className="bg-transparent"
        />

        <Panel position="top-right" className="m-6 pointer-events-none">
          <div className="glass-premium p-5 shadow-2xl flex flex-col gap-4 pointer-events-auto w-64 border-white/5 rounded-3xl backdrop-blur-3xl">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[9px]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-emerald animate-pulse" />
                Orchestrator
              </span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">
                {nodes.length} Components
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/2 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Auto Layout
                </span>
                <div className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">
                  READY
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="flex-1 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 disabled:opacity-20 transition-all flex items-center justify-center"
                >
                  <Icons.Undo className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="flex-1 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 disabled:opacity-20 transition-all flex items-center justify-center"
                >
                  <Icons.Redo className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <Controls className="bg-black/40! border-white/5! rounded-xl! overflow-hidden! shadow-2xl! p-1! m-6! scale-90" />

        <MiniMap
          className="bg-black/40! border-white/5! rounded-3xl! overflow-hidden! shadow-2xl! m-6! backdrop-blur-md opacity-60 hover:opacity-100 transition-opacity"
          style={{ width: 200, height: 140 }}
          position="bottom-right"
          maskColor="rgba(0,0,0,0.5)"
          nodeColor={n => {
            const nodeData = n.data as CustomNodeData
            if (!nodeData?.type) return '#334155'
            const blockDef = BLOCK_DEFINITIONS[nodeData.type]
            return blockDef?.color || '#334155'
          }}
          nodeStrokeWidth={0}
          nodeBorderRadius={8}
        />
      </ReactFlow>

      <ContextMenu
        position={menuPosition}
        onClose={() => setMenuPosition(null)}
        onAddBlock={onAddFromMenu}
      />
    </div>
  )
}

export default function EditorCanvas(props: EditorCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <ReactFlowProvider>
        <EditorCanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  )
}
