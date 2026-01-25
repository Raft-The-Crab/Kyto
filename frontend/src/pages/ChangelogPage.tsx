import { Link } from 'react-router-dom'
import { ArrowLeft, Rocket, Zap, MessageSquare, Shield, Star, GitCommit } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export default function ChangelogPage() {
  const changes = [
    {
      version: 'v0.5.0',
      date: 'Jan 24, 2026',
      title: 'The "God-Tier" UX Update',
      description:
        'A massive overhaul of the entire platform experience. Unified navigation, premium settings, and a fully revitalized marketplace.',
      type: 'major',
      features: [
        {
          icon: Rocket,
          text: 'Unified Top Bar: Consistent, high-density navigation across Dashboard, Builder, and Marketplace.',
        },
        {
          icon: Shield,
          text: 'New Settings Engine: Manage account details, billing, API keys, and themes from one powerful dialog.',
        },
        {
          icon: Star,
          text: 'Marketplace 2.0: Clean, responsive design with category filtering and trending metrics.',
        },
        {
          icon: Zap,
          text: 'Performance Polish: Resolved 40+ IDE errors for a smoother, faster build experience.',
        },
      ],
    },
    {
      version: 'v0.4.0',
      date: 'Jan 22, 2026',
      title: 'AI & Advanced Logic',
      description: 'Introducing the brain of your bot. Logic blocks and AI intent classification.',
      type: 'minor',
      features: [
        {
          icon: Zap,
          text: 'Logic Blocks: Math, Random Number, Loop, and Switch Case blocks added.',
        },
        { icon: MessageSquare, text: 'AI Intent: Smart routing based on user message content.' },
        { icon: Shield, text: 'Auto-Mod Module: Pre-built templates for keeping servers safe.' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Simple Header */}
      <header className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <GitCommit className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">Changelog</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          {changes.map((release, i) => (
            <div key={release.version} className="relative pl-8 md:pl-0">
              {/* Timeline Line */}
              {i !== changes.length - 1 && (
                <div className="absolute left-8 top-16 bottom-[-64px] w-px bg-slate-200 dark:bg-slate-800 md:left-[-32px] lg:left-[-64px]" />
              )}

              <div className="md:flex gap-12">
                {/* Version Meta */}
                <div className="mb-6 md:mb-0 md:w-48 shrink-0 flex flex-col md:items-end md:text-right">
                  <div className="sticky top-28">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                      {release.version}
                    </h2>
                    <p className="text-sm font-bold text-slate-400 mb-3">{release.date}</p>
                    <Badge
                      variant={release.type === 'major' ? 'default' : 'secondary'}
                      className="uppercase tracking-widest text-[10px]"
                    >
                      {release.type} Release
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all shadow-sm">
                  <h3 className="text-2xl font-bold mb-4">{release.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                    {release.description}
                  </p>

                  <div className="space-y-4">
                    {release.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <feature.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pt-1">
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 font-bold text-sm border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p>© 2026 Botify Platform. Built for builders.</p>
      </footer>
    </div>
  )
}
