import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Code2, Users, Sparkles, Blocks } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { BuilderPreview } from '@/components/landing/BuilderPreview'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const handleWatchDemo = () => {
    navigate('/docs')
  }

  const features = [
    {
      icon: Blocks,
      title: 'Visual Builder',
      description: 'Drag and drop blocks to build your bot logic visually',
    },
    {
      icon: Code2,
      title: 'Code Editor',
      description: 'Switch to code view for advanced customization',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Work together with your team in real-time',
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Get smart suggestions as you build',
    },
  ]

  const stats = [
    { label: 'Bots Created', value: '10k+' },
    { label: 'Active Users', value: '5k+' },
    { label: 'Uptime', value: '99.9%' },
  ]

  return (
    <PublicLayout>
      <div className="relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-32">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 active:scale-95 transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">
                v2.0 Beta Now Live
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-foreground"
            >
              BUILD BOTS <br />
              <span className="text-primary italic">WITHOUT</span> LIMITS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-xl text-muted-foreground font-medium mb-12 leading-relaxed"
            >
              The easiest way to build powerful Discord bots. Create, test, and host complex
              automation with our easy drag-and-drop builder.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button
                onClick={handleGetStarted}
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl shadow-glow active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={handleWatchDemo}
                className="h-14 px-10 border-border bg-card/50 backdrop-blur-xl hover:bg-card/80 text-foreground font-black rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                Help Center
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-40 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10"
          >
            <div className="text-center mb-16">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-4">
                THE BUILDER
              </h2>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
                Build bots without writing code
              </p>
            </div>
            <BuilderPreview />
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6 relative bg-card/20 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-foreground text-center">
                POWERFUL TOOLS MADE SIMPLE
              </h2>
              <p className="text-muted-foreground font-medium text-lg">
                Everything you need to build, scale, and host complex bots.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="glass p-10 rounded-[32px] border border-border/50 hover:border-primary/50 transition-all shadow-sm group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-6xl md:text-7xl font-black tracking-tighter text-foreground italic flex justify-center items-end gap-2 leading-none">
                  {stat.value}
                </div>
                <div className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto glass p-16 md:p-32 rounded-[64px] border border-primary/20 bg-primary/5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.85]">
                START <br />
                <span className="text-primary italic">BUILDING</span>
              </h2>
              <Button
                onClick={handleGetStarted}
                className="h-16 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-3xl shadow-glow active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                Get Started Now
                <Zap className="w-5 h-5 ml-3 fill-current" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
