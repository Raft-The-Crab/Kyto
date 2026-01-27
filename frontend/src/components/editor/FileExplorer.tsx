import { useState } from 'react'
import {
  Folder,
  FileCode,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  FilePlus,
  FolderPlus,
} from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { cn } from '@/lib/utils'

interface FileTreeItemProps {
  nodeId: string
  depth?: number
}

function FileTreeItem({ nodeId, depth = 0 }: FileTreeItemProps) {
  const activeProjectId = useProjectStore(state => state.activeProjectId)
  const project = useProjectStore(state => state.projects[activeProjectId])
  const files = project?.files || {}
  const activeFileId = useProjectStore(state => state.activeFileId)
  const setActiveFile = useProjectStore(state => state.setActiveFile)
  const toggleFolder = useProjectStore(state => state.toggleFolder)
  const deleteNode = useProjectStore(state => state.deleteNode)
  const createFile = useProjectStore(state => state.createFile)
  const createFolder = useProjectStore(state => state.createFolder)
  const renameNode = useProjectStore(state => state.renameNode)

  const node = files[nodeId]
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(node?.name || '')

  if (!node) return null

  const isFolder = node.type === 'folder'
  const isActive = activeFileId === nodeId
  const paddingLeft = depth * 12 + 12

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFolder) {
      toggleFolder(nodeId)
    } else {
      setActiveFile(nodeId)
    }
  }

  const handleSubmitRename = (e: React.FormEvent) => {
    e.preventDefault()
    if (editName.trim()) {
      renameNode(nodeId, editName.trim())
      setIsEditing(false)
    }
  }

  const handleCreate = (type: 'file' | 'folder', e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isFolder) return
    const name = type === 'file' ? 'new_file.js' : 'new_folder'
    if (type === 'file') {
      createFile(nodeId, name)
    } else {
      createFolder(nodeId, name)
    }
    if (!node.isExpanded) toggleFolder(nodeId)
  }

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          'group flex items-center gap-2 py-1.5 px-2 cursor-pointer transition-colors border-l-2 select-none',
          isActive
            ? 'bg-indigo-500/10 border-indigo-500 text-white'
            : 'border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Expand Icon */}
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {isFolder &&
            (node.isExpanded ? (
              <ChevronDown className="w-3 h-3 text-slate-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-500" />
            ))}
        </div>

        {/* Type Icon */}
        <div className="w-4 h-4 flex items-center justify-center shrink-0">
          {isFolder ? (
            <Folder className={cn('w-4 h-4', isActive ? 'text-indigo-400' : 'text-amber-500/80')} />
          ) : (
            <FileCode
              className={cn('w-4 h-4', isActive ? 'text-indigo-400' : 'text-blue-400/80')}
            />
          )}
        </div>

        {/* Name / Rename Input */}
        {isEditing ? (
          <form onSubmit={handleSubmitRename} className="flex-1 min-w-0">
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onClick={e => e.stopPropagation()}
              className="w-full bg-black border border-indigo-500 rounded px-1 text-xs text-white focus:outline-none"
            />
          </form>
        ) : (
          <span className="text-xs font-medium truncate flex-1">{node.name}</span>
        )}

        {/* Actions (Hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isFolder && (
            <>
              <button
                onClick={e => handleCreate('file', e)}
                className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-green-400"
                title="New File"
              >
                <FilePlus className="w-3 h-3" />
              </button>
              <button
                onClick={e => handleCreate('folder', e)}
                className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-yellow-400"
                title="New Folder"
              >
                <FolderPlus className="w-3 h-3" />
              </button>
            </>
          )}
          <button
            onClick={e => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-blue-400"
            title="Rename"
          >
            <Edit2 className="w-3 h-3" />
          </button>

          {nodeId !== 'root' && (
            <button
              onClick={e => {
                e.stopPropagation()
                if (confirm('Delete this item?')) deleteNode(nodeId)
              }}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {isFolder && node.isExpanded && node.children && (
        <div>
          {node.children.map(childId => (
            <FileTreeItem key={childId} nodeId={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileExplorer() {
  const activeProjectId = useProjectStore(state => state.activeProjectId)
  const project = useProjectStore(state => state.projects[activeProjectId])

  if (!project || !project.rootFolderId)
    return (
      <div className="p-4 text-center text-slate-500 text-xs mt-10">
        Initializing File System...
      </div>
    )

  return (
    <div className="h-full flex flex-col bg-[#0b0b0e] border-r border-white/5 font-sans">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Explorer</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <FileTreeItem nodeId={project.rootFolderId} />
      </div>
    </div>
  )
}
