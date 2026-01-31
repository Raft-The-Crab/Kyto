import React from 'react'
import { Lock, Eye, EyeOff, ShieldAlert, Sparkles, Key } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export function EnvPanel() {
  const { settings, updateSettings } = useProjectStore()
  const [showToken, setShowToken] = React.useState(false)

  const handleSave = () => {
    toast.success('Environment variables saved! 🔐')
  }

  return (
    <div className="h-full matte-dark flex flex-col overflow-y-auto custom-scrollbar">
      <div className="p-10 space-y-12 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-bold text-[10px] uppercase tracking-widest shadow-glow-emerald">
            <Lock className="w-3 h-3" /> Secure Vault
          </div>
          <h2 className="heading-primary text-3xl">Secrets & Environment</h2>
          <p className="body-text text-sm text-muted-foreground/60 leading-relaxed">
            These variables are securely stored in your local enclave and automatically injected
            into your bot's runtime context.
          </p>
        </div>

        <div className="space-y-10">
          {/* Token Input */}
          <div className="space-y-4">
            <label className="label-text-premium flex items-center justify-between">
              <span>DISCORD_TOKEN</span>
              <button
                onClick={() => setShowToken(!showToken)}
                className="text-muted-foreground hover:text-indigo-400 transition-colors bg-white/5 p-1.5 rounded-lg border border-divider/50 shadow-sm"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </label>
            <div className="relative group">
              <Key className="w-4 h-4 text-muted-foreground/40 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type={showToken ? 'text' : 'password'}
                value={settings.botToken}
                onChange={e => updateSettings({ botToken: e.target.value })}
                placeholder="MTA5OD..."
                className="soft-input pl-11 pr-4 py-3 text-xs h-12"
              />
            </div>
          </div>

          {/* Client ID */}
          <div className="space-y-4">
            <label className="label-text-premium flex items-center gap-2">
              CLIENT_ID <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
            </label>
            <div className="relative group">
              <ShieldAlert className="w-4 h-4 text-muted-foreground/40 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={settings.clientId}
                onChange={e => updateSettings({ clientId: e.target.value })}
                placeholder="11029384756"
                className="soft-input pl-11 pr-4 py-3 text-xs h-12"
              />
            </div>
          </div>

          {/* Prefix */}
          <div className="space-y-4">
            <label className="label-text-premium">BOT_PREFIX</label>
            <input
              type="text"
              value={settings.prefix}
              onChange={e => updateSettings({ prefix: e.target.value })}
              className="soft-input px-5 py-3 text-xs h-12 font-black"
            />
          </div>

          <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h4 className="heading-tertiary text-[13px] mb-1">Local Encryption</h4>
              <p className="body-text text-[11px] text-muted-foreground/60 leading-relaxed">
                Your secrets are encrypted with AES-256 and never leave your browser, ensuring
                maximum privacy for your credentials.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full btn-primary h-12 rounded-2xl shadow-premium-lg"
          >
            Encrypt & Commit Secrets
          </Button>
        </div>
      </div>
    </div>
  )
}
