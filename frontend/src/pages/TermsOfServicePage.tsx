import { Scale, FileText, AlertCircle, ShieldCheck, Gavel, Handshake } from 'lucide-react'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: <Handshake className="w-6 h-6 text-primary" />,
      title: 'CONSENSUS & ADHERENCE',
      content:
        'By orchestrating logic via Kyto Studio, you enter a binding consensus with these terms. Non-compliance results in immediate revocation of studio infrastructure access.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'ORCHESTRATION ETHICS',
      content:
        "You bear absolute responsibility for ensuring your automated entities comply with Discord's Global Developer Protocols and Community Standards.",
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-primary" />,
      title: 'NEURAL SECURITY',
      content:
        'Studio tokens and workspace credentials are your sole responsibility. Kyto Studio architects cannot recover compromised logic due to client-side encryption protocols.',
    },
  ]

  return (
    <PublicLayout>
      <div className="relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-muted/50 border border-border/50">
                <Scale className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Legal Infrastructure
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter mb-4 text-foreground uppercase">
                TERMS OF <span className="text-primary italic">SERVICE</span>
              </h1>
              <p className="text-muted-foreground font-medium text-lg">
                Last Synchronized: January 29, 2026
              </p>
            </motion.div>

            <div className="grid gap-8 mb-20">
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-10 space-y-6 rounded-[32px] border border-border/50 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-medium text-sm">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-12 mb-20">
              <section className="glass p-10 rounded-[40px] border border-border/50">
                <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 mb-6 text-foreground uppercase">
                  <Gavel className="w-8 h-8 text-primary" />
                  LIMITATION OF LIABILITY
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Kyto Studio is provided "AS IS". Our architects disclaim all responsibility for
                  logic dislocations, downtime, or database volatilities incurred during the
                  execution of user-defined workflows within third-party environments.
                </p>
              </section>

              <section className="glass p-10 rounded-[40px] border border-border/50">
                <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 mb-6 text-foreground uppercase">
                  <FileText className="w-8 h-8 text-primary" />
                  INTELLECTUAL DOMAIN
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  The user maintains absolute sovereignty over logic flows and automation code
                  exported from Kyto Studio. The Studio infrastructure, including its neural logic
                  engine and proprietary interface, remains the exclusive property of Kyto.
                </p>
              </section>
            </div>

            <div className="p-12 rounded-[48px] border-2 border-primary/20 bg-primary/5 flex items-center gap-8 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mb-32" />
              <Scale className="w-12 h-12 text-primary shrink-0 relative z-10" />
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest leading-loose relative z-10">
                We reserve the right to recalibrate these terms at any moment. Significant
                architectural protocol shifts will be broadcast via our encrypted Discord channel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
