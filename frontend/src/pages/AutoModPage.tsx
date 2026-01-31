import { useState } from 'react'
import {
  ShieldAlert,
  Sparkles,
  MessageSquare,
  Plus,
  Settings2,
  Trash2,
  Play,
  Bot,
  Edit3,
} from 'lucide-react'
import { ProjectLayout } from '@/components/layout/ProjectLayout'
import { Button } from '@/components/ui/Button'
import { Rule, RuleEngine } from '@/engine/ruleEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AutoModPage() {
  const [rules] = useState<Rule[]>([
    {
      id: '1',
      name: 'Anti-Spam Filter',
      enabled: true,
      trigger: { type: 'message_contains', value: 'http' },
      actions: [
        { type: 'delete_message', properties: {} },
        { type: 'send_reply', properties: { content: 'No links allowed!' } },
      ],
    },
    {
      id: '2',
      name: 'Profanity Blocker',
      enabled: false,
      trigger: { type: 'message_contains', value: 'badword' },
      actions: [
        { type: 'delete_message', properties: {} },
        { type: 'ban_user', properties: { reason: 'Profanity detected' } },
      ],
    },
  ])

  const [simulationInput, setSimulationInput] = useState('')
  const [simulationResult, setSimulationResult] = useState<string | null>(null)

  const handleSimulate = () => {
    if (!simulationInput.trim()) {
      toast.error('Please enter a message to test')
      return
    }
    const result = RuleEngine.simulateResponse(simulationInput, rules)
    setSimulationResult(result)
    toast.success('Simulation run successfully')
  }

  return (
    <ProjectLayout>
      <div className="max-w-[1800px] mx-auto py-8 px-6 space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full font-bold text-[10px] uppercase tracking-widest">
              <ShieldAlert className="w-3 h-3" /> Safety Engine
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white bg-gradient-to-r from-red-200 to-red-500 bg-clip-text text-transparent">
              Auto-Moderation
            </h1>
            <p className="text-slate-400 font-medium max-w-xl">
              Protect your server with rule-based AI automation. Configure triggers and actions to
              keep your community safe.
            </p>
          </div>
          <Button className="bg-red-500 hover:bg-red-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-red-500/20 gap-2">
            <Plus className="w-5 h-5" /> Create Rule
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rules List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-slate-400" />
                Active Rules
              </h2>
            </div>

            <div className="space-y-4">
              {rules.map((rule, idx) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group glass-premium p-6 border border-white/5 rounded-2xl hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/5"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            rule.enabled
                              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                              : 'bg-slate-600'
                          )}
                        />
                        <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                          {rule.name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 text-xs font-mono text-slate-300">
                          <span className="text-red-400 font-bold">IF</span>
                          <span>{rule.trigger.type}</span>
                          <span className="text-slate-500">contains</span>
                          <span className="text-yellow-400">"{rule.trigger.value}"</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-xs font-bold px-1">THEN</span>
                          {rule.actions.map((action, i) => (
                            <div
                              key={i}
                              className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-400"
                            >
                              {action.type.replace('_', ' ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 transition-all">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Sandbox Simulation */}
          <aside className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/5 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">AI Sandbox</h2>
                  <p className="text-xs text-slate-500">Test your rules safely</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Type a test message..."
                    value={simulationInput}
                    onChange={e => setSimulationInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600 font-medium"
                    onKeyDown={e => e.key === 'Enter' && handleSimulate()}
                  />
                </div>

                <Button
                  onClick={handleSimulate}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold h-10 shadow-lg border border-white/5"
                >
                  <Play className="w-4 h-4 mr-2 text-green-400" /> Run Simulation
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {simulationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 pt-6 border-t border-white/5"
                  >
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <Bot className="w-3.5 h-3.5" /> Output Log
                    </div>
                    <div className="p-3 bg-black/60 rounded-lg border border-white/5 font-mono text-xs leading-relaxed max-h-40 overflow-y-auto">
                      <div className="text-slate-400 mb-1">$ simulating_message_event...</div>
                      {simulationResult.includes('Action Taken') ? (
                        <div className="text-emerald-400">{simulationResult}</div>
                      ) : (
                        <div className="text-slate-300">{simulationResult}</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!simulationResult && (
                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <p className="text-xs text-slate-600 italic">
                    Results will appear here after running a simulation.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </ProjectLayout>
  )
}
