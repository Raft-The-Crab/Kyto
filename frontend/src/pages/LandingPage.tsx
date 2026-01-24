import { Rocket, Zap, Code2, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center space-y-8 max-w-5xl">
          <div className="flex items-center justify-center gap-4">
            <Rocket className="w-20 h-20 text-indigo-400 animate-bounce" />
            <h1 className="text-8xl font-bold text-white">
              Botify
            </h1>
          </div>
          
          <p className="text-3xl text-indigo-200 max-w-3xl mx-auto font-light">
            Next-generation visual Discord bot builder
          </p>
          
          <p className="text-xl text-indigo-300 max-w-2xl mx-auto">
            Build powerful Discord bots with zero coding experience. 
            Generate production-ready source code you own forever.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="px-8 py-6 bg-indigo-500/10 backdrop-blur-sm border border-indigo-400/30 rounded-xl hover:bg-indigo-500/20 transition-all">
              <Zap className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <p className="text-indigo-200 font-semibold text-lg">Free Forever</p>
              <p className="text-indigo-300 text-sm mt-2">No paywalls, no premium tiers</p>
            </div>
            
            <div className="px-8 py-6 bg-indigo-500/10 backdrop-blur-sm border border-indigo-400/30 rounded-xl hover:bg-indigo-500/20 transition-all">
              <Code2 className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <p className="text-indigo-200 font-semibold text-lg">Zero Code Required</p>
              <p className="text-indigo-300 text-sm mt-2">Visual builder for everyone</p>
            </div>
            
            <div className="px-8 py-6 bg-indigo-500/10 backdrop-blur-sm border border-indigo-400/30 rounded-xl hover:bg-indigo-500/20 transition-all">
              <Lock className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <p className="text-indigo-200 font-semibold text-lg">You Own the Code</p>
              <p className="text-indigo-300 text-sm mt-2">Export and deploy anywhere</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center pt-8">
            <Link
              to="/builder/commands"
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/50"
            >
              Start Building
            </Link>
            
            <Link
              to="/marketplace"
              className="px-10 py-4 bg-transparent border-2 border-indigo-400 hover:bg-indigo-500/20 text-indigo-200 font-bold rounded-xl transition-all"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
