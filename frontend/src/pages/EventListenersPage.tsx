import { Radio, Plus, Search } from 'lucide-react'

function EventListenersPage() {
  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Radio className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Event Listeners</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" />
              New Event
            </button>
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Events List */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Your Events
            </h2>
            <div className="space-y-2">
              <div className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-all">
                <p className="text-white font-semibold">messageCreate</p>
                <p className="text-sm text-slate-400">Triggered on new messages</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-slate-950 p-6">
          <div className="h-full border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <Radio className="w-16 h-16 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-lg">Select an event or create a new one</p>
            </div>
          </div>
        </main>

        {/* Properties Panel */}
        <aside className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Properties
            </h2>
            <p className="text-slate-500 text-sm">No event selected</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default EventListenersPage
