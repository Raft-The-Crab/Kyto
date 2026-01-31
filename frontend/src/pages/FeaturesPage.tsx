import { useNavigate } from 'react-router-dom'
import {
  Zap,
  Code2,
  Palette,
  Users,
  Cloud,
  Shield,
  Sparkles,
  Terminal,
  Database,
  GitBranch,
  Blocks,
  PlayCircle,
  BarChart3,
  Lock,
  Download,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function FeaturesPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Palette,
      title: 'Visual Canvas Editor',
      description:
        'Drag-and-drop interface for building Discord bots without writing code. Connect blocks visually to create complex logic flows.',
      color: 'emerald',
      benefits: [
        'Intuitive drag-and-drop interface',
        'Real-time visual feedback',
        'Snap-to-grid alignment',
        'Minimap for large projects',
      ],
    },
    {
      icon: Code2,
      title: 'Professional Code Editor',
      description:
        'Switch seamlessly to Monaco editor for direct code editing. Full syntax highlighting, autocomplete, and IntelliSense support.',
      color: 'blue',
      benefits: [
        'Monaco editor integration',
        'Syntax highlighting for JS/Python',
        'Auto-completion and IntelliSense',
        'Split view: Visual + Code',
      ],
    },
    {
      icon: Users,
      title: 'Real-Time Collaboration',
      description:
        'Work together with your team in real-time. See cursors, edits, and changes as they happen.',
      color: 'purple',
      benefits: [
        'Live cursor tracking',
        'Instant sync across clients',
        'Built-in chat and comments',
        'Conflict resolution',
      ],
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description:
        'Get intelligent suggestions and code generation powered by AI. Ask questions and receive context-aware help.',
      color: 'pink',
      benefits: [
        'Context-aware suggestions',
        'Code generation from prompts',
        'Error detection and fixes',
        'Best practice recommendations',
      ],
    },
    {
      icon: Download,
      title: 'Multi-Language Export',
      description:
        'Export your project to Discord.js or Discord.py with a single click. Get production-ready, well-structured code.',
      color: 'yellow',
      benefits: [
        'Discord.js (TypeScript/JavaScript)',
        'Discord.py (Python)',
        'Clean, documented code',
        'Ready-to-deploy structure',
      ],
    },
    {
      icon: Blocks,
      title: 'Extensive Block Library',
      description:
        'Over 100+ pre-built blocks for common Discord bot functionality. From commands to events to database operations.',
      color: 'indigo',
      benefits: [
        'Commands & Slash commands',
        'Event listeners',
        'Database operations',
        'Custom logic blocks',
      ],
    },
    {
      icon: Database,
      title: 'Built-in Database Support',
      description:
        'Connect to databases without configuration. Support for MongoDB, PostgreSQL, and more.',
      color: 'cyan',
      benefits: [
        'Visual query builder',
        'Schema management',
        'Migration tools',
        'Connection pooling',
      ],
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description:
        'Track changes, create branches, and collaborate with confidence. Built-in Git integration.',
      color: 'green',
      benefits: [
        'Automatic version history',
        'Branch management',
        'Rollback capabilities',
        'Change visualization',
      ],
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description:
        'Bank-level encryption, secure authentication, and compliance with industry standards.',
      color: 'red',
      benefits: [
        'End-to-end encryption',
        'OAuth2 authentication',
        'Role-based permissions',
        'Audit logging',
      ],
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description:
        'Monitor bot performance, track user engagement, and optimize based on real data.',
      color: 'orange',
      benefits: ['Real-time metrics', 'User analytics', 'Performance monitoring', 'Custom reports'],
    },
    {
      icon: Cloud,
      title: 'Cloud Deployment',
      description:
        'Deploy to the cloud with one click. Automatic scaling, load balancing, and uptime monitoring.',
      color: 'teal',
      benefits: [
        'One-click deployment',
        'Auto-scaling infrastructure',
        '99.9% uptime guarantee',
        'Global CDN',
      ],
    },
    {
      icon: Terminal,
      title: 'Developer Tools',
      description:
        'Built-in console, debugger, and testing tools. Everything you need for professional development.',
      color: 'slate',
      benefits: [
        'Interactive console',
        'Breakpoint debugging',
        'Unit testing framework',
        'Performance profiler',
      ],
    },
  ]

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/20',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/20',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/20',
    },
    pink: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      border: 'border-pink-500/20',
      glow: 'shadow-pink-500/20',
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/20',
      glow: 'shadow-yellow-500/20',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
      glow: 'shadow-indigo-500/20',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/20',
      glow: 'shadow-cyan-500/20',
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
      glow: 'shadow-green-500/20',
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      glow: 'shadow-red-500/20',
    },
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
      glow: 'shadow-orange-500/20',
    },
    teal: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-400',
      border: 'border-teal-500/20',
      glow: 'shadow-teal-500/20',
    },
    slate: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/20',
      glow: 'shadow-slate-500/20',
    },
  }

  return (
    <PublicLayout>
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                Everything You Need
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-linear-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Build Discord bots faster with our comprehensive suite of tools and features. From
              visual programming to AI assistance, we've got you covered.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => {
              const colors = (colorMap[feature.color] || colorMap.emerald)!
              const Icon = feature.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all group shadow-sm hover:shadow-md"
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110',
                      colors.bg,
                      colors.border,
                      'border'
                    )}
                  >
                    <Icon className={cn('w-6 h-6', colors.text)} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className={cn('w-4 h-4 mt-0.5 shrink-0', colors.text)} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>

          {/* Comparison Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="glass p-8 rounded-2xl border border-border/50 mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
              Kyto vs Traditional Development
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-muted-foreground">Traditional Method</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                    <span>Manual setup and configuration</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                    <span>Steep learning curve</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                    <span>Hours of debugging</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                    <span>Complex deployment process</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-secondary">With Kyto</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-secondary" />
                    <span className="text-foreground">Visual setup in minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-secondary" />
                    <span className="text-foreground">Intuitive drag-and-drop interface</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-secondary" />
                    <span className="text-foreground">AI-powered error detection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-secondary" />
                    <span className="text-foreground">One-click deployment</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center glass p-12 rounded-2xl border border-border/50"
          >
            <Zap className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 text-foreground">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers building amazing Discord bots with Kyto. Start creating
              today, completely free.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate('/signup')}
                className="font-bold px-8 h-12 rounded-xl shadow-glow"
                size="lg"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/docs')}
                className="px-8 h-12 rounded-xl"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}
