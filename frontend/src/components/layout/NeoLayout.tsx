import { Link, useLocation } from 'react-router-dom'
import { Rocket, Box, Zap, Settings, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NeoLayoutProps {
  children: React.ReactNode
}

export function NeoLayout({ children }: NeoLayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Commands', path: '/commands', icon: Box },
    { label: 'Events', path: '/events', icon: Zap },
    { label: 'Modules', path: '/modules', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900">
      {/* Neo-brutalist Dotted Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Glassmorphic Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white/70 backdrop-blur-md border border-white/50 shadow-xl shadow-slate-200/50 rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-300 hover:bg-white/90">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-indigo-500/30">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-950">Botify</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50">
            {navItems.map((item) => {
              const active = isActive(item.path)
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200",
                    active 
                      ? "bg-white text-indigo-600 shadow-md shadow-slate-200/50 scale-105" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", active && "stroke-[2.5px]")} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right mr-2">
                <p className="text-xs font-bold text-slate-800">Demo User</p>
                <p className="text-[10px] text-slate-500 font-medium">Free Plan</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-lg cursor-pointer transform hover:scale-105 transition-transform" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-32 pb-12 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
