import { create } from 'zustand'

export interface Variable {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean'
  defaultValue: any
}

interface VariablesState {
  variables: Variable[]
  addVariable: (variable: Variable) => void
  removeVariable: (id: string) => void
  updateVariable: (id: string, updates: Partial<Variable>) => void
}

export const useVariablesStore = create<VariablesState>((set) => ({
  variables: [
    { id: '1', name: 'userPoints', type: 'number', defaultValue: 0 },
    { id: '2', name: 'welcomeMessage', type: 'string', defaultValue: 'Hello!' },
  ],
  addVariable: (v) => set((state) => ({ variables: [...state.variables, v] })),
  removeVariable: (id) => set((state) => ({ variables: state.variables.filter((v) => v.id !== id) })),
  updateVariable: (id, updates) =>
    set((state) => ({
      variables: state.variables.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    })),
}))
