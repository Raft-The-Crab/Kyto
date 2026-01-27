import { motion } from 'framer-motion'
import { Activity, Users, MessageSquare, Zap, ArrowUp } from 'lucide-react'

export function AnalyticsPanel() {
  return (
    <div className="h-full bg-slate-50 dark:bg-black p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Performance Analytics
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Real-time telemetry from your bot cluster.
          </p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Messages"
            value="2.4M"
            trend="+12.5%"
            icon={MessageSquare}
            color="text-indigo-500"
            bg="bg-indigo-500/10"
          />
          <StatCard
            label="Active Users"
            value="84.2K"
            trend="+5.2%"
            icon={Users}
            color="text-emerald-500"
            bg="bg-emerald-500/10"
          />
          <StatCard
            label="Command Usage"
            value="156K"
            trend="+8.1%"
            icon={Zap}
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Uptime"
            value="99.9%"
            trend="+0.1%"
            icon={Activity}
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
        </div>

        {/* Charts Area (Placeholder for Recharts or similar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Traffic Volume
            </h3>
            <div className="flex-1 flex items-end justify-between gap-2 px-2">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-indigo-50 dark:bg-indigo-900/10 rounded-t-lg relative group overflow-hidden"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.05, ease: 'easeOut' }}
                    className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
            </div>
          </div>

          <div className="h-[400px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Resource Usage
            </h3>
            <div className="space-y-6">
              <UsageBar label="CPU Load" value={42} color="bg-blue-500" />
              <UsageBar label="Memory" value={68} color="bg-purple-500" />
              <UsageBar label="Network I/O" value={24} color="bg-emerald-500" />
              <UsageBar label="Disk Space" value={12} color="bg-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, icon: Icon, color, bg }: any) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
          <ArrowUp className="w-3 h-3" /> {trend}
        </span>
      </div>
      <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
        {value}
      </h4>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        {label}
      </p>
    </div>
  )
}

function UsageBar({ label, value, color }: any) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs font-bold text-slate-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}
