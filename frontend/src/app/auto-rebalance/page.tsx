'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useAccount } from 'wagmi'

interface RebalanceStrategy {
  id: string
  name: string
  targetAllocations: { [key: string]: number }
  frequency: string
  threshold: number
  status: 'active' | 'paused' | 'inactive'
  lastRebalance: string
  nextRebalance: string
}

interface PortfolioAsset {
  symbol: string
  name: string
  icon: string
  currentValue: number
  currentAllocation: number
  targetAllocation: number
  deviation: number
}

export default function AutoRebalancePage() {
  const { isConnected, address } = useAccount()
  const [strategies, setStrategies] = useState<RebalanceStrategy[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([])
  const [activeTab, setActiveTab] = useState<'strategies' | 'create' | 'portfolio'>('strategies')
  const [loading, setLoading] = useState(false)
  
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    frequency: 'weekly',
    threshold: 5,
    allocations: {
      'RWA': 60,
      'ETH': 25,
      'USDC': 15
    }
  })

  // Mock data
  useEffect(() => {
    setStrategies([
      {
        id: '1',
        name: 'Conservative RWA Focus',
        targetAllocations: { 'RWA': 60, 'ETH': 25, 'USDC': 15 },
        frequency: 'weekly',
        threshold: 5,
        status: 'active',
        lastRebalance: '2024-12-20',
        nextRebalance: '2024-12-27'
      },
      {
        id: '2',
        name: 'Aggressive Growth',
        targetAllocations: { 'RWA': 40, 'ETH': 50, 'WBTC': 10 },
        frequency: 'monthly',
        threshold: 10,
        status: 'paused',
        lastRebalance: '2024-12-01',
        nextRebalance: '2025-01-01'
      }
    ])

    setPortfolio([
      {
        symbol: 'RWA',
        name: 'Real World Assets',
        icon: '🏢',
        currentValue: 15000,
        currentAllocation: 65,
        targetAllocation: 60,
        deviation: 5
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        icon: '🔷',
        currentValue: 5500,
        currentAllocation: 22,
        targetAllocation: 25,
        deviation: -3
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        icon: '💵',
        currentValue: 3200,
        currentAllocation: 13,
        targetAllocation: 15,
        deviation: -2
      }
    ])
  }, [])

  const handleCreateStrategy = async () => {
    if (!isConnected) return
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const strategy: RebalanceStrategy = {
        id: Date.now().toString(),
        name: newStrategy.name,
        targetAllocations: newStrategy.allocations,
        frequency: newStrategy.frequency,
        threshold: newStrategy.threshold,
        status: 'active',
        lastRebalance: new Date().toISOString().split('T')[0],
        nextRebalance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      
      setStrategies(prev => [...prev, strategy])
      setNewStrategy({
        name: '',
        frequency: 'weekly',
        threshold: 5,
        allocations: { 'RWA': 60, 'ETH': 25, 'USDC': 15 }
      })
      setActiveTab('strategies')
      
      alert('Auto-rebalance strategy created successfully!')
    } catch (error) {
      alert('Failed to create strategy. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStrategy = async (strategyId: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStrategies(prev => prev.map(strategy => 
        strategy.id === strategyId 
          ? { 
              ...strategy, 
              status: strategy.status === 'active' ? 'paused' : 'active' 
            }
          : strategy
      ))
    } catch (error) {
      alert('Failed to update strategy status.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualRebalance = async () => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Update portfolio to target allocations
      setPortfolio(prev => prev.map(asset => ({
        ...asset,
        currentAllocation: asset.targetAllocation,
        deviation: 0
      })))
      
      alert('Portfolio rebalanced successfully!')
    } catch (error) {
      alert('Failed to rebalance portfolio.')
    } finally {
      setLoading(false)
    }
  }

  const totalValue = portfolio.reduce((sum, asset) => sum + asset.currentValue, 0)
  const needsRebalancing = portfolio.some(asset => Math.abs(asset.deviation) >= 5)

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">⚖️ Auto-Rebalance Portfolio</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to set up automated portfolio rebalancing</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800">Please connect your MetaMask wallet to continue</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚖️ Auto-Rebalance Portfolio</h1>
          <p className="text-gray-600">Intelligent robo-advisor that maintains your target asset allocations</p>
        </div>

        {/* Portfolio Summary */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800">Portfolio Overview</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Total Portfolio Value</div>
            </div>
          </div>
          
          {needsRebalancing && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 font-medium">⚠️ Portfolio needs rebalancing</span>
                <button
                  onClick={handleManualRebalance}
                  disabled={loading}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm font-medium"
                >
                  {loading ? 'Rebalancing...' : 'Rebalance Now'}
                </button>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-4">
            {portfolio.map((asset) => (
              <div key={asset.symbol} className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{asset.icon}</span>
                    <span className="font-medium">{asset.symbol}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    asset.deviation > 0 ? 'text-red-600' : asset.deviation < 0 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {asset.deviation > 0 ? '+' : ''}{asset.deviation}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Current: {asset.currentAllocation}% | Target: {asset.targetAllocation}%
                </div>
                <div className="text-lg font-semibold">${asset.currentValue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('strategies')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'strategies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🤖 Active Strategies ({strategies.filter(s => s.status === 'active').length})
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ➕ Create Strategy
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'portfolio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Portfolio Details
              </button>
            </nav>
          </div>
        </div>

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Rebalancing Strategies</h2>
            </div>
            
            {strategies.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No rebalancing strategies configured</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first strategy →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{strategy.name}</h3>
                        <p className="text-sm text-gray-500">
                          Rebalances {strategy.frequency} when deviation exceeds {strategy.threshold}%
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          strategy.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : strategy.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {strategy.status}
                        </span>
                        <button
                          onClick={() => handleToggleStrategy(strategy.id)}
                          disabled={loading}
                          className={`px-4 py-2 rounded text-sm font-medium ${
                            strategy.status === 'active'
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          } disabled:opacity-50`}
                        >
                          {strategy.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Target Allocations</h4>
                        <div className="space-y-1">
                          {Object.entries(strategy.targetAllocations).map(([asset, allocation]) => (
                            <div key={asset} className="flex justify-between text-sm">
                              <span>{asset}:</span>
                              <span className="font-medium">{allocation}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Schedule</h4>
                        <div className="text-sm space-y-1">
                          <div>Last: {strategy.lastRebalance}</div>
                          <div>Next: {strategy.nextRebalance}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Settings</h4>
                        <div className="text-sm space-y-1">
                          <div>Frequency: {strategy.frequency}</div>
                          <div>Threshold: {strategy.threshold}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Strategy Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Create Rebalancing Strategy</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Conservative RWA Focus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rebalancing Frequency
                  </label>
                  <select
                    value={newStrategy.frequency}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deviation Threshold (%)
                  </label>
                  <input
                    type="number"
                    value={newStrategy.threshold}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, threshold: parseInt(e.target.value) }))}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Target Asset Allocations
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">RWA (%)</label>
                    <input
                      type="number"
                      value={newStrategy.allocations.RWA}
                      onChange={(e) => setNewStrategy(prev => ({
                        ...prev,
                        allocations: { ...prev.allocations, RWA: parseInt(e.target.value) }
                      }))}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ETH (%)</label>
                    <input
                      type="number"
                      value={newStrategy.allocations.ETH}
                      onChange={(e) => setNewStrategy(prev => ({
                        ...prev,
                        allocations: { ...prev.allocations, ETH: parseInt(e.target.value) }
                      }))}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">USDC (%)</label>
                    <input
                      type="number"
                      value={newStrategy.allocations.USDC}
                      onChange={(e) => setNewStrategy(prev => ({
                        ...prev,
                        allocations: { ...prev.allocations, USDC: parseInt(e.target.value) }
                      }))}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Total: {Object.values(newStrategy.allocations).reduce((sum, val) => sum + val, 0)}%
                  {Object.values(newStrategy.allocations).reduce((sum, val) => sum + val, 0) !== 100 && (
                    <span className="text-red-600 ml-2">⚠️ Must equal 100%</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleCreateStrategy}
                disabled={loading || !newStrategy.name || Object.values(newStrategy.allocations).reduce((sum, val) => sum + val, 0) !== 100}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Creating Strategy...' : 'Create Auto-Rebalance Strategy'}
              </button>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Detailed Portfolio Analysis</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deviation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action Needed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.map((asset) => (
                    <tr key={asset.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{asset.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{asset.symbol}</div>
                            <div className="text-sm text-gray-500">{asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${asset.currentValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.currentAllocation}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.targetAllocation}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          asset.deviation > 0 
                            ? 'bg-red-100 text-red-800'
                            : asset.deviation < 0
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {asset.deviation > 0 ? '+' : ''}{asset.deviation}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.abs(asset.deviation) >= 5 
                          ? asset.deviation > 0 ? 'Sell some' : 'Buy more'
                          : 'No action needed'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🤖 How Auto-Rebalancing Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Intelligent Monitoring</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Continuously tracks portfolio allocations</li>
                <li>• Uses Chainlink price feeds for accuracy</li>
                <li>• Monitors deviation from target percentages</li>
                <li>• Triggers rebalancing when thresholds are met</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Automated Execution</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Executes trades on Uniswap V3 automatically</li>
                <li>• Minimizes slippage with smart routing</li>
                <li>• Respects gas price limits and timing</li>
                <li>• Maintains target allocations over time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}