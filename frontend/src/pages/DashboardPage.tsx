import { useNavigate } from 'react-router-dom'
import {
  Zap,
  BookOpen,
  ArrowRight,
  MessageSquare,
  Shield,
  Search,
  Globe,
  Settings2,
} from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { name, commands, events, createCommand, language } = useProjectStore()
  const navigate = useNavigate()

  const handleCreate = () => {
    const id = createCommand()
    navigate(`/builder/commands/${id}`)
  }

  return (
    <NeoLayout>
      <div className="space-y-12 pb-16">
        {/* Global Production Header */}
        <section className="relative overflow-hidden p-12 rounded-4xl border-2 border-black/10 dark:border-slate-800 bg-indigo-600 text-white shadow-neo group transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-white/20 transition-all duration-1000" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
                Environment Active • {language}
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
                {name.toUpperCase()}
              </h1>
              <p className="text-indigo-100 text-lg md:text-xl font-bold max-w-2xl leading-relaxed opacity-90">
                Workspace summary for{' '}
                <span className="text-white underline decoration-wavy decoration-2">
                  {(commands?.length || 0) + (events?.length || 0)} resources
                </span>{' '}
                configured on the {language} gateway.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button
                onClick={handleCreate}
                className="h-16 px-8 bg-white text-indigo-600 hover:bg-slate-50 font-black shadow-neo-sm hover:translate-y-[-4px] transition-all text-sm border-2 border-slate-900"
              >
                CREATE RESOURCE
              </Button>
              <Button
                onClick={() => navigate('/docs')}
                variant="outline"
                className="h-14 border-white/40 text-white hover:bg-white/10 font-black tracking-widest text-[10px]"
              >
                DOCUMENTATION
              </Button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickCard
                title="COMMAND LOGIC"
                value={commands?.length || 0}
                icon={MessageSquare}
                color="bg-blue-500"
                onClick={() => navigate('/commands')}
                desc="Visual Slash Command Trees"
              />
              <QuickCard
                title="GATEWAY EVENTS"
                value={events?.length || 0}
                icon={Zap}
                color="bg-amber-500"
                onClick={() => navigate('/events')}
                desc="Real-time Discord Listeners"
              />
            </div>

            {/* Production Launch Checklist */}
            <Card className="bg-white dark:bg-slate-900 border-2 border-slate-900 shadow-neo-sm overflow-hidden rounded-3xl">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b-2 border-slate-900 p-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                      Setup Progress
                    </CardTitle>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      Resource Checklist
                    </p>
                  </div>
                </div>
                <div className="h-2 w-24 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[25%]" />
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white dark:bg-slate-900">
                <div className="divide-y-2 divide-slate-100 dark:divide-slate-800">
                  <GuideItem
                    step="01"
                    title="Logic Block Structure"
                    desc="Every flow requires a '/' trigger block to initialize."
                    done={commands?.length > 0}
                  />
                  <GuideItem
                    step="02"
                    title="Gateway Credentials"
                    desc="Enter your BOT_TOKEN and CLIENT_ID in the vault."
                    done={false}
                  />
                  <GuideItem
                    step="03"
                    title="Permissions Audit"
                    desc="Configure required Intents for your specific logic."
                    done={false}
                  />
                  <GuideItem
                    step="04"
                    title="Deploy to Cloud"
                    desc="The engine will convert your nodes into production code."
                    done={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-800 shadow-neo rounded-3xl overflow-hidden">
              <CardHeader className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-black/5 dark:border-slate-800">
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2 font-black uppercase text-sm tracking-widest">
                  <Shield className="w-4 h-4 text-emerald-500" /> System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5 bg-white dark:bg-slate-900">
                <StatusRow label="Core Engine" status="Operational" />
                <StatusRow label="State Storage" status="Operational" />
                <StatusRow label="Discord Gateway" status="Active" pulse />

                <div className="pt-6 border-t-2 border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
                    Release v2.0.0 Stable
                  </p>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-900 dark:border-slate-700 shadow-neo-sm">
                    <p className="text-xs font-black text-slate-900 dark:text-white mb-1 uppercase">
                      Release Notes
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                      Advanced API support for Voice, Threads, and AutoMod is now active.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Actions */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 pl-2">
                Quick Console
              </h4>
              <ActionLink
                label="Search Templates"
                icon={Search}
                onClick={() => navigate('/marketplace')}
              />
              <ActionLink
                label="Bot Configuration"
                icon={Settings2}
                onClick={() => navigate('/settings')}
              />
              <ActionLink label="Runtime Docs" icon={BookOpen} onClick={() => navigate('/docs')} />
            </div>
          </div>
        </div>
      </div>
    </NeoLayout>
  )
}

function QuickCard({ title, value, icon: Icon, color, onClick, desc }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-800 p-8 rounded-3xl shadow-neo-sm hover:shadow-neo hover:translate-y-[-4px] transition-all text-left flex items-center justify-between group relative overflow-hidden"
    >
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-none">
          {value}
        </h4>
        <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>
      </div>
      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-black/20 dark:border-slate-800 transition-all group-hover:scale-110 group-hover:rotate-6 shadow-neo-sm relative z-10',
          color
        )}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity',
          color
        )}
      />
    </button>
  )
}

function GuideItem({ step, title, desc, done }: any) {
  return (
    <button className="w-full p-6 flex items-start gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group bg-white dark:bg-slate-900">
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all shrink-0',
          done
            ? 'bg-emerald-500 text-white border-slate-900 shadow-neo-sm'
            : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-900 dark:border-slate-800'
        )}
      >
        {done ? '✓' : step}
      </div>
      <div className="flex-1">
        <h4
          className={cn(
            'font-black text-sm mb-1 uppercase tracking-tight transition-all leading-none',
            done
              ? 'text-slate-400 line-through'
              : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
          )}
        >
          {title}
        </h4>
        <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide leading-relaxed mt-1">
          {desc}
        </p>
      </div>
      {!done && (
        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:translate-x-1 transition-all mt-1" />
      )}
    </button>
  )
}

function StatusRow({ label, status, pulse }: { label: string; status: string; pulse?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
      <span
        className={cn(
          'flex items-center gap-2 text-[10px] font-black uppercase',
          status === 'Operational' ? 'text-emerald-500 font-black' : 'text-amber-500 font-black'
        )}
      >
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500',
            pulse && 'animate-pulse shadow-[0_0_8px_currentColor]'
          )}
        />
        {status}
      </span>
    </div>
  )
}

function ActionLink({ label, icon: Icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full p-5 flex items-center justify-between bg-white dark:bg-slate-900 border-2 border-black/10 dark:border-slate-800 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-neo-sm hover:shadow-neo transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-black/5 dark:border-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 transition-colors shadow-sm">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
        </div>
        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
          {label}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
    </button>
  )
}
