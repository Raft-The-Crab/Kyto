import { useState, useEffect, useRef } from 'react'
import { Bot, Send, Loader2, Wand2, MessageSquare, Undo, Redo, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'
import { useEditorStore } from '@/store/editorStore'
import { AdvancedAI, StoreActions } from '@/engine/advancedAI'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  suggestions?: any[]
  actions?: string[]
}

export function AIHelper() {
  const [isOpen, setIsOpen] = useState(false)
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

  const ai = new AdvancedAI()

  const storeActions: StoreActions = {
    addBlock: (type, position, _properties) => addBlock(type, position),
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

        // Handle pending action
        if (response.pendingAction) {
          toast.info(
            `AI suggests: ${response.pendingAction.description}. Click "Execute" to apply.`,
            {
              action: {
                label: 'Execute',
                onClick: () => {
                  response.pendingAction!.action()
                  ai.executePendingAction(response.pendingAction!.id)
                  toast.success('Action executed!')
                },
              },
            }
          )
        }
      }, 800) // Simulate typing delay
    } catch (error) {
      setIsTyping(false)
      toast.error('Failed to get AI response')
    }
  }

  const handleApplySuggestion = (suggestion: any) => {
    if (suggestion.blocks && suggestion.blocks.length > 0) {
      suggestion.blocks.forEach((block: any) => {
        addBlock(block.type, block.position)
      })
      toast.success(`Applied: ${suggestion.title}`)
    }
  }

  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      build_moderation: 'Build a moderation system',
      build_welcome: 'Create a welcome bot',
      add_slash_command: 'Add a slash command',
      explain_commands: 'Explain how commands work',
      list_events: 'Show me available events',
    }

    const message = quickMessages[action] || action
    setInput(message)
    handleSend()
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="[w-[450px] [h-[600px] border-3 border-black dark:border-white shadow-neo-lg rounded-xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-4 border-b-3 border-black dark:border-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-black border-2 border-black dark:border-white rounded-lg flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-black dark:text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tighter">AI Assistant</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                        Online
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                    title="Undo"
                  >
                    <Undo className="w-4 h-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                    title="Redo"
                  >
                    <Redo className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-zinc-950">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 border-3 border-black dark:border-white rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-tight mb-2 text-slate-900 dark:text-white">
                      Start a Conversation
                    </p>
                    <p className="text-xs text-black/50 dark:text-white/50 mb-4 font-bold">
                      Ask me anything about building Discord bots!
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-xs mx-auto">
                      {['How do I start?', 'Build moderation bot', 'Explain slash commands'].map(
                        q => (
                          <button
                            key={q}
                            onClick={() => {
                              setInput(q)
                              setTimeout(handleSend, 100)
                            }}
                            className="px-3 py-1 bg-muted/20 border-2 border-black dark:border-white rounded-none text-[10px] font-black uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {q}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/20 border-2 border-black dark:border-white'} p-3 rounded-none`}
                    >
                      <p className="text-xs font-bold leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </p>

                      {/* Suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.suggestions.map((sug: any) => (
                            <div
                              key={sug.id}
                              className="bg-white dark:bg-black border-2 border-black dark:border-white rounded-none p-2"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="text-[10px] font-black uppercase">{sug.title}</h4>
                                  <p className="text-[9px] opacity-70">{sug.description}</p>
                                </div>
                                <Badge variant="default">{Math.round(sug.confidence * 100)}%</Badge>
                              </div>
                              {sug.blocks && sug.blocks.length > 0 && (
                                <Button
                                  onClick={() => handleApplySuggestion(sug)}
                                  size="sm"
                                  variant="neo"
                                  className="w-full mt-1"
                                >
                                  <Wand2 className="w-3 h-3 mr-1" />
                                  Apply
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick Actions */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {msg.actions.map((action: string) => (
                            <button
                              key={action}
                              onClick={() => handleQuickAction(action)}
                              className="px-2 py-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-[9px] font-bold uppercase hover:bg-accent/10 hover:border-accent hover:text-accent transition-colors shadow-sm"
                            >
                              {action.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted/20 border-2 border-black/10 dark:border-white/10 p-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse delay-100" />
                        <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {/* Input */}
              <div className="p-4 border-t-2 border-black/10 dark:border-white/10 bg-slate-50 dark:bg-black/20 shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="shrink-0 rounded-lg shadow-sm"
                  >
                    {isTyping ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="shadow-xl relative rounded-xl pr-6 bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-slate-900 dark:border-white/20"
            >
              <Bot className="w-5 h-5 mr-2" />
              AI Assistant
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-white animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
