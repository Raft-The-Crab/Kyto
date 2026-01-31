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
          'group flex items-center gap-3 py-2 px-4 cursor-pointer transition-all duration-300 border-l-2 select-none',
          isActive
            ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[inset_4px_0_12px_rgba(99,102,241,0.05)]'
            : 'border-transparent hover:bg-white/5 text-muted-foreground/60 hover:text-foreground'
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Expand Icon */}
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          {isFolder &&
            (node.isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            ))}
        </div>

        {/* Type Icon */}
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          {isFolder ? (
            <Folder
              className={cn(
                'w-4 h-4 transition-colors',
                isActive ? 'text-indigo-400' : 'text-amber-500/60 group-hover:text-amber-400'
              )}
            />
          ) : (
            <FileCode
              className={cn(
                'w-4 h-4 transition-colors',
                isActive
                  ? 'text-indigo-400 shadow-glow'
                  : 'text-indigo-400/40 group-hover:text-indigo-400'
              )}
            />
          )}
        </div>

        {/* Name / Rename Input */}
        {isEditing ? (
          <form
            onSubmit={handleSubmitRename}
            className="flex-1 min-w-0"
            onClick={e => e.stopPropagation()}
          >
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              className="w-full bg-black/40 border border-indigo-500/50 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </form>
        ) : (
          <span
            className={cn(
              'text-[11px] font-bold truncate flex-1 tracking-tight transition-colors',
              isActive ? 'text-indigo-400' : 'text-muted-foreground/80 group-hover:text-foreground'
            )}
          >
            {node.name}
          </span>
        )}

        {/* Actions (Hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
          {isFolder && (
            <>
              <button
                onClick={e => handleCreate('file', e)}
                className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-muted-foreground/40 hover:text-emerald-400 transition-colors"
                title="New File"
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={e => handleCreate('folder', e)}
                className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-muted-foreground/40 hover:text-amber-400 transition-colors"
                title="New Folder"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={e => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-muted-foreground/40 hover:text-indigo-400 transition-colors"
            title="Rename"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {nodeId !== 'root' && (
            <button
              onClick={e => {
                e.stopPropagation()
                if (confirm('Delete this item?')) deleteNode(nodeId)
              }}
              className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground/40 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Children */}
      {isFolder && node.isExpanded && node.children && (
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-divider/30" />
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
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-divider flex items-center justify-center animate-pulse">
          <Folder className="w-5 h-5 text-muted-foreground/20" />
        </div>
        <p className="label-text-premium text-[10px] opacity-20 uppercase tracking-widest">
          Booting File Engine...
        </p>
      </div>
    )

  return (
    <div className="h-full flex flex-col matte-dark border-r border-divider/50">
      <div className="px-6 py-5 border-b border-divider/50 flex items-center justify-between shrink-0 bg-black/10">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-glow" />
          <h2 className="heading-tertiary text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
            Registry
          </h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar bg-black/5">
        <FileTreeItem nodeId={project.rootFolderId} />
      </div>
    </div>
  )
}
