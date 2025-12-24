'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

interface AnalyticsData {
  totalUsers: number
  totalProperties: number
  totalValueLocked: string
  totalYieldDistributed: string
  averageYield: string
  topPerformingProperty: string
  recentTransactions: number
  activeStreams: number
  permissionsCreated: number
}

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalProperties: 10,
    totalValueLocked: '0 ETH',
    totalYieldDistributed: '0 ETH',
    averageYield: '0%',
    topPerformingProperty: 'Denver Mountain Resort',
    recentTransactions: 0,
    activeStreams: 0,
    permissionsCreated: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Mock analytics data
      setAnalytics({
        totalUsers: 1247,
        totalProperties: 10,
        totalValueLocked: '32,450 ETH',
        totalYieldDistributed: '2,156 ETH',
        averageYield: '6.2%',
        topPerformingProperty: 'Denver Mountain Resort (8.1%)',
        recentTransactions: 89,
        activeStreams: 23,
        permissionsCreated: 156
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📈 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Platform performance metrics and insights
          </p>
        </div>

        {/* Platform Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Properties</h3>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Value Locked</h3>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalValueLocked}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Average Yield</h3>
                <p className="text-2xl font-bold text-green-600">{analytics.averageYield}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Key Performance Indicators</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Yield Distributed</span>
                <span className="font-semibold text-green-600">{analytics.totalYieldDistributed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Top Performing Property</span>
                <span className="font-semibold text-blue-600">{analytics.topPerformingProperty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recent Transactions (24h)</span>
                <span className="font-semibold text-gray-900">{analytics.recentTransactions}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 Advanced Features Usage</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Money Streams</span>
                <span className="font-semibold text-blue-600">{analytics.activeStreams}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">EIP-7715 Permissions Created</span>
                <span className="font-semibold text-emerald-600">{analytics.permissionsCreated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Auto-Compound Strategies</span>
                <span className="font-semibold text-yellow-600">42</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Property Performance Ranking</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3">Rank</th>
                  <th className="text-left py-3">Property</th>
                  <th className="text-left py-3">Total Value</th>
                  <th className="text-left py-3">Yield Rate</th>
                  <th className="text-left py-3">Investors</th>
                  <th className="text-left py-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3">🥇 1</td>
                  <td className="py-3 font-medium">Denver Mountain Resort</td>
                  <td className="py-3">5,500 ETH</td>
                  <td className="py-3 text-green-600 font-semibold">8.1%</td>
                  <td className="py-3">234</td>
                  <td className="py-3 text-green-600">+12.3%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">🥈 2</td>
                  <td className="py-3 font-medium">Seattle Warehouse District</td>
                  <td className="py-3">3,100 ETH</td>
                  <td className="py-3 text-green-600 font-semibold">7.2%</td>
                  <td className="py-3">189</td>
                  <td className="py-3 text-green-600">+9.8%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">🥉 3</td>
                  <td className="py-3 font-medium">Austin Tech Hub Office</td>
                  <td className="py-3">4,200 ETH</td>
                  <td className="py-3 text-green-600 font-semibold">6.8%</td>
                  <td className="py-3">156</td>
                  <td className="py-3 text-green-600">+8.5%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">4</td>
                  <td className="py-3 font-medium">Los Angeles Studio Complex</td>
                  <td className="py-3">6,800 ETH</td>
                  <td className="py-3 text-green-600 font-semibold">6.5%</td>
                  <td className="py-3">298</td>
                  <td className="py-3 text-green-600">+7.2%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3">5</td>
                  <td className="py-3 font-medium">Miami Beach Condos</td>
                  <td className="py-3">1,800 ETH</td>
                  <td className="py-3 text-green-600 font-semibold">5.1%</td>
                  <td className="py-3">123</td>
                  <td className="py-3 text-green-600">+6.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Protocol Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Envio Indexer</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  ✅ Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Superfluid</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  ✅ Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Aave V3</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  ✅ Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uniswap V3</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  ✅ Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Network Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Network</span>
                <span className="font-medium">Base Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Block Height</span>
                <span className="font-medium">18,234,567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gas Price</span>
                <span className="font-medium">0.001 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TPS</span>
                <span className="font-medium">~50</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 AI Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Parse Success Rate</span>
                <span className="font-medium text-green-600">84.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response Time</span>
                <span className="font-medium">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commands Processed</span>
                <span className="font-medium">12,456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-medium text-green-600">96.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}