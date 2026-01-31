import { useNavigate } from 'react-router-dom'
import { Scale, Code, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function LicensePage() {
  const navigate = useNavigate()

  return (
    <PublicLayout>
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        <section className="relative py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full bg-muted/50 border border-border/50">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Legal Governance
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4">
                SOFTWARE <span className="text-primary italic">LICENSE</span>
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                Official terms and conditions governing the use of Kyto Studio infrastructure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass p-10 rounded-[32px] border border-border/50 mb-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                  <Scale className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Studio License</h2>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    Version 2.0.0 (2026 Revision)
                  </p>
                </div>
              </div>

              <div className="space-y-10 text-muted-foreground font-medium leading-relaxed">
                <p className="text-foreground font-bold">
                  Copyright © 2026 Kyto Studio & The Kyto Team. All rights reserved.
                </p>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic underline decoration-primary/30 decoration-4 underline-offset-8">
                    License Grant
                  </h3>
                  <p>
                    Subject to compliance with these terms, Kyto Studio grants you a limited,
                    non-exclusive, non-transferable, and revocable license to orchestrate automation
                    via the Kyto Studio platform for both personal and high-scale commercial
                    production.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic underline decoration-primary/30 decoration-4 underline-offset-8">
                    Restrictions
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'No reverse orchestration of core logic',
                      'No redistribution of studio assets',
                      'Proprietary markers must remain intact',
                      'Compliance with global automation laws',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm font-bold">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic underline decoration-primary/30 decoration-4 underline-offset-8">
                    User Ownership
                  </h3>
                  <p className="bg-muted/30 p-6 rounded-2xl border border-border italic border-l-4 border-l-primary">
                    "All automation logic, generated code (Discord.js/Discord.py), and workflow
                    configurations created within Kyto Studio remain the absolute property of the
                    creator. Kyto Studio claims zero intellectual property rights over
                    user-generated logic."
                  </p>
                </div>

                <div className="pt-10 border-t border-border/50">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">
                    Warranty Disclaimer
                  </h3>
                  <p className="text-[10px] text-muted-foreground/60 uppercase leading-loose font-bold tracking-wider">
                    THE STUDIO INFRASTRUCTURE IS PROVIDED "AS IS" WITHOUT EXPRESS OR IMPLIED
                    WARRANTY. IN NO EVENT SHALL Kyto STUDIO OR ITS ARCHITECTS BE HELD LIABLE FOR
                    OUTAGES, OR DISLOCATIONS ARISING FROM PRODUCTION DEPLOYMENTS.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass p-10 rounded-[32px] border border-border/50 flex flex-col md:flex-row items-center justify-between gap-8 group"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Code className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Open Source Heritage</h2>
                  <p className="text-muted-foreground font-medium text-sm mt-1">
                    Kyto stands on the shoulders of giants. We respect and utilize various
                    open-source protocols.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/docs')}
                className="h-12 px-8 border-border hover:bg-white/5 font-black rounded-2xl text-xs uppercase tracking-widest whitespace-nowrap"
              >
                Protocol Manifest
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
