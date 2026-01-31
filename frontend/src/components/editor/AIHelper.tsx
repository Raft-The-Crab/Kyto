import { useState, useEffect, useRef } from 'react'
import { Bot, Send, MessageSquare, Undo, Redo, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { useEditorStore } from '@/store/editorStore'
import { AdvancedAI, StoreActions } from '@/engine/advancedAI'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  suggestions?: Array<{
    id: string
    title: string
    description: string
    blocks: Array<{ type: string; properties: Record<string, unknown> }>
  }>
  actions?: string[]
}

interface AIHelperProps {
  isSidebar?: boolean
}

export function AIHelper({ isSidebar = false }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(isSidebar)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    blocks,
    connections,
    addBlock,
    removeBlock,
    updateBlock,
    addConnection,
    removeConnection,
    clearCanvas,
    duplicateBlock,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorStore()

  const aiRef = useRef<AdvancedAI>(new AdvancedAI())
  const ai = aiRef.current

  useEffect(() => {
    ai.loadModel()
  }, [ai])

  const storeActions: StoreActions = {
    addBlock: (type, position, initialProperties) =>
      addBlock(type as any, position, initialProperties),
    removeBlock,
    updateBlock,
    addConnection,
    removeConnection,
    clearCanvas,
    duplicateBlock,
    undo,
    redo,
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await ai.generateResponse(input, blocks, connections, storeActions)

      setTimeout(() => {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
          suggestions: response.suggestions || [],
          actions: response.quickActions || [],
        }

        setMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)

        if (response.pendingAction) {
          toast.info(
            `AI suggests: ${response.pendingAction.description}. Click "Execute" to apply.`,
            {
              action: {
                label: 'Execute',
                onClick: () => {
                  if (response.pendingAction?.blocks) {
                    response.pendingAction.blocks.forEach((block: any, index: number) => {
                      // @ts-ignore
                      addBlock(
                        block.type,
                        {
                          x: 200 + (block.offset?.x ?? index * 220),
                          y: 200 + (block.offset?.y ?? 0),
                        },
                        block.properties
                      )
                    })
                  }
                  response.pendingAction!.action()
                  ai.executePendingAction(response.pendingAction!.id)
                  toast.success('Orchestration complete!')
                },
              },
            }
          )
        }
      }, 800)
    } catch (error) {
      setIsTyping(false)
      toast.error('Failed to get AI response')
    }
  }

  const handleApplySuggestion = (suggestion: Record<string, any>) => {
    if (suggestion.blocks && suggestion.blocks.length > 0) {
      suggestion.blocks.forEach((block: { type: string; properties: Record<string, unknown> }) => {
        addBlock(block.type as any, { x: 100, y: 100 }, block.properties)
      })
      toast.success(`Applied: ${suggestion.title}`)
    }
  }

  // const handleQuickAction = (action: string) => {
  //   const quickMessages: Record<string, string> = {
  //     build_moderation: 'Build a moderation system',
  //     build_welcome: 'Create a welcome bot',
  //     add_slash_command: 'Add a slash command',
  //   }
  //   const message = quickMessages[action] || action
  //   setInput(message)
  //   handleSend()
  // }

  return (
    <div className="fixed bottom-12 right-12 z-100">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ scale: 0.9, opacity: 0, y: 50, filter: 'blur(10px)' }}
            className="w-[480px] h-[680px] glass-premium shadow-[0_32px_128px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden border-white/5 rounded-[48px] backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[inset_0_4px_12px_rgba(16,185,129,0.1)]">
                  <Bot className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200 tracking-tight">Kyto AI</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Neural Engine Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-all disabled:opacity-20"
                >
                  <Undo className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-all disabled:opacity-20"
                >
                  <Redo className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-all ml-2"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-24 h-24 mb-10 bg-white/2 border border-white/5 rounded-[40px] flex items-center justify-center shadow-inner group">
                    <MessageSquare className="w-10 h-10 text-emerald-400/40 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Workspace Intelligence</h4>
                  <p className="text-sm text-slate-500 max-w-[280px] leading-relaxed">
                    I can orchestrate logic blocks, optimize execution traces, and build complex bot
                    systems from natural language.
                  </p>
                </div>
              )}

              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={cn(
                      'max-w-[85%] p-6 rounded-[32px] shadow-2xl transition-all',
                      msg.role === 'user'
                        ? 'bg-emerald-500 text-black font-bold rounded-tr-none'
                        : 'bg-white/3 border border-white/5 text-slate-200 rounded-tl-none'
                    )}
                  >
                    <p className="text-[13px] leading-relaxed">{msg.content}</p>

                    {msg.suggestions?.map((sug: any) => (
                      <div
                        key={sug.id}
                        className="mt-6 p-5 bg-black/40 border border-white/5 rounded-2xl"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                              {sug.title}
                            </h5>
                            <p className="text-[10px] text-slate-500 mt-1">{sug.description}</p>
                          </div>
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                            MATCH
                          </span>
                        </div>
                        <Button
                          onClick={() => handleApplySuggestion(sug)}
                          className="w-full bg-white/5 hover:bg-white/10 border-white/5 text-white text-[10px] font-bold h-10 rounded-xl"
                        >
                          Execute Orchestration
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/3 border border-white/5 p-4 rounded-2xl flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-8 border-t border-white/5 bg-white/1">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Request bot orchestration..."
                  className="w-full bg-black/60 border border-white/5 rounded-3xl pl-7 pr-16 py-5 text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-700 font-medium"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-emerald hover:bg-emerald-400 transition-all active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-5 bg-black border border-white/5 pl-6 pr-8 py-5 rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-emerald-500/5 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-inner scale-110">
              <Bot className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="relative text-left">
              <p className="text-[13px] font-bold text-white tracking-tight">AI Orchestrator</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-emerald" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Kyto Neural Online
                </span>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
