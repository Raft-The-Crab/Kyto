import { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { Code2, Box, LayoutDashboard, Sun, Moon, Users, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/components/providers/ThemeProvider'
import { toast } from 'sonner'

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

  const actions = [
    {
      group: 'Navigation',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, action: () => navigate('/dashboard') },
        { label: 'Command Builder', icon: Code2, action: () => navigate('/commands') },
        { label: 'Marketplace', icon: Box, action: () => navigate('/marketplace') },
        { label: 'Docs', icon: BookOpen, action: () => navigate('/docs') },
      ],
    },
    {
      group: 'Theme',
      items: [
        { label: 'Light Mode', icon: Sun, action: () => setTheme('light') },
        { label: 'Dark Mode', icon: Moon, action: () => setTheme('dark') },
      ],
    },
    {
      group: 'Collaboration',
      items: [
        {
          label: 'Show Online Users',
          icon: Users,
          action: () => toast.info('Collaboration presence coming soon!'),
        },
      ],
    },
  ]

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {actions.map(group => (
          <Command.Group key={group.group} heading={group.group}>
            {group.items.map(item => (
              <Command.Item key={item.label} onSelect={() => run(item.action)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  )
}
