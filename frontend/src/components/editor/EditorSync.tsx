import { useEffect } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useProjectStore } from '@/store/projectStore'
import { CanvasState } from '@/types'

interface EditorSyncProps {
  id: string
  entityType: 'command' | 'event' | 'module'
  initialData: CanvasState
}

export function EditorSync({ id, entityType, initialData }: EditorSyncProps) {
  const { selectedBlockId, initializeFromData } = useEditorStore()
  const editorBlocks = useEditorStore(state => state.blocks)
  const editorConnections = useEditorStore(state => state.connections)
  const editorViewport = useEditorStore(state => state.viewportPosition)

  const updateCommand = useProjectStore(state => state.updateCommand)
  const updateEvent = useProjectStore(state => state.updateEvent)
  const updateModule = useProjectStore(state => state.updateModule)

  // Hydration
  useEffect(() => {
    if (initialData) {
      // Only initialize if the store is empty or different ID (handled by cleanup)
      initializeFromData(initialData)
    }
  }, [id, initialData, initializeFromData]) // Added initialData to dependencies

  // Sync back to store
  useEffect(() => {
    if (!id) return

    const timeout = setTimeout(() => {
      const canvas = {
        blocks: editorBlocks,
        connections: editorConnections,
        selectedBlockId,
        viewportPosition: editorViewport,
      }

      if (entityType === 'command') updateCommand(id, { canvas })
      if (entityType === 'event') updateEvent(id, { canvas })
      if (entityType === 'module') updateModule(id, { canvas })
    }, 1000)

    return () => clearTimeout(timeout)
  }, [editorBlocks, editorConnections, editorViewport, selectedBlockId, id, entityType])

  return null
}
