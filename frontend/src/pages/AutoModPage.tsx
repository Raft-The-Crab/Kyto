import React, { useState } from 'react'
import { ShieldAlert, Sparkles, MessageSquare } from 'lucide-react'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { Button } from '@/components/ui/Button'
import { Rule, RuleEngine } from '@/engine/ruleEngine'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function AutoModPage() {
  const [rules, setRules] = useState<Rule[]>([
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border-2 border-red-600 font-black text-[10px] uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" /> Safety Engine
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">AUTO-MODERATION</h1>
          <p className="text-xl text-slate-500 font-medium">
            Protect your server with rule-based AI automation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Rules List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">Active Rules</h2>
              <Button variant="outline" className="rounded-xl border-2 gap-2 shadow-neo-sm">
                <Plus className="w-4 h-4" /> Create Rule
              </Button>
            </div>

            <div className="space-y-4">
              {rules.map(rule => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-neo-sm hover:translate-y-[-2px] transition-all group"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-slate-900">{rule.name}</h3>
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            rule.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                          )}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 border border-slate-200">
                          IF {rule.trigger.type}: "{rule.trigger.value}"
                        </span>
                        {rule.actions.map((action, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-indigo-50 rounded-lg text-xs font-bold text-indigo-600 border border-indigo-100"
                          >
                            THEN {action.type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-indigo-600">
                        <Settings2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-xl transition-colors text-slate-300 hover:text-red-500">
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
            <div className="p-8 bg-slate-900 rounded-3xl shadow-neo border-4 border-slate-800 text-white space-y-6">
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <Button onClick={handleSimulate} className="w-full h-12 shadow-neo-sm">
                  <Play className="w-4 h-4 mr-2" /> Simulate Logic
                </Button>
              </div>

              <AnimatePresence>
                {simulationResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-xs font-mono text-emerald-400 leading-relaxed"
                  >
                    <div className="flex items-center gap-2 mb-2 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                      <Eye className="w-3 h-3" /> Console Output
                    </div>
                    {simulationResult}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-8 border-4 border-slate-900 rounded-3xl bg-indigo-600 shadow-neo text-white">
              <h3 className="text-xl font-black mb-4">Pro Feature: Pattern Learning</h3>
              <p className="text-sm font-medium text-indigo-100 opacity-80 leading-relaxed">
                Upgrade to Botify Pro to enable automatic rule generation based on your server's
                chat patterns.
              </p>
              <button className="mt-6 w-full py-3 bg-white text-indigo-600 font-black rounded-xl shadow-neo-sm hover:translate-y-[-2px] transition-all">
                LEARN MORE
              </button>
            </div>
          </aside>
        </div>
      </div>
    </NeoLayout>
  )
}
