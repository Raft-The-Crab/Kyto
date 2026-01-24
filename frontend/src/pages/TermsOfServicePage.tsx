import { FileText } from 'lucide-react'

function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <FileText className="w-10 h-10 text-indigo-400" />
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing and using Botify, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              Botify grants you a personal, non-transferable, non-exclusive license to use the software and services.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>You own all code generated through Botify</li>
              <li>You may use, modify, and distribute generated code freely</li>
              <li>You may not resell or redistribute Botify itself</li>
              <li>You may not use Botify for illegal purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Code Ownership</h2>
            <p className="text-slate-300 leading-relaxed">
              All code generated using Botify is your property. We claim no ownership or rights to your generated Discord bots. 
              You are free to deploy, modify, sell, or distribute the generated code as you see fit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Privacy & Data</h2>
            <p className="text-slate-300 leading-relaxed">
              Botify is designed with privacy in mind. All bot projects are stored locally in your browser. 
              We do not collect, store, or transmit your bot data to external servers unless you explicitly choose to sync with optional cloud features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer</h2>
            <p className="text-slate-300 leading-relaxed">
              Botify is provided "as is" without warranty of any kind. We do not guarantee that the service will be uninterrupted or error-free. 
              You use Botify at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Discord Terms Compliance</h2>
            <p className="text-slate-300 leading-relaxed">
              You are responsible for ensuring that your Discord bot complies with Discord's Terms of Service and Developer Terms. 
              Botify is a tool - you are responsible for how you use it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Changes to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of Botify constitutes acceptance of modified terms.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-800">
            <p className="text-slate-400 text-sm">
              Last updated: January 24, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
