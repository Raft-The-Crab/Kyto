import { motion } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink, Check, Copy, AlertCircle, Key, Link2, Server, Webhook } from 'lucide-react'

interface IntegrationStep {
  title: string
  description: string
  action?: () => void
}

export function IntegrationsPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'setup' | 'oauth' | 'webhooks'>('setup')

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(label)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const discordPortalUrl = 'https://discord.com/developers/applications'
  
  const setupSteps: IntegrationStep[] = [
    {
      title: 'Create Discord Application',
      description: 'Go to the Discord Developer Portal and click "New Application"',
    },
    {
      title: 'Create a Bot',
      description: 'Navigate to the "Bot" section and click "Add Bot"',
    },
    {
      title: 'Copy Bot Token',
      description: 'Click "Reset Token" and copy your bot token. Keep this secret!',
    },
    {
      title: 'Set Intents',
      description: 'Enable "Server Members Intent" and "Message Content Intent" if needed',
    },
    {
      title: 'Generate Invite URL',
      description: 'Go to OAuth2 → URL Generator, select "bot" and "applications.commands"',
    },
  ]

  const permissions = [
    { name: 'Send Messages', value: 2048 },
    { name: 'Manage Messages', value: 8192 },
    { name: 'Embed Links', value: 16384 },
    { name: 'Read Message History', value: 65536 },
    { name: 'Add Reactions', value: 64 },
    { name: 'Use Slash Commands', value: 2147483648 },
    { name: 'Kick Members', value: 2 },
    { name: 'Ban Members', value: 4 },
    { name: 'Manage Roles', value: 268435456 },
    { name: 'Moderate Members', value: 1099511627776 },
  ]

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([
    2048, 16384, 65536, 2147483648 // Basic permissions
  ])

  const togglePermission = (value: number) => {
    setSelectedPermissions(prev =>
      prev.includes(value)
        ? prev.filter(p => p !== value)
        : [...prev, value]
    )
  }

  const calculatePermissionInt = () => {
    return selectedPermissions.reduce((a, b) => a + b, 0)
  }

  const generateInviteUrl = (clientId: string = 'YOUR_CLIENT_ID') => {
    const perms = calculatePermissionInt()
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${perms}&scope=bot%20applications.commands`
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
              Discord Integration
            </h1>
            <p className="text-zinc-400">
              Set up your Discord bot and connect it to your server
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <a
              href={discordPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-[#5865F2] border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000] flex items-center gap-4"
            >
              <Server className="w-8 h-8" />
              <div>
                <h3 className="font-bold">Developer Portal</h3>
                <p className="text-sm opacity-80">Create & manage bots</p>
              </div>
              <ExternalLink className="w-5 h-5 ml-auto" />
            </a>
            
            <button
              onClick={() => setActiveSection('oauth')}
              className="p-6 bg-zinc-800 border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000] flex items-center gap-4 text-left"
            >
              <Link2 className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="font-bold">Generate Invite</h3>
                <p className="text-sm text-zinc-400">Create bot invite URL</p>
              </div>
            </button>
            
            <button
              onClick={() => setActiveSection('webhooks')}
              className="p-6 bg-zinc-800 border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000] flex items-center gap-4 text-left"
            >
              <Webhook className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="font-bold">Webhooks</h3>
                <p className="text-sm text-zinc-400">Send messages via webhook</p>
              </div>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'setup', label: 'Setup Guide' },
              { id: 'oauth', label: 'Invite Generator' },
              { id: 'webhooks', label: 'Webhooks' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-lg border-2 border-black font-bold transition-colors ${
                  activeSection === tab.id
                    ? 'bg-[#5865F2] text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Setup Guide Section */}
          {activeSection === 'setup' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-zinc-900 border-4 border-black rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Key className="w-6 h-6 text-[#5865F2]" />
                  Bot Setup Guide
                </h2>
                
                <div className="space-y-4">
                  {setupSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-zinc-800 rounded-lg border-2 border-zinc-700"
                    >
                      <div className="w-8 h-8 bg-[#5865F2] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold">{step.title}</h3>
                        <p className="text-sm text-zinc-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={discordPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white font-bold uppercase border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]"
                >
                  Open Developer Portal
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-500/10 border-4 border-yellow-500 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-500">Keep Your Token Secret!</h4>
                  <p className="text-sm text-zinc-300">
                    Never share your bot token publicly. If compromised, regenerate it immediately in the Developer Portal.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* OAuth Generator Section */}
          {activeSection === 'oauth' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900 border-4 border-black rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Link2 className="w-6 h-6 text-emerald-400" />
                Bot Invite URL Generator
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Bot Client ID</label>
                <input
                  type="text"
                  placeholder="Enter your Client ID from Developer Portal"
                  className="w-full px-4 py-3 bg-zinc-800 border-4 border-black rounded-lg focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Bot Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {permissions.map(perm => (
                    <button
                      key={perm.value}
                      onClick={() => togglePermission(perm.value)}
                      className={`p-2 text-sm rounded-lg border-2 transition-colors flex items-center gap-2 ${
                        selectedPermissions.includes(perm.value)
                          ? 'bg-[#5865F2] border-[#5865F2]'
                          : 'bg-zinc-800 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {selectedPermissions.includes(perm.value) && <Check className="w-4 h-4" />}
                      {perm.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Permission Integer</label>
                <div className="px-4 py-3 bg-zinc-800 border-4 border-black rounded-lg font-mono">
                  {calculatePermissionInt()}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Generated Invite URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generateInviteUrl()}
                    readOnly
                    className="flex-1 px-4 py-3 bg-zinc-800 border-4 border-black rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(generateInviteUrl(), 'url')}
                    className="px-4 py-3 bg-[#5865F2] border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform"
                  >
                    {copiedItem === 'url' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Webhooks Section */}
          {activeSection === 'webhooks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900 border-4 border-black rounded-lg p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Webhook className="w-6 h-6 text-yellow-400" />
                Discord Webhooks
              </h2>

              <p className="text-zinc-300 mb-6">
                Webhooks let you send messages to Discord channels without a bot. Perfect for notifications!
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-800 rounded-lg">
                  <h3 className="font-bold mb-2">Create a Webhook</h3>
                  <ol className="list-decimal list-inside text-sm text-zinc-400 space-y-1">
                    <li>Open Discord server settings</li>
                    <li>Go to Integrations → Webhooks</li>
                    <li>Click "New Webhook"</li>
                    <li>Copy the webhook URL</li>
                  </ol>
                </div>

                <div className="p-4 bg-zinc-800 rounded-lg">
                  <h3 className="font-bold mb-2">Example: Send a Message</h3>
                  <pre className="mt-2 bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-emerald-400">{`fetch('YOUR_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Hello from Kyto!',
    username: 'Kyto Bot',
  })
});`}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
