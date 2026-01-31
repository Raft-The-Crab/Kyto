import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProjectStore } from '@/store/projectStore'
import { GlobalVariable as Variable } from '@/types'

export function VariablesPanel() {
  const { variables, createVariable, deleteVariable } = useProjectStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newVarName, setNewVarName] = useState('')
  const [newVarType, setNewVarType] = useState<Variable['type']>('string')

  const handleCreate = () => {
    if (!newVarName) return
    createVariable(
      newVarName,
      newVarType as 'string' | 'number' | 'boolean' | 'secret',
      newVarType === 'number' ? '0' : newVarType === 'boolean' ? 'false' : ''
    )
    setIsCreating(false)
    setNewVarName('')
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
          onClick={() => setIsCreating(true)}
          className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-glow transition-all active:scale-90 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/5 dark:bg-zinc-950/20">
        <AnimatePresence>
          {isCreating && (
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
                  placeholder="name_of_variable"
                  value={newVarName}
                  onChange={e => setNewVarName(e.target.value)}
                  className="soft-input px-4 py-2.5 text-xs h-10"
                />
                <select
                  value={newVarType}
                  onChange={e => setNewVarType(e.target.value as any)}
                  className="soft-input px-4 py-2.5 text-[10px] h-10 w-full appearance-none cursor-pointer"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreate}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-10 text-[11px] font-bold shadow-glow-emerald active:scale-95 transition-all"
                  >
                    Commit
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 p-0 rounded-xl hover:bg-white/5"
                    onClick={() => setIsCreating(false)}
                  >
                    <X className="w-4.5 h-4.5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {variables.map(variable => (
          <div
            key={variable.id}
            className="group p-5 matte-dark border border-divider rounded-2xl hover:border-indigo-500/30 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="heading-tertiary text-[13px] tracking-tight">{variable.name}</p>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 opacity-60">
                  {variable.type}
                </span>
              </div>
              <button
                onClick={() => deleteVariable(variable.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-all active:scale-90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {variables.length === 0 && !isCreating && (
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
