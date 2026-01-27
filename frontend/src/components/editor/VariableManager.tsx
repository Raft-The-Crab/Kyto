import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

export function VariableManager() {
  const { variables, createVariable, deleteVariable } = useProjectStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newVar, setNewVar] = useState<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'secret'
    value: string
  }>({
    name: '',
    type: 'string',
    value: '',
  })

  const handleAdd = () => {
    if (!newVar.name) return
    createVariable(newVar.name, newVar.type, newVar.value)
    setIsAdding(false)
    setNewVar({ name: '', type: 'string', value: '' })
  }

  return (
    <div className="h-full bg-white dark:bg-slate-950 flex flex-col transition-colors border-l border-slate-200 dark:border-slate-800">
      <div className="p-5 border-b-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Global Variables
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-neo-sm transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {isAdding && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-indigo-500 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-3">
              <input
                autoFocus
                type="text"
                placeholder="Variable Name"
                value={newVar.name}
                onChange={e => setNewVar(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold"
              />
              <div className="flex gap-2">
                <select
                  value={newVar.type}
                  onChange={e => setNewVar(prev => ({ ...prev, type: e.target.value as any }))}
                  className="px-3 py-2 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="secret">Secret</option>
                </select>
                <input
                  type="text"
                  placeholder="Default Value"
                  value={newVar.value}
                  onChange={e => setNewVar(prev => ({ ...prev, value: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newVar.name}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        )}

        {(variables || []).map(variable => (
          <div
            key={variable.id}
            className="group p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                  {variable.type}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{variable.name}</span>
              </div>
              <button
                onClick={() => deleteVariable(variable.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              {variable.type === 'secret' ? '••••••••' : variable.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
