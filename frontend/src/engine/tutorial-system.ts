import { BlockType } from '@/types'

export interface TutorialStep {
  id: string
  title: string
  description: string
  targetElement?: string
  highlightElements?: string[]
  nextButtonText?: string
  blockType?: BlockType
  codeExample?: string
  action?: () => void
}

export interface Tutorial {
  id: string
  title: string
  description: string
  steps: TutorialStep[]
  category: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
}

export const KYTO_TUTORIALS: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Kyto',
    description: 'Learn the basics of creating your first Discord bot with Kyto',
    category: 'beginner',
    estimatedTime: 10,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Kyto',
        description:
          'Kyto is a visual Discord bot builder that lets you create bots with drag-and-drop blocks. No coding required!',
        nextButtonText: 'Start Learning',
      },
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        description:
          'This is your project dashboard where you can manage your bots, commands, and events.',
        targetElement: '#dashboard-nav',
        highlightElements: ['#commands-tab', '#events-tab', '#modules-tab'],
      },
      {
        id: 'create-command',
        title: 'Creating Your First Command',
        description:
          'Let\'s create a simple ping command. Click the "New Command" button to get started.',
        targetElement: '#new-command-btn',
        action: () => {
          // Simulate clicking the new command button
          console.log('Creating new command...')
        },
      },
      {
        id: 'command-builder-intro',
        title: 'Command Builder Interface',
        description:
          'This is the command builder. Here you can drag blocks to create your command logic.',
        targetElement: '#block-library',
        highlightElements: ['#canvas-area', '#properties-panel'],
      },
      {
        id: 'add-trigger',
        title: 'Adding a Trigger',
        description:
          'Every command starts with a trigger. Drag the "Slash Command" block to the canvas.',
        blockType: 'command_slash',
        codeExample: '/ping - Replies with Pong!',
      },
      {
        id: 'configure-command',
        title: 'Configure Your Command',
        description: 'Set the command name to "ping" and description to "Replies with Pong!"',
        targetElement: '#properties-panel',
        nextButtonText: 'Next',
      },
      {
        id: 'add-reply',
        title: 'Add a Reply',
        description: 'Drag the "Send Message" block and connect it to your command trigger.',
        blockType: 'action_reply',
        codeExample: 'await interaction.reply({ content: "Pong! 🏓" });',
      },
      {
        id: 'test-command',
        title: 'Test Your Command',
        description: 'Click the "Test" button to simulate your command execution.',
        targetElement: '#test-btn',
      },
      {
        id: 'export-command',
        title: 'Export Your Bot',
        description: 'Once satisfied, click "Export" to generate the actual Discord bot code.',
        targetElement: '#export-btn',
      },
      {
        id: 'congratulations',
        title: 'Congratulations!',
        description:
          "You've created your first Discord bot command! Continue exploring Kyto to build more complex bots.",
      },
    ],
  },
  {
    id: 'intermediate-features',
    title: 'Intermediate Kyto Features',
    description: 'Learn about more advanced features like events, modules, and error handling',
    category: 'intermediate',
    estimatedTime: 15,
    steps: [
      {
        id: 'events-intro',
        title: 'Understanding Events',
        description:
          'Events respond to Discord activities like member joins, message updates, etc.',
        nextButtonText: 'Continue',
      },
      {
        id: 'create-event',
        title: 'Creating an Event',
        description: 'Go to the Events tab and create a "Member Join" event.',
        blockType: 'event_member_join',
      },
      {
        id: 'welcome-message',
        title: 'Sending Welcome Messages',
        description: 'Create a welcome message for new members using the Send Message block.',
        blockType: 'action_reply',
        codeExample: 'await channel.send(`Welcome to the server, {user.mention}!`);',
      },
      {
        id: 'error-handling',
        title: 'Error Handling',
        description: 'Add error handling to prevent your bot from crashing.',
        blockType: 'error_handler',
      },
      {
        id: 'modules-intro',
        title: 'Introduction to Modules',
        description: 'Modules help organize related functionality into reusable components.',
        blockType: 'call_module',
      },
    ],
  },
  {
    id: 'advanced-patterns',
    title: 'Advanced Bot Patterns',
    description: 'Master complex bot architectures and advanced functionality',
    category: 'advanced',
    estimatedTime: 20,
    steps: [
      {
        id: 'complex-workflows',
        title: 'Complex Workflows',
        description: 'Learn to create complex workflows with conditions, loops, and variables.',
        blockType: 'if_condition',
      },
      {
        id: 'database-integration',
        title: 'Database Integration',
        description: 'Connect your bot to databases for persistent storage.',
        blockType: 'action_reply',
      },
      {
        id: 'external-apis',
        title: 'External API Integration',
        description: "Connect to external APIs to extend your bot's capabilities.",
        blockType: 'http_request',
      },
      {
        id: 'deployment',
        title: 'Deploying Your Bot',
        description: 'Learn how to deploy your bot to various hosting platforms.',
        nextButtonText: 'Complete Tutorial',
      },
    ],
  },
]

export class TutorialManager {
  private currentTutorial: Tutorial | null = null
  private currentStepIndex: number = 0
  private completedTutorials: Set<string> = new Set()
  private userProgress: Map<string, number> = new Map() // Maps tutorialId to last completed step

  constructor() {
    this.loadProgress()
  }

  /**
   * Start a tutorial
   */
  startTutorial(tutorialId: string): boolean {
    const tutorial = KYTO_TUTORIALS.find(t => t.id === tutorialId)
    if (!tutorial) {
      console.error(`Tutorial with id ${tutorialId} not found`)
      return false
    }

    this.currentTutorial = tutorial
    this.currentStepIndex = 0
    return true
  }

  /**
   * Get the current step in the active tutorial
   */
  getCurrentStep(): TutorialStep | null {
    if (!this.currentTutorial) return null
    return this.currentTutorial.steps[this.currentStepIndex] || null
  }

  /**
   * Move to the next step
   */
  nextStep(): boolean {
    if (!this.currentTutorial) return false

    const currentStep = this.getCurrentStep()
    if (currentStep?.action) {
      currentStep.action()
    }

    if (this.currentStepIndex < this.currentTutorial.steps.length - 1) {
      this.currentStepIndex++
      this.saveProgress()
      return true
    } else {
      // Tutorial completed
      this.markTutorialCompleted(this.currentTutorial.id)
      this.endTutorial()
      return false
    }
  }

  /**
   * Move to the previous step
   */
  prevStep(): boolean {
    if (!this.currentTutorial) return false

    if (this.currentStepIndex > 0) {
      this.currentStepIndex--
      this.saveProgress()
      return true
    }
    return false
  }

  /**
   * End the current tutorial
   */
  endTutorial() {
    this.currentTutorial = null
    this.currentStepIndex = 0
  }

  /**
   * Get all available tutorials
   */
  getTutorials(): Tutorial[] {
    return KYTO_TUTORIALS
  }

  /**
   * Get tutorials by category
   */
  getTutorialsByCategory(category: 'beginner' | 'intermediate' | 'advanced'): Tutorial[] {
    return KYTO_TUTORIALS.filter(t => t.category === category)
  }

  /**
   * Check if a tutorial is completed
   */
  isTutorialCompleted(tutorialId: string): boolean {
    return this.completedTutorials.has(tutorialId)
  }

  /**
   * Mark a tutorial as completed
   */
  markTutorialCompleted(tutorialId: string) {
    this.completedTutorials.add(tutorialId)
    this.userProgress.delete(tutorialId) // Clear progress when completed
    this.saveProgress()
  }

  /**
   * Get progress for a specific tutorial
   */
  getTutorialProgress(tutorialId: string): number {
    const tutorial = KYTO_TUTORIALS.find(t => t.id === tutorialId)
    if (!tutorial) return 0

    const savedProgress = this.userProgress.get(tutorialId) || 0
    return Math.min(savedProgress, tutorial.steps.length)
  }

  /**
   * Get overall progress percentage
   */
  getOverallProgress(): number {
    const totalTutorials = KYTO_TUTORIALS.length
    const completedCount = this.completedTutorials.size
    return totalTutorials > 0 ? Math.round((completedCount / totalTutorials) * 100) : 0
  }

  /**
   * Save user progress to localStorage
   */
  private saveProgress() {
    const progressData = {
      completed: Array.from(this.completedTutorials),
      inProgress: Array.from(this.userProgress.entries()),
      currentTutorial: this.currentTutorial?.id || null,
      currentStep: this.currentStepIndex,
    }

    localStorage.setItem('kyto-tutorial-progress', JSON.stringify(progressData))
  }

  /**
   * Load user progress from localStorage
   */
  private loadProgress() {
    try {
      const progressData = localStorage.getItem('kyto-tutorial-progress')
      if (progressData) {
        const parsed = JSON.parse(progressData)
        this.completedTutorials = new Set(parsed.completed || [])
        this.userProgress = new Map(parsed.inProgress || [])

        // Restore current tutorial if it was in progress
        if (parsed.currentTutorial) {
          const tutorial = KYTO_TUTORIALS.find(t => t.id === parsed.currentTutorial)
          if (tutorial) {
            this.currentTutorial = tutorial
            this.currentStepIndex = parsed.currentStep || 0
          }
        }
      }
    } catch (error) {
      console.error('Error loading tutorial progress:', error)
    }
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    this.completedTutorials.clear()
    this.userProgress.clear()
    this.currentTutorial = null
    this.currentStepIndex = 0
    localStorage.removeItem('kyto-tutorial-progress')
  }
}

// Singleton instance
export const tutorialManager = new TutorialManager()
