import { useNavigate } from 'react-router-dom'
import { Plus, Zap, MoreVertical, Trash2, Edit3, ArrowRight } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { EventListener } from '@/types'

export default function EventsListPage() {
  const navigate = useNavigate()
  const { events, createEvent, deleteEvent } = useProjectStore()

  const handleCreate = () => {
    const id = createEvent()
    navigate(`/builder/events/${id}`)
  }

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/builder/events/${id}`)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id)
    }
  }

  return (
    <NeoLayout>
      <div className="flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Event Listeners
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              React to Discord events like messages, new members, or reactions.
            </p>
          </div>
          
          <button 
            onClick={handleCreate}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Create Event
          </button>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center gap-6 group hover:border-emerald-400/50 hover:bg-emerald-50/10 transition-all cursor-pointer" onClick={handleCreate}>
            <div className="p-6 bg-emerald-100/50 rounded-full group-hover:bg-emerald-200/50 group-hover:scale-110 transition-all duration-300">
               <Zap className="w-12 h-12 text-emerald-500 group-hover:text-emerald-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No events yet</h3>
              <p className="text-slate-500 max-w-md">Create an event listener to make your bot respond to real-time actions.</p>
            </div>
            <span className="text-emerald-600 font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Start Building <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt: EventListener) => (
              <div 
                key={evt.id}
                onClick={() => navigate(`/builder/events/${evt.id}`)}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={(e) => handleEdit(evt.id, e)}
                    className="p-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(evt.id, e)}
                    className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Zap className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {evt.name}
                  </h3>
                  <div className="inline-block px-2 py-1 bg-slate-100 rounded-md text-xs font-mono text-slate-500">
                    {evt.eventType}
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {evt.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>{new Date(evt.updatedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                    Edit <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </NeoLayout>
  )
}
