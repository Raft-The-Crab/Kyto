import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
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

        <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-12">Last Updated: January 25, 2026</p>

        <div className="space-y-12 prose dark:prose-invert prose-indigo max-w-none">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="opacity-80 leading-relaxed">
              Welcome to Kyto ("Platform"). By accessing or using our website, services, or tools,
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please
              do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use of Service</h2>
            <ul className="list-disc pl-5 space-y-2 opacity-80 leading-relaxed">
              <li>You must be at least 13 years old to use the Platform.</li>
              <li>You agree not to use the Platform for any illegal or unauthorized purpose.</li>
              <li>
                You are responsible for maintaining the security of your account and bot tokens.
              </li>
              <li>We reserve the right to terminate access for violation of these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Bot Content & Conduct</h2>
            <p className="opacity-80 leading-relaxed">
              Bots created on Kyto must comply with Discord's Terms of Service and Community
              Guidelines. We strictly prohibit bots that:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 opacity-80 leading-relaxed">
              <li>Promote hate speech, violence, or illegal content.</li>
              <li>Engage in spam or mass automated messaging.</li>
              <li>Attempt to exploit the Platform's infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
            <p className="opacity-80 leading-relaxed">
              You retain ownership of the logic flows and configurations you create. Kyto retains
              ownership of the underlying visual builder technology, interface, and provided assets.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Disclaimer</h2>
            <p className="opacity-80 leading-relaxed">
              The Platform is provided "as is" without warranties of any kind. We are not liable for
              any damages resulting from the use or inability to use the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
