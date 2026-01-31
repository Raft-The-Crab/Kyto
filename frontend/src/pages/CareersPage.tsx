import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function CareersPage() {
  const navigate = useNavigate()

  const positions = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description:
        'Help us build the future of Discord bot development. Experience with React, TypeScript, and Node.js required.',
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description:
        'Design intuitive interfaces for our visual bot builder. Strong portfolio in SaaS design required.',
    },
    {
      id: 3,
      title: 'Developer Advocate',
      department: 'Community',
      location: 'Remote',
      type: 'Part-time',
      description:
        'Create content, tutorials, and engage with our community. Experience with Discord bots and technical writing.',
    },
  ]

  return (
    <PublicLayout>
      <div className="relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        <section className="relative py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">
                <Rocket className="w-4 h-4" />
                Join the Frontier
              </div>
              <h1 className="text-6xl font-black tracking-tighter mb-6 uppercase">
                ENGINEER THE <span className="text-primary italic">FUTURE</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                Kyto Studio is scaling. We're looking for architects to help us redefine the
                boundaries of automation logic.
              </p>
            </motion.div>

            {/* Open Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-10 text-center">
                Open Roles
              </h2>
              <div className="space-y-6">
                {positions.map((position, index) => (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="glass p-10 rounded-[32px] border border-border/50 hover:border-primary/50 transition-all shadow-sm group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                            {position.department}
                          </span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight mb-4 text-foreground group-hover:text-primary transition-colors">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {position.type}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button
                          onClick={() => navigate('/contact')}
                          size="lg"
                          className="h-14 px-10 bg-foreground text-background font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest shadow-glow-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                    <p className="mt-8 pt-8 border-t border-border/50 text-muted-foreground font-medium text-sm leading-relaxed max-w-3xl">
                      {position.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* General Inquiry */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-24 p-16 rounded-[48px] border border-secondary/20 bg-secondary/5 text-center relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -mr-32 -mb-32" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight mb-4 uppercase">
                  Don't see your role?
                </h3>
                <p className="text-muted-foreground font-medium mb-10 max-w-xl mx-auto">
                  We're always looking for exceptional talent. If you have a unique skill set that
                  can help Kyto scale, drop us a line.
                </p>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="outline"
                  size="lg"
                  className="h-14 px-12 border-border hover:bg-white/5 font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                  General Application
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
