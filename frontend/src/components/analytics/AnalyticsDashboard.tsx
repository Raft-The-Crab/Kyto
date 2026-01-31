import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { Activity, Users, MessageSquare, Zap, TrendingUp, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  totalCommands: number
  totalEvents: number
  totalModules: number
  dailyActivity: Array<{
    date: string
    executions: number
    errors: number
  }>
  commandUsage: Array<{
    name: string
    executions: number
    errors: number
    avgResponseTime: number // in ms
    lastUsed: string
  }>
  errorLogs: Array<{
    id: string
    timestamp: string
    message: string
    severity: 'high' | 'medium' | 'low'
    command: string
    stackTrace?: string
  }>
  performanceMetrics: {
    avgResponseTime: number // in ms
    uptimePercentage: number
    errorRate: number // percentage
    throughput: number // requests per minute
    peakLoad: number // concurrent users
  }
  userEngagement: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    returningUsers: number
    sessionDuration: number // average in minutes
  }
  resourceUsage: {
    cpuUsage: number // percentage
    memoryUsage: number // percentage
    networkTraffic: number // MB
  }
  growthMetrics: {
    weeklyGrowth: number // percentage
    monthlyGrowth: number // percentage
    retentionRate: number // percentage
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics`, {
          headers: {
            'X-User-ID': localStorage.getItem('userId') || 'default',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setAnalyticsData(data.analytics)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        // Fallback to mock data if API fails
        const mockData: AnalyticsData = {
          totalCommands: 24,
          totalEvents: 8,
          totalModules: 3,
          dailyActivity: [
            { date: 'Mon', executions: 45, errors: 2 },
            { date: 'Tue', executions: 52, errors: 1 },
            { date: 'Wed', executions: 48, errors: 3 },
            { date: 'Thu', executions: 78, errors: 0 },
            { date: 'Fri', executions: 65, errors: 2 },
            { date: 'Sat', executions: 90, errors: 5 },
            { date: 'Sun', executions: 82, errors: 1 },
          ],
          commandUsage: [
            {
              name: 'ping',
              executions: 120,
              errors: 2,
              avgResponseTime: 120,
              lastUsed: '2023-05-15 14:30',
            },
            {
              name: 'help',
              executions: 85,
              errors: 0,
              avgResponseTime: 95,
              lastUsed: '2023-05-15 12:15',
            },
            {
              name: 'ban',
              executions: 12,
              errors: 1,
              avgResponseTime: 320,
              lastUsed: '2023-05-15 10:45',
            },
            {
              name: 'kick',
              executions: 8,
              errors: 0,
              avgResponseTime: 280,
              lastUsed: '2023-05-15 09:30',
            },
            {
              name: 'mute',
              executions: 15,
              errors: 3,
              avgResponseTime: 250,
              lastUsed: '2023-05-15 16:20',
            },
          ],
          errorLogs: [
            {
              id: '1',
              timestamp: '2023-05-15 14:30',
              message: 'Permission denied for command ban',
              severity: 'medium',
              command: 'ban',
              stackTrace:
                'at PermissionHandler.checkPermission(...)\nat CommandExecutor.execute(...)',
            },
            {
              id: '2',
              timestamp: '2023-05-15 10:15',
              message: 'Database connection failed',
              severity: 'high',
              command: 'kick',
              stackTrace: 'at DatabaseClient.connect(...)\nat UserManager.updateUser(...)',
            },
            {
              id: '3',
              timestamp: '2023-05-14 16:45',
              message: 'Invalid user ID provided',
              severity: 'low',
              command: 'mute',
            },
            {
              id: '4',
              timestamp: '2023-05-14 11:20',
              message: 'Rate limit exceeded',
              severity: 'medium',
              command: 'ping',
            },
            {
              id: '5',
              timestamp: '2023-05-13 20:10',
              message: 'Missing required permissions',
              severity: 'high',
              command: 'ban',
            },
          ],
          performanceMetrics: {
            avgResponseTime: 245,
            uptimePercentage: 99.8,
            errorRate: 0.8,
            throughput: 45,
            peakLoad: 120,
          },
          userEngagement: {
            totalUsers: 1240,
            activeUsers: 342,
            newUsers: 24,
            returningUsers: 287,
            sessionDuration: 24,
          },
          resourceUsage: {
            cpuUsage: 45,
            memoryUsage: 62,
            networkTraffic: 1.2,
          },
          growthMetrics: {
            weeklyGrowth: 3.2,
            monthlyGrowth: 12.5,
            retentionRate: 87.3,
          },
        }
        setAnalyticsData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium">No analytics data available</h3>
        <p className="text-sm">Start using your bot to see analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your bot's performance and usage</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('day')}
          >
            Day
          </Button>
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                // Export analytics data from API as JSON
                const response = await fetch(`/api/analytics/export/json`, {
                  headers: {
                    'X-User-ID': localStorage.getItem('userId') || 'default',
                  },
                })

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`)
                }

                // Create blob from response and trigger download
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `kyto-analytics-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
              } catch (error) {
                console.error('Error exporting analytics data:', error)
                alert('Failed to export analytics data. Using fallback export.')

                // Fallback to local export if API fails
                if (analyticsData) {
                  const dataStr = JSON.stringify(analyticsData, null, 2)
                  const dataUri =
                    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

                  const exportFileDefaultName = `kyto-analytics-${new Date().toISOString().split('T')[0]}.json`

                  const linkElement = document.createElement('a')
                  linkElement.setAttribute('href', dataUri)
                  linkElement.setAttribute('download', exportFileDefaultName)
                  linkElement.click()
                }
              }
            }}
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Commands"
          value={analyticsData.totalCommands.toString()}
          icon={<Zap className="h-6 w-6 text-emerald-500" />}
          change="+12% from last week"
        />
        <StatCard
          title="Total Events"
          value={analyticsData.totalEvents.toString()}
          icon={<Activity className="h-6 w-6 text-blue-500" />}
          change="+5% from last week"
        />
        <StatCard
          title="Active Users"
          value={analyticsData.userEngagement.activeUsers.toString()}
          icon={<Users className="h-6 w-6 text-purple-500" />}
          change="+18% from last week"
        />
        <StatCard
          title="Avg Response Time"
          value={`${analyticsData.performanceMetrics.avgResponseTime}ms`}
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          change="-8% from last week"
        />
        <StatCard
          title="Throughput"
          value={`${analyticsData.performanceMetrics.throughput}/min`}
          icon={<TrendingUp className="h-6 w-6 text-cyan-500" />}
          change="+7% from last week"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="executions" fill="#10B981" name="Executions" />
                <Bar dataKey="errors" fill="#EF4444" name="Errors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Command Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Command Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.commandUsage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="executions"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                >
                  {analyticsData.commandUsage.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name?: string) => {
                    if (name === 'executions') return [value, 'Executions']
                    if (name === 'errors') return [value, 'Errors']
                    return [value, name || '']
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.performanceMetrics.uptimePercentage}%
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${analyticsData.performanceMetrics.uptimePercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {analyticsData.performanceMetrics.errorRate}%
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${analyticsData.performanceMetrics.errorRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.userEngagement.newUsers}</div>
            <p className="text-xs text-muted-foreground">This week</p>
            <TrendingUp className="h-8 w-8 text-emerald-500 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage and Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>CPU Usage</span>
                  <span>{analyticsData.resourceUsage.cpuUsage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${analyticsData.resourceUsage.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Memory Usage</span>
                  <span>{analyticsData.resourceUsage.memoryUsage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${analyticsData.resourceUsage.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Network Traffic</span>
                  <span>{analyticsData.resourceUsage.networkTraffic} MB</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{
                      width: `${Math.min(analyticsData.resourceUsage.networkTraffic * 20, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Weekly Growth</span>
                <span className="text-emerald-500 font-medium">
                  +{analyticsData.growthMetrics.weeklyGrowth}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Growth</span>
                <span className="text-emerald-500 font-medium">
                  +{analyticsData.growthMetrics.monthlyGrowth}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Retention Rate</span>
                <span className="text-emerald-500 font-medium">
                  {analyticsData.growthMetrics.retentionRate}%
                </span>
              </div>
              <div className="pt-2">
                <div className="h-32 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { day: 'Mon', growth: 1.2 },
                        { day: 'Tue', growth: 1.8 },
                        { day: 'Wed', growth: 2.1 },
                        { day: 'Thu', growth: 2.5 },
                        { day: 'Fri', growth: 3.2 },
                        { day: 'Sat', growth: 2.8 },
                        { day: 'Sun', growth: 3.2 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="growth"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Command Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Command Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Command</th>
                  <th className="text-left py-3 px-4 font-medium">Executions</th>
                  <th className="text-left py-3 px-4 font-medium">Errors</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Response</th>
                  <th className="text-left py-3 px-4 font-medium">Success Rate</th>
                  <th className="text-left py-3 px-4 font-medium">Last Used</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.commandUsage.map((cmd, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{cmd.name}</td>
                    <td className="py-3 px-4">{cmd.executions}</td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs',
                          cmd.errors > 0
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        )}
                      >
                        {cmd.errors}
                      </span>
                    </td>
                    <td className="py-3 px-4">{cmd.avgResponseTime}ms</td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs',
                          ((cmd.executions - cmd.errors) / cmd.executions) * 100 > 95
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        )}
                      >
                        {Math.round(((cmd.executions - cmd.errors) / cmd.executions) * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{cmd.lastUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Recent Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.errorLogs.map(log => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                <div
                  className={cn(
                    'p-2 rounded-full',
                    log.severity === 'high' && 'bg-red-500/10 text-red-500',
                    log.severity === 'medium' && 'bg-yellow-500/10 text-yellow-500',
                    log.severity === 'low' && 'bg-orange-500/10 text-orange-500'
                  )}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium truncate">{log.message}</h4>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Command: {log.command}</p>
                  {log.stackTrace && (
                    <details className="mt-2 text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Show Stack Trace</summary>
                      <pre className="mt-2 p-2 bg-secondary rounded-md overflow-x-auto">
                        {log.stackTrace}
                      </pre>
                    </details>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change: string
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => {
  const isPositive = change.includes('+')

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn('text-xs mt-2', isPositive ? 'text-emerald-500' : 'text-red-500')}>
          {change}
        </p>
      </CardContent>
    </Card>
  )
}
