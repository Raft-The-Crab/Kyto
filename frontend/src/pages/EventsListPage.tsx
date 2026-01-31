import { useState, useMemo } from 'react'
import { Plus, Zap, Trash2, Edit3, Search, Calendar, Clock } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { ProjectLayout } from '@/components/layout/ProjectLayout'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

export default function EventsListPage() {
  const { events, deleteEvent, createEvent } = useProjectStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredEvents = useMemo(() => {
    return events
      .filter(evt => evt.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [events, searchQuery])

  const handleCreate = () => {
    // Assuming createEvent returns an ID or handling navigation differently
    // Adjust based on actual store implementation
    const id = createEvent()
    navigate(`/builder/events/${id}`)
  }

  return (
    <ProjectLayout>
      <div className="max-w-7xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-indigo-400" /> Event System
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Event Listeners</h1>
            <p className="text-slate-400 font-medium text-sm max-w-lg">
              React to Discord events like message creates, member joins, and more.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Listener
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md sticky top-20 z-30">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/5 text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-slate-200"
            />
          </div>

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

        <div
          className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Calendar className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white">No events found</h3>
                <p className="text-slate-500">Create your first event listener to get started.</p>
                <Button variant="outline" onClick={handleCreate} className="mt-4">
                  Create Event
                </Button>
              </motion.div>
            ) : (
              filteredEvents.map(evt => (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10',
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
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <Zap className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                            {evt.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(evt.updatedAt || Date.now(), {
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
                        <Link to={`/builder/events/${evt.id}`}>
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
                            deleteEvent(evt.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Description (Grid only) */}
                  {viewMode === 'grid' && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        Listens to the <code>{evt.eventType}</code> event.
                      </p>
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
