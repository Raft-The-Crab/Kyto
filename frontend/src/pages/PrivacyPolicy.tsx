import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white transition-colors py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-12">Last Updated: January 25, 2026</p>

        <div className="space-y-12 prose dark:prose-invert prose-indigo max-w-none">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Data We Collect</h2>
            <p className="opacity-80 leading-relaxed mb-4">
              We collect minimal data necessary to provide our services:
            </p>
            <ul className="list-disc pl-5 space-y-2 opacity-80 leading-relaxed">
              <li>Account information (Email, Username, User ID) via authentication providers.</li>
              <li>Project data (Bot configurations, logic flows, environment variables).</li>
              <li>Usage analytics (anonymized page views, error logs) to improve performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Data</h2>
            <p className="opacity-80 leading-relaxed">Your data is used solely to:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2 opacity-80 leading-relaxed">
              <li>Provide and maintain the Kyto service.</li>
              <li>Persist your bot projects across sessions.</li>
              <li>Authenticate your access to the dashboard.</li>
            </ul>
            <p className="opacity-80 leading-relaxed mt-4">
              We do <strong>not</strong> sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p className="opacity-80 leading-relaxed">
              We implement industry-standard security measures to protect your information.
              Sensitive data such as Bot Tokens are encrypted at rest and never exposed to the
              frontend after initial input.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Services</h2>
            <p className="opacity-80 leading-relaxed">
              Our service integrates with Discord APIs. By using Kyto, you also acknowledge
              Discord's Privacy Policy. We may use third-party hosting and analytics providers
              (e.g., Vercel, Supabase) who adhere to strict data protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p className="opacity-80 leading-relaxed">
              For privacy concerns, please contact us at privacy@kyto.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
