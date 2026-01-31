import { BookOpen, Cpu, Search, Zap, Shield, Database, Workflow, Globe, Server } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { PublicLayout } from '@/components/layout/PublicLayout'

const DOC_CONTENT = {
  introduction: {
    title: 'Introduction',
    icon: <BookOpen className="w-5 h-5 text-primary" />,
    description: 'Welcome to Kyto, the industrial-grade visual automation studio.',
    content: (
      <div className="space-y-8 animate-in fade-in duration-700">
        <p className="text-xl leading-relaxed text-muted-foreground font-medium">
          Kyto is a high-performance visual IDE for building and deploying Discord bots. Unlike
          traditional "bot makers", Kyto generates production-standard **React-like logic flows**
          that compile directly to optimized JavaScript or Python.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass p-8 border-primary/20 bg-primary/5">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-glow">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-foreground mb-2 text-lg">Blazing Fast</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Proprietary execution engine designed for sub-50ms command latency.
            </p>
          </div>
          <div className="glass p-8 border-emerald-500/20 bg-emerald-500/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-foreground mb-2 text-lg">Type Safe</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Every block is strictly typed, ensuring your bot never crashes due to unexpected data.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  architecture: {
    title: 'Worker Architecture',
    icon: <Server className="w-5 h-5 text-blue-500" />,
    description: 'Understand the underlying engine power.',
    content: (
      <div className="space-y-8 animate-in fade-in duration-700">
        <p className="text-muted-foreground font-medium leading-relaxed">
          Kyto bots run on a distributed edge architecture using **Cloudflare Workers** and **D1
          Databases**. This allows your bot to be globally available with zero cold-starts.
        </p>
        <div className="glass p-8 space-y-6">
          <div className="flex gap-4">
            <div className="shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">State Management</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Persistent state is handled via Durable Objects. This enables real-time interaction
                and cross-instance synchronization without external database calls.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0 w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">D1 Database Integration</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kyto provides built-in relational storage. Each project gets its own isolated SQLite
                instance, optimized for high-concurrency bot operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  logic: {
    title: 'Logic Flows',
    icon: <Workflow className="w-5 h-5 text-emerald-500" />,
    description: 'The anatomy of a Kyto automation.',
    content: (
      <div className="space-y-8 animate-in fade-in duration-700">
        <p className="text-muted-foreground font-medium leading-relaxed">
          Building in Kyto follows a simple **Event &rarr; Action** pattern. Understanding the flow
          of data between blocks is key to mastering the studio.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 glass border-border/50">
            <div className="text-primary font-black text-xs uppercase mb-2 tracking-widest">
              Level 1
            </div>
            <h4 className="font-bold mb-2">Triggers</h4>
            <p className="text-xs text-muted-foreground">
              Slash commands, Message events, or Interactivity callbacks.
            </p>
          </div>
          <div className="p-6 glass border-border/50">
            <div className="text-secondary font-black text-xs uppercase mb-2 tracking-widest">
              Level 2
            </div>
            <h4 className="font-bold mb-2">Conditions</h4>
            <p className="text-xs text-muted-foreground">
              Filter flows by permissions, server IDs, or variable values.
            </p>
          </div>
          <div className="p-6 glass border-border/50">
            <div className="text-emerald-500 font-black text-xs uppercase mb-2 tracking-widest">
              Level 3
            </div>
            <h4 className="font-bold mb-2">Actions</h4>
            <p className="text-xs text-muted-foreground">
              Send messages, update DB, trigger AI, or call external APIs.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  hosting: {
    title: 'Hosting & Deployment',
    icon: <Globe className="w-5 h-5 text-amber-500" />,
    description: 'Deploy your bot to the cloud in seconds.',
    content: (
      <div className="space-y-8 animate-in fade-in duration-700">
        <p className="text-muted-foreground font-medium leading-relaxed">
          Kyto offers native integration with major cloud providers. You can choose between our
          managed hosting or your own infrastructure.
        </p>
        <div className="space-y-4">
          <div className="glass p-6 border-amber-500/20 bg-amber-500/5">
            <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Kyto Managed (1-Click)
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Zero configuration. Just hit "Publish" and your bot is live on our high-speed edge
              network. Ideal for most applications.
            </p>
          </div>
          <div className="glass p-6 border-blue-500/20 bg-blue-500/5">
            <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Railway / GitHub Integration
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Connect your account to Railway or GitHub. Kyto will automatically push the generated
              code to your repository and trigger a build. Full control over your infrastructure.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  ai: {
    title: 'AI Integration',
    icon: <Cpu className="w-5 h-5 text-purple-500" />,
    description: 'Next-gen intelligence for your Discord bot.',
    content: (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="glass p-8 border-amber-500/20 bg-amber-500/5 flex gap-6 items-start">
          <div className="p-3 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            <strong>Key Management:</strong> Kyto uses a client-side encryption model. Your API keys
            never touch our persistent storage unless you enable encrypted cloud backups.
          </p>
        </div>
        <p className="text-muted-foreground font-medium leading-relaxed">
          Our AI blocks support GPT-4o, Claude 3.5, and Gemini Pro. Use them for sentiment-aware
          moderation, automated customer support, or creative storytelling.
        </p>
      </div>
    ),
  },
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<keyof typeof DOC_CONTENT>('introduction')
  const [search, setSearch] = useState('')

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col lg:flex-row gap-16">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-80 shrink-0 space-y-12">
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search technical docs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border border-transparent focus:border-border/50 focus:bg-card rounded-2xl text-[13px] font-bold text-foreground outline-none transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-4">
                Architecture & Core
              </h3>
              <div className="space-y-1">
                {Object.entries(DOC_CONTENT).map(([id, data]) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id as any)}
                    className={`w-full px-6 py-3.5 rounded-2xl text-[13px] font-bold transition-all flex items-center gap-4 active:scale-[0.98] ${
                      activeSection === id
                        ? 'bg-primary text-primary-foreground shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className={
                        activeSection === id
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground transition-colors group-hover:text-foreground'
                      }
                    >
                      {data.icon}
                    </span>
                    {data.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                  {DOC_CONTENT[activeSection].title} Guide
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[0.9]">
                  {DOC_CONTENT[activeSection].title}
                </h1>
                <p className="text-xl text-muted-foreground font-bold max-w-2xl leading-relaxed">
                  {DOC_CONTENT[activeSection].description}
                </p>
              </div>

              <div className="pt-12 border-t border-border/50">
                {DOC_CONTENT[activeSection].content}
              </div>

              {/* Navigation Footer */}
              <div className="pt-20 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                    Technical Support
                  </span>
                  <p className="text-lg font-black text-foreground tracking-tight">
                    Need deep-dive help?
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="px-8 font-black text-xs uppercase tracking-widest"
                  >
                    Join Discord
                  </Button>
                  <Button className="px-8 font-black text-xs uppercase tracking-widest shadow-glow">
                    Contact Support
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </PublicLayout>
  )
}
