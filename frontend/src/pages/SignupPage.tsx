import { Link, useNavigate } from 'react-router-dom'
import { Zap, Lock, Mail, User, Github, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SignupPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('PROTOCOL ERROR: Partial data detected')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Identity verified. Welcome to Kyto.')
    setTimeout(() => navigate('/dashboard'), 1000)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Visual Side (Left) - Premium Dark Aesthetic */}
      <div className="hidden lg:flex w-[45%] bg-black relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

        {/* Animated Background Elements */}
        <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-full h-full bg-emerald-600/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />

        <div className="relative z-10 w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-3 mb-20 group">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-glow group-hover:scale-110 transition-all duration-500">
              <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500" />
            </div>
            <span className="font-black text-3xl tracking-tighter text-white uppercase italic">
              Kyto
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <h1 className="text-5xl font-black leading-[1.1] text-white tracking-tighter uppercase">
              ARCHITECT THE <span className="text-emerald-500 italic">NEW WORLD</span>.
            </h1>
            <div className="space-y-6">
              <div className="glass p-8 rounded-[32px] border border-white/5 bg-white/5 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-emerald-500/20 transition-colors" />
                <p className="text-xl text-slate-300 font-medium leading-relaxed italic mb-6">
                  "Transitioning to Kyto was like moving from a steam engine to a warp drive. The
                  speed of iteration is phenomenal."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-black text-emerald-500">
                    SC
                  </div>
                  <div>
                    <div className="font-black text-white text-xs uppercase tracking-widest">
                      Sarah Chen
                    </div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                      Logic Architect
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.03),transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-10 relative z-10"
        >
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Create Account</h2>
            <p className="text-muted-foreground font-medium text-sm">
              Join us and start building your bots today.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Your Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className="flex h-14 w-full rounded-2xl border-2 border-border/50 bg-background/50 px-3 py-2 text-sm font-bold placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:border-emerald-500/50 focus-visible:ring-4 focus-visible:ring-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-50 pl-12 transition-all shadow-sm"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <User className="absolute left-4 top-5 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    className="flex h-14 w-full rounded-2xl border-2 border-border/50 bg-background/50 px-3 py-2 text-sm font-bold placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:border-emerald-500/50 focus-visible:ring-4 focus-visible:ring-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-50 pl-12 transition-all shadow-sm"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Mail className="absolute left-4 top-5 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    className="flex h-14 w-full rounded-2xl border-2 border-border/50 bg-background/50 px-3 py-2 text-sm font-bold placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:border-emerald-500/50 focus-visible:ring-4 focus-visible:ring-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-50 pl-12 transition-all shadow-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Lock className="absolute left-4 top-5 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-foreground text-background font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-glow-primary hover:bg-emerald-500 hover:border-emerald-500 hover:text-white group border-2 border-transparent"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="bg-background px-4 text-muted-foreground/40">Continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 border-2 border-border/50 hover:bg-white/5 font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all active:scale-95"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-14 border-2 border-border/50 hover:bg-[#5865F2]/5 font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all active:scale-95 text-[#5865F2] hover:border-[#5865F2]/30"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
              </svg>
              Discord
            </Button>
          </div>

          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
