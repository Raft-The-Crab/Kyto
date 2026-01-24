import { Store, Download, Star, TrendingUp, Package } from 'lucide-react'

function MarketplacePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Store className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold text-white">Marketplace</h1>
            </div>
            
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all">
              Share Your Bot
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates, modules, and bots..."
              className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium whitespace-nowrap">
            All
          </button>
          <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-medium whitespace-nowrap transition-all">
            Bot Templates
          </button>
          <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-medium whitespace-nowrap transition-all">
            Modules
          </button>
          <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-medium whitespace-nowrap transition-all">
            Commands
          </button>
          <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-medium whitespace-nowrap transition-all">
            Events
          </button>
        </div>

        {/* Featured Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Trending Templates</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <Package className="w-10 h-10 text-indigo-400" />
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Moderation Bot</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Complete moderation system with ban, kick, mute, and warning features
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Download className="w-4 h-4" />
                    <span>1.2k downloads</span>
                  </div>
                  
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default MarketplacePage
