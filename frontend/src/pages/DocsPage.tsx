import { useState } from 'react'
import {
  BookOpen,
  ChevronRight,
  Search,
  Zap,
  Code2,
  Bot,
  Layout,
  Terminal,
  Cpu,
  Globe,
} from 'lucide-react'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const DOCS_STRUCTURE = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      { label: 'Introduction', id: 'intro' },
      { label: 'Installation', id: 'install' },
      { label: 'Your First Bot', id: 'first-bot' },
    ],
  },
  {
    title: 'Visual Builder',
    icon: Layout,
    items: [
      { label: 'Block Basics', id: 'blocks' },
      { label: 'Variables Store', id: 'variables' },
      { label: 'Flow Logic', id: 'logic' },
    ],
  },
  {
    title: 'Languages',
    icon: Code2,
    items: [
      { label: 'Discord.js (JS)', id: 'js' },
      { label: 'Discord.py (Python)', id: 'py' },
    ],
  },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('intro')

  return (
    <NeoLayout>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Docs Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8 h-fit lg:sticky lg:top-32">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-800 rounded-xl shadow-neo-sm outline-none focus:translate-y-[-2px] transition-all font-black text-xs text-slate-900 dark:text-white"
            />
          </div>

          <nav className="space-y-8">
            {DOCS_STRUCTURE.map(section => (
              <div key={section.title} className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  <section.icon className="w-3.5 h-3.5" />
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          'w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between group border-2',
                          activeSection === item.id
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-neo-sm translate-x-1'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
                        )}
                      >
                        {item.label}
                        <ChevronRight
                          className={cn(
                            'w-3 h-3 transition-transform',
                            activeSection === item.id
                              ? 'rotate-90'
                              : 'opacity-0 group-hover:opacity-100'
                          )}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Docs Content */}
        <main className="flex-1 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {activeSection === 'intro' && <IntroContent />}
              {activeSection === 'blocks' && <BlocksContent />}
              {activeSection === 'js' && <JSContent />}
              {/* Fallback for unhandled sections */}
              {!['intro', 'blocks', 'js'].includes(activeSection) && <ComingSoon />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </NeoLayout>
  )
}

function IntroContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 border-b-4 border-slate-900 dark:border-slate-800 pb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
          <Zap className="w-3 h-3" /> v1.2 Release
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
          INTRODUCTION
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-2xl">
          Welcome to the Botify documentation. Learn how to build world-class Discord bots without
          writing a single line of boilerplate.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert prose-xl max-w-none space-y-8">
        <section>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">
            What is Botify?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed">
            Botify is a next-generation Discord bot builder designed for both beginners and advanced
            developers. Our core philosophy is{' '}
            <strong className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200">
              "Visual Logic, Production Code"
            </strong>
            . We provide a powerful drag-and-drop interface that generates clean, readable, and
            highly optimized code.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <FeatureCard
            icon={Terminal}
            title="Elite IDE"
            desc="Built-in Monaco editor with full file system access and terminal simulation."
          />
          <FeatureCard
            icon={Cpu}
            title="Visual Engine"
            desc="High-performance node builder with real-time code generation and validation."
          />
          <FeatureCard
            icon={Globe}
            title="Webhooks & APIs"
            desc="Integrated HTTP blocks to connect your bot to any external data source."
          />
          <FeatureCard
            icon={Code2}
            title="Multi-Language"
            desc="Switch between Discord.js and Discord.py with a single click."
          />
        </div>
      </div>
    </div>
  )
}

function BlocksContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 border-b-4 border-slate-900 dark:border-slate-800 pb-12">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          Blocks Engine
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
          The heart of Botify. Learn how to combine blocks to build complex logic.
        </p>
      </div>

      <div className="space-y-12">
        <DocSection title="Trigger Blocks">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Triggers are the starting points of your flow. Every command or event must start with a
            Trigger block.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-900 dark:border-slate-800 shadow-neo-sm">
            <code className="text-indigo-600 dark:text-indigo-400 font-black">
              On Slash Command
            </code>
            <p className="text-sm text-slate-500 mt-2 font-bold uppercase tracking-wide">
              Fires when a user types /command in Discord.
            </p>
          </div>
        </DocSection>

        <DocSection title="Action Blocks">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Actions perform tasks like sending messages, adding roles, or deleting content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="font-bold text-slate-900 dark:text-white">Send Message</span>
              <p className="text-xs text-slate-500 mt-1">Supports Markdown and variables.</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="font-bold text-slate-900 dark:text-white">Send Embed</span>
              <p className="text-xs text-slate-500 mt-1">
                Rich formatting with titles, colors, and footers.
              </p>
            </div>
          </div>
        </DocSection>
      </div>
    </div>
  )
}

function JSContent() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 border-b-4 border-slate-900 dark:border-slate-800 pb-12">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          Discord.js
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed font-mono">
          Powered by v14.13+
        </p>
      </div>
      <div className="p-8 bg-slate-900 rounded-3xl border-4 border-indigo-500 shadow-neo text-white">
        <pre className="text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
          {`const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log('Bot is live! 🚀');
});

client.login(process.env.TOKEN);`}
        </pre>
      </div>
      <p className="text-slate-600 dark:text-slate-400 font-bold italic border-l-4 border-indigo-500 pl-4">
        Botify handles all of this boilerplate for you automatically in the Code tab.
      </p>
    </div>
  )
}

function ComingSoon() {
  return (
    <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl opacity-50">
      <h3 className="text-2xl font-black text-slate-900 dark:text-white">Drafting content...</h3>
      <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mt-2">
        Checking for updates ⚡
      </p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-3xl shadow-neo-sm hover:shadow-neo hover:translate-y-[-4px] transition-all group">
      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-4 border-2 border-slate-900 dark:border-slate-700 group-hover:bg-indigo-600 transition-colors">
        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
      </div>
      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function DocSection({ title, children }: any) {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
        {title}
      </h3>
      {children}
    </section>
  )
}
