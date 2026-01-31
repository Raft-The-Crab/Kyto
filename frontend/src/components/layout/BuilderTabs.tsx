import { Link, useLocation } from 'react-router-dom'
import { Terminal, Zap, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BuilderTabs() {
  const location = useLocation()

  const tabs = [
    { label: 'Commands', path: '/commands', icon: Terminal },
    { label: 'Events', path: '/events', icon: Zap },
    { label: 'Modules', path: '/modules', icon: Package },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-md rounded-xl w-fit mb-10 border border-white/5">
      {tabs.map(tab => {
        const isActive = location.pathname.startsWith(tab.path)
        const Icon = tab.icon

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              'px-6 py-2 flex items-center gap-2.5 rounded-lg transition-all duration-300 text-xs font-bold uppercase tracking-widest',
              isActive
                ? 'bg-white/10 text-emerald-400 shadow-sm border border-white/10'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-400' : 'text-slate-500')} />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
