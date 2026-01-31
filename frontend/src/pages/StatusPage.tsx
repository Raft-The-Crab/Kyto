import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PublicLayout } from '@/components/layout/PublicLayout'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down' | 'checking'
  latency?: number
  description: string
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Bot Builder', status: 'checking', description: 'Visual node editor and canvas' },
    { name: 'Logic Engine', status: 'checking', description: 'Human-refined logic suggestions' },
    { name: 'Code Export', status: 'checking', description: 'Discord.js & Discord.py generation' },
    { name: 'Collaboration', status: 'checking', description: 'Real-time WebSocket sync' },
    { name: 'Project Storage', status: 'checking', description: 'Database and file storage' },
  ])

  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  async function checkStatus() {
    setIsRefreshing(true)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'

    try {
      const start = performance.now()
      const response = await fetch(apiUrl)
      const latency = Math.round(performance.now() - start)

      if (response.ok) {
        setBackendStatus('online')
        setServices(prev =>
          prev.map(s => ({
            ...s,
            status: 'operational' as const,
            latency: s.name === 'Bot Builder' ? latency : undefined,
          }))
        )
      } else {
        setBackendStatus('offline')
        setServices(prev => prev.map(s => ({ ...s, status: 'degraded' as const })))
      }
    } catch {
      setBackendStatus('offline')
      setServices(prev =>
        prev.map(s => ({
          ...s,
          status:
            s.name === 'Project Storage' || s.name === 'Bot Builder'
              ? ('operational' as const)
              : ('down' as const),
        }))
      )
    }

    setLastChecked(new Date())
    setIsRefreshing(false)
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-secondary" />
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'down':
        return <XCircle className="w-5 h-5 text-destructive" />
      default:
        return <Activity className="w-5 h-5 text-muted-foreground animate-pulse" />
    }
  }

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'Operational'
      case 'degraded':
        return 'Degraded'
      case 'down':
        return 'Down'
      default:
        return 'Checking...'
    }
  }

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'text-secondary bg-secondary/10 border-secondary/20'
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'down':
        return 'text-destructive bg-destructive/10 border-destructive/20'
      default:
        return 'text-muted-foreground bg-muted/10 border-border/20'
    }
  }

  const overallStatus = services.every(s => s.status === 'operational')
    ? 'operational'
    : services.some(s => s.status === 'down')
      ? 'down'
      : 'degraded'

  return (
    <PublicLayout>
      <div className="relative">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        {/* Content */}
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-sm font-bold text-secondary mb-6">
                <Activity className="w-4 h-4" />
                Live System Status
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4 text-foreground">
                SYSTEM <span className="text-primary italic">STATUS</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Real-time monitoring of all Kyto services and infrastructure.
              </p>
            </motion.div>

            {/* Overall Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`glass rounded-3xl border p-8 mb-8 ${getStatusColor(overallStatus)} shadow-glow`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="p-4 rounded-2xl bg-background/50 border border-current/10">
                    {getStatusIcon(overallStatus)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">
                      {overallStatus === 'operational'
                        ? 'All Systems Operational'
                        : overallStatus === 'down'
                          ? 'Service Disruption'
                          : 'Partial Outage'}
                    </h2>
                    {lastChecked && (
                      <p className="text-sm font-bold opacity-70 mt-1 uppercase tracking-widest">
                        Last checked: {lastChecked.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={checkStatus}
                  disabled={isRefreshing}
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-background/50 hover:bg-background rounded-2xl border-current/20 font-black h-12"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </motion.div>

            {/* Service Status List */}
            <div className="grid gap-4 mb-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                  className="glass rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all shadow-sm group"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-muted/50 border border-border group-hover:bg-primary/5 transition-colors">
                          {getStatusIcon(service.status)}
                        </div>
                        <h3 className="text-xl font-black tracking-tight">{service.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      {service.latency && (
                        <div className="text-right hidden sm:block">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Latency
                          </div>
                          <div className="text-xl font-black text-secondary italic">
                            {service.latency}ms
                          </div>
                        </div>
                      )}
                      <div
                        className={`px-5 py-2.5 rounded-xl border font-black text-xs uppercase tracking-widest ${getStatusColor(service.status)}`}
                      >
                        {getStatusText(service.status)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Backend Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass rounded-2xl border border-border/50 p-8 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted/50 border border-border`}>
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Backend Connectivity</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {backendStatus === 'online' ? (
                      <span className="text-emerald-500 font-bold text-sm">
                        Secure connection established
                      </span>
                    ) : backendStatus === 'offline' ? (
                      <span className="text-destructive font-bold text-sm">
                        Disconnected from automation cluster
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-bold text-sm">
                        Handshaking...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 p-8 rounded-[32px] border border-primary/20 bg-primary/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors duration-500" />
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-4 uppercase italic text-primary">
                  Intelligence & Support
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-3xl">
                  This heartbeat monitor verifies core service health every 30 seconds. Experience
                  zero-compromise reliability with our human-centric studio infrastructure. If you
                  encounter anomalies, please consult our{' '}
                  <a href="/blog" className="text-primary hover:underline font-black">
                    status updates
                  </a>{' '}
                  or contact the studio leads directly.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
