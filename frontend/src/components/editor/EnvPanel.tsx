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
    <div className="h-full bg-white flex flex-col font-sans overflow-y-auto">
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border-2 border-emerald-600 font-black text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Secure Vault
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Secrets & ENV</h2>
          <p className="text-xs font-medium text-slate-400 tracking-tight leading-relaxed">
            These variables are stored locally in your browser and injected during generation.
          </p>
        </div>

        <div className="space-y-6">
          {/* Token Input */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-900 flex items-center justify-between">
              <span>DISCORD_TOKEN</span>
              <button
                onClick={() => setShowToken(!showToken)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type={showToken ? 'text' : 'password'}
                value={settings.botToken}
                onChange={e => updateSettings({ botToken: e.target.value })}
                placeholder="MTA5OD..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-neo-sm"
              />
            </div>
          </div>

          {/* Client ID */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-900">CLIENT_ID</label>
            <div className="relative group">
              <Key className="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                value={settings.clientId}
                onChange={e => updateSettings({ clientId: e.target.value })}
                placeholder="11029384756"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-neo-sm"
              />
            </div>
          </div>

          {/* Prefix */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-900">BOT_PREFIX</label>
            <input
              type="text"
              value={settings.prefix}
              onChange={e => updateSettings({ prefix: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-black focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-neo-sm"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-black text-slate-900 uppercase">Security Note</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
            Never share your code with the token visible. Always use these environment variables.
          </p>
        </div>

        <Button onClick={handleSave} className="w-full h-12 text-lg shadow-neo">
          Save Variables
        </Button>
      </div>
    </div>
  )
}
