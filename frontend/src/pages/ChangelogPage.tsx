import { Rocket, Zap, MessageSquare, Shield, Star, GitCommit } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { NeoLayout } from '@/components/layout/NeoLayout'

export default function ChangelogPage() {
  const changes = [
    {
      version: 'v0.6.0',
      date: 'Jan 25, 2026',
      title: 'The God Update ⚡',
      description:
        'WE LISTENED. The biggest update in Kyto history is here. Massive block library expansion, advanced configuration tools, and a UI that feels smoother than butter.',
      type: 'major',
      features: [
        {
          icon: Zap,
          text: '20+ New Blocks: Ban, Kick, Timeout, Role Management, Threads, and Voice Controls.',
        },
        {
          icon: Shield,
          text: 'Advanced Slash Commands: Build complex commands with Arguments (String, User, Integer) using the new Options Builder.',
        },
        {
          icon: Star,
          text: 'BotGhost Killer: We are now "free forever" with more features than the paid competition. No locks, no paywalls.',
        },
        {
          icon: MessageSquare,
          text: 'Embed Builder 2.0: Full control over title, description, colors, authors, and footers.',
        },
      ],
    },
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
    <NeoLayout>
      <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-12 border-b border-slate-200 dark:border-white/10 pb-8">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <GitCommit className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Changelog
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
              Latest updates and improvements to the platform.
            </p>
          </div>
        </div>

        <div className="space-y-16">
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
                <div className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-3xl p-8 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity bg-indigo-500 blur-2xl rounded-bl-full w-32 h-32" />

                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                    {release.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                    {release.description}
                  </p>

                  <div className="space-y-4">
                    {release.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors"
                      >
                        <div className="p-2 bg-white dark:bg-black rounded-xl shadow-sm border border-slate-100 dark:border-white/10">
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
      </div>
    </NeoLayout>
  )
}
