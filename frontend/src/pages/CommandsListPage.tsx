import { useNavigate, Link } from 'react-router-dom'
import { Plus, Terminal, Trash2, Edit3 } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { BuilderTabs } from '@/components/layout/BuilderTabs'

export default function CommandsListPage() {
  const { commands, deleteCommand, createCommand } = useProjectStore()
  const navigate = useNavigate()

  const handleCreate = () => {
    const id = createCommand()
    navigate(`/builder/commands/${id}`)
  }

  return (
    <NeoLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <BuilderTabs />

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Slash Commands
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Define how your bot responds to user inputs.
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2 shadow-neo-sm">
            <Plus className="w-4 h-4" /> Create Command
          </Button>
        </div>

        <div className="grid gap-6">
          {commands.length === 0 ? (
            <Card className="border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-neo">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 border-2 border-slate-900 dark:border-slate-700">
                  <Terminal className="w-8 h-8 text-slate-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                  No commands yet
                </h3>
                <p className="text-slate-500 font-medium mb-6 max-w-sm">
                  Create your first slash command to start adding interactivity to your bot.
                </p>
                <Button onClick={handleCreate} className="shadow-neo-sm">
                  Create Command
                </Button>
              </CardContent>
            </Card>
          ) : (
            commands.map((cmd: any) => (
              <Card
                key={cmd.id}
                className="group hover:border-indigo-600 dark:hover:border-indigo-500 transition-all border-2 border-black/10 dark:border-slate-800 shadow-neo-sm hover:translate-y-[-2px] hover:shadow-neo cursor-default rounded-3xl bg-white dark:bg-slate-900"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors border-2 border-transparent group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30">
                      <Terminal className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black flex items-center gap-2">
                        /{cmd.name}
                        <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
                          slash
                        </span>
                      </CardTitle>
                      <CardDescription className="line-clamp-1 mt-1 font-medium">
                        {cmd.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/builder/commands/${cmd.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600"
                      >
                        <Edit3 className="w-4 h-4 stroke-[2.5px]" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => deleteCommand(cmd.id)}
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5px]" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-slate-500 font-bold">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      Active
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Updated just now</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </NeoLayout>
  )
}
