import { Link } from 'react-router-dom'
import { Rocket, Zap, Code2, Lock, ArrowRight, Terminal } from 'lucide-react'
import { NeoLayout } from '@/components/layout/NeoLayout'

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-hidden">
        {/* Dotted Background */}
        <div 
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 pt-20">
        <div className="text-center space-y-8 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-slate-900 shadow-sm mb-4 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-800">v1.0 Public Beta is Live</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-tight tracking-tight">
            Build Bots
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Visually.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The next-generation Discord bot builder. 
            No code required, but full source code provided.
            <br className="hidden md:block" />
            <span className="text-slate-900 font-bold">Free forever. Open Source.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link
              to="/commands"
              className="px-10 py-5 bg-indigo-600 text-white font-bold text-xl rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-3"
            >
              Start Building <ArrowRight className="w-6 h-6" />
            </Link>
            
            <Link
              to="/marketplace"
              className="px-10 py-5 bg-white text-slate-900 font-bold text-xl rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(203,213,225,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(203,213,225,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(203,213,225,1)] transition-all flex items-center justify-center gap-3"
            >
              Explore Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 bg-white border-t-2 border-slate-900 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={Zap}
                title="Visual Builder" 
                desc="Drag & drop powerful blocks to create complex commands and logic flows in seconds."
                color="bg-yellow-400"
            />
             <FeatureCard 
                icon={Code2}
                title="Clean Code" 
                desc="We generate readable, production-ready Discord.js code that you can export and own."
                color="bg-indigo-400"
            />
             <FeatureCard 
                icon={Lock}
                title="Privacy First" 
                desc="Everything works locally in your browser. No data tracking, no hidden servers."
                color="bg-emerald-400"
            />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    return (
        <div className="p-8 bg-slate-50 border-2 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] transition-all">
            <div className={`w-14 h-14 ${color} border-2 border-slate-900 rounded-xl flex items-center justify-center mb-6`}>
                <Icon className="w-8 h-8 text-white stroke-[2.5px]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
        </div>
    )
}

export default LandingPage
