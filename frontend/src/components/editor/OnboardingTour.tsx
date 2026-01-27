import { useState, useEffect } from 'react'
import { HelpCircle, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    title: 'Welcome to Kyto! 👋',
    text: 'Building Discord bots has never been easier. Follow this 30-second tour to understand the essentials.',
    icon: Sparkles,
  },
  {
    title: 'The Block Library 📦',
    text: "Drag and drop triggers (like 'Slash Command') and actions (like 'Send Message') onto the canvas.",
    target: 'left-sidebar',
  },
  {
    title: 'Logic & Flow 🔗',
    text: 'Connect blocks by clicking and dragging handles. Execution flows from top to bottom.',
    target: 'canvas',
  },
  {
    title: 'Real-time Code 💻',
    text: "Switch to the 'Code' tab anytime to see the production-ready Discord.js code being generated.",
    target: 'view-switcher',
  },
]

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(-1)

  useEffect(() => {
    const hasSeen = localStorage.getItem('kyto-onboarding-done')
    if (!hasSeen) {
      setTimeout(() => setCurrentStep(0), 1000)
    }
  }, [])

  if (currentStep === -1) return null

  const step = STEPS[currentStep]
  if (!step) return null

  const Icon = step.icon || HelpCircle

  const handleFinish = () => {
    localStorage.setItem('kyto-onboarding-done', 'true')
    setCurrentStep(-1)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
      style={{ zIndex: 200 }}
    >
      <Card className="w-full max-w-sm border-2 border-slate-900 shadow-neo-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-6 text-white relative">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black">{step.title}</h3>
          <button
            onClick={handleFinish}
            className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <CardContent className="p-6">
          <p className="text-slate-600 font-medium leading-relaxed mb-6">{step.text}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === currentStep ? 'bg-indigo-600' : 'bg-slate-200'
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(s => s - 1)}>
                  Back
                </Button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <Button size="sm" onClick={() => setCurrentStep(s => s + 1)}>
                  Next Step
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleFinish}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  Got it! 🚀
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
