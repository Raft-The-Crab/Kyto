import { ProjectLayout } from '@/components/layout/ProjectLayout'
import { motion } from 'framer-motion'
import { TrendingUp, Package, Star, Download, ChevronRight } from 'lucide-react'
import { TEMPLATES } from '@/lib/templates'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'

export default function MarketplacePage() {
  const navigate = useNavigate()
  const { createProject } = useProjectStore()

  const handleUseTemplate = (template: any) => {
    toast.success(`Starting project with template: ${template.name}`)
    // Logic to create project from template
    // For now just create a blank one with the name
    createProject(`${template.name} Project`, 'discord.js')
    navigate('/builder/commands')
  }

  return (
    <ProjectLayout>
      <div className="max-w-7xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-1000">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-foreground">Marketplace</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover community-made templates and architectures to jumpstart your bot.
          </p>
        </div>

        {/* Featured Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="heading-secondary text-2xl text-foreground">Trending Architectures</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {TEMPLATES.map((tpl, idx) => (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleUseTemplate(tpl)}
                className="group cursor-pointer glass p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all shadow-sm hover:shadow-md relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/10 transition-all duration-700" />

                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 group-hover:scale-110 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500">
                    <Package className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl label-text text-sm font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{tpl.rating || '4.9'}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 relative z-10">
                  <h3 className="heading-tertiary text-xl font-bold group-hover:text-primary transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="body-text text-sm leading-relaxed line-clamp-2 text-muted-foreground">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50 relative z-10">
                  <div className="flex items-center gap-4 text-muted-foreground label-text">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Download className="w-3.5 h-3.5" />
                      {tpl.downloads || '1.2k'}
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-primary font-bold text-[13px] group-hover:gap-3 transition-all">
                    Import Module <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </ProjectLayout>
  )
}
