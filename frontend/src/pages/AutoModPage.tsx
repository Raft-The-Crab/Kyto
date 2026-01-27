import { useState } from 'react'
import {
  ShieldAlert,
  Sparkles,
  MessageSquare,
  Plus,
  Settings2,
  Trash2,
  Play,
  Eye,
} from 'lucide-react'
import { NeoLayout } from '@/components/layout/NeoLayout'
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
  ])

  const [simulationInput, setSimulationInput] = useState('')
  const [simulationResult, setSimulationResult] = useState<string | null>(null)

  const handleSimulate = () => {
    const result = RuleEngine.simulateResponse(simulationInput, rules)
    setSimulationResult(result)
    toast.info('Rule simulation complete!')
  }

  return (
    <NeoLayout>
      <div className="max-w-6xl mx-auto py-12 px-6">
        <header className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full border border-red-200 dark:border-red-900/50 font-bold text-[10px] uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" /> Safety Engine
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            AUTO-MODERATION
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Protect your server with rule-based AI automation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Rules List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Active Rules</h2>
              <Button
                variant="outline"
                className="rounded-xl border-2 gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Create Rule
              </Button>
            </div>

            <div className="space-y-4">
              {rules.map(rule => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:translate-y-[-2px] hover:border-black/20 dark:hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {rule.name}
                        </h3>
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            rule.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                          )}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          IF {rule.trigger.type}: "{rule.trigger.value}"
                        </span>
                        {rule.actions.map((action, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30"
                          >
                            THEN {action.type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
                        <Settings2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-slate-300 hover:text-red-500">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Sandbox Simulation */}
          <aside className="space-y-8">
            <div className="p-8 bg-slate-900 dark:bg-black rounded-2xl shadow-neo border-2 border-slate-800 dark:border-slate-800 text-white space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-black tracking-tight">AI SANDBOX</h2>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Type a message below to see how your rules would react in real-time.
              </p>

              <div className="space-y-4">
                <div className="relative group">
                  <MessageSquare className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Testing message..."
                    value={simulationInput}
                    onChange={e => setSimulationInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 dark:bg-zinc-900 border border-slate-700 dark:border-slate-800 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
                  />
                </div>
                <Button onClick={handleSimulate} className="w-full h-12 shadow-sm rounded-xl">
                  <Play className="w-4 h-4 mr-2" /> Simulate Logic
                </Button>
              </div>

              <AnimatePresence>
                {simulationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-slate-800 dark:bg-zinc-900 border border-slate-700 dark:border-slate-800 rounded-xl text-xs font-mono text-emerald-400 leading-relaxed"
                  >
                    <div className="flex items-center gap-2 mb-2 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                      <Eye className="w-3 h-3" /> Console Output
                    </div>
                    {simulationResult}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </NeoLayout>
  )
}
