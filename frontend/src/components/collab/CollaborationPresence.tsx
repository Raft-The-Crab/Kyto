import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import type { CollabUser } from '@/services/collaboration'

interface CollaborationPresenceProps {
  users: CollabUser[]
  isConnected: boolean
}

export function CollaborationPresence({ users, isConnected }: CollaborationPresenceProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(users.length > 1)
  }, [users])

  if (!show) return null

  return (
    <div className="fixed top-20 right-6 z-50">
      <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-neo-lg rounded-none p-4 min-w-[200px]">
        <div className="flex items-center gap-2 mb-3 border-b-4 border-black dark:border-white pb-2">
          <Users className="w-4 h-4" />
          <h3 className="text-xs font-black uppercase tracking-wider">Live Collaboration</h3>
          <div
            className={`ml-auto w-2 h-2 rounded-none ${isConnected ? 'bg-secondary' : 'bg-destructive'}`}
          />
        </div>

        <div className="space-y-2">
          {users.map(user => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 bg-muted/20 border-2 border-black dark:border-white rounded-none"
            >
              <div className="w-6 h-6 bg-primary rounded-none flex items-center justify-center text-[10px] font-black text-primary-foreground border-2 border-black">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-xs font-bold uppercase tracking-tight truncate">
                {user.name}
              </span>
            </div>
          ))}
        </div>

        {users.length >= 2 && (
          <p className="mt-3 text-[9px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 border-t-2 border-black/10 dark:border-white/10 pt-2">
            Room full (2/2)
          </p>
        )}
      </div>
    </div>
  )
}
