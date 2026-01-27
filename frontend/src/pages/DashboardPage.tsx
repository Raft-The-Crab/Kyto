import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Box, Trash2, Search, Wand2, Shield, Coins, Ticket, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProjectStore } from '@/store/projectStore'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { TEMPLATES } from '@/lib/templates'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { projects, createProject, deleteProject, createCommand, updateCommand } = useProjectStore()
  const [filterType] = useState<'all' | 'command' | 'event' | 'module'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const projectsArray = Object.values(projects)

  const handleCreateProject = () => {
    const newProjectId = createProject('My Bot', 'discord.js')
    if (newProjectId) {
      toast.success('Project created!')
      navigate(`/builder/commands`)
    }
  }

  const handleUseTemplate = (template: (typeof TEMPLATES)[number]) => {
    const newProjectId = createProject(template.name, template.language)
    if (newProjectId) {
      // Hydrate commands
      template.commands.forEach(cmd => {
        const cmdId = createCommand()
        updateCommand(cmdId, {
          name: cmd.name,
          description: cmd.description,
          canvas: {
            blocks: JSON.parse(JSON.stringify(cmd.blocks)), // Deep copy and cast to mutable
            connections: JSON.parse(JSON.stringify(cmd.connections)),
            viewportPosition: { x: 0, y: 0, zoom: 0.8 },
            selectedBlockId: null,
          },
        })
      })
      toast.success(`Created project from ${template.name}`)
      navigate(`/builder/commands`)
    }
  }

  const filteredProjects = projectsArray.filter(p => {
    const matchesFilter = filterType === 'all' || true
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <NeoLayout>
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Let's Build.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-lg">
              Manage your bots, deploy improvements, and monitor uptime from one central hub.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:w-80"
              />
            </div>
            <Button
              onClick={handleCreateProject}
              size="lg"
              className="rounded-xl shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11"
            >
              <Plus className="w-5 h-5 mr-2" /> New Project
            </Button>
          </div>
        </div>

        {/* Templates Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
            <Wand2 className="w-4 h-4" /> Quick Start Templates
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map(template => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Icon = ({ Shield, Coins, Ticket } as any)[template.icon] || Box
              return (
                <div
                  key={template.id}
                  onClick={() => handleUseTemplate(template)}
                  className="group relative bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                >
                  <div
                    className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity bg-${template.color}-500 blur-2xl rounded-bl-full w-24 h-24`}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-${template.color}-50 dark:bg-${template.color}-900/10 border border-${template.color}-100 dark:border-${template.color}-500/20`}
                    >
                      <Icon
                        className={`w-6 h-6 text-${template.color}-600 dark:text-${template.color}-400`}
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg text-slate-500">
                      TEMPLATE
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                    {template.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
              <Box className="w-4 h-4" /> Recent Projects
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl bg-slate-50/50 dark:bg-white/5">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Get started by creating a new bot or using a template.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/builder/commands`)} // Redirect to builder for now since module page might not exist
                  className="group bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                      <Box className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        if (confirm('Delete this project?')) {
                          deleteProject(project.id)
                          toast.success('Project deleted')
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors flex items-center gap-2">
                      {project.name}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      {project.language} • v{project.version}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-600 dark:text-slate-300">
                      {project.commands.length} Commands
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-600 dark:text-slate-300">
                      {project.events.length} Events
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </NeoLayout>
  )
}
