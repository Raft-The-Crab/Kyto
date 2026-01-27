import { NeoLayout } from '@/components/layout/NeoLayout'
import { CheckCircle2, ShieldCheck, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  return (
    <NeoLayout>
      <div className="max-w-4xl mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border-2 border-emerald-600 font-black text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Privacy First
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter">
              PRIVACY POLICY
            </h1>
            <p className="text-lg text-slate-500 font-bold uppercase tracking-widest">
              Last Updated: January 20, 2026
            </p>
          </div>

          <div className="prose prose-slate prose-xl max-w-none space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shrink-0">
                  1
                </span>
                Introduction
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                At Kyto, we take your privacy seriously. This policy describes how we collect,
                use, and protect your personal information when you use our platform.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shrink-0">
                  2
                </span>
                Data We Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PolicyCard
                  title="Account Information"
                  desc="Email address, name, and profile picture provided during signup via Discord or Email."
                />
                <PolicyCard
                  title="Project Data"
                  desc="Bot configurations, command logic, and variables stored within your project."
                />
              </div>
            </section>

            <section className="space-y-6 py-12 bg-slate-50 rounded-3xl border-2 border-slate-900 p-8 shadow-neo-sm translate-x-1 translate-y-1">
              <h2 className="text-3xl font-black text-slate-900">How we protect your tokens</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                We follow a <strong>Zero-Trust</strong> local-first architecture. Your Discord Bot
                Tokens are stored in your browser's persistent storage and are never transmitted to
                our backend unless you explicitly enable cloud persistence features.
              </p>
            </section>

            <section className="space-y-6 pt-12">
              <div className="p-8 border-4 border-slate-900 rounded-3xl bg-white shadow-neo">
                <h3 className="text-3xl font-black text-slate-900 mb-6">Contact Us</h3>
                <div className="flex items-center gap-4 text-slate-900 font-bold text-xl">
                  <Mail className="w-8 h-8 text-indigo-600" />
                  privacy@kyto.app
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </NeoLayout>
  )
}

function PolicyCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl">
      <h4 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        {title}
      </h4>
      <p className="text-slate-500 font-bold text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
