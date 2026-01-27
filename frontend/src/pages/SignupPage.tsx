import { Link, useNavigate } from 'react-router-dom'
import { Terminal, Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NeoLayout } from '@/components/layout/NeoLayout'
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
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success('Account created! Redirecting...')
    setTimeout(() => navigate('/dashboard'), 1000)
  }

  return (
    <NeoLayout>
      <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] animate-pulse-slow delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-6 group transition-transform hover:scale-105"
            >
              <div className="p-2.5 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                Kyto
              </span>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Join 10,000+ developers building the future.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2 group">
              <label htmlFor="signup-name" className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1 tracking-wider group-focus-within:text-emerald-500 transition-colors">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="signup-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 dark:bg-zinc-900/50 border-2 border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label htmlFor="signup-email" className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1 tracking-wider group-focus-within:text-emerald-500 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="signup-email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-zinc-900/50 border-2 border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label htmlFor="signup-password" className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1 tracking-wider group-focus-within:text-emerald-500 transition-colors">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="signup-password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-zinc-900/50 border-2 border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg font-black shadow-lg shadow-emerald-500/20 mt-4 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline underline-offset-4 decoration-2"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </NeoLayout>
  )
}
