import { FileCode, FileJson, Settings2, Lock, ChevronRight, Folder, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/store/projectStore'

export function FileExplorer() {
  const { language, name, activeFileId, setActiveFile } = useProjectStore()

  const files = [
    {
      id: 'main',
      name: language === 'discord.js' ? 'index.js' : 'main.py',
      icon: FileCode,
      color: language === 'discord.js' ? 'text-yellow-500' : 'text-blue-500',
    },
    {
      id: 'settings',
      name: 'settings.json',
      icon: FileJson,
      color: 'text-indigo-400',
    },
    {
      id: 'env',
      name: '.env',
      icon: Lock,
      color: 'text-emerald-500',
    },
    {
      id: 'pkg',
      name: language === 'discord.js' ? 'package.json' : 'requirements.txt',
      icon: Settings2,
      color: 'text-slate-400',
    },
  ]

  return (
    <div className="h-full bg-white dark:bg-slate-950 flex flex-col font-sans transition-colors">
      <div className="p-4 border-b-2 border-black/10 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white truncate max-w-[120px]">
            {name.replace(/\s+/g, '-').toLowerCase()}
          </span>
        </div>
        <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all">
          <RefreshCw className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black transition-all group border-2 border-transparent',
                activeFileId === file.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-neo-sm translate-y-[-2px] border-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              )}
            >
              <file.icon
                className={cn('w-4 h-4', activeFileId === file.id ? 'text-inherit' : file.color)}
              />
              <span className="flex-1 text-left truncate tracking-tight">{file.name}</span>
              {activeFileId === file.id && <ChevronRight className="w-3 h-3 opacity-50" />}
            </button>
          ))}
        </div>

        <div className="mt-10 px-6">
          <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">
            Bot Modules
          </h4>
          <div className="space-y-3 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <SidebarFolder name="commands/" />
            <SidebarFolder name="events/" />
            <SidebarFolder name="utils/" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t-2 border-black/10 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            V-FS SYNC ACTIVE
          </span>
        </div>
      </div>
    </div>
  )
}

function SidebarFolder({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors cursor-default">
      <Folder className="w-3 h-3" />
      <span>{name}</span>
    </div>
  )
}
