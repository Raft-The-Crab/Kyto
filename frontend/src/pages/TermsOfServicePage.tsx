import { NeoLayout } from '@/components/layout/NeoLayout'
import { AlertCircle, Scale, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TermsOfServicePage() {
  return (
    <NeoLayout>
      <div className="max-w-4xl mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full border-2 border-indigo-600 font-black text-xs uppercase tracking-widest">
              <Scale className="w-4 h-4" /> Legal
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter">
              TERMS OF SERVICE
            </h1>
            <p className="text-lg text-slate-500 font-bold uppercase tracking-widest">
              Effective Date: January 20, 2026
            </p>
          </div>

          <div className="prose prose-slate prose-xl max-w-none space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl shrink-0">
                  1
                </span>
                Agreement to Terms
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                By accessing or using Botify ("the Service"), you agree to be bound by these Terms
                of Service. If you do not agree to all of the terms, do not access the Service.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-xl shrink-0">
                  2
                </span>
                Use of the Service
              </h2>
              <div className="space-y-4">
                <TermItem text="You are responsible for any bots you create and deploy using Botify." />
                <TermItem text="You must not use the service for illegal or unauthorized purposes." />
                <TermItem text="You must comply with Discord's Developer Terms of Service at all times." />
              </div>
            </section>

            <section className="space-y-6 py-12 bg-yellow-50 rounded-3xl border-2 border-slate-900 p-8 shadow-neo-sm">
              <div className="flex items-center gap-4 mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
                <h2 className="text-3xl font-black text-slate-900 uppercase">
                  Limitation of Liability
                </h2>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic">
                Botify is provided "as is" and "as available". We are not responsible for any issues
                arising from Discord's API changes or bot downtime.
              </p>
            </section>

            <div className="text-center pt-20 border-t-2 border-slate-100">
              <div className="inline-flex items-center gap-2 font-black text-slate-400 uppercase tracking-widest text-sm">
                <FileText className="w-4 h-4" /> End of Document
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </NeoLayout>
  )
}

function TermItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-slate-300 transition-all">
      <div className="w-2 h-2 mt-2 bg-indigo-600 rounded-full shrink-0" />
      <p className="font-bold text-slate-700 leading-tight">{text}</p>
    </div>
  )
}
