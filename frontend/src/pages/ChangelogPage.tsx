import { useNavigate } from 'react-router-dom'
import { CheckCircle, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function ChangelogPage() {
  const navigate = useNavigate()

  const releases = [
    {
      version: '2.0.2',
      date: 'January 29, 2026',
      title: 'Frontend Improvements',
      items: [
        'Fixed all builder pages (Commands, Events, Modules)',
        'Added Contact, Blog, and Careers pages',
        'Improved navigation and routing',
        'Updated all dates and removed excessive marketing',
        'Consistent design across all pages',
      ],
    },
    {
      version: '2.0.1',
      date: 'December 26, 2025',
      title: 'Branding Update',
      items: [
        'Rebranded from Kyto to Kyto',
        'Updated all UI references and branding',
        'Added migration helper for localStorage',
        'Improved documentation',
      ],
    },
    {
      version: '2.0.0',
      date: 'December 25, 2025',
      title: 'Major Platform Release',
      items: [
        'Visual canvas builder with drag-and-drop',
        'Monaco code editor integration',
        'Real-time collaboration features',
        'Human-centric Logic Engine implementation',
        'Multi-language export (Discord.js & Discord.py)',
      ],
    },
    {
      version: '1.5.0',
      date: 'December 7, 2025',
      title: 'Builder Enhancements',
      items: [
        'Added module builder',
        'Improved event listener system',
        'New block library with 50+ blocks',
        'Enhanced properties panel',
      ],
    },
    {
      version: '1.0.0',
      date: 'December 1, 2025',
      title: 'Initial Release',
      items: [
        'Command builder launched',
        'Basic event system',
        'Project management',
        'Code export functionality',
      ],
    },
  ]

  return (
    <PublicLayout>
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <section className="relative py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-black uppercase tracking-widest text-secondary mb-8">
                <History className="w-4 h-4" />
                Version History
              </div>
              <h1 className="text-6xl font-black tracking-tighter mb-6">
                THE <span className="text-secondary italic">EVOLUTION</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                Tracking the journey of Kyto Studio from inception to the next-gen automation
                powerhouse.
              </p>
            </motion.div>

            <div className="space-y-16">
              {releases.map((release, index) => (
                <motion.div
                  key={release.version}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="flex gap-8">
                    <div className="relative shrink-0 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-secondary">
                        <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                      </div>
                      {index !== releases.length - 1 && (
                        <div className="w-px flex-1 bg-linear-to-b from-secondary/50 to-transparent mt-4 mb-[-64px]" />
                      )}
                    </div>

                    <div className="flex-1 glass rounded-[32px] border border-border/50 p-8 hover:border-secondary/50 transition-all shadow-sm hover:shadow-glow-secondary relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                              Build {release.version}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                              {release.date}
                            </span>
                          </div>
                          <h2 className="text-3xl font-black tracking-tight">{release.title}</h2>
                        </div>
                      </div>

                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {release.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5 opacity-80" />
                            <span className="text-sm font-medium text-foreground/80 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-24 p-12 rounded-[48px] border border-primary/20 bg-primary/5 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight mb-4">WANT THE FULL STORY?</h3>
                <p className="text-muted-foreground font-medium mb-10 max-w-xl mx-auto">
                  Sign up for our developer updates and be the first to know about upcoming studio
                  features.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/docs')}
                    size="lg"
                    className="h-12 px-8 bg-foreground text-background font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    View Docs
                  </Button>
                  <Button
                    onClick={() => navigate('/blog')}
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-border hover:bg-white/5 font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    Read Blog
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
