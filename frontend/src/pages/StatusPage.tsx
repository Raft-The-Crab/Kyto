import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down' | 'checking'
  latency?: number
  description: string
}

export function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Bot Builder', status: 'checking', description: 'Visual node editor and canvas' },
    { name: 'AI Assistant', status: 'checking', description: 'Rule-based AI suggestions' },
    { name: 'Code Export', status: 'checking', description: 'Discord.js & Discord.py generation' },
    { name: 'Real-time Collaboration', status: 'checking', description: 'WebSocket sync' },
    { name: 'Project Storage', status: 'checking', description: 'Local IndexedDB storage' },
  ])

  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function checkStatus() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787'
    
    try {
      const start = performance.now()
      const response = await fetch(apiUrl)
      const latency = Math.round(performance.now() - start)
      
      if (response.ok) {
        setBackendStatus('online')
        setServices(prev => prev.map(s => ({
          ...s,
          status: 'operational' as const,
          latency: s.name === 'Bot Builder' ? latency : undefined,
        })))
      } else {
        setBackendStatus('offline')
        setServices(prev => prev.map(s => ({ ...s, status: 'degraded' as const })))
      }
    } catch {
      setBackendStatus('offline')
      // Still mark frontend features as operational
      setServices(prev => prev.map(s => ({
        ...s,
        status: s.name === 'Project Storage' || s.name === 'Bot Builder' 
          ? 'operational' as const 
          : 'down' as const,
      })))
    }
    
    setLastChecked(new Date())
  }

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'bg-emerald-500'
      case 'degraded': return 'bg-yellow-500'
      case 'down': return 'bg-red-500'
      default: return 'bg-gray-400 animate-pulse'
    }
  }

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'Operational'
      case 'degraded': return 'Degraded'
      case 'down': return 'Down'
      default: return 'Checking...'
    }
  }

  const overallStatus = services.every(s => s.status === 'operational')
    ? 'All Systems Operational'
    : services.every(s => s.status === 'down')
    ? 'Major Outage'
    : 'Partial Outage'

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
              System Status
            </h1>
            <p className="text-zinc-400">
              Real-time status of Kyto services
            </p>
          </div>

          {/* Overall Status Banner */}
          <div className={`p-6 rounded-lg border-4 border-black mb-8 ${
            overallStatus === 'All Systems Operational' 
              ? 'bg-emerald-500/10 border-emerald-500' 
              : overallStatus === 'Major Outage' 
              ? 'bg-red-500/10 border-red-500' 
              : 'bg-yellow-500/10 border-yellow-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${
                  overallStatus === 'All Systems Operational' 
                    ? 'bg-emerald-500' 
                    : overallStatus === 'Major Outage' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500'
                }`} />
                <span className="text-xl font-bold">{overallStatus}</span>
              </div>
              {lastChecked && (
                <span className="text-sm text-zinc-400">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Service List */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 border-4 border-black rounded-lg p-4 hover:transform hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    <p className="text-sm text-zinc-400">{service.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {service.latency && (
                      <span className="text-xs text-zinc-500">{service.latency}ms</span>
                    )}
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                      <span className="text-sm font-medium">{getStatusText(service.status)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Backend Connection Status */}
          <div className="mt-8 p-4 bg-zinc-900 border-4 border-black rounded-lg">
            <h3 className="font-bold mb-2">Backend Connection</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                backendStatus === 'online' ? 'bg-emerald-500' :
                backendStatus === 'offline' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'
              }`} />
              <span className="text-sm">
                {backendStatus === 'online' ? 'Connected' :
                 backendStatus === 'offline' ? 'Disconnected (using offline mode)' : 'Checking...'}
              </span>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-8 text-center">
            <button
              onClick={checkStatus}
              className="px-6 py-3 bg-[#5865F2] text-white font-bold uppercase border-4 border-black rounded-lg hover:transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#000]"
            >
              Refresh Status
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
