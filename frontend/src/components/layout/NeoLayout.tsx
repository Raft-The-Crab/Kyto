import { Toaster } from 'sonner'
import { TopBar } from './TopBar'
import { BackgroundOrbs } from './BackgroundOrbs'

interface NeoLayoutProps {
  children: React.ReactNode
}

export function NeoLayout({ children }: NeoLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08080c] relative font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-500">
      <Toaster richColors position="top-right" theme="system" closeButton />

      {/* Premium Background Elements */}
      <BackgroundOrbs />

      {/* Dynamic Grid Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-20 dark:opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <TopBar />

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 pb-20 px-6 max-w-[1400px] mx-auto min-h-screen animate-in fade-in duration-700">
        {children}
      </main>
    </div>
  )
}
