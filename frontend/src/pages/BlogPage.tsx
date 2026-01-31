import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function BlogPage() {
  const navigate = useNavigate()

  const posts = [
    {
      id: 1,
      title: 'Introducing Kyto 2.0',
      excerpt: 'A major update to our visual bot builder with new features and improvements.',
      date: 'December 26, 2024',
      readTime: '5 min read',
      category: 'Product',
    },
    {
      id: 2,
      title: 'Building Your First Discord Bot',
      excerpt: "Step-by-step guide to creating a Discord bot using Kyto's visual editor.",
      date: 'December 20, 2024',
      readTime: '8 min read',
      category: 'Tutorial',
    },
    {
      id: 3,
      title: 'Best Practices for Bot Development',
      excerpt: 'Learn the essential patterns and practices for building reliable Discord bots.',
      date: 'December 15, 2024',
      readTime: '6 min read',
      category: 'Guide',
    },
  ]

  return (
    <PublicLayout>
      <div className="relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">
                <Newspaper className="w-4 h-4" />
                Dispatch & Insights
              </div>
              <h1 className="text-6xl font-black tracking-tighter mb-6 uppercase">
                THE Kyto <span className="text-primary italic">JOURNAL</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                Intel, technical deep-dives, and architect updates from the core Kyto team.
              </p>
            </motion.div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="glass p-8 rounded-[32px] border border-border/50 hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-glow-primary relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                      {post.category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black tracking-tight mb-4 text-foreground group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground font-medium text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all text-xs font-black uppercase tracking-widest">
                    Transmission View
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Coming Soon / Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-24 p-16 rounded-[48px] border border-primary/20 bg-primary/5 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mt-32" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-4xl font-black tracking-tight mb-6">STAY IN THE NEURAL LOOP</h3>
                <p className="text-muted-foreground font-medium text-lg mb-10">
                  New architecture guides, logic engine deep-dives, and feature reveals are pushed
                  every week.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/docs')}
                    size="lg"
                    className="h-14 px-10 bg-primary text-primary-foreground font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-glow-primary"
                  >
                    Browse Protocol
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 border-border hover:bg-white/5 font-black rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    Subscribe
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
