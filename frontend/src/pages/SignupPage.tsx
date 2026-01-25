import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Rocket, ArrowRight, Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      login(name, email)
      toast.success(`Welcome to Botify, ${name}! 🚀`)
      navigate('/dashboard')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Right: Form (Order swapped for visual interest compared to Login) */}
      <div className="md:order-2 bg-white flex items-center justify-center p-6 md:p-12 relative">
        <Link
          to="/"
          className="absolute top-8 right-8 text-sm font-bold text-slate-500 hover:text-slate-900"
        >
          Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Create an account</h2>
            <p className="text-slate-500 font-medium">Start building your dream bot in seconds.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="John Doe"
                  className="pl-10"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Creating...' : 'Get Started'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="text-center font-medium">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-indigo-600 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      {/* Left: Branding */}
      <div className="md:order-1 bg-indigo-600 border-r-2 border-slate-900 hidden md:flex flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 text-white">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border-2 border-slate-900 shadow-neo mb-6">
            <Rocket className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Join the
            <br />
            Revolution.
          </h1>
        </div>

        <div className="relative z-10 text-white">
          <ul className="space-y-4 font-bold text-lg">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Unlimited Projects
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Community Templates
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400" /> 100% Exportable Code
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
