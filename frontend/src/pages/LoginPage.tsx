import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Rocket, ArrowRight, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      login('Demo User', email)
      toast.success('Welcome back! 👋')
      navigate('/dashboard')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Branding */}
      <div className="bg-slate-50 border-r-2 border-slate-900 hidden md:flex flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center border-2 border-slate-900 shadow-neo mb-6">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Build bots without
            <br />
            writing code.
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-sm">
            Join thousands of creators building the next generation of Discord apps using Botify's
            visual engine.
          </p>
        </div>

        <div className="relative z-10">
          <blockquote className="text-xl font-bold text-slate-900 italic mb-4">
            "The most intuitive bot builder I've ever used. The Neo-Brutalist design is just chef's
            kiss."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-900" />
            <div>
              <p className="font-bold text-slate-900">Alex Chen</p>
              <p className="text-sm font-bold text-slate-500">Bot Developer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="bg-white flex items-center justify-center p-6 md:p-12 relative">
        <Link
          to="/"
          className="absolute top-8 right-8 text-sm font-bold text-slate-500 hover:text-slate-900"
        >
          Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input type="password" required placeholder="••••••••" className="pl-10" />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="text-center font-medium">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
