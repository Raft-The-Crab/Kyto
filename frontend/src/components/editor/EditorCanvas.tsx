import { useCallback, useEffect, DragEvent, useRef, useState } from 'react'
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
import { CustomEdge } from './CustomEdge'
import { ContextMenu } from './ContextMenu'
import { useEditorStore } from '@/store/editorStore'
import { BlockType } from '@/types'

const nodeTypes = {
  customBlock: CustomBlockNode,
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
  const { screenToFlowPosition, fitView, setViewport, getViewport } = useReactFlow()

  // Track last known store states to avoid reactive loops
  const lastStoreBlocks = useRef<string>('')
  const lastStoreConnections = useRef<string>('')

  // Local UI state
  const [snapToGrid, setSnapToGrid] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kyto_snap') !== 'false'
    } catch (e) {
      return true
    }
  })
  const [showGrid, setShowGrid] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kyto_grid') === 'true'
    } catch (e) {
      return false
    }
  })

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
    const flowNodes: Node<CustomNodeData>[] = blocks.map(block => {
      const labelLen = (block.data.label || '').length
      const dynamicWidth = Math.min(420, Math.max(140, labelLen * 8 + 120))
      const propsCount = Object.keys(block.data.properties || {}).length
      const dynamicHeight = Math.min(220, Math.max(88, 80 + propsCount * 20))

      return ({
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
        width: dynamicWidth,
        height: dynamicHeight,
      })
    })

    const flowEdges = connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      type: 'custom',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 3 },
    }))

    setNodes(flowNodes)
    setEdges(flowEdges)

    lastStoreBlocks.current = JSON.stringify(blocks)
    lastStoreConnections.current = JSON.stringify(connections)

    const timer = setTimeout(() => fitView({ padding: 0.2, duration: 400, maxZoom: 1 }), 50)
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
            width: Math.min(420, Math.max(140, ((block.data.label || '').length * 8) + 120)),
            height: Math.min(220, Math.max(88, 80 + Object.keys(block.data.properties || {}).length * 20)),
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
        type: 'custom',
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
          {
            ...params,
            id,
            type: 'custom',
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 3 },
          },
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

  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }, [])

  const onAddFromMenu = useCallback(
    (type: BlockType) => {
      if (!menuPosition) return
      const position = screenToFlowPosition(menuPosition)
      addBlock(type, position) // No adjustment needed for exact placement
      setMenuPosition(null)
      toast.success('Block added.')
    },
    [menuPosition, addBlock, screenToFlowPosition]
  )

  // Zoom controls
  const zoomIn = useCallback(() => {
    try {
      const v = getViewport()
      setViewport({ x: v.x, y: v.y, zoom: Math.min(4, v.zoom * 1.2) })
    } catch (e) {
      fitView({ padding: 0.2 })
    }
  }, [getViewport, setViewport, fitView])

  const zoomOut = useCallback(() => {
    try {
      const v = getViewport()
      setViewport({ x: v.x, y: v.y, zoom: Math.max(0.05, v.zoom * 0.8) })
    } catch (e) {
      fitView({ padding: 0.2 })
    }
  }, [getViewport, setViewport, fitView])

  const resetZoom = useCallback(() => {
    fitView({ padding: 0.2, duration: 400 })
  }, [fitView])

  // Auto-arrange: simple grid layout
  const autoArrange = useCallback(() => {
    const count = nodes.length
    if (count === 0) {
      toast.error('No blocks to arrange.')
      return
    }

    const cols = Math.max(1, Math.floor(Math.sqrt(count)))
    const colWidth = 260
    const rowHeight = 180
    const padding = 80

    setNodes(prev => {
      return prev.map((n, i) => {
        const row = Math.floor(i / cols)
        const col = i % cols
        const newPos = { x: col * colWidth + padding, y: row * rowHeight + padding }
        updateBlock(n.id, { position: newPos })
        return { ...n, position: newPos }
      })
    })

    // Give React Flow a small moment then fit the view
    setTimeout(() => fitView({ padding: 0.12, duration: 400 }), 80)
    toast.success('Blocks auto-arranged.')
  }, [nodes.length, setNodes, updateBlock, fitView])

  // Move / Nudge selected node by dx/dy in flow coords
  const moveSelected = useCallback(
    (dx: number, dy: number) => {
      if (!selectedBlockId) return
      const block = blocks.find(b => b.id === selectedBlockId)
      if (!block) return
      const snap = (v: number) => (snapToGrid ? Math.round(v / 8) * 8 : v)
      const newPos = { x: snap(block.position.x + dx), y: snap(block.position.y + dy) }
      updateBlock(selectedBlockId, { position: newPos })
      setNodes(prev => prev.map(n => (n.id === selectedBlockId ? { ...n, position: newPos } : n)))
    },
    [selectedBlockId, blocks, snapToGrid, updateBlock, setNodes]
  )

  const centerSelected = useCallback(() => {
    if (!selectedBlockId) return
    // Center on screen: convert screen center to flow position
    const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const block = blocks.find(b => b.id === selectedBlockId)
    if (!block) return
    const newPos = { x: Math.round(center.x - 120), y: Math.round(center.y - 40) }
    updateBlock(selectedBlockId, { position: newPos })
    setNodes(prev => prev.map(n => (n.id === selectedBlockId ? { ...n, position: newPos } : n)))
    toast.success('Block centered in viewport.')
  }, [selectedBlockId, screenToFlowPosition, blocks, updateBlock, setNodes])

  // Keyboard shortcuts: A = auto-arrange, +/- = zoom, Ctrl/Cmd+0 = reset/fit, arrows = nudge
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // prevent typing in inputs from triggering actions
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) return

      const nudgeAmount = e.shiftKey ? 32 : 8

      if (e.key === 'a' || e.key === 'A') {
        autoArrange()
      } else if (e.key === '+' || e.key === '=') {
        zoomIn()
      } else if (e.key === '-') {
        zoomOut()
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        resetZoom()
      } else if (e.key === 'ArrowLeft') {
        moveSelected(-nudgeAmount, 0)
      } else if (e.key === 'ArrowRight') {
        moveSelected(nudgeAmount, 0)
      } else if (e.key === 'ArrowUp') {
        moveSelected(0, -nudgeAmount)
      } else if (e.key === 'ArrowDown') {
        moveSelected(0, nudgeAmount)
      }
    }

    const onPref = (ev: Event) => {
      const detail = (ev as CustomEvent).detail || {}
      if (typeof detail.snapToGrid === 'boolean') setSnapToGrid(detail.snapToGrid)
      if (typeof detail.showGrid === 'boolean') setShowGrid(detail.showGrid)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('kyto:preferences', onPref as EventListener)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('kyto:preferences', onPref as EventListener)
    }
  }, [autoArrange, zoomIn, zoomOut, resetZoom])

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
        onContextMenu={onPaneContextMenu} // Right click trigger
        onMoveEnd={(_, viewport) => updateViewport(viewport)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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

        {/* Optional grid overlay when user toggles Grid */}
        {showGrid && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(200,200,200,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,200,200,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px, 24px 24px',
            }}
          />
        )}
        <Panel position="top-right" className="m-6 pointer-events-none">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-black/10 dark:border-slate-800 rounded-2xl p-3 shadow-neo-sm flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 pointer-events-auto transition-all">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse" />
                Environment Ready
              </span>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
              <span className="text-slate-900 dark:text-white uppercase tracking-tighter">
                {nodes.length} Components
              </span>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-mono">Shortcuts:</span> A = Auto-arrange · + / - = Zoom · Ctrl/Cmd+0 = Fit
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Zoom out"
                className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs"
                onClick={zoomOut}
                title="Zoom out"
              >
                −
              </button>

              <button
                type="button"
                aria-label="Reset zoom / Fit"
                className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs"
                onClick={resetZoom}
                title="Reset zoom / Fit (Ctrl/Cmd+0)"
              >
                Fit
              </button>

              <button
                type="button"
                aria-label="Zoom in"
                className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs"
                onClick={zoomIn}
                title="Zoom in"
              >
                +
              </button>

              <button
                type="button"
                aria-label="Auto arrange blocks (A)"
                className="px-2 py-1 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs hover:brightness-95"
                onClick={autoArrange}
                title="Auto arrange blocks"
              >
                Auto-arrange
              </button>

              {/* Snap-to-grid toggle */}
              <button
                type="button"
                aria-pressed={snapToGrid}
                aria-label={snapToGrid ? 'Disable snap to grid' : 'Enable snap to grid'}
                onClick={() => {
                  const next = !snapToGrid
                  setSnapToGrid(next)
                  try {
                    localStorage.setItem('kyto_snap', String(next))
                    window.dispatchEvent(new CustomEvent('kyto:preferences', { detail: { snapToGrid: next } }))
                  } catch (e) {}
                }}
                className={"px-2 py-1 rounded-md text-xs " + (snapToGrid ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800')}
                title={snapToGrid ? 'Snap-to-grid: ON' : 'Snap-to-grid: OFF'}
              >
                Snap
              </button>

              {/* Grid toggle */}
              <button
                type="button"
                aria-pressed={showGrid}
                aria-label={showGrid ? 'Hide grid' : 'Show grid'}
                onClick={() => {
                  const next = !showGrid
                  setShowGrid(next)
                  try {
                    localStorage.setItem('kyto_grid', String(next))
                    window.dispatchEvent(new CustomEvent('kyto:preferences', { detail: { showGrid: next } }))
                  } catch (e) {}
                }}
                className={"px-2 py-1 rounded-md text-xs " + (showGrid ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800')}
                title={showGrid ? 'Hide grid' : 'Show grid'}
              >
                Grid
              </button>

              {/* Nudge / Center controls */}
              <button
                type="button"
                aria-label="Center selected block"
                className="px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800"
                onClick={centerSelected}
                title="Center selected block"
              >
                Center
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Nudge left"
                  className="px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800"
                  onClick={() => moveSelected(-8, 0)}
                  title="Nudge left"
                >
                  ←
                </button>

                <button
                  type="button"
                  aria-label="Nudge right"
                  className="px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800"
                  onClick={() => moveSelected(8, 0)}
                  title="Nudge right"
                >
                  →
                </button>

                <button
                  type="button"
                  aria-label="Nudge up"
                  className="px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800"
                  onClick={() => moveSelected(0, -8)}
                  title="Nudge up"
                >
                  ↑
                </button>

                <button
                  type="button"
                  aria-label="Nudge down"
                  className="px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800"
                  onClick={() => moveSelected(0, 8)}
                  title="Nudge down"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </Panel>
        <Controls className="bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-800 shadow-neo-sm m-6! rounded-xl overflow-hidden" />
        <MiniMap
          className="bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-800 shadow-neo-sm m-6! rounded-xl overflow-hidden hidden md:block"
          position="bottom-right"
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

export function EditorCanvas(props: EditorCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <ReactFlowProvider>
        <EditorCanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  )
}
