import { useCallback, useEffect, DragEvent, useRef } from 'react'
import { toast } from 'sonner'
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
} from '@xyflow/react'
import { CustomBlockNode, CustomNodeData } from './CustomBlockNode'
import { useEditorStore } from '@/store/editorStore'
import { BlockType } from '@/types'

const nodeTypes = {
  customBlock: CustomBlockNode,
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

  // Track last known store states to avoid reactive loops
  const lastStoreBlocks = useRef<string>('')
  const lastStoreConnections = useRef<string>('')

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
  } = useEditorStore()

  // --- HARD RESET (On Entity Change) ---
  useEffect(() => {
    const flowNodes: Node<CustomNodeData>[] = blocks.map(block => ({
      id: block.id,
      type: 'customBlock',
      position: block.position,
      data: {
        type: block.type,
        label: block.data.label,
        properties: block.data.properties,
        isValid: block.data.isValid,
        errors: block.data.errors,
      },
      selected: block.id === selectedBlockId,
      width: 240,
      height: 120,
    }))

    const flowEdges = connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 3 },
    }))

    setNodes(flowNodes)
    setEdges(flowEdges)

    lastStoreBlocks.current = JSON.stringify(blocks)
    lastStoreConnections.current = JSON.stringify(connections)

    const timer = setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId])

  // --- REACTIVE STORE SYNC (Store -> Local Nodes) ---
  useEffect(() => {
    const storeBlocksString = JSON.stringify(blocks)
    if (storeBlocksString !== lastStoreBlocks.current) {
      setNodes(prev => {
        return blocks.map(block => {
          const existing = prev.find(p => p.id === block.id)
          return {
            id: block.id,
            type: 'customBlock',
            position: existing ? existing.position : block.position,
            data: {
              type: block.type,
              label: block.data.label,
              properties: block.data.properties,
              isValid: block.data.isValid,
              errors: block.data.errors,
            },
            selected: block.id === selectedBlockId,
            width: 240,
            height: 120,
          }
        })
      })
      lastStoreBlocks.current = storeBlocksString
    }
  }, [blocks, selectedBlockId, setNodes])

  // --- REACTIVE STORE SYNC (Store -> Local Edges) ---
  useEffect(() => {
    const storeConnString = JSON.stringify(connections)
    if (storeConnString !== lastStoreConnections.current) {
      const flowEdges = connections.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 3 },
      }))
      setEdges(flowEdges)
      lastStoreConnections.current = storeConnString
    }
  }, [connections, setEdges])

  // --- INTERACTION SYNC (Local -> Store) ---
  const handleNodesChange: OnNodesChange<Node<CustomNodeData>> = useCallback(
    changes => {
      onNodesChange(changes)

      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          updateBlock(change.id, { position: change.position })
        }
        if (change.type === 'select') {
          selectBlock(change.selected ? change.id : null)
        }
        if (change.type === 'remove') {
          removeBlock(change.id)
        }
      })
    },
    [onNodesChange, updateBlock, selectBlock, removeBlock]
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
      const conn = {
        id,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      }

      addConnection(conn)
      // We update local state immediately for visual snappiness
      setEdges(eds =>
        addEdge(
          { ...params, id, animated: true, style: { stroke: '#6366f1', strokeWidth: 3 } },
          eds
        )
      )
    },
    [addConnection, setEdges]
  )

  // --- DRAG & DROP ---
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
      const adjustedPosition = { x: position.x - 120, y: position.y - 20 }

      addBlock(type, adjustedPosition)
      onBlockDragStart(null)
      toast.success('Logical block added.')
    },
    [draggedBlockType, addBlock, onBlockDragStart, screenToFlowPosition]
  )

  return (
    <div className="w-full h-full bg-white dark:bg-[#08080c] relative flex flex-col transition-colors duration-500 overflow-hidden isolate">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMoveEnd={(_, viewport) => updateViewport(viewport)}
        nodeTypes={nodeTypes}
        minZoom={0.05}
        maxZoom={4}
        className="flex-1"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color="rgba(99, 102, 241, 0.12)"
        />
        <Panel position="top-right" className="m-6 pointer-events-none">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-black/10 dark:border-slate-800 rounded-2xl p-3 shadow-neo-sm flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 pointer-events-auto transition-all">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse" />
              Environment Ready
            </span>
            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
            <span className="text-slate-900 dark:text-white uppercase tracking-tighter">
              {nodes.length} Components
            </span>
          </div>
        </Panel>
        <Controls className="bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-800 shadow-neo-sm m-6! rounded-xl overflow-hidden" />
        <MiniMap
          className="bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-800 shadow-neo-sm m-6! rounded-xl overflow-hidden hidden md:block"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  )
}

export function EditorCanvas(props: EditorCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <ReactFlowProvider>
        <EditorCanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  )
}
