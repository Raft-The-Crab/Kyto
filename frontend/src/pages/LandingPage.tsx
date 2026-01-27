import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Zap,
  Shield,
  Code2,
  Cpu,
  Globe,
  MessageCircle,
  Layout,
  Terminal,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NeoLayout } from '@/components/layout/NeoLayout'

export default function LandingPage() {
  return (
    <NeoLayout>
      <div className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 flex flex-col items-center text-center relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[80px] -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            v2.0 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Build Advanced Discord Bots <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-sky-500">
              Without Writing Code
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Kyto is the ultimate visual builder for Discord. Create slash commands, event
            listeners, and complex logic flows using our drag-and-drop node system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link to="/commands">
              <Button
                size="lg"
                className="h-14 px-8 text-lg gap-2 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105"
              >
                Start Building Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button
                variant="secondary"
                size="lg"
                className="h-14 px-8 text-lg gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                Read Documentation
              </Button>
            </Link>
          </div>

          {/* Code Preview / Interface Mockup */}
          <div className="mt-20 relative w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-transparent rounded-2xl" />
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner">
              {/* Use the uploaded image purely as UI reference, keeping code based implementation here for responsiveness */}
              <div className="flex border-b border-slate-800 bg-slate-900/80 p-3 items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="flex-1 text-center text-xs font-mono text-slate-500">
                  kyto_editor.tsx
                </div>
              </div>
              <div className="h-[400px] md:h-[600px] relative overflow-hidden bg-[url('/grid-pattern.svg')] opacity-90">
                {/* Mock Nodes */}
                <div className="absolute top-20 left-20 w-64 bg-[#1a1a1f] border border-indigo-500 rounded-2xl p-4 shadow-lg shadow-indigo-500/10 flex flex-col gap-2">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs uppercase">Slash Command</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 bg-white/5 rounded w-full" />
                    <div className="h-6 bg-white/5 rounded w-2/3" />
                  </div>
                </div>

                <div className="absolute top-60 left-80 w-64 bg-[#1a1a1f] border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-2 opacity-80">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs uppercase">Send Reply</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-6 bg-white/5 rounded w-full" />
                  </div>
                </div>

                {/* SVG Connection Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 300 130 C 300 200, 380 200, 380 240"
                    stroke="#6366f1"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-dash"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-24 px-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl my-24 border border-slate-200 dark:border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Why Kyto?</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              We provide the power of a coding environment with the ease of a visual builder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Layout className="w-6 h-6 text-pink-500" />}
              title="Visual Flow Engine"
              desc="Design complex logic trees visually. Branch, loop, and condition your bot's behavior without syntax errors."
            />
            <FeatureCard
              icon={<Code2 className="w-6 h-6 text-blue-500" />}
              title="Real Code Generation"
              desc="Every flow you build compiles to clean, efficient Discord.js or Python code under the hood."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-emerald-500" />}
              title="Enterprise Security"
              desc="Built-in permission handling, rate limiting, and secure token storage keep your bot safe."
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6 text-purple-500" />}
              title="Serverless Hosting"
              desc="Deploy your bot instantly to our cloud infrastructure with zero config."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-orange-500" />}
              title="Web Dashboard"
              desc="Manage servers, view analytics, and update your bot from anywhere."
            />
            <FeatureCard
              icon={<Terminal className="w-6 h-6 text-slate-500" />}
              title="Developer Mode"
              desc="Switch to code view to write custom scripts and import npm packages directly."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Kyto</span>
          </div>
          <div className="flex gap-8">
            <Link to="/tos" className="hover:text-indigo-500 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-indigo-500 transition-colors">
              Privacy
            </Link>
            <Link to="/docs" className="hover:text-indigo-500 transition-colors">
              Docs
            </Link>
            <a href="#" className="hover:text-indigo-500 transition-colors">
              Discord
            </a>
          </div>
          <p>© 2026 Kyto. All rights reserved.</p>
        </footer>
      </div>
    </NeoLayout>
  )
}

function FeatureCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500 transition-all hover:shadow-xl hover:-translate-y-1 group">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}
