import { Mail, MessageSquare, Send, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Orchestration message queued:', formData)
  }

  return (
    <PublicLayout>
      <div className="relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        <section className="relative py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-muted/20 border border-border">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Neutral Bridge
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase leading-none">
                CONNECT WITH THE <br />
                <span className="text-primary italic">ARCHITECTS</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mt-4">
                Establish a direct link with the Kyto Studio engineering team.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass p-12 rounded-[48px] border border-border/50 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                <h2 className="text-3xl font-black mb-10 text-foreground uppercase tracking-tight">
                  Transmission Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Identity
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 bg-muted/20 border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/30 transition-all font-bold text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Protocol: Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 bg-muted/20 border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/30 transition-all font-bold text-sm"
                        placeholder="your@logic.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Subject Vector
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-5 py-4 bg-muted/20 border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/30 transition-all font-bold text-sm"
                      placeholder="What protocol are we discussing?"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Payload Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-5 py-4 bg-muted/20 border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/30 transition-all resize-none font-bold text-sm leading-relaxed"
                      placeholder="Transmission content..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 bg-foreground text-background font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-glow-primary hover:bg-primary hover:text-primary-foreground group"
                  >
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Dispatch Transmission
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-8"
              >
                <div className="glass p-10 rounded-[40px] border border-border/50 hover:border-primary/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                      Direct Path
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6 font-medium text-sm leading-relaxed">
                    Automated ticket response for architectural support and billing queries.
                  </p>
                  <a
                    href="mailto:support@Kyto. studio"
                    className="text-primary hover:text-primary/80 transition-colors font-black text-xs uppercase tracking-widest"
                  >
                    support@Kyto.studio
                  </a>
                </div>

                <div className="glass p-10 rounded-[40px] border border-border/50 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                      <MessageSquare className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                      Neural Hive
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6 font-medium text-sm leading-relaxed">
                    Synchronize with our global architect community for real-time collaboration.
                  </p>
                  <a
                    href="https://discord.gg/Kyto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-400 transition-colors font-black text-xs uppercase tracking-widest"
                  >
                    discord.gg/Kyto
                  </a>
                </div>

                <div className="p-10 rounded-[40px] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
                      Temporal Status
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed font-bold uppercase tracking-widest opacity-60">
                    Typical response latency: <br />
                    <span className="text-white">12 - 24 Hours</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
