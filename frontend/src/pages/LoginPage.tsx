import { Link, useNavigate } from 'react-router-dom'
import { Terminal, Lock, Mail, Github, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error('Please enter your credentials')
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success('Welcome back!')
    navigate('/dashboard')
  }

  return (
    <NeoLayout>
      <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[128px] animate-pulse-slow" />
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
              <div className="p-2.5 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-xl text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                KYTO
              </span>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Enter your coordinates to access the mainframe.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 ml-1 tracking-wider group-focus-within:text-indigo-500 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-zinc-900/50 border-2 border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider group-focus-within:text-indigo-500 transition-colors">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-zinc-900/50 border-2 border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>

            <Button
              className="w-full h-14 text-lg font-black shadow-lg shadow-indigo-500/20 mt-4 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-white dark:bg-[#09090b] px-3 text-slate-400 font-bold">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 border-2 border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all font-bold text-sm text-slate-700 dark:text-slate-300 group">
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 p-3 border-2 border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all font-bold text-sm text-slate-700 dark:text-slate-300 group">
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform text-[#5865F2]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
              </svg>
              Discord
            </button>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4 decoration-2"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </NeoLayout>
  )
}
