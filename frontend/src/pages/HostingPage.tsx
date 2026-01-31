import {
  Globe,
  Github,
  Server,
  Zap,
  Layers,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Database,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { toast } from 'sonner'
import { ProjectLayout } from '@/components/layout/ProjectLayout'

export default function HostingPage() {
  const activeProjectId = useProjectStore(state => state.activeProjectId)
  const projects = useProjectStore(state => state.projects)
  const updateDeployment = useProjectStore(state => state.updateDeployment)

  const activeProject = activeProjectId ? projects[activeProjectId] : null
  const deployment = activeProject?.deployment || {
    provider: 'local',
    status: 'stopped',
    environment: {},
  }

  // State for simulated UI
  const [isDeploying, setIsDeploying] = useState(false)
  const [connectedGitHub, setConnectedGitHub] = useState(false)
  const [connectedRailway, setConnectedRailway] = useState(false)

  const navigate = useNavigate()

  const handleConnectGitHub = () => {
    // Simulate GitHub OAuth
    setTimeout(() => {
      setConnectedGitHub(true)
      toast.success('Successfully connected to GitHub')
    }, 1500)
  }

  const handleConnectRailway = () => {
    // Simulate Railway connection
    setTimeout(() => {
      setConnectedRailway(true)
      toast.success('Successfully linked Railway account')
    }, 1500)
  }

  const handleDeploy = () => {
    if (!activeProjectId) {
      toast.error('No active project found')
      return
    }

    if (!connectedGitHub || !connectedRailway) {
      toast.error('Please connect your GitHub and Railway accounts first.')
      return
    }

    setIsDeploying(true)
    updateDeployment({ status: 'deploying' })

    setTimeout(() => {
      setIsDeploying(false)
      updateDeployment({
        status: 'deployed',
        url: 'https://my-awesome-bot.railway.app',
        lastDeployedAt: Date.now(),
      })
      toast.success('Your bot is now live on Railway!')
    }, 3000)
  }

  if (!activeProjectId) {
    return (
      <ProjectLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-4">
            <Layers className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">No Project Selected</h1>
          <p className="text-muted-foreground max-w-md font-medium">
            You need to select or create a project before you can manage its hosting and
            infrastructure.
          </p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="h-12 px-8 bg-primary text-primary-foreground font-black rounded-xl"
          >
            Go to Dashboard
          </Button>
        </div>
      </ProjectLayout>
    )
  }

  return (
    <ProjectLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-12 pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
              Hosting
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Bot Status</h1>
            <p className="text-muted-foreground font-medium">
              Managing infrastructure for{' '}
              <span className="text-foreground font-bold">{activeProject?.name}</span>
            </p>
          </div>
          <Button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl shadow-glow active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            {isDeploying ? (
              <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 mr-3 fill-current" />
            )}
            {isDeploying ? 'Deploying...' : 'One-Click Deploy'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connection Status Cards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-card border border-border rounded-xl">
                    <Github className="w-6 h-6 text-foreground" />
                  </div>
                  {connectedGitHub ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-muted/20 text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-border">
                      Disconnected
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">Code Repository</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                  Connect your code to GitHub to keep track of changes and enable automatic bot
                  updates.
                </p>
                <Button
                  variant={connectedGitHub ? 'outline' : 'default'}
                  onClick={handleConnectGitHub}
                  className={`w-full h-11 rounded-xl font-bold tracking-tight ${connectedGitHub ? 'border-border' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                >
                  {connectedGitHub ? 'Manage Connection' : 'Connect Repository'}
                </Button>
              </motion.div>

              {/* Railway Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-card border border-border rounded-xl">
                    <Server className="w-6 h-6 text-purple-500" />
                  </div>
                  {connectedRailway ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Linked
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-muted/20 text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-border">
                      Not Linked
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">Cloud Hosting</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
                  Host your bot in the cloud so it stays online 24/7. Simple setup, no config
                  needed.
                </p>
                <Button
                  variant={connectedRailway ? 'outline' : 'default'}
                  onClick={handleConnectRailway}
                  className={`w-full h-11 rounded-xl font-bold tracking-tight ${connectedRailway ? 'border-border' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'}`}
                >
                  {connectedRailway ? 'Dashboard' : 'Link Railway Account'}
                </Button>
              </motion.div>
            </div>

            {/* Deployment Status */}
            <div className="glass p-8 rounded-3xl border border-border/50 space-y-8">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <RefreshCw
                  className={`w-6 h-6 ${deployment.status === 'deploying' ? 'animate-spin' : ''}`}
                />
                Deployment Status
              </h3>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-bold">Current Environment</span>
                    <span className="text-primary font-black uppercase tracking-widest">
                      Production
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-bold">Status</span>
                    <span
                      className={`font-black uppercase tracking-widest ${
                        deployment.status === 'deployed'
                          ? 'text-emerald-500'
                          : deployment.status === 'deploying'
                            ? 'text-amber-500'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {deployment.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-bold">Last Deployed</span>
                    <span className="text-foreground font-medium">
                      {deployment.lastDeployedAt
                        ? new Date(deployment.lastDeployedAt).toLocaleString()
                        : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="w-px bg-border/50 hidden md:block" />

                <div className="flex-1 w-full space-y-4">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    Live Endpoint
                  </h4>
                  {deployment.url ? (
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border group hover:border-primary/50 transition-all shadow-inner"
                    >
                      <span className="text-sm font-bold text-foreground truncate">
                        {deployment.url}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ) : (
                    <div className="p-4 bg-muted/10 rounded-2xl border border-dashed border-border text-center">
                      <span className="text-sm text-muted-foreground font-medium">
                        Waiting for first deployment...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-border/50 bg-primary/5">
              <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4">
                Infrastructure Pro
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-bold">Edge Network: Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-bold">Auto-Scaling: Enabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Database className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-bold">D1 Persistence: Ready</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-border/50 bg-muted/5">
              <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4">
                Plan Usage
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold">Build Seconds</span>
                  <span className="font-bold">850 / 6000s</span>
                </div>
                <div className="h-2 w-full bg-border/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[15%]" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
              <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Security Note
              </h4>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Your API keys and OAuth tokens are AES-256 encrypted before being transmitted to our
                automation worker. Kyto never stores plain-text secrets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  )
}
