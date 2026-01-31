import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Store, BookOpen, Layers, Menu, X, Zap, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserMenu } from './UserMenu'
import { WorkspaceSelector } from './WorkspaceSelector'
import { SettingsDialog } from './SettingsDialog'
import { useState } from 'react'

export function TopBar() {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true
    return false
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Builder', path: '/builder', icon: Layers },
    { label: 'Templates', path: '/marketplace', icon: Store },
    { label: 'Hosting', path: '/hosting', icon: Globe },
    { label: 'Help', path: '/docs', icon: BookOpen },
  ]

  if (location.pathname === '/') return null

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
        <header className="h-12 max-w-7xl w-full bg-background/90 backdrop-blur-xl rounded-full flex items-center justify-between px-4 border border-white/5 shadow-medium">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 active:scale-95 transition-all group"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black shadow-emerald group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 fill-black" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">Kyto</span>
            </Link>

            {/* Main Nav */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-lg transition-all',
                      active
                        ? 'bg-white/5 text-emerald-400 shadow-sm'
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <WorkspaceSelector />
              <div className="h-4 w-px bg-white/5" />
              <UserMenu onOpenSettings={() => setSettingsOpen(true)} />
            </div>

            {/* Mobile Toggle */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-500"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md lg:hidden">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
                  <Zap className="w-4 h-4 fill-black" />
                </div>
                <span className="font-bold text-white">Kyto</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-bold text-slate-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
