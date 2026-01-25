import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { Search, Code2, Zap, Box, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/components/providers/ThemeProvider'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const run = (action: () => void) => {
    setOpen(false)
    action()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
      <Command className="w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white shadow-neo rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center border-b-2 border-slate-900 dark:border-white px-4">
          <Search className="w-5 h-5 text-slate-500 mr-3" />
          <Command.Input
            placeholder="Type a command or search..."
            className="w-full h-14 bg-transparent outline-none text-lg font-medium placeholder:text-slate-400 dark:text-white"
          />
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-slate-500 font-medium">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Navigation"
            className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2"
          >
            <Command.Item
              onSelect={() => run(() => navigate('/dashboard'))}
              className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
              <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                Dashboard
              </span>
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => navigate('/commands'))}
              className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
            >
              <Box className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
              <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                Commands
              </span>
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => navigate('/events'))}
              className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
            >
              <Zap className="w-4 h-4 text-slate-500 group-hover:text-emerald-600" />
              <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                Events
              </span>
            </Command.Item>
          </Command.Group>

          <Command.Group
            heading="Themes"
            className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-4"
          >
            <Command.Item
              onSelect={() => run(() => setTheme('light'))}
              className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <Sun className="w-4 h-4" />
              <span className="font-medium text-slate-700 dark:text-slate-200">Light Mode</span>
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => setTheme('dark'))}
              className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <Moon className="w-4 h-4" />
              <span className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => setTheme('cyber'))}
              className="flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <Code2 className="w-4 h-4 text-green-500" />
              <span className="font-medium text-slate-700 dark:text-slate-200">Cyber Mode</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
        <div className="border-t-2 border-slate-900 dark:border-white p-2 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-500 text-center">
          Press{' '}
          <kbd className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-1 rounded">
            ESC
          </kbd>{' '}
          to close
        </div>
      </Command>
    </div>
  )
}
