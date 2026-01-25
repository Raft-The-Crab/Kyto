import { useState } from 'react'
import { Sparkles, X, Loader2, Bot, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from 'sonner'
import { useEditorStore } from '@/store/editorStore'

export function AIHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addBlock } = useEditorStore()

  const handleGenerate = async () => {
    if (!prompt) return
    setIsLoading(true)

    // Simulate meaningful AI logic generation
    setTimeout(() => {
      const p = prompt.toLowerCase()

      if (p.includes('ping') || p.includes('pong')) {
        addBlock('command_slash', { x: 200, y: 100 })
        addBlock('action_reply', { x: 200, y: 250 })
        toast.success('Generated Discord Ping routine. 🤖')
      } else if (p.includes('kick') || p.includes('ban') || p.includes('mod')) {
        addBlock('command_slash', { x: 200, y: 100 })
        addBlock('if_condition', { x: 200, y: 250 })
        addBlock('action_kick', { x: 100, y: 450 })
        addBlock('action_reply', { x: 350, y: 450 })
        toast.success('Assembled Moderation Guard flow. 🛡️')
      } else if (p.includes('api') || p.includes('fetch') || p.includes('weather')) {
        addBlock('command_slash', { x: 200, y: 100 })
        addBlock('http_request', { x: 200, y: 250 })
        addBlock('send_embed', { x: 200, y: 400 })
        toast.success('Fetched Data Integration blocks. 🌐')
      } else {
        addBlock('command_slash', { x: 200, y: 100 })
        addBlock('action_reply', { x: 200, y: 250 })
        toast.info('Synthesized a generic starter logic chain.')
      }

      setIsLoading(false)
      setIsOpen(false)
      setPrompt('')
    }, 1200)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <Card className="w-[380px] border-2 border-slate-900 shadow-neo animate-in zoom-in-95 duration-200 rounded-3xl overflow-hidden dark:bg-slate-900">
          <div className="p-5 border-b-2 border-slate-900 bg-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">Assistant</h3>
                <p className="text-[8px] font-bold text-white/40 uppercase">
                  Logical sequence generator
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-2 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                Behavior Blueprint
              </label>
              <textarea
                className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-800 rounded-2xl resize-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300"
                placeholder="Describe a complex flow (e.g. 'Create a kick command that checks if user is admin then fetches a joke API...')"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>
            <Button
              className="w-full gap-3 h-14 text-sm font-black shadow-neo-sm border-2 border-slate-900"
              onClick={handleGenerate}
              disabled={isLoading || !prompt}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              GENERATE LOGIC
            </Button>
            <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Standard AI assistance active
            </p>
          </CardContent>
        </Card>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 border-2 border-slate-900 text-white shadow-neo hover:-translate-y-1 transition-all active:translate-y-0"
        >
          <Sparkles className="h-7 w-7" />
          <div className="absolute -top-12 right-0 hidden group-hover:block bg-slate-900 text-white text-[10px] font-black py-2 px-4 rounded-xl border-2 border-slate-900 shadow-sm whitespace-nowrap">
            OPEN ASSISTANT
          </div>
        </button>
      )}
    </div>
  )
}
