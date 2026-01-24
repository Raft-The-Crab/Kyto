import { useCallback, useRef, DragEvent } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react'
import { CustomBlockNode } from './CustomBlockNode'
import { useEditorStore } from '@/store/editorStore'
import { BlockType } from '@/types'

const nodeTypes = {
  customBlock: CustomBlockNode,
}

interface EditorCanvasProps {
  onBlockDragStart: (type: BlockType | null) => void
  draggedBlockType: BlockType | null
}

function EditorCanvasInner({ onBlockDragStart, draggedBlockType }: EditorCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const { blocks, addBlock, selectBlock, selectedBlockId } = useEditorStore()

  // Sync blocks from store to nodes
  useCallback(() => {
    const flowNodes: Node[] = blocks.map(block => ({
      id: block.id,
      type: 'customBlock',
      position: block.position,
      data: block.data,
      selected: block.id === selectedBlockId,
    }))
    setNodes(flowNodes)
  }, [blocks, selectedBlockId, setNodes])()

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        id: `edge-${connection.source}-${connection.target}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        animated: true,
      }
      setEdges(eds => addEdge(edge, eds))
    },
    [setEdges]
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectBlock(node.id)
    },
    [selectBlock]
  )

  const onPaneClick = useCallback(() => {
    selectBlock(null)
  }, [selectBlock])

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      if (!draggedBlockType || !reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 110,
        y: event.clientY - reactFlowBounds.top - 50,
      }

      addBlock(draggedBlockType, position)
      onBlockDragStart(null)
    },
    [draggedBlockType, addBlock, onBlockDragStart]
  )

  return (
    <div ref={reactFlowWrapper} className="flex-1 bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-950"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
      >
        <Background color="#334155" variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls className="!bg-slate-800 !border-slate-700" />
        <MiniMap
          className="!bg-slate-900 !border-slate-700"
          nodeColor="#4f46e5"
          maskColor="rgba(15, 23, 42, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}

export function EditorCanvas(props: EditorCanvasProps) {
  return (
    <ReactFlowProvider>
      <EditorCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
