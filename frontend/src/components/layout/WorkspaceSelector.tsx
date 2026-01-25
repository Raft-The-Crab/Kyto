import { ChevronsUpDown, Check, Plus, Bot } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Button } from '@/components/ui/Button'
import { useProjectStore } from '@/store/projectStore'
import { toast } from 'sonner'

export function WorkspaceSelector() {
  const { projects, activeProjectId, switchProject, createProject } = useProjectStore()

  const activeProject = projects[activeProjectId]

  const handleCreateProject = () => {
    // Basic prompt for now - could be a modal later
    const name = window.prompt('Enter bot name:')
    if (!name) return

    const result = createProject(name, 'discord.js')
    if (!result) {
      toast.error('Bot limit reached! You can only have 8 bots.')
    } else {
      toast.success(`Created ${name}!`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-between border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-indigo-600 rounded-lg p-1 shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col items-start truncate">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Active Bot
              </span>
              <span className="font-black truncate text-sm">
                {activeProject?.name || 'Select Bot'}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" align="start">
        <DropdownMenuLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          My Bots ({Object.keys(projects).length}/8)
        </DropdownMenuLabel>

        {Object.values(projects).map(project => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => switchProject(project.id)}
            className="cursor-pointer"
          >
            <span className="flex-1 font-bold truncate">{project.name}</span>
            {activeProjectId === project.id && <Check className="w-4 h-4 text-indigo-600" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCreateProject}
          className="text-indigo-600 focus:text-indigo-700 font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Bot
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
