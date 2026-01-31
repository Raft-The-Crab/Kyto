import { useNavigate } from 'react-router-dom'
import { Target, Code2, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <PublicLayout>
      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="heading-primary text-4xl md:text-5xl mb-4">About Kyto</h1>
            <p className="text-xl text-muted-foreground">
              A modern visual platform for Discord bot development
            </p>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-8 rounded-2xl border border-border/50 shadow-sm mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Kyto simplifies Discord bot development by combining visual programming with
                professional code generation. Whether you're a beginner or an experienced developer,
                our platform helps you build and deploy bots faster.
              </p>
              <p>
                Started in December 2024, Kyto has grown into a comprehensive platform that supports
                both visual block-based development and direct code editing, giving you the best of
                both worlds.
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <div className="glass p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Visual Development</h3>
              <p className="text-muted-foreground text-sm">
                Drag-and-drop interface for building bot logic without writing code
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-border/50 hover:border-blue-500/30 transition-all shadow-sm">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Code Export</h3>
              <p className="text-muted-foreground text-sm">
                Generate clean, production-ready code in Discord.js or Discord.py
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-border/50 hover:border-purple-500/30 transition-all shadow-sm">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Collaboration</h3>
              <p className="text-muted-foreground text-sm">
                Real-time collaboration features for team projects
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-border/50 hover:border-pink-500/30 transition-all shadow-sm">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">AI Assistance</h3>
              <p className="text-muted-foreground text-sm">
                Smart suggestions and code generation to accelerate development
              </p>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass p-8 rounded-2xl border border-border/50 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4 text-foreground">The Team</h2>
            <p className="text-muted-foreground mb-6">
              Kyto is developed by a small team dedicated to improving the Discord bot development
              experience. We're constantly working on new features and improvements based on
              community feedback.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/contact')}
                className="rounded-xl shadow-sm"
              >
                Get in Touch
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/docs')}
                className="rounded-xl shadow-sm"
              >
                Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}
