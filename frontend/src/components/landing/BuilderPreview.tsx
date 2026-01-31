import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Zap, Layers, Cpu, Play, Plus, Terminal, MousePointer2 } from 'lucide-react'

const PREVIEWS = [
  {
    id: 'commands',
    title: 'Command Builder',
    description: 'Design Slash Commands with visual parameters.',
    icon: Terminal,
    color: 'primary',
    content: (
      <div className="p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Terminal className="w-4 h-4" />
          <span>/ban user: @target reason: string</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Parameter</span>
              <span className="text-primary font-bold">User</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className="h-full bg-primary"
              />
            </div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Required</span>
              <div className="w-8 h-4 rounded-full bg-primary/50 relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
              </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full" />
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Zap className="w-3 h-3" />
            <span>ON EXECUTE</span>
          </div>
          <div className="pl-4 border-l border-primary/30 py-2 space-y-2">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-[10px]">
              if (user.roles.has(ADMIN))
            </div>
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30 text-[10px] text-primary">
              target.ban({'{ reason }'})
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'events',
    title: 'Event Orchestrator',
    description: 'Trigger 100+ Discord events with zero latency.',
    icon: Zap,
    color: 'emerald',
    content: (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              Live Traffic
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase">Kyto Engine v2.0</div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-white">MESSAGE_CREATE</div>
                  <div className="text-[8px] text-slate-500 font-medium">Channel ID: 19284...</div>
                </div>
              </div>
              <div className="text-[8px] font-black text-emerald-500 uppercase">Triggered</div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'logic',
    title: 'Neural Flows',
    description: 'Advanced logic gating for complex bots.',
    icon: Cpu,
    color: 'blue',
    content: (
      <div className="p-6 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Cpu className="w-32 h-32 text-blue-500" />
        </div>
        <div className="relative space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 font-black text-[10px] uppercase tracking-widest shadow-glow-blue">
              INCOMING DATA
            </div>
          </div>
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0.5 h-10 bg-linear-to-b from-blue-500 to-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-4 rounded-2xl border border-white/5 bg-white/5 text-center space-y-2">
              <div className="text-[10px] font-black text-white uppercase tracking-widest">
                GATE A
              </div>
              <div className="text-[8px] text-slate-500">Filter Spam</div>
            </div>
            <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 text-center space-y-2">
              <div className="text-[10px] font-black text-primary uppercase tracking-widest">
                GATE B
              </div>
              <div className="text-[8px] text-slate-500">Analyze Sentiment</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export function BuilderPreview() {
  const [activeId, setActiveId] = useState('commands')
  const activePreview = PREVIEWS.find(p => p.id === activeId)!

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-center">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          {PREVIEWS.map(preview => (
            <button
              key={preview.id}
              onClick={() => setActiveId(preview.id)}
              className={`w-full text-left p-6 rounded-3xl border transition-all relative overflow-hidden group ${
                activeId === preview.id
                  ? 'bg-card border-primary/30 shadow-glow shadow-primary/5 scale-[1.02]'
                  : 'border-transparent hover:bg-white/5'
              }`}
            >
              {activeId === preview.id && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute inset-0 bg-primary/5 pointer-events-none"
                />
              )}
              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl transition-all ${
                    activeId === preview.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-slate-900 border border-white/5 text-slate-400'
                  }`}
                >
                  <preview.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4
                    className={`font-black text-xs uppercase tracking-[0.2em] mb-1 transition-colors ${
                      activeId === preview.id ? 'text-primary' : 'text-slate-400'
                    }`}
                  >
                    {preview.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-medium leading-relaxed max-w-[200px]">
                    {preview.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Preview Screen */}
        <motion.div
          layout
          className="relative aspect-16/10 rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl p-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_70%)]" />

          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/30" />
                <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Layers className="w-3 h-3" />
                <span>Workspace / Main Bot</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Draft
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Play className="w-3.5 h-3.5 text-primary fill-primary" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {activePreview.content}
              </motion.div>
            </AnimatePresence>

            {/* Mouse Cursor Simulation */}
            <motion.div
              animate={{
                x: [100, 300, 200, 400],
                y: [100, 150, 300, 100],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              className="absolute pointer-events-none z-50 opacity-50"
            >
              <MousePointer2 className="w-5 h-5 text-white" />
              <div className="ml-4 -mt-2 px-2 py-1 bg-primary text-[8px] font-black text-white rounded-md whitespace-nowrap uppercase tracking-widest shadow-glow-primary">
                Kyto Architect
              </div>
            </motion.div>
          </div>

          {/* Bottom Status */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2 rounded-full border border-white/5 bg-slate-950/50 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500" />
              <span>Engine Optimized</span>
            </div>
            <div className="h-2 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
              <Plus className="w-2 h-2" />
              <span>Auto-Save Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
