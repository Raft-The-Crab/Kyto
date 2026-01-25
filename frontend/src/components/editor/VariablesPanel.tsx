import { useState } from 'react'
import { Plus, Trash2, Check, X, Variable as VariableIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useVariablesStore, Variable } from '@/store/variablesStore'
import { Card, CardContent } from '@/components/ui/Card'

export function VariablesPanel() {
  const { variables, addVariable, removeVariable } = useVariablesStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newVarName, setNewVarName] = useState('')
  const [newVarType, setNewVarType] = useState<Variable['type']>('string')

  const handleCreate = () => {
    if (!newVarName) return
    addVariable({
      id: crypto.randomUUID(),
      name: newVarName,
      type: newVarType,
      defaultValue: newVarType === 'number' ? 0 : newVarType === 'boolean' ? false : '',
    })
    setIsCreating(false)
    setNewVarName('')
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l-2 border-slate-900 dark:border-white">
      <div className="p-4 border-b-2 border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
        <h3 className="font-black text-lg flex items-center gap-2 text-slate-900 dark:text-white">
          <VariableIcon className="w-5 h-5 text-indigo-500" /> Variables
        </h3>
        <Button size="sm" onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isCreating && (
          <Card className="animate-in slide-in-from-top-2">
            <CardContent className="p-3 space-y-2">
              <Input
                placeholder="Variable Name"
                value={newVarName}
                onChange={e => setNewVarName(e.target.value)}
                autoFocus
              />
              <select
                className="w-full p-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-transparent text-sm font-bold outline-none focus:border-indigo-500"
                value={newVarType}
                onChange={e => setNewVarType(e.target.value as Variable['type'])}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleCreate}
                >
                  <Check className="w-4 h-4" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreating(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {variables.map(variable => (
          <div
            key={variable.id}
            className="group flex items-center justify-between p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-800 transition-all hover:shadow-neo-sm"
          >
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{variable.name}</p>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded uppercase">
                {variable.type}
              </span>
            </div>
            <button
              onClick={() => removeVariable(variable.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {variables.length === 0 && !isCreating && (
          <div className="text-center py-10 text-slate-400">
            <p>No variables yet.</p>
            <p className="text-sm">Click + to add global state.</p>
          </div>
        )}
      </div>
    </div>
  )
}
