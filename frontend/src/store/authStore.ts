import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  login: (name: string, email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (name, email) => set({ isAuthenticated: true, user: { name, email } }),
  logout: () => set({ isAuthenticated: false, user: null }),
}))
