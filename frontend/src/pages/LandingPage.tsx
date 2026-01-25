import { Link } from 'react-router-dom'
import {
  Zap,
  Code2,
  Lock,
  ArrowRight,
  Sparkles,
  Terminal,
  Layers,
  Globe,
  Github,
  Twitter,
  MessageSquare,
  Play,
  CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid'
import { Button } from '@/components/ui/Button'

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      {/* Premium Dotted Background */}
      <div
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Glassmorphic Top Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/80 backdrop-blur-md border-2 border-slate-900 shadow-neo rounded-2xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm border-2 border-slate-900">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">BOTIFY</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wider text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <Link to="/docs" className="hover:text-indigo-600 transition-colors">
              Docs
            </Link>
            <Link to="/marketplace" className="hover:text-indigo-600 transition-colors">
              Marketplace
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block font-bold text-sm text-slate-600">
              Sign In
            </Link>
            <Link to="/signup">
              <Button className="rounded-xl shadow-neo-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border-2 border-indigo-600 shadow-neo-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
              Now with Discord.py Support
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8"
          >
            THE FUTURE OF
            <br />
            <span className="text-indigo-600 drop-shadow-[0_2px_0_rgba(15,23,42,1)]">
              BOT BUILDING
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mb-12"
          >
            Industrial logic. Professional execution. Private infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/signup">
              <Button size="lg" className="h-16 px-10 text-xl shadow-neo group">
                Build My Bot
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-10 text-xl shadow-neo-sm border-2"
            >
              <Play className="w-6 h-6 mr-2 fill-current" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20 flex flex-wrap justify-center items-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
          >
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
              <MessageSquare className="w-8 h-8" /> DISCORD
            </div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
              <Github className="w-8 h-8" /> GITHUB
            </div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter uppercase">
              Vercel
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="relative z-10 py-24 bg-white border-y-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
            PACKED WITH POWER.
          </h2>
          <p className="text-lg text-slate-500 font-bold uppercase tracking-widest">
            Everything you need to ship a god-tier bot.
          </p>
        </div>

        <BentoGrid>
          <BentoGridItem
            title="Visual Flow Engine"
            description="Drag and drop blocks to create complex logic trees. No syntax errors, just pure logic."
            header={
              <div className="flex flex-1 w-full h-full min-h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex-center">
                <Layers className="w-12 h-12 text-indigo-200" />
              </div>
            }
            icon={<Zap className="w-6 h-6 text-indigo-600" />}
            className="md:col-span-2"
            color="bg-indigo-50/50"
          />
          <BentoGridItem
            title="Multi-Language"
            description="Advanced logic transpilation for production-grade environments."
            header={
              <div className="flex flex-1 w-full h-full min-h-24 rounded-2xl bg-orange-50 border-2 border-orange-100 flex-center">
                <Code2 className="w-12 h-12 text-orange-200" />
              </div>
            }
            icon={<Globe className="w-6 h-6 text-orange-500" />}
            className="md:col-span-1"
            color="bg-orange-50/50"
          />
          <BentoGridItem
            title="Professional IDE"
            description="VS Code powered editing experience built right into your browser."
            icon={<Terminal className="w-6 h-6 text-slate-900" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Private & Secure"
            description="Proprietary architecture ensures your logic remains secured within the platform."
            icon={<Lock className="w-6 h-6 text-emerald-600" />}
            className="md:col-span-2"
            color="bg-emerald-50/50"
          />
        </BentoGrid>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-32 bg-indigo-600 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
          <div>
            <div className="text-6xl font-black mb-2 tracking-tighter">50K+</div>
            <div className="text-sm font-black uppercase tracking-widest text-indigo-200">
              Bots Built
            </div>
          </div>
          <div>
            <div className="text-6xl font-black mb-2 tracking-tighter">1.2M</div>
            <div className="text-sm font-black uppercase tracking-widest text-indigo-200">
              Blocks Placed
            </div>
          </div>
          <div>
            <div className="text-6xl font-black mb-2 tracking-tighter">99.9%</div>
            <div className="text-sm font-black uppercase tracking-widest text-indigo-200">
              Uptime
            </div>
          </div>
          <div>
            <div className="text-6xl font-black mb-2 tracking-tighter">0$</div>
            <div className="text-sm font-black uppercase tracking-widest text-indigo-200">
              Initial Cost
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t-4 border-slate-900 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 group mb-6">
                <div className="p-2 bg-indigo-600 rounded-xl text-white border-2 border-slate-900 shadow-neo-sm">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-slate-900">BOTIFY</span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm mb-8 leading-relaxed">
                The most intuitive, powerful visual bot builder for creators who want to ship fast.
                Built by developers, for developers.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl hover:bg-indigo-50 transition-all shadow-neo-sm"
                >
                  <Twitter className="w-5 h-5 text-indigo-500" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl hover:bg-slate-100 transition-all shadow-neo-sm"
                >
                  <Github className="w-5 h-5 text-slate-900" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl hover:bg-indigo-50 transition-all shadow-neo-sm"
                >
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">
                Platform
              </h4>
              <ul className="space-y-4 font-bold text-slate-500">
                <li>
                  <Link to="/marketplace" className="hover:text-indigo-600 transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-indigo-600 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">
                Legal
              </h4>
              <ul className="space-y-4 font-bold text-slate-500">
                <li>
                  <Link to="/terms" className="hover:text-indigo-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 font-bold text-sm">© 2026 Botify. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
