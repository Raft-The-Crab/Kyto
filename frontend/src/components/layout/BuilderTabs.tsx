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
    <div className="flex items-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-0">
      {tabs.map(tab => {
        const isActive = location.pathname.startsWith(tab.path)
        const Icon = tab.icon

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              'px-4 py-3 flex items-center gap-2 font-bold text-sm border-b-2 transition-all',
              isActive
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:border-slate-300'
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
