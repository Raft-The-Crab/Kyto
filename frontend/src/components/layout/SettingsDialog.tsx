import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { User, Key, Palette, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { useTheme } from '@/components/providers/ThemeProvider'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { setTheme, theme } = useTheme()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-slate-950">
        <DialogHeader className="sr-only">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your account and preferences.</DialogDescription>
        </DialogHeader>

        <div className="flex h-full">
          <Tabs defaultValue="account" orientation="vertical" className="flex h-full w-full">
            {/* Sidebar */}
            <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 shrink-0">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                <Settings className="w-5 h-5" />
                Settings
              </h2>
              <TabsList className="flex flex-col h-auto bg-transparent gap-1 p-0 justify-start w-full">
                <SettingsTab value="account" icon={User} label="Account" />
                <SettingsTab value="api" icon={Key} label="API Keys" />
                <SettingsTab value="appearance" icon={Palette} label="Appearance" />
              </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto min-w-0 bg-white dark:bg-slate-950">
              <TabsContent value="account" className="space-y-6 mt-0">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Account</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Manage your profile and personal details.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-neo-sm">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Max 1MB (JPG/PNG)
                    </p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="dark:text-slate-300">
                      Display Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue="Jacob B."
                      className="dark:bg-slate-900 dark:border-slate-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="dark:text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      defaultValue="jacob@kyto.app"
                      className="dark:bg-slate-900 dark:border-slate-700"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="shadow-neo-sm">Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6 mt-0">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Appearance</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Customize how Kyto looks on your device.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">
                    Theme Preference
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <ThemeCard mode="light" current={theme} onClick={() => setTheme('light')} />
                    <ThemeCard mode="dark" current={theme} onClick={() => setTheme('dark')} />
                    <ThemeCard mode="system" current={theme} onClick={() => setTheme('system')} />
                  </div>

                  <div className="mt-6">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-3">
                      Editor Preferences
                    </h4>

                    <div className="flex flex-col gap-3">
                      <label className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div>
                          <div className="font-bold">Snap to grid</div>
                          <div className="text-xs text-slate-500">Automatically snap nodes to a grid while dragging</div>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={localStorage.getItem('kyto_snap') !== 'false'}
                          onChange={(e) => {
                            const v = e.target.checked
                            localStorage.setItem('kyto_snap', String(v))
                            window.dispatchEvent(new CustomEvent('kyto:preferences', { detail: { snapToGrid: v } }))
                          }}
                        />
                      </label>

                      <label className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div>
                          <div className="font-bold">Show grid</div>
                          <div className="text-xs text-slate-500">Display a background grid to help positioning</div>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked={localStorage.getItem('kyto_grid') === 'true'}
                          onChange={(e) => {
                            const v = e.target.checked
                            localStorage.setItem('kyto_grid', String(v))
                            window.dispatchEvent(new CustomEvent('kyto:preferences', { detail: { showGrid: v } }))
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-6 mt-0">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">API Keys</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Manage Discord Tokens.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-slate-900 dark:border-slate-700 rounded-xl flex justify-between items-center bg-slate-50 dark:bg-slate-900 shadow-neo-sm">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Active Bot</p>
                      <p className="text-xs text-slate-500 font-mono">************************</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold"
                    >
                      Revoke
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-2 border-slate-300 dark:border-slate-700 transition-all hover:border-indigo-600 font-black"
                  >
                    Add New Token
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SettingsTab({ value, icon: Icon, label }: { value: string; icon: any; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-500 rounded-lg transition-all font-bold text-slate-500 dark:text-slate-400"
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </TabsTrigger>
  )
}

function ThemeCard({
  mode,
  current,
  onClick,
}: {
  mode: string
  current: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        current === mode
          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-200 dark:ring-indigo-900 shadow-neo-sm'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div
        className={`w-full aspect-video rounded-lg mb-3 border border-slate-200 dark:border-slate-700 ${
          mode === 'dark'
            ? 'bg-slate-900'
            : mode === 'light'
              ? 'bg-white'
              : 'bg-linear-to-br from-white to-slate-900'
        }`}
      />
      <span className="font-black capitalize text-xs tracking-widest">{mode}</span>
    </button>
  )
}
