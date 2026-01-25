import { useState } from 'react'
import { Sparkles, X, Loader2, Bot, Wand2, Lightbulb, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'
import { useEditorStore } from '@/store/editorStore'
import { apiClient } from '@/services/api'

interface Suggestion {
  id: string
  title: string
  description: string
  category: string
  blocks?: any[]
  confidence: number
}

export function AIHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { blocks, connections, addBlock } = useEditorStore()

  const handleGetSuggestions = async () => {
    setIsLoading(true)

    const response = await apiClient.getAISuggestions(
      { blocks, connections },
      'Analyze my bot logic'
    )

    if (response.data?.suggestions) {
      setSuggestions(response.data.suggestions)
      if (response.data.suggestions.length === 0) {
        toast.info('Your bot looks good! No immediate suggestions.')
      }
    } else {
      toast.error('Failed to analyze bot')
    }

    setIsLoading(false)
  }

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (suggestion.blocks && suggestion.blocks.length > 0) {
      suggestion.blocks.forEach((block: any) => {
        addBlock(block.type, block.position)
      })
      toast.success(`Applied: ${suggestion.title}`)
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
    } else {
      toast.info(suggestion.description)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'error_handling':
        return 'destructive'
      case 'optimization':
        return 'accent'
      case 'best_practice':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <Card className="w-[420px] border-4 border-black dark:border-white shadow-neo-lg rounded-none overflow-hidden dark:bg-black animate-in zoom-in-95 duration-200">
          <div className="p-5 border-b-4 border-black dark:border-white bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-black border-2 border-black dark:border-white rounded-none flex items-center justify-center">
                <Bot className="w-5 h-5 text-black dark:text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tighter">AI Assistant</h3>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-70">
                  Rule-Based Analysis
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-none transition-colors border-2 border-transparent hover:border-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <CardContent className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {suggestions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 border-4 border-black dark:border-white rounded-none flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-black/40 dark:text-white/40" />
                </div>
                <p className="text-sm font-black uppercase tracking-tight mb-2">
                  No Suggestions Yet
                </p>
                <p className="text-xs text-black/50 dark:text-white/50 mb-4 font-bold uppercase tracking-wider">
                  Click analyze to get AI recommendations
                </p>
                <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Bot
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/60">
                    {suggestions.length} Suggestion{suggestions.length > 1 ? 's' : ''}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGetSuggestions}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Refresh</>}
                  </Button>
                </div>

                <div className="space-y-3">
                  {suggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white rounded-none p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-xs uppercase tracking-tight mb-1">
                            {suggestion.title}
                          </h4>
                          <p className="text-[10px] text-black/70 dark:text-white/70 leading-relaxed font-bold">
                            {suggestion.description}
                          </p>
                        </div>
                        <Badge variant={getCategoryColor(suggestion.category)}>
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                      </div>

                      {suggestion.blocks && suggestion.blocks.length > 0 && (
                        <Button
                          onClick={() => handleApplySuggestion(suggestion)}
                          size="sm"
                          variant="neo"
                          className="w-full"
                        >
                          <Wand2 className="w-3 h-3 mr-2" />
                          Apply to Canvas
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleGetSuggestions}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => {
            setIsOpen(true)
            if (suggestions.length === 0 && blocks.length > 0) {
              handleGetSuggestions()
            }
          }}
          size="lg"
          className="shadow-neo-lg"
        >
          <Bot className="w-5 h-5 mr-2" />
          AI Assistant
        </Button>
      )}
    </div>
  )
}
