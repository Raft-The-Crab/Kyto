import { motion } from 'framer-motion'
import { Zap, ArrowUp, Cpu, Globe, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AnalyticsPanel() {
  return (
    <div className="h-full matte-dark md:bg-black/20 p-8 md:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="heading-primary text-4xl mb-3">Project analytics</h2>
          <p className="body-text text-lg text-muted-foreground/60 max-w-2xl">
            High-level metrics about your bot project. This is placeholder data for now.
          </p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Total Commands"
            value="1.2M"
            trend="+12.5%"
            icon={Zap}
            color="text-indigo-400"
            bg="bg-indigo-500/10"
          />
          <StatCard
            label="Active Nodes"
            value="42"
            trend="+5.2%"
            icon={Globe}
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
          <StatCard
            label="Avg. Latency"
            value="24ms"
            trend="-4.2%"
            icon={Cpu}
            color="text-blue-400"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Total Memory"
            value="12.4GB"
            trend="+2.1%"
            icon={Database}
            color="text-pink-400"
            bg="bg-pink-500/10"
          />
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 matte-dark border border-divider rounded-[2.5rem] p-8 md:p-10 shadow-premium-xl flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="heading-secondary text-xl">Flow Velocity</h3>
              <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-divider/50">
                {['1H', '6H', '24H', '7D'].map((p, i) => (
                  <button
                    key={p}
                    className={cn(
                      'px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95',
                      i === 2
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-3 px-2">
              {[
                40, 65, 45, 90, 65, 45, 75, 55, 85, 40, 60, 45, 95, 70, 50, 80, 60, 45, 70, 50, 85,
                60, 45, 75, 55, 90,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-linear-to-t from-indigo-500/20 via-indigo-500/5 to-transparent rounded-t-xl relative group h-full"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1.2, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-t-xl opacity-40 group-hover:opacity-100 group-hover:shadow-glow transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
              <span>00:00 UTC</span>
              <span>12:00 UTC</span>
              <span>23:59 UTC</span>
            </div>
          </div>

          <div className="matte-dark border border-divider rounded-[2.5rem] p-8 md:p-10 shadow-premium-xl flex flex-col min-h-[480px]">
            <h3 className="heading-secondary text-xl mb-10">Core Vitals</h3>
            <div className="space-y-10 flex-1 flex flex-col justify-center">
              <UsageBar label="CPU Execution" value={42} color="bg-indigo-500" />
              <UsageBar label="Memory Overhead" value={68} color="bg-pink-500" />
              <UsageBar label="Network Throughput" value={24} color="bg-emerald-500" />
              <UsageBar label="Disk Consistency" value={12} color="bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, icon: Icon, color, bg }: any) {
  return (
    <div className="p-7 matte-dark border border-divider rounded-[2rem] shadow-premium hover:shadow-premium-lg transition-all group overflow-hidden relative">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div
          className={`p-4 rounded-2xl ${bg} border border-divider/50 shadow-inner group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-6 h-6 ${color} shadow-glow`} />
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-glow-emerald">
          <ArrowUp className="w-3 h-3" /> {trend}
        </span>
      </div>
      <h4 className="heading-primary text-3xl mb-1.5 relative z-10">{value}</h4>
      <p className="label-text-premium text-[10px] relative z-10">{label}</p>
    </div>
  )
}

function UsageBar({ label, value, color }: any) {
  return (
    <div className="group">
      <div className="flex justify-between mb-3 px-1">
        <span className="label-text text-[10px] opacity-40 uppercase tracking-widest">{label}</span>
        <span className="heading-tertiary text-xs">{value}%</span>
      </div>
      <div className="h-2.5 w-full bg-black/20 dark:bg-zinc-950/40 rounded-full overflow-hidden border border-divider/50 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            `h-full ${color} rounded-full shadow-glow opacity-80 group-hover:opacity-100 transition-opacity`,
            color.includes('indigo') ? 'shadow-indigo-500/40' : ''
          )}
        />
      </div>
    </div>
  )
}
