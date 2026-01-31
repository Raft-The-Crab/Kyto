import { Toaster } from 'sonner'
import { TopBar } from './TopBar'

interface ProjectLayoutProps {
  children: React.ReactNode
}

export function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative font-sans text-foreground overflow-x-hidden selection:bg-primary/30">
      <Toaster richColors position="top-right" theme="dark" closeButton />

      {/* Structural Industrial Grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only absolute left-4 top-6 bg-background border border-border px-3 py-2 rounded-md shadow-sm z-50 text-xs font-bold"
      >
        Skip to main content
      </a>

      <TopBar />

      <main
        id="main"
        className="relative z-10 pt-20 animate-in fade-in slide-in-from-bottom-2 duration-700"
      >
        {children}
      </main>
    </div>
  )
}
