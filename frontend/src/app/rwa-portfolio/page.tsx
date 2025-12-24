'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

interface PortfolioItem {
  propertyId: string
  propertyName: string
  shares: string
  investment: string
  currentValue: string
  yield: string
  totalYieldEarned: string
  performance: string
}

export default function RWAPortfolioPage() {
  const { address, isConnected } = useAccount()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [totalStats, setTotalStats] = useState({
    totalInvestment: '0 ETH',
    currentValue: '0 ETH',
    totalYield: '0 ETH',
    performance: '+0%'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      loadPortfolio()
    }
  }, [isConnected, address])

  const loadPortfolio = async () => {
    setLoading(true)
    try {
      // Mock portfolio data
      const mockPortfolio: PortfolioItem[] = [
        {
          propertyId: '1',
          propertyName: 'Manhattan Luxury Apartments',
          shares: '50',
          investment: '5.0 ETH',
          currentValue: '5.2 ETH',
          yield: '4.2%',
          totalYieldEarned: '0.8 ETH',
          performance: '+4.0%'
        },
        {
          propertyId: '2',
          propertyName: 'Miami Beach Condos',
          shares: '30',
          investment: '3.0 ETH',
          currentValue: '3.15 ETH',
          yield: '5.1%',
          totalYieldEarned: '0.45 ETH',
          performance: '+5.0%'
        },
        {
          propertyId: '5',
          propertyName: 'Denver Mountain Resort',
          shares: '20',
          investment: '2.0 ETH',
          currentValue: '2.1 ETH',
          yield: '8.1%',
          totalYieldEarned: '0.35 ETH',
          performance: '+5.0%'
        }
      ]

      setPortfolio(mockPortfolio)
      
      // Calculate totals
      const totalInv = mockPortfolio.reduce((sum, item) => sum + parseFloat(item.investment), 0)
      const totalVal = mockPortfolio.reduce((sum, item) => sum + parseFloat(item.currentValue), 0)
      const totalYld = mockPortfolio.reduce((sum, item) => sum + parseFloat(item.totalYieldEarned), 0)
      const perf = ((totalVal - totalInv) / totalInv * 100).toFixed(1)

      setTotalStats({
        totalInvestment: `${totalInv.toFixed(2)} ETH`,
        currentValue: `${totalVal.toFixed(2)} ETH`,
        totalYield: `${totalYld.toFixed(2)} ETH`,
        performance: `+${perf}%`
      })
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceColor = (performance: string) => {
    if (performance.startsWith('+')) return 'text-green-600'
    if (performance.startsWith('-')) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 RWA Portfolio
          </h1>
          <p className="text-gray-600">
            Track your real estate investments and performance metrics
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {isConnected && (
          <>
            {/* Portfolio Summary */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Investment</h3>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalInvestment}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Value</h3>
                <p className="text-2xl font-bold text-gray-900">{totalStats.currentValue}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Yield Earned</h3>
                <p className="text-2xl font-bold text-green-600">{totalStats.totalYield}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Performance</h3>
                <p className={`text-2xl font-bold ${getPerformanceColor(totalStats.performance)}`}>
                  {totalStats.performance}
                </p>
              </div>
            </div>

            {/* Portfolio Holdings */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🏢 Your Holdings</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading portfolio...</p>
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No investments found.</p>
                  <p className="text-sm mt-2">Start investing in real estate properties to see your portfolio here!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3">Property</th>
                        <th className="text-left py-3">Shares</th>
                        <th className="text-left py-3">Investment</th>
                        <th className="text-left py-3">Current Value</th>
                        <th className="text-left py-3">Yield Rate</th>
                        <th className="text-left py-3">Yield Earned</th>
                        <th className="text-left py-3">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((item) => (
                        <tr key={item.propertyId} className="border-b border-gray-100">
                          <td className="py-4">
                            <div>
                              <div className="font-medium text-gray-900">{item.propertyName}</div>
                              <div className="text-xs text-gray-500">Property #{item.propertyId}</div>
                            </div>
                          </td>
                          <td className="py-4 font-medium">{item.shares}</td>
                          <td className="py-4 font-medium">{item.investment}</td>
                          <td className="py-4 font-medium">{item.currentValue}</td>
                          <td className="py-4 font-medium text-blue-600">{item.yield}</td>
                          <td className="py-4 font-medium text-green-600">{item.totalYieldEarned}</td>
                          <td className={`py-4 font-medium ${getPerformanceColor(item.performance)}`}>
                            {item.performance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 Performance Over Time</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">📊</p>
                  <p>Performance chart coming soon</p>
                  <p className="text-sm">Track your portfolio growth over time</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <a
                  href="/rwa-properties"
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🏢 Invest in Properties
                </a>
                <a
                  href="/rwa-yield"
                  className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  💰 Claim Yield
                </a>
                <a
                  href="/yield-farmer"
                  className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  🌾 Auto-Compound
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}