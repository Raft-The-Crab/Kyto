import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Terminal, Code, Cpu, Search, ChevronRight } from 'lucide-react'
import { NeoLayout } from '@/components/layout/NeoLayout'

export default function DocsPage() {
  return (
    <NeoLayout>
      <div className="min-h-screen font-sans text-slate-900 dark:text-white">
        {/* Navbar */}
        <nav className="h-16 border-b border-slate-200 dark:border-white/10 flex items-center px-6 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-6 w-full max-w-7xl mx-auto">
            <Link
              to="/"
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold text-lg tracking-tight mr-auto">Documentation</span>

            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search documentation"
                placeholder="Search docs..."
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-lg pl-9 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-8 shrink-0 sticky top-24 h-fit">
            <DocSection title="Getting Started">
              <DocLink active>Introduction</DocLink>
              <DocLink>Installation</DocLink>
              <DocLink>Your First Bot</DocLink>
              <DocLink>Deploying</DocLink>
            </DocSection>

            <DocSection title="Building Blocks">
              <DocLink>Triggers</DocLink>
              <DocLink>Actions</DocLink>
              <DocLink>Conditions</DocLink>
              <DocLink>Loops & Logic</DocLink>
            </DocSection>

            <DocSection title="Advanced">
              <DocLink>Variables</DocLink>
              <DocLink>Database</DocLink>
              <DocLink>API Requests</DocLink>
              <DocLink>Custom Code</DocLink>
            </DocSection>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose dark:prose-invert max-w-none">
              <h1 className="text-5xl font-black tracking-tighter mb-6">Welcome to Kyto Docs</h1>
              <p className="lead text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Kyto is the world's most advanced visual automation studio. Create complex Discord bots
                without writing a single line of code, or drop into code mode for infinite
                extensibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-12">
                <Card
                  icon={<BookOpen className="w-6 h-6 text-pink-500" />}
                  title="Quick Start"
                  desc="Build a 'Ping' command in 2 minutes."
                  href="#"
                />
                <Card
                  icon={<Terminal className="w-6 h-6 text-blue-500" />}
                  title="Hosting Guide"
                  desc="Deploy to Vercel, Railway, or VPS."
                  href="#"
                />
                <Card
                  icon={<Code className="w-6 h-6 text-emerald-500" />}
                  title="Logic Hooks"
                  desc="Learn variables, loops, and math."
                  href="#"
                />
                <Card
                  icon={<Cpu className="w-6 h-6 text-purple-500" />}
                  title="Node Reference"
                  desc="Documentation for every block."
                  href="#"
                />
              </div>

              <h2>Core Concepts</h2>
              <p>
                Kyto works by connecting <strong>Nodes</strong> together to form a logical flow.
                Each node represents an action (like sending a message) or a condition (checking a
                user's role).
              </p>

              <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 my-8 not-prose">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-500" />
                  Pro Tip
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You can switch between <strong>Visual Mode</strong> and <strong>Code Mode</strong>{' '}
                  at any time by clicking the toggle in the editor top bar.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </NeoLayout>
  )
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 pl-3">
        {title}
      </h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  )
}

function DocLink({ children, active }: { children: string; active?: boolean }) {
  return (
    <li>
      <a
        href="#"
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
          active
            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
        }`}
      >
        {children}
        {active && <ChevronRight className="w-4 h-4 opacity-50" />}
      </a>
    </li>
  )
}

function Card({
  icon,
  title,
  desc,
  href,
}: {
  icon: any
  title: string
  desc: string
  href: string
}) {
  return (
    <a
      href={href}
      className="block p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="mb-4 bg-slate-50 dark:bg-black/50 w-fit p-3 rounded-xl shadow-sm border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
    </a>
  )
}
