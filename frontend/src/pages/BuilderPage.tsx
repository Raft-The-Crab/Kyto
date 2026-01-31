import { useState, useMemo } from 'react'
import {
  Plus,
  Terminal,
  Calendar,
  Package,
  Trash2,
  Edit3,
  Search,
  Grid3x3,
  List,
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { ProjectLayout } from '@/components/layout/ProjectLayout'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

type TabType = 'commands' | 'events' | 'modules'

export default function BuilderPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as TabType) || 'commands'

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab })
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const {
    commands,
    events,
    modules,
    createCommand,
    createEvent,
    createModule,
    deleteCommand,
    deleteEvent,
    deleteModule,
  } = useProjectStore()

  const filteredCommands = useMemo(() => {
    return commands
      .filter(cmd => cmd.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [commands, searchQuery])

  const filteredEvents = useMemo(() => {
    return events
      .filter(evt => evt.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [events, searchQuery])

  const filteredModules = useMemo(() => {
    const modulesArray = Object.values(modules || {})
    return modulesArray
      .filter(mod => mod.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [modules, searchQuery])

  const handleCreate = () => {
    let id: string = ''
    switch (activeTab) {
      case 'commands':
        id = createCommand()
        break
      case 'events':
        id = createEvent()
        break
      case 'modules':
        id = createModule()
        break
    }

    if (!id) {
      toast.error('Failed to create item')
      return
    }

    switch (activeTab) {
      case 'commands':
        navigate(`/builder/commands/${id}`)
        break
      case 'events':
        navigate(`/builder/events/${id}`)
        break
      case 'modules':
        navigate(`/builder/modules/${id}`)
        break
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    switch (activeTab) {
      case 'commands':
        deleteCommand(id)
        break
      case 'events':
        deleteEvent(id)
        break
      case 'modules':
        deleteModule(id)
        break
    }
  }

  const handleEdit = (id: string) => {
    switch (activeTab) {
      case 'commands':
        navigate(`/builder/commands/${id}`)
        break
      case 'events':
        navigate(`/builder/events/${id}`)
        break
      case 'modules':
        navigate(`/builder/modules/${id}`)
        break
    }
  }

  const tabs = [
    { id: 'commands', label: 'Commands', icon: Terminal, count: commands.length },
    { id: 'events', label: 'Events', icon: Calendar, count: events.length },
    {
      id: 'modules',
      label: 'Modules',
      icon: Package,
      count: Object.keys(modules || {}).length,
    },
  ] as const

  const currentItems =
    activeTab === 'commands'
      ? filteredCommands
      : activeTab === 'events'
        ? filteredEvents
        : filteredModules

  return (
    <ProjectLayout>
      <div className="max-w-7xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white">Visual Builder</h1>
            <p className="text-slate-400 font-medium text-sm max-w-lg">
              Create commands, event listeners, and modules with drag-and-drop logic blocks.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className={cn(
              'font-bold h-12 px-6 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2',
              activeTab === 'commands' &&
                'bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/20',
              activeTab === 'events' &&
                'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20',
              activeTab === 'modules' &&
                'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/20'
            )}
          >
            <Plus className="w-5 h-5" />
            New {activeTab === 'commands' ? 'Command' : activeTab === 'events' ? 'Event' : 'Module'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-white/5">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all border-2',
                  isActive &&
                    tab.id === 'commands' &&
                    'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                  isActive &&
                    tab.id === 'events' &&
                    'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
                  isActive &&
                    tab.id === 'modules' &&
                    'bg-pink-500/10 border-pink-500/30 text-pink-400',
                  !isActive &&
                    'bg-white/2 border-transparent text-slate-500 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-black',
                    isActive && tab.id === 'commands' && 'bg-emerald-500/20 text-emerald-300',
                    isActive && tab.id === 'events' && 'bg-indigo-500/20 text-indigo-300',
                    isActive && tab.id === 'modules' && 'bg-pink-500/20 text-pink-300',
                    !isActive && 'bg-white/5 text-slate-600'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search & View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/2 border border-white/5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex gap-2 bg-white/2 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
              )}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-all',
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/2 border border-white/5 flex items-center justify-center mb-6">
                {activeTab === 'commands' && <Terminal className="w-10 h-10 text-emerald-500" />}
                {activeTab === 'events' && <Calendar className="w-10 h-10 text-indigo-500" />}
                {activeTab === 'modules' && <Package className="w-10 h-10 text-pink-500" />}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No {activeTab} found</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md">
                {searchQuery
                  ? `No ${activeTab} match your search. Try a different query.`
                  : `Create your first ${activeTab.slice(0, -1)} to get started.`}
              </p>
              <Button
                onClick={handleCreate}
                className={cn(
                  'font-bold rounded-xl shadow-lg',
                  activeTab === 'commands' && 'bg-emerald-500 hover:bg-emerald-600 text-black',
                  activeTab === 'events' && 'bg-indigo-500 hover:bg-indigo-600 text-white',
                  activeTab === 'modules' && 'bg-pink-500 hover:bg-pink-600 text-white'
                )}
              >
                Create{' '}
                {activeTab === 'commands' ? 'Command' : activeTab === 'events' ? 'Event' : 'Module'}
              </Button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white/2 border border-white/5 rounded-3xl p-6 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => handleEdit(item.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center',
                        activeTab === 'commands' && 'bg-emerald-500/10 text-emerald-500',
                        activeTab === 'events' && 'bg-indigo-500/10 text-indigo-500',
                        activeTab === 'modules' && 'bg-pink-500/10 text-pink-500'
                      )}
                    >
                      {activeTab === 'commands' && <Terminal className="w-6 h-6" />}
                      {activeTab === 'events' && <Calendar className="w-6 h-6" />}
                      {activeTab === 'modules' && <Package className="w-6 h-6" />}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleEdit(item.id)
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDelete(item.id)
                        }}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2 truncate">{item.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Updated{' '}
                    {item.updatedAt
                      ? formatDistanceToNow(item.updatedAt, { addSuffix: true })
                      : 'never'}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {currentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group flex items-center justify-between bg-white/2 border border-white/5 rounded-2xl p-5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => handleEdit(item.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        activeTab === 'commands' && 'bg-emerald-500/10 text-emerald-500',
                        activeTab === 'events' && 'bg-indigo-500/10 text-indigo-500',
                        activeTab === 'modules' && 'bg-pink-500/10 text-pink-500'
                      )}
                    >
                      {activeTab === 'commands' && <Terminal className="w-5 h-5" />}
                      {activeTab === 'events' && <Calendar className="w-5 h-5" />}
                      {activeTab === 'modules' && <Package className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Updated{' '}
                        {item.updatedAt
                          ? formatDistanceToNow(item.updatedAt, { addSuffix: true })
                          : 'never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleEdit(item.id)
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleDelete(item.id)
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProjectLayout>
  )
}
