import { Rocket } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center gap-4">
          <Rocket className="w-16 h-16 text-indigo-400 animate-bounce" />
          <h1 className="text-7xl font-bold text-white">
            Botify
          </h1>
        </div>
        <p className="text-2xl text-indigo-200 max-w-2xl mx-auto">
          Next-generation visual Discord bot builder
        </p>
        <div className="flex gap-4 justify-center">
          <div className="px-6 py-3 bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 rounded-lg">
            <p className="text-indigo-200 text-sm">🎯 Free Forever</p>
          </div>
          <div className="px-6 py-3 bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 rounded-lg">
            <p className="text-indigo-200 text-sm">🚀 Zero Code Required</p>
          </div>
          <div className="px-6 py-3 bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 rounded-lg">
            <p className="text-indigo-200 text-sm">💎 You Own the Code</p>
          </div>
        </div>
        <div className="pt-8">
          <p className="text-indigo-300 text-lg animate-pulse">
            Setting up your workspace...
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
