'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, Users, DollarSign, Activity, Home, Zap, MessageCircle, BarChart3 } from 'lucide-react'
import VedaChat from '@/components/VedaChat'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface UserProfile {
  id: string
  user: string
  totalPaymentVolumeSent: string
  totalPaymentVolumeReceived: string
  totalPropertyInvestments: string
  activePaymentSchedules: number
  totalPaymentsSent: string
  totalPaymentsReceived: string
}

interface ProtocolStats {
  date: string
  totalPaymentVolume: string
  totalPayments: string
  activePaymentSchedules: string
  totalExecutorRewards: string
  totalGasUsed: string
}

interface PaymentExecution {
  id: string
  payer: string
  recipient: string
  amount: string
  timestamp: string
  executor: string
  executorReward: string
}

export default function VedaDashboard() {
  const [userAddress, setUserAddress] = useState('0x24c80f19649c0Da8418011eF0B6Ed3e22007758c')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [protocolStats, setProtocolStats] = useState<ProtocolStats | null>(null)
  const [recentPayments, setRecentPayments] = useState<PaymentExecution[]>([])
  const [loading, setLoading] = useState(false)
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking')

  const formatUSDC = (amount: string) => {
    const value = parseFloat(amount) / 1e18 // USDC has 18 decimals in this system
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatAddress = (address: string) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
  }

  const checkHealth = async () => {
    try {
      setHealthStatus('checking')
      const response = await fetch(`${API_BASE}/api/envio/health`)
      if (response.ok) {
        setHealthStatus('healthy')
      } else {
        setHealthStatus('unhealthy')
      }
    } catch (error) {
      setHealthStatus('unhealthy')
    }
  }

  const loadUserProfile = async () => {
    if (!userAddress) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/envio/user/${userAddress}`)
      const data = await response.json()
      setUserProfile(data.profile)
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProtocolStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/envio/protocol/stats`)
      const data = await response.json()
      setProtocolStats(data.stats)
    } catch (error) {
      console.error('Failed to load protocol stats:', error)
    }
  }

  const loadRecentPayments = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/envio/payments/recent?limit=5`)
      const data = await response.json()
      setRecentPayments(data.payments || [])
    } catch (error) {
      console.error('Failed to load recent payments:', error)
    }
  }

  useEffect(() => {
    checkHealth()
    loadProtocolStats()
    loadRecentPayments()
  }, [])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Veda Analytics Dashboard</h1>
          </div>
          <p className="text-xl opacity-90">Real-time financial intelligence and protocol analytics</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${
              healthStatus === 'healthy' ? 'bg-green-400' : 
              healthStatus === 'unhealthy' ? 'bg-red-400' : 'bg-yellow-400'
            }`} />
            <span className="text-sm">
              {healthStatus === 'healthy' ? 'System Healthy' : 
               healthStatus === 'unhealthy' ? 'System Issues' : 'Checking...'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <MessageCircle className="h-4 w-4 mr-2" />
                Assistant
              </Button>
            </Link>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Ethereum Address</label>
                <Input
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="0x..."
                  className="font-mono"
                />
              </div>
              <Button onClick={loadUserProfile} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load Profile'}
              </Button>
              <Button variant="outline" onClick={checkHealth}>
                <Activity className="h-4 w-4 mr-2" />
                Health Check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Address</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {formatAddress(userProfile.user)}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payments Sent</span>
                    <span className="font-semibold text-green-600">
                      {formatUSDC(userProfile.totalPaymentVolumeSent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payments Received</span>
                    <span className="font-semibold text-blue-600">
                      {formatUSDC(userProfile.totalPaymentVolumeReceived)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Property Investments</span>
                    <span className="font-semibold text-purple-600">
                      {formatUSDC(userProfile.totalPropertyInvestments)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Schedules</span>
                    <Badge variant="secondary">{userProfile.activePaymentSchedules}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Payments</span>
                    <Badge variant="outline">{userProfile.totalPaymentsSent}</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  ) : (
                    'Load a user to see their profile'
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Protocol Stats */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Protocol Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {protocolStats ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="font-semibold">{protocolStats.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Volume</span>
                    <span className="font-semibold text-green-600">
                      {formatUSDC(protocolStats.totalPaymentVolume)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Payments</span>
                    <Badge variant="secondary">{protocolStats.totalPayments}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Schedules</span>
                    <Badge variant="outline">{protocolStats.activePaymentSchedules}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Executor Rewards</span>
                    <span className="font-semibold text-blue-600">
                      {formatUSDC(protocolStats.totalExecutorRewards)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gas Used</span>
                    <span className="font-semibold">
                      {parseInt(protocolStats.totalGasUsed).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p>Loading protocol stats...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPayments.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
                      <div className="font-semibold text-green-600 text-lg">
                        {formatUSDC(payment.amount)}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>From: <code className="bg-gray-200 px-1 rounded">{formatAddress(payment.payer)}</code></div>
                        <div>To: <code className="bg-gray-200 px-1 rounded">{formatAddress(payment.recipient)}</code></div>
                        <div>Time: {formatTimestamp(payment.timestamp)}</div>
                        <div>Executor: <code className="bg-gray-200 px-1 rounded">{formatAddress(payment.executor)}</code></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p>Loading recent payments...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Features Banner */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">🚀 Real-Time Home Ownership</h3>
              <p className="text-lg opacity-90 mb-4">
                Where rent = equity accumulation through zero-latency financial intelligence
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Zero-latency queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Real-time payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Property analytics</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}