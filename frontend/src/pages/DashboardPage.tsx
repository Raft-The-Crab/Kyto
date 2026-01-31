import { ProjectLayout } from '@/components/layout/ProjectLayout'
import {
  Activity,
  GitCommit,
  Plus,
  FolderOpen,
  Terminal,
  Zap,
  Layers,
  Search,
  LayoutGrid,
  List,
  Trash2,
  ChevronRight,
  Bot,
  Shield,
  FileText,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '@/lib/templates'

export default function DashboardPage() {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showTemplates, setShowTemplates] = useState(true)

  // Hooks
  const { projects, createProject, switchProject, deleteProject } = useProjectStore()
  const navigate = useNavigate()

  // Derived State
  const projectsArray = useMemo(() => Object.values(projects), [projects])

  const filteredProjects = useMemo(() => {
    return projectsArray
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
  }, [projectsArray, searchQuery])

  const stats = useMemo(() => {
    return {
      totalProjects: projectsArray.length,
      totalCommands: projectsArray.reduce((acc, p) => acc + p.commands.length, 0),
      totalEvents: projectsArray.reduce((acc, p) => acc + p.events.length, 0),
      totalModules: projectsArray.reduce((acc, p) => acc + (p.modules?.length || 0), 0),
    }
  }, [projectsArray])

  // Handlers
  const handleCreateProject = (type: 'discord.js' | 'discord.py') => {
    createProject('My New Project', type)
    navigate(`/builder?tab=commands`)
  }

  const handleOpenProject = (projectId: string) => {
    switchProject(projectId)
    navigate(`/builder?tab=commands`)
  }

  const handleDeleteProject = (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    deleteProject(id)
    toast.success('Project deleted successfully')
  }

  const handleUseTemplate = (template: any) => {
    // Template logic
    console.log('Using template:', template.name)
  }

  const activityLog = useMemo(() => {
    return projectsArray
      .flatMap(p => [
        {
          id: `act-${p.id}-1`,
          type: 'update',
          project: p.name,
          action: 'Updated command logic',
          time: p.updatedAt || Date.now(),
          icon: GitCommit,
          color: 'text-blue-400 bg-blue-500/10',
        },
        {
          id: `act-${p.id}-2`,
          type: 'create',
          project: p.name,
          action: 'Created new event listener',
          time: (p.updatedAt || Date.now()) - 86400000,
          icon: Plus,
          color: 'text-emerald-400 bg-emerald-500/10',
        },
      ])
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)
  }, [projectsArray])

  return (
    <ProjectLayout>
      <div className="min-h-screen overflow-y-auto">
        <div className="max-w-[1800px] mx-auto py-8 px-6 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="heading-display text-4xl font-black tracking-tight bg-linear-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="body-text text-muted-foreground font-medium text-lg">
                Manage your bots, monitor activity, and deploy updates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-11 px-5 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              >
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </Button>
              <Button
                className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                onClick={() => handleCreateProject('discord.js')}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Bot
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Bots"
              value={stats.totalProjects}
              icon={FolderOpen}
              trend="+2 this week"
              color="text-blue-400"
              bg="bg-blue-500/10"
              border="border-blue-500/20"
            />
            <StatCard
              title="Active Commands"
              value={stats.totalCommands}
              icon={Terminal}
              trend="+12% usage"
              color="text-emerald-400"
              bg="bg-emerald-500/10"
              border="border-emerald-500/20"
            />
            <StatCard
              title="Event Listeners"
              value={stats.totalEvents}
              icon={Zap}
              trend="99.9% uptime"
              color="text-amber-400"
              bg="bg-amber-500/10"
              border="border-amber-500/20"
            />
            <StatCard
              title="Total Modules"
              value={stats.totalModules}
              icon={Layers}
              trend="4 installed"
              color="text-purple-400"
              bg="bg-purple-500/10"
              border="border-purple-500/20"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="heading-secondary text-xl font-bold flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    Your Bots
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    {projectsArray.length}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="Search bots..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="h-10 pl-9 pr-4 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full sm:w-64"
                    />
                  </div>

                  <div className="flex p-1 bg-background/50 rounded-xl border border-border/50">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        viewMode === 'grid'
                          ? 'bg-background shadow-sm text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        viewMode === 'list'
                          ? 'bg-background shadow-sm text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Templates Teaser */}
              {projectsArray.length === 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Start from a Template
                    </h3>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary h-auto p-0"
                      onClick={() => setShowTemplates(!showTemplates)}
                    >
                      {showTemplates ? 'Hide Templates' : 'Show Templates'}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showTemplates && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
                      >
                        {TEMPLATES.slice(0, 3).map(tpl => (
                          <TemplateCard key={tpl.id} template={tpl} onUse={handleUseTemplate} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Projects List */}
              <AnimatePresence mode="popLayout">
                {filteredProjects.length > 0 ? (
                  <div
                    className={cn(
                      'grid gap-4',
                      viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                    )}
                  >
                    {filteredProjects.map((project, idx) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        viewMode={viewMode}
                        onOpen={() => handleOpenProject(project.id)}
                        onDelete={() => handleDeleteProject(project.id)}
                        idx={idx}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState onCreate={() => handleCreateProject('discord.js')} />
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar (Activity & Status) */}
            <div className="space-y-8">
              {/* Activity Feed */}
              <div className="glass rounded-xl border border-border/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-secondary" />
                    Recent Activity
                  </h2>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    View All
                  </Button>
                </div>

                <div className="space-y-0">
                  {activityLog.map(item => (
                    <div
                      key={item.id}
                      className="relative pl-6 pb-6 last:pb-0 border-l border-border/50 last:border-0 ml-2"
                    >
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-background border-2 border-border ring-4 ring-background" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-muted-foreground">
                          {formatDistanceToNow(item.time, { addSuffix: true })}
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          {item.action} <span className="text-muted-foreground">in</span>{' '}
                          <span className="text-primary">{item.project}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Card */}
              <div className="p-6 rounded-xl bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-500 mb-1">System Healthy</h3>
                    <p className="text-sm text-emerald-500/80 leading-relaxed mb-4">
                      All systems operational. API response time is normal (24ms).
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-500/60">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  )
}

// Subcomponents

function StatCard({ title, value, icon: Icon, trend, color, bg, border }: any) {
  return (
    <div
      className={cn(
        'bg-card/95 border-none shadow-soft p-6 rounded-3xl transition-all hover:scale-[1.02]',
        border
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-2xl', bg, color)}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={cn('text-xs font-bold px-2 py-1 rounded-full bg-background/50', color)}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
      </div>
    </div>
  )
}

function TemplateCard({ template, onUse }: any) {
  return (
    <div
      className="group relative p-6 glass rounded-xl border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
      onClick={() => onUse(template)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          {template.icon === 'Command' ? (
            <Terminal className="w-5 h-5" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-bold text-foreground mb-1">{template.name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
    </div>
  )
}

function ProjectCard({ project, viewMode, onOpen, onDelete, idx }: any) {
  const isList = viewMode === 'list'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      onClick={onOpen}
      className={cn(
        'group cursor-pointer bg-card/95 border-none transition-all hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.01]',
        isList
          ? 'p-4 flex items-center justify-between rounded-3xl'
          : 'p-6 rounded-3xl flex flex-col h-full shadow-soft'
      )}
    >
      <div className={cn('flex items-start gap-4', isList && 'items-center')}>
        <div
          className={cn(
            'shrink-0 flex items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary group-hover:scale-110 transition-transform duration-500',
            isList ? 'w-10 h-10' : 'w-14 h-14 mb-4'
          )}
        >
          <Bot className={cn(isList ? 'w-5 h-5' : 'w-7 h-7')} />
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors truncate">
            {project.name}
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Updated {formatDistanceToNow(project.updatedAt || Date.now(), { addSuffix: true })}
          </p>
        </div>
      </div>

      {!isList && (
        <>
          <div className="mt-auto pt-6 flex items-center gap-4 text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md">
              <Terminal className="w-3.5 h-3.5" />
              {project.commands.length} Commands
            </div>
            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md">
              <Zap className="w-3.5 h-3.5" />
              {project.events.length} Events
            </div>
          </div>
        </>
      )}

      {isList && (
        <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <span className="hidden sm:inline">{project.commands.length} Commands</span>
          <span className="hidden sm:inline">{project.events.length} Events</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  )
}

function EmptyState({ onCreate }: any) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center glass rounded-2xl border border-dashed border-border/50">
      <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Bot className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">No Bots Found</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        Get started by creating your first Discord bot.
      </p>
      <Button
        onClick={onCreate}
        className="h-12 px-8 bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform"
      >
        Create Bot
      </Button>
    </div>
  )
}
