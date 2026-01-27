import { useState, useEffect } from 'react'
import { X, Check, ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditorStore } from '@/store/editorStore'

interface TutorialStep {
  id: string
  title: string
  description: string
  action: string
  highlight?: string
  checkCondition: (state: any) => boolean
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Kyto!',
    description: "Let's build your first Discord bot together. I'll guide you through each step.",
    action: 'Click Next to start',
    checkCondition: () => true,
  },
  {
    id: 'add_command',
    title: 'Add a Slash Command',
    description:
      'Every bot needs a way for users to interact with it. Open the Library panel on the left and drag a "Slash Command" block onto the canvas.',
    action: 'Add a Slash Command block',
    highlight: 'library',
    checkCondition: state => state.blocks.some((b: any) => b.type === 'command_slash'),
  },
  {
    id: 'add_reply',
    title: 'Add a Reply Action',
    description:
      'Great! Now your command needs to do something. Find the "Reply" block in the Library and add it to the canvas.',
    action: 'Add a Reply block',
    highlight: 'library',
    checkCondition: state => state.blocks.some((b: any) => b.type === 'action_reply'),
  },
  {
    id: 'connect_blocks',
    title: 'Connect the Blocks',
    description:
      'Click and drag from the bottom circle of the Slash Command to the top circle of the Reply block to connect them.',
    action: 'Connect the blocks',
    highlight: 'canvas',
    checkCondition: state => state.connections.length > 0,
  },
  {
    id: 'configure_command',
    title: 'Configure Your Command',
    description:
      'Click on the Slash Command block to open the Inspector panel. Give your command a name like "ping" or "hello".',
    action: 'Name your command',
    highlight: 'inspector',
    checkCondition: state => {
      const cmd = state.blocks.find((b: any) => b.type === 'command_slash')
      return cmd?.data?.properties?.name && cmd.data.properties.name.length > 0
    },
  },
  {
    id: 'test_bot',
    title: 'Test Your Bot!',
    description:
      'Amazing! You\'ve built your first Discord bot. Click the "Export" button in the top bar to download your bot code.',
    action: 'Export your bot',
    highlight: 'export',
    checkCondition: () => true,
  },
  {
    id: 'complete',
    title: '🎉 Tutorial Complete!',
    description:
      "You've mastered the basics! Now you can build any Discord bot you imagine. Need help? Click the AI Assistant button anytime.",
    action: 'Start building!',
    checkCondition: () => true,
  },
]

export function OnboardingTutorial() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const { blocks, connections } = useEditorStore()

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('kyto_tutorial_completed')
    if (!hasSeenTutorial) {
      setIsActive(true)
    }
  }, [])

  useEffect(() => {
    if (!isActive || isCompleted) return

    const step = tutorialSteps[currentStep]
    if (step && step.checkCondition({ blocks, connections })) {
      // Auto-advance if condition is met (except first and last steps)
      if (currentStep > 0 && currentStep < tutorialSteps.length - 1) {
        const timer = setTimeout(() => {
          handleNext()
        }, 1500)
        return () => clearTimeout(timer)
      }
    }
    return undefined
  }, [blocks, connections, currentStep, isActive, isCompleted])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    localStorage.setItem('kyto_tutorial_completed', 'true')
    setTimeout(() => {
      setIsActive(false)
    }, 2000)
  }

  const handleSkip = () => {
    localStorage.setItem('kyto_tutorial_completed', 'true')
    setIsActive(false)
  }

  if (!isActive) return null

  const step = tutorialSteps[currentStep]
  if (!step) return null
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-lg"
        >
          <Card className="border-4 border-black dark:border-white shadow-neo-lg rounded-none overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 bg-muted/20 relative">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Header */}
            <div className="p-6 border-b-4 border-black dark:border-white bg-primary text-primary-foreground">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="p-2 hover:bg-white/20 rounded-none transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{step.title}</h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-sm font-bold leading-relaxed">{step.description}</p>

              {currentStep > 0 && currentStep < tutorialSteps.length - 1 && (
                <div className="bg-accent/10 border-4 border-accent/20 rounded-none p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-xs font-black uppercase tracking-wider text-accent">
                      Your Task
                    </span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-tight">{step.action}</p>
                </div>
              )}

              {isCompleted && currentStep === tutorialSteps.length - 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 p-4 bg-secondary/10 border-4 border-secondary rounded-none"
                >
                  <Check className="w-8 h-8 text-secondary" />
                  <span className="text-lg font-black uppercase tracking-tight text-secondary">
                    Tutorial Complete!
                  </span>
                </motion.div>
              )}

              <div className="flex gap-3">
                {currentStep > 0 && currentStep < tutorialSteps.length - 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button onClick={handleNext} className="flex-1">
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Finish
                    </>
                  ) : (
                    <>
                      {step.checkCondition({ blocks, connections }) ? 'Continue' : 'Skip'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <button
                onClick={handleSkip}
                className="w-full text-xs font-black uppercase tracking-wider text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                Skip Tutorial
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
