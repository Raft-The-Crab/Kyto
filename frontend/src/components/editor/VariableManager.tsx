import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div className="h-full matte-dark md:bg-black/20 flex flex-col transition-colors border-l border-divider/50">
      <div className="p-8 border-b border-divider bg-black/10 dark:bg-zinc-950/40 flex items-center justify-between shrink-0">
        <div>
          <h2 className="heading-tertiary text-lg">Variables</h2>
          <p className="label-text text-[10px] opacity-40 lowercase first-letter:uppercase mt-0.5">
            Manage shared values for this workspace.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-glow transition-all active:scale-90 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/5 dark:bg-zinc-950/20">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="p-5 matte-dark border border-indigo-500/30 rounded-[1.5rem] shadow-premium-lg"
            >
              <div className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Variable Name"
                  value={newVar.name}
                  onChange={e => setNewVar(prev => ({ ...prev, name: e.target.value }))}
                  className="soft-input px-4 py-2.5 text-xs h-10"
                />
                <div className="flex gap-2">
                  <select
                    value={newVar.type}
                    onChange={e => setNewVar(prev => ({ ...prev, type: e.target.value as any }))}
                    className="soft-input px-4 py-2.5 text-[10px] h-10 w-24 appearance-none text-center cursor-pointer"
                  >
                    <option value="string">STR</option>
                    <option value="number">NUM</option>
                    <option value="boolean">BOOL</option>
                    <option value="secret">SEC</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Default Value"
                    value={newVar.value}
                    onChange={e => setNewVar(prev => ({ ...prev, value: e.target.value }))}
                    className="flex-1 soft-input px-4 py-2.5 text-xs h-10"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-muted-foreground transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!newVar.name}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-[11px] shadow-glow-emerald disabled:opacity-20 transition-all active:scale-95"
                  >
                    Commit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(variables || []).map(variable => (
          <div
            key={variable.id}
            className="group p-5 matte-dark border border-divider rounded-2xl hover:border-indigo-500/30 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-divider/50 px-2 py-0.5 rounded-lg text-indigo-400">
                  {variable.type}
                </span>
                <span className="heading-tertiary text-[13px]">{variable.name}</span>
              </div>
              <button
                onClick={() => deleteVariable(variable.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-all active:scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[11px] font-mono body-text opacity-60 bg-black/20 dark:bg-black/40 p-3 rounded-xl border border-divider/30 truncate">
              {variable.type === 'secret' ? '••••••••' : variable.value}
            </div>
          </div>
        ))}

        {variables.length === 0 && !isAdding && (
          <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
            <div className="p-4 rounded-3xl bg-white/5 border border-divider">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="label-text-premium text-[11px]">No variables defined yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
