import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Store, BookOpen, Layers, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserMenu } from './UserMenu'
import { WorkspaceSelector } from './WorkspaceSelector'
import { SettingsDialog } from './SettingsDialog'
import { useState } from 'react'

export function TopBar() {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true
    return false
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Modules', path: '/modules', icon: Layers },
    { label: 'Marketplace', path: '/marketplace', icon: Store },
    { label: 'Docs', path: '/docs', icon: BookOpen },
  ]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
        <header className="pointer-events-auto h-16 w-full max-w-[1400px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-black/10 dark:border-slate-800 rounded-2xl flex items-center justify-between px-6 shadow-neo-sm transform transition-all hover:shadow-neo">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white border-2 border-slate-900 transition-transform group-hover:scale-110">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white uppercase hidden sm:block">
                Botify
              </span>
            </Link>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            {/* Main Nav */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map(item => {
                const active = isActive(item.path)
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all group border-2',
                      active
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-3.5 h-3.5',
                        active ? 'stroke-[3px]' : 'group-hover:scale-110'
                      )}
                    />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <WorkspaceSelector />
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <UserMenu onOpenSettings={() => setSettingsOpen(true)} />
          </div>
        </header>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
