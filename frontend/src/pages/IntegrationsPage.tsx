import { ProjectLayout } from '@/components/layout/ProjectLayout'
import { motion } from 'framer-motion'
import { Server, ExternalLink, Link2, Webhook, Key, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const discordPortalUrl = 'https://discord.com/developers/applications'

const setupSteps = [
  {
    title: 'Create Application',
    description: 'Go to the Discord Developer Portal and create a new application.',
  },
  {
    title: 'Get Client ID',
    description: 'Copy the Application ID (Client ID) from the General Information tab.',
  },
  {
    title: 'Add Bot User',
    description: 'Go to the Bot tab and click "Add Bot" to generate a token.',
  },
  {
    title: 'Configure Intents',
    description: 'Enable Message Content and Server Members intents for full functionality.',
  },
]

const permissions = [
  { name: 'Administrator', value: 8 },
  { name: 'Manage Server', value: 32 },
  { name: 'Manage Roles', value: 268435456 },
  { name: 'Kick Members', value: 2 },
  { name: 'Ban Members', value: 4 },
  { name: 'Send Messages', value: 2048 },
  { name: 'Manage Messages', value: 8192 },
  { name: 'Read History', value: 65536 },
]

export default function IntegrationsPage() {
  const [activeSection, setActiveSection] = useState<'setup' | 'oauth' | 'webhooks'>('setup')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const togglePermission = (value: number) => {
    setSelectedPermissions(prev =>
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    )
  }

  const calculatePermissionInt = () => {
    return selectedPermissions.reduce((acc, curr) => acc | curr, 0)
  }

  const generateInviteUrl = () => {
    const clientId = 'YOUR_CLIENT_ID' // Placeholder
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${calculatePermissionInt()}&scope=bot%20applications.commands`
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(type)
    toast.success(`${type} copied to clipboard!`)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  return (
    <ProjectLayout>
      <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary label-text mx-auto text-xs font-bold uppercase tracking-wider">
              Deployment & Connectivity
            </div>
            <h1 className="heading-primary text-5xl font-black text-foreground">
              Discord Integration
            </h1>
            <p className="body-text text-base max-w-2xl mx-auto text-muted-foreground">
              Seamlessly link your workspace to the Discord Cloud using our professional integration
              suite.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <a
              href={discordPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 glass rounded-2xl flex flex-col gap-6 group shadow-sm hover:shadow-md border border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-primary/30">
                <Server className="w-7 h-7" />
              </div>
              <div>
                <h3 className="heading-tertiary text-xl font-bold">Developer Portal</h3>
                <p className="body-text text-sm mt-1 text-muted-foreground">
                  Create and manage your bot applications on Discord.
                </p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-all" />
            </a>

            <button
              onClick={() => setActiveSection('oauth')}
              className="p-8 glass rounded-2xl flex flex-col gap-6 group text-left shadow-sm hover:shadow-md border border-border/50 hover:border-secondary/50 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-secondary/30">
                <Link2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="heading-tertiary text-xl font-bold">Invite Generator</h3>
                <p className="body-text text-sm mt-1 text-muted-foreground">
                  Create a custom bot invite URL with permissions.
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveSection('webhooks')}
              className="p-8 glass rounded-2xl flex flex-col gap-6 group text-left shadow-sm hover:shadow-md border border-border/50 hover:border-yellow-500/50 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-yellow-500 text-white flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-yellow-500/30">
                <Webhook className="w-7 h-7" />
              </div>
              <div>
                <h3 className="heading-tertiary text-xl font-bold">Webhooks</h3>
                <p className="body-text text-sm mt-1 text-muted-foreground">
                  Send messages to channels without a bot token.
                </p>
              </div>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-muted/20 p-1 rounded-2xl border border-border/50 mb-12">
            {[
              { id: 'setup', label: 'Setup Guide' },
              { id: 'oauth', label: 'Invite Generator' },
              { id: 'webhooks', label: 'Webhooks' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={cn(
                  'flex-1 py-3 px-6 rounded-xl font-bold transition-all text-[13px] uppercase tracking-wider',
                  activeSection === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <div className="glass p-8 rounded-2xl border border-border/50 min-h-[400px]">
            {activeSection === 'setup' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Bot Setup Guide</h2>
                </div>

                <div className="grid gap-4">
                  {setupSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex gap-6 p-6 bg-muted/20 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                        <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={() => window.open(discordPortalUrl, '_blank')}
                  className="mt-8 h-12 px-8 flex items-center gap-2"
                >
                  Open Developer Portal <ExternalLink className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {activeSection === 'oauth' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <Link2 className="w-6 h-6 text-secondary" />
                  <h2 className="text-xl font-bold text-foreground">Invite Generator</h2>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Bot Client ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your Client ID"
                      className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none text-foreground"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Bot Permissions
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {permissions.map(perm => (
                        <button
                          key={perm.value}
                          onClick={() => togglePermission(perm.value)}
                          className={cn(
                            'p-4 text-[13px] font-bold rounded-xl border transition-all flex items-center gap-3',
                            selectedPermissions.includes(perm.value)
                              ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                              : 'bg-muted/10 border-border text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <div
                            className={cn(
                              'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                              selectedPermissions.includes(perm.value)
                                ? 'bg-background border-background'
                                : 'border-border'
                            )}
                          >
                            {selectedPermissions.includes(perm.value) && (
                              <Check className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          {perm.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Permission Int
                      </label>
                      <div className="px-6 py-3.5 bg-primary/5 rounded-xl font-mono text-2xl font-bold text-primary border border-primary/20">
                        {calculatePermissionInt()}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Invite URL
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={generateInviteUrl()}
                          readOnly
                          className="flex-1 px-6 py-3.5 bg-muted/20 border border-border rounded-xl font-mono text-sm overflow-hidden text-ellipsis text-foreground"
                        />
                        <button
                          onClick={() => copyToClipboard(generateInviteUrl(), 'URL')}
                          className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-sm shrink-0 active:scale-95"
                        >
                          {copiedItem === 'URL' ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'webhooks' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <Webhook className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-bold text-foreground">Discord Webhooks</h2>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                    <p className="text-yellow-600 dark:text-yellow-500 font-medium m-0 leading-relaxed text-[13px]">
                      Webhooks are a low-latency way to push messages directly to a Discord channel.
                      No bot login required.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-foreground">Quick Start</h3>
                      <ol className="space-y-4 text-muted-foreground font-medium text-[13px]">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border border-border shrink-0">
                            1
                          </div>
                          Right-click channel →{' '}
                          <span className="text-foreground">Edit Channel</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border border-border shrink-0">
                            2
                          </div>
                          Go to <span className="text-foreground">Integrations</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border border-border shrink-0">
                            3
                          </div>
                          Create <span className="text-primary">New Webhook</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-black border border-border shrink-0">
                            4
                          </div>
                          Copy the generated <span className="text-secondary">Webhook URL</span>
                        </li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-foreground">Implementation</h3>
                      <div className="bg-zinc-950 rounded-2xl p-6 border border-white/5 shadow-inner">
                        <code className="text-[12px] text-emerald-400 block whitespace-pre overflow-x-auto leading-relaxed font-mono">
                          {`// Send message via Fetch API
 fetch('YOUR_WEBHOOK_URL', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
     content: 'Hello from Kyto!',
     username: 'Kyton'
   })
 });`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </ProjectLayout>
  )
}
