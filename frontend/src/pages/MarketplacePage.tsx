import { Download, Star, TrendingUp, Package, ChevronRight } from 'lucide-react'
import { TEMPLATES } from '@/lib/templates'
import { NeoLayout } from '@/components/layout/NeoLayout'

function MarketplacePage() {
  return (
    <NeoLayout>
      <div className="flex-1 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Marketplace
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Browse community templates and modules
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group w-96 hidden md:block">
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-all font-bold shadow-neo-sm"
              />
            </div>
            <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white font-black rounded-xl transition-all shadow-neo-sm hover:shadow-neo hover:-translate-y-1">
              Share Flow
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold whitespace-nowrap shadow-neo-sm border-2 border-slate-900 hover:-translate-y-1 transition-transform">
            All Items
          </button>
          {['Templates', 'Modules', 'Triggers', 'Scripts'].map(cat => (
            <button
              key={cat}
              className="px-6 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 border-2 border-slate-900 dark:border-slate-700 rounded-xl font-bold whitespace-nowrap transition-all shadow-neo-sm hover:-translate-y-1"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Trending Now
              </h2>
            </div>
            <button className="text-indigo-500 font-bold hover:text-indigo-600 transition-colors flex items-center gap-1 group">
              View all{' '}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                className="group bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl p-6 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all cursor-default relative overflow-hidden shadow-neo-sm hover:shadow-neo hover:-translate-y-1"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/20 transition-colors" />

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center border-2 border-slate-900 dark:border-indigo-500/20 shadow-sm">
                    <Package className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-500/20 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-black">{tpl.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-slate-500 text-sm font-medium mb-6 min-h-[40px] leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Download className="w-4 h-4" />
                    <span>{tpl.downloads}</span>
                  </div>

                  <button className="px-5 py-2.5 bg-slate-900 dark:bg-white group-hover:bg-indigo-600 dark:group-hover:bg-indigo-600 text-white dark:text-slate-900 group-hover:text-white text-sm font-black rounded-xl transition-all shadow-neo-sm hover:shadow-neo">
                    Use Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </NeoLayout>
  )
}

export default MarketplacePage
