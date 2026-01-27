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
    { label: 'Builder', path: '/commands', icon: Layers },
    { label: 'Marketplace', path: '/marketplace', icon: Store },
    { label: 'Resources', path: '/docs', icon: BookOpen },
  ]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
        <header className="pointer-events-auto h-16 w-full max-w-[1400px] bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl flex items-center justify-between px-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm transition-transform group-hover:scale-105">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white hidden sm:block">
                KYTO
              </span>
            </Link>

            {/* Main Nav - Hide on Landing Page check */}
            {location.pathname !== '/' && (
              <div className="flex items-center gap-1">
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-4" />
                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map(item => {
                    const active = isActive(item.path)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-bold transition-all group flex items-center gap-2',
                          active
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-4 h-4',
                            active ? 'stroke-[2.5px]' : 'group-hover:scale-110 transition-transform'
                          )}
                        />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {location.pathname === '/' ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <div className="hidden lg:block">
                  <WorkspaceSelector />
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                <UserMenu onOpenSettings={() => setSettingsOpen(true)} />
              </>
            )}
          </div>
        </header>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
