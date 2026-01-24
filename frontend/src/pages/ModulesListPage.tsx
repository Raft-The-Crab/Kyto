import { useNavigate } from 'react-router-dom'
import { Plus, Settings, MoreVertical, Trash2, Edit3, ArrowRight, Package } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { NeoLayout } from '@/components/layout/NeoLayout'
import { Module } from '@/types'

export default function ModulesListPage() {
  const navigate = useNavigate()
  const { modules, createModule, deleteModule } = useProjectStore()

  const handleCreate = () => {
    const id = createModule()
    navigate(`/builder/modules/${id}`)
  }

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/builder/modules/${id}`)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this module?')) {
      deleteModule(id)
    }
  }

  return (
    <NeoLayout>
      <div className="flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Modules
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              Group commands and events into reusable modules.
            </p>
          </div>
          
          <button 
            onClick={handleCreate}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Create Module
          </button>
        </div>

        {/* Modules Grid */}
        {modules.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center gap-6 group hover:border-purple-400/50 hover:bg-purple-50/10 transition-all cursor-pointer" onClick={handleCreate}>
            <div className="p-6 bg-purple-100/50 rounded-full group-hover:bg-purple-200/50 group-hover:scale-110 transition-all duration-300">
               <Package className="w-12 h-12 text-purple-500 group-hover:text-purple-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No modules yet</h3>
              <p className="text-slate-500 max-w-md">Create a module to organize your bot logic.</p>
            </div>
            <span className="text-purple-600 font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Start Building <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod: Module) => (
              <div 
                key={mod.id}
                onClick={() => navigate(`/builder/modules/${mod.id}`)}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={(e) => handleEdit(mod.id, e)}
                    className="p-2 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-600 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(mod.id, e)}
                    className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Package className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {mod.name}
                  </h3>
                  <div className="flex gap-2">
                     <span className="inline-block px-2 py-1 bg-slate-100 rounded-md text-xs font-mono text-slate-500">
                        {mod.commands?.length || 0} cmds
                     </span>
                     <span className="inline-block px-2 py-1 bg-slate-100 rounded-md text-xs font-mono text-slate-500">
                        {mod.events?.length || 0} events
                     </span>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {mod.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>{new Date(mod.updatedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 group-hover:text-purple-600 transition-colors">
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
