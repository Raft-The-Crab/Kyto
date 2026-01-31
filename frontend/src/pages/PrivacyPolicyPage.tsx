import { ShieldCheck, Mail, Lock, Eye, Globe, Scale } from 'lucide-react'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Button } from '@/components/ui/Button'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'ENCRYPTED PROTECTION',
      content:
        'We utilize enterprise-grade AES-256 encryption. Your Studio tokens are held exclusively in hardened local cache and are never transmitted to our core servers without explicit cloud-sync activation.',
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: 'DATA MINIMALISM',
      content:
        'Kyto Studio only ingests strictly necessary telemetry required for session integrity, such as Discord identifiers and authentication metadata.',
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: 'ZERO-ACCESS ARCHITECTURE',
      content:
        'Our infrastructure is built on zero-access principles. Kyto architects possess zero capability to inspect or manipulate your private logic flows.',
    },
  ]

  return (
    <PublicLayout>
      <div className="relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-muted/50 border border-border/50">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Privacy Protocol
                </span>
              </div>

              <h1 className="text-6xl font-black tracking-tighter mb-4 text-foreground uppercase">
                PRIVACY <span className="text-primary italic">POLICY</span>
              </h1>
              <p className="text-muted-foreground font-medium text-lg">
                Last Revision: January 29, 2026
              </p>
            </motion.div>

            <div className="grid gap-8 mb-20">
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-10 space-y-6 rounded-[32px] border border-border/50 group relative overflow-hidden"
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
                  <p className="text-muted-foreground font-medium leading-relaxed text-sm">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-12 mb-20">
              <section className="glass p-10 rounded-[40px] border border-border/50">
                <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 mb-6 text-foreground uppercase">
                  <Globe className="w-8 h-8 text-primary" />
                  COOKIE TELEMETRY
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed italic">
                  "We utilize strictly functional telemetry tokens to maintain session persistence.
                  Kyto Studio maintains a strict anti-tracking stance; we do not utilize third-party
                  advertising cookies or behavioral analytics vendors."
                </p>
              </section>

              <section className="glass p-10 rounded-[40px] border border-border/50">
                <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 mb-6 text-foreground uppercase">
                  <Scale className="w-8 h-8 text-primary" />
                  EXTERNAL PROTOCOLS
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Authentication is bridged via Discord. For telemetric details regarding their
                  infrastructure, please consult the Discord Privacy Manifest. Kyto Studio limits
                  Discord data ingestion to the minimum required for identification.
                </p>
              </section>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-[48px] bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-primary/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="space-y-2 text-center md:text-left relative z-10">
                <h3 className="text-3xl font-black tracking-tight uppercase italic">
                  PROTOCOL QUESTIONS?
                </h3>
                <p className="opacity-90 font-bold text-sm uppercase tracking-widest">
                  Our privacy architects are standing by.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => (window.location.href = 'mailto:privacy@Kyto.app')}
                className="h-16 px-10 bg-white text-primary font-black rounded-2xl hover:bg-white/90 transition-all text-xs uppercase tracking-[0.2em] shadow-xl relative z-10"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Privacy Team
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
