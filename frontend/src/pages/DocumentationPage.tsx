import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronRight, Code, Zap, Puzzle, MessageSquare, Shield, Database, Settings, Play } from 'lucide-react'

interface DocSection {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  steps: { title: string; content: string; code?: string }[]
}

const TUTORIALS: Tutorial[] = [
  {
    id: 'first-bot',
    title: 'Create Your First Bot',
    description: 'Learn the basics of building a Discord bot with Kyto',
    difficulty: 'beginner',
    duration: '10 min',
    steps: [
      { 
        title: 'Add a Slash Command', 
        content: 'Drag a "Slash Command" block from the Triggers section onto the canvas. This will be the entry point for your bot command.',
      },
      { 
        title: 'Configure the Command', 
        content: 'Click on the block and set the command name to "ping" and description to "Check if bot is online".',
      },
      { 
        title: 'Add a Reply', 
        content: 'Drag a "Reply to Interaction" block and connect it to your command block.',
      },
      { 
        title: 'Set the Reply Message', 
        content: 'Click on the reply block and set the content to "🏓 Pong! Bot is alive!"',
      },
      { 
        title: 'Export Your Bot', 
        content: 'Click the Export button to generate Discord.js or Discord.py code.',
        code: `// Generated from your visual flow
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong! Bot is alive!');
  }
});`
      },
    ],
  },
  {
    id: 'moderation-bot',
    title: 'Build a Moderation Bot',
    description: 'Create kick, ban, and timeout commands with permission checks',
    difficulty: 'intermediate',
    duration: '20 min',
    steps: [
      { 
        title: 'Create the Kick Command', 
        content: 'Add a Slash Command block with name "kick" and add a user option.',
      },
      { 
        title: 'Add Permission Check', 
        content: 'Connect a "Check Permissions" block to verify the user has KICK_MEMBERS permission.',
      },
      { 
        title: 'Add Branching Logic', 
        content: 'The permission check has two outputs: "true" for allowed and "false" for denied. Connect appropriate responses to each.',
      },
      { 
        title: 'Perform the Kick', 
        content: 'On the "true" path, add a "Kick Member" action block targeting the selected user.',
      },
      { 
        title: 'Send Confirmation', 
        content: 'Add reply blocks to confirm the action or show an error message.',
        code: `// Permission check pattern
if (!interaction.member.permissions.has('KICK_MEMBERS')) {
  return interaction.reply({ content: 'No permission!', ephemeral: true });
}
await member.kick(reason);
await interaction.reply('User kicked successfully!');`
      },
    ],
  },
  {
    id: 'welcome-system',
    title: 'Welcome New Members',
    description: 'Automatically greet users when they join your server',
    difficulty: 'beginner',
    duration: '8 min',
    steps: [
      { 
        title: 'Add Event Listener', 
        content: 'Drag a "Member Join" event listener to the canvas. This triggers when anyone joins.',
      },
      { 
        title: 'Send Welcome Message', 
        content: 'Connect a "Send Message" block and configure it to send to your welcome channel.',
      },
      { 
        title: 'Use Variables', 
        content: 'Use {member.mention} to ping the new user and {server.name} for the server name.',
      },
      { 
        title: 'Optional: Add Auto-Role', 
        content: 'Connect an "Add Role" block to automatically give new members a role.',
      },
    ],
  },
  {
    id: 'embed-messages',
    title: 'Rich Embed Messages',
    description: 'Create beautiful embedded messages with colors and fields',
    difficulty: 'beginner',
    duration: '5 min',
    steps: [
      { 
        title: 'Add Send Embed Block', 
        content: 'After your trigger, add a "Send Embed" block.',
      },
      { 
        title: 'Customize Appearance', 
        content: 'Set title, description, color (hex code), and add fields for organized info.',
      },
      { 
        title: 'Add Images', 
        content: 'Use thumbnail for small images or image for large ones. URLs must be direct links.',
      },
    ],
  },
  {
    id: 'ai-assistant',
    title: 'Using the AI Assistant',
    description: 'Let AI help you build commands faster',
    difficulty: 'beginner',
    duration: '5 min',
    steps: [
      { 
        title: 'Open AI Helper', 
        content: 'Click the AI icon in the toolbar or press Ctrl+I to open the assistant.',
      },
      { 
        title: 'Describe What You Want', 
        content: 'Type something like "Create a kick command with permission checks" and the AI will suggest blocks.',
      },
      { 
        title: 'Apply Suggestions', 
        content: 'Click "Add to Canvas" to automatically add the suggested block flow.',
      },
    ],
  },
]

export function DocumentationPage() {
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [selectedSection, setSelectedSection] = useState<string>('getting-started')

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Play className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Welcome to Kyto!</h3>
          <p className="text-zinc-300">
            Kyto is a visual Discord bot builder that lets you create powerful bots without writing code.
            Simply drag and drop blocks, connect them together, and export your bot.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-zinc-800 rounded-lg border-2 border-zinc-700">
              <h4 className="font-bold mb-2">1. Design</h4>
              <p className="text-sm text-zinc-400">Use the visual canvas to design your bot logic</p>
            </div>
            <div className="p-4 bg-zinc-800 rounded-lg border-2 border-zinc-700">
              <h4 className="font-bold mb-2">2. Test</h4>
              <p className="text-sm text-zinc-400">Preview and validate your bot before exporting</p>
            </div>
            <div className="p-4 bg-zinc-800 rounded-lg border-2 border-zinc-700">
              <h4 className="font-bold mb-2">3. Export</h4>
              <p className="text-sm text-zinc-400">Generate Discord.js or Discord.py code</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'blocks',
      title: 'Block Types',
      icon: <Puzzle className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-[#5865F2] mb-2">Triggers</h4>
            <p className="text-sm text-zinc-400 mb-2">Entry points that start your bot logic</p>
            <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
              <li><strong>Slash Command</strong> - Modern Discord commands (/ping)</li>
              <li><strong>Event Listener</strong> - React to Discord events</li>
              <li><strong>Message Command</strong> - Prefix commands (!ping)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-emerald-500 mb-2">Actions</h4>
            <p className="text-sm text-zinc-400 mb-2">Things your bot can do</p>
            <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
              <li><strong>Reply</strong> - Send a response to the user</li>
              <li><strong>Send Message</strong> - Send to a specific channel</li>
              <li><strong>Send Embed</strong> - Rich formatted messages</li>
              <li><strong>Add/Remove Role</strong> - Manage user roles</li>
              <li><strong>Kick/Ban/Timeout</strong> - Moderation actions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-yellow-500 mb-2">Conditions</h4>
            <p className="text-sm text-zinc-400 mb-2">Control flow with logic</p>
            <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
              <li><strong>Check Permissions</strong> - Verify user permissions</li>
              <li><strong>If/Else</strong> - Branch based on conditions</li>
              <li><strong>Compare Values</strong> - Check equality</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'variables',
      title: 'Variables',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-zinc-300">
            Use variables to make your bot dynamic. Variables are wrapped in curly braces.
          </p>
          <div className="bg-zinc-800 p-4 rounded-lg font-mono text-sm">
            <div className="text-emerald-400">{'{user.mention}'}</div>
            <div className="text-emerald-400">{'{user.username}'}</div>
            <div className="text-emerald-400">{'{server.name}'}</div>
            <div className="text-emerald-400">{'{channel.name}'}</div>
            <div className="text-emerald-400">{'{message.content}'}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'permissions',
      title: 'Permissions',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-zinc-300">
            Always check permissions before performing moderation actions!
          </p>
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Common Permissions</h4>
            <ul className="text-sm text-zinc-300 space-y-1">
              <li>• KICK_MEMBERS - Kick users</li>
              <li>• BAN_MEMBERS - Ban users</li>
              <li>• MANAGE_MESSAGES - Delete messages</li>
              <li>• MANAGE_ROLES - Add/remove roles</li>
              <li>• ADMINISTRATOR - Full access</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'export',
      title: 'Exporting',
      icon: <Code className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-zinc-300">
            Export your bot as Discord.js (JavaScript) or Discord.py (Python) code.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h4 className="font-bold text-yellow-400 mb-2">Discord.js</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Node.js 18+</li>
                <li>• npm install</li>
                <li>• npm start</li>
              </ul>
            </div>
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h4 className="font-bold text-[#3776AB] mb-2">Discord.py</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Python 3.10+</li>
                <li>• pip install</li>
                <li>• python main.py</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const getDifficultyColor = (difficulty: Tutorial['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-500'
      case 'intermediate': return 'bg-yellow-500'
      case 'advanced': return 'bg-red-500'
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
              Documentation
            </h1>
            <p className="text-zinc-400">
              Learn how to build amazing Discord bots with Kyto
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-2">
                <h3 className="font-bold text-sm uppercase text-zinc-500 mb-4">Documentation</h3>
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                      selectedSection === section.id
                        ? 'bg-[#5865F2] text-white'
                        : 'hover:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Selected Section */}
              <div className="bg-zinc-900 border-4 border-black rounded-lg p-6 mb-8">
                {sections.find(s => s.id === selectedSection)?.content}
              </div>

              {/* Tutorials */}
              <h2 className="text-2xl font-bold mb-4">Tutorials</h2>
              <div className="space-y-4">
                {TUTORIALS.map((tutorial) => (
                  <motion.div
                    key={tutorial.id}
                    className="bg-zinc-900 border-4 border-black rounded-lg overflow-hidden"
                    layout
                  >
                    <button
                      onClick={() => {
                        setExpandedTutorial(expandedTutorial === tutorial.id ? null : tutorial.id)
                        setActiveStep(0)
                      }}
                      className="w-full p-4 flex items-center justify-between hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`px-2 py-1 text-xs font-bold uppercase rounded ${getDifficultyColor(tutorial.difficulty)}`}>
                          {tutorial.difficulty}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold">{tutorial.title}</h3>
                          <p className="text-sm text-zinc-400">{tutorial.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500">{tutorial.duration}</span>
                        {expandedTutorial === tutorial.id ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                    
                    {expandedTutorial === tutorial.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t-4 border-black"
                      >
                        <div className="p-4">
                          {/* Step Progress */}
                          <div className="flex gap-2 mb-6">
                            {tutorial.steps.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveStep(i)}
                                className={`flex-1 h-2 rounded-full transition-colors ${
                                  i <= activeStep ? 'bg-[#5865F2]' : 'bg-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                          
                          {/* Active Step */}
                          <div className="space-y-4">
                            <h4 className="font-bold text-lg">
                              Step {activeStep + 1}: {tutorial.steps[activeStep].title}
                            </h4>
                            <p className="text-zinc-300">{tutorial.steps[activeStep].content}</p>
                            
                            {tutorial.steps[activeStep].code && (
                              <pre className="bg-zinc-800 p-4 rounded-lg overflow-x-auto">
                                <code className="text-sm text-emerald-400">
                                  {tutorial.steps[activeStep].code}
                                </code>
                              </pre>
                            )}
                            
                            {/* Navigation */}
                            <div className="flex justify-between pt-4">
                              <button
                                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                                disabled={activeStep === 0}
                                className="px-4 py-2 bg-zinc-800 rounded-lg disabled:opacity-50"
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => setActiveStep(Math.min(tutorial.steps.length - 1, activeStep + 1))}
                                disabled={activeStep === tutorial.steps.length - 1}
                                className="px-4 py-2 bg-[#5865F2] rounded-lg disabled:opacity-50"
                              >
                                Next Step
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
