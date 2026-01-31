import { motion } from 'framer-motion'
import { Zap, Menu, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AnimatePresence } from 'framer-motion'

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Templates', href: '/marketplace' },
    { label: 'Help', href: '/docs' },
    { label: 'Status', href: '/status' },
    { label: 'Blog', href: '/blog' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Universal Sticky Header */}
      <nav className="fixed top-0 w-full z-100 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-premium rounded-full px-6 py-3 border border-white/10 shadow-glow flex items-center justify-between"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 shadow-glow group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-primary fill-primary" />
              </div>
              <span className="text-xl font-black tracking-tight">Kyto</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex font-bold text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 rounded-xl shadow-glow group"
                onClick={() => navigate('/signup')}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Mobile Toggle */}
              <button
                className="md:hidden p-2 hover:bg-white/5 rounded-lg text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-90 bg-background/95 backdrop-blur-3xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black text-foreground py-4 border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8 flex flex-col gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-2xl h-14"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="lg"
                  className="w-full rounded-2xl h-14 bg-primary text-primary-foreground font-black shadow-glow"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="pt-24 min-h-screen">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Kyto</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 text-sm text-muted-foreground font-medium">
            <div className="flex flex-col gap-3">
              <span className="font-black text-xs uppercase tracking-widest mb-2 text-primary">
                Platform
              </span>
              <Link to="/marketplace" className="hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link to="/hosting" className="hover:text-foreground transition-colors">
                Hosting
              </Link>
              <Link to="/status" className="hover:text-foreground transition-colors">
                System Status
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-black text-xs uppercase tracking-widest mb-2 text-primary">
                Resources
              </span>
              <Link to="/docs" className="hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/changelog" className="hover:text-foreground transition-colors">
                Changelog
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-black text-xs uppercase tracking-widest mb-2 text-primary">
                Company
              </span>
              <Link to="/careers" className="hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-black text-xs uppercase tracking-widest mb-2 text-primary">
                Legal
              </span>
              <Link to="/tos" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/license" className="hover:text-foreground transition-colors">
                Software License
              </Link>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-8 md:mt-0">
            © 2026 Kyto. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
