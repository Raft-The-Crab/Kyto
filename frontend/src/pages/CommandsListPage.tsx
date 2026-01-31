import { useState, useMemo } from 'react'
import { Plus, Terminal, Trash2, Edit3, Zap, Search } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { ProjectLayout } from '@/components/layout/ProjectLayout'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

export default function CommandsListPage() {
  const { commands, deleteCommand, createCommand } = useProjectStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'updated'>('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCommands = useMemo(() => {
    return commands
      .filter(cmd => cmd.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return (b.updatedAt || 0) - (a.updatedAt || 0)
      })
  }, [commands, searchQuery, sortBy])

  const handleCreate = () => {
    const id = createCommand()
    navigate(`/builder/commands/${id}`)
  }

  const handleSortChange = (newSort: 'name' | 'updated') => {
    setSortBy(newSort)
  }

  return (
    <ProjectLayout>
      <div className="max-w-7xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-emerald-400" /> Interaction Layer
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Slash Commands</h1>
            <p className="text-slate-400 font-medium text-sm max-w-lg">
              Define the primary interface for your users. Build complex argument logic and
              responses.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Command
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-transparent p-0 sticky top-20 z-30">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-card/95 border-none shadow-soft text-sm rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground text-foreground"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex p-1 bg-black/20 rounded-xl border border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'grid'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-[1px]" />
                  <div className="bg-current rounded-[1px]" />
                  <div className="bg-current rounded-[1px]" />
                  <div className="bg-current rounded-[1px]" />
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'list'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                <div className="w-4 h-4 flex flex-col gap-1">
                  <div className="h-0.5 w-full bg-current rounded-full" />
                  <div className="h-0.5 w-full bg-current rounded-full" />
                  <div className="h-0.5 w-full bg-current rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        <div
          className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredCommands.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Terminal className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white">No commands found</h3>
                <p className="text-slate-500">Create your first slash command to get started.</p>
                <Button variant="outline" onClick={handleCreate} className="mt-4">
                  Create Command
                </Button>
              </motion.div>
            ) : (
              filteredCommands.map(cmd => (
                <motion.div
                  key={cmd.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'group relative overflow-hidden rounded-3xl border-none bg-card/95 transition-all hover:scale-[1.01] hover:shadow-xl shadow-soft',
                    viewMode === 'list' && 'flex items-center justify-between p-6'
                  )}
                >
                  <div
                    className={cn(
                      'space-y-4 p-6',
                      viewMode === 'list' && 'p-0 space-y-0 flex items-center gap-6 flex-1'
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-black text-muted-foreground">
                            Sort by:
                          </label>
                          <select
                            value={sortBy}
                            onChange={e => handleSortChange(e.target.value as 'name' | 'updated')}
                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
                          >
                            <option value="name">Name</option>
                            <option value="updated">Last Updated</option>
                          </select>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <Terminal className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                            /{cmd.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
                            <span>
                              Updated{' '}
                              {formatDistanceToNow(cmd.updatedAt || Date.now(), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className={cn(
                          'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity',
                          viewMode === 'list' && 'opacity-100'
                        )}
                      >
                        <Link to={`/builder/commands/${cmd.id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 hover:bg-white/10 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 hover:bg-red-500/20 hover:text-red-400"
                          onClick={e => {
                            e.preventDefault()
                            deleteCommand(cmd.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Description (Grid only) */}
                    {viewMode === 'grid' && (
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
                        {cmd.description || 'No description provided.'}
                      </p>
                    )}
                  </div>

                  {/* Footer Stats (Grid Only) */}
                  {viewMode === 'grid' && (
                    <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 list-disc">
                          ID:{' '}
                          <code className="bg-white/5 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                            {cmd.id.slice(0, 6)}
                          </code>
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProjectLayout>
  )
}
