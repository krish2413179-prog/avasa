'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useAccount } from 'wagmi'

interface WhaleTrader {
  id: string
  address: string
  name: string
  avatar: string
  totalValue: string
  winRate: number
  followers: number
  avgReturn: string
  recentTrades: number
  status: 'following' | 'not-following'
}

interface CopyTrade {
  id: string
  whaleAddress: string
  whaleName: string
  fromToken: string
  toToken: string
  amount: string
  timestamp: string
  status: 'pending' | 'executed' | 'failed'
  myAmount: string
}

interface CopySettings {
  whaleAddress: string
  copyPercentage: number
  maxAmountPerTrade: string
  minAmountPerTrade: string
  enabled: boolean
}

export default function CopyTradingPage() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState<'whales' | 'following' | 'trades' | 'settings'>('whales')
  const [whales, setWhales] = useState<WhaleTrader[]>([])
  const [copyTrades, setCopyTrades] = useState<CopyTrade[]>([])
  const [copySettings, setCopySettings] = useState<CopySettings[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data
  useEffect(() => {
    setWhales([
      {
        id: '1',
        address: '0x1234...5678',
        name: 'nancy.base.eth',
        avatar: '👩‍💼',
        totalValue: '$2.4M',
        winRate: 78,
        followers: 1250,
        avgReturn: '+24.5%',
        recentTrades: 15,
        status: 'following'
      },
      {
        id: '2',
        address: '0x2345...6789',
        name: 'defi-whale.base.eth',
        avatar: '🐋',
        totalValue: '$5.8M',
        winRate: 85,
        followers: 2100,
        avgReturn: '+31.2%',
        recentTrades: 8,
        status: 'not-following'
      },
      {
        id: '3',
        address: '0x3456...7890',
        name: 'crypto-alpha.base.eth',
        avatar: '🚀',
        totalValue: '$1.9M',
        winRate: 72,
        followers: 890,
        avgReturn: '+18.7%',
        recentTrades: 22,
        status: 'not-following'
      }
    ])

    setCopyTrades([
      {
        id: '1',
        whaleAddress: '0x1234...5678',
        whaleName: 'nancy.base.eth',
        fromToken: 'USDC',
        toToken: 'ETH',
        amount: '1000',
        timestamp: '2024-12-24 10:30',
        status: 'executed',
        myAmount: '50'
      },
      {
        id: '2',
        whaleAddress: '0x1234...5678',
        whaleName: 'nancy.base.eth',
        fromToken: 'ETH',
        toToken: 'WBTC',
        amount: '2.5',
        timestamp: '2024-12-24 09:15',
        status: 'pending',
        myAmount: '0.125'
      }
    ])

    setCopySettings([
      {
        whaleAddress: '0x1234...5678',
        copyPercentage: 5,
        maxAmountPerTrade: '100',
        minAmountPerTrade: '10',
        enabled: true
      }
    ])
  }, [])

  const handleFollowWhale = async (whaleId: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setWhales(prev => prev.map(whale => 
        whale.id === whaleId 
          ? { ...whale, status: 'following', followers: whale.followers + 1 }
          : whale
      ))
      
      // Add default copy settings
      const whale = whales.find(w => w.id === whaleId)
      if (whale) {
        setCopySettings(prev => [...prev, {
          whaleAddress: whale.address,
          copyPercentage: 5,
          maxAmountPerTrade: '100',
          minAmountPerTrade: '10',
          enabled: true
        }])
      }
      
      alert('Successfully started following whale trader!')
    } catch (error) {
      alert('Failed to follow whale trader.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollowWhale = async (whaleId: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setWhales(prev => prev.map(whale => 
        whale.id === whaleId 
          ? { ...whale, status: 'not-following', followers: whale.followers - 1 }
          : whale
      ))
      
      // Remove copy settings
      const whale = whales.find(w => w.id === whaleId)
      if (whale) {
        setCopySettings(prev => prev.filter(setting => setting.whaleAddress !== whale.address))
      }
      
      alert('Stopped following whale trader.')
    } catch (error) {
      alert('Failed to unfollow whale trader.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSettings = async (whaleAddress: string, newSettings: Partial<CopySettings>) => {
    setCopySettings(prev => prev.map(setting => 
      setting.whaleAddress === whaleAddress 
        ? { ...setting, ...newSettings }
        : setting
    ))
  }

  const followingWhales = whales.filter(whale => whale.status === 'following')
  const totalCopyTrades = copyTrades.length
  const successfulTrades = copyTrades.filter(trade => trade.status === 'executed').length

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">👥 Copy Trading</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to follow whale traders automatically</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 Copy Trading</h1>
          <p className="text-gray-600">Follow whale trades automatically with Envio real-time monitoring</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Following</h3>
            <p className="text-2xl font-bold text-blue-600">{followingWhales.length}</p>
            <p className="text-sm text-gray-500">Whale traders</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Copy Trades</h3>
            <p className="text-2xl font-bold text-green-600">{totalCopyTrades}</p>
            <p className="text-sm text-gray-500">Total executed</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Success Rate</h3>
            <p className="text-2xl font-bold text-purple-600">
              {totalCopyTrades > 0 ? Math.round((successfulTrades / totalCopyTrades) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-500">Successful trades</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Avg Return</h3>
            <p className="text-2xl font-bold text-orange-600">+12.3%</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('whales')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'whales'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🐋 Discover Whales
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'following'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Following ({followingWhales.length})
              </button>
              <button
                onClick={() => setActiveTab('trades')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trades'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Copy Trades
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Discover Whales Tab */}
        {activeTab === 'whales' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whales.map((whale) => (
              <div key={whale.id} className="bg-white rounded-lg shadow-sm p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{whale.avatar}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{whale.name}</h3>
                      <p className="text-sm text-gray-500">{whale.address}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    whale.status === 'following' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {whale.status === 'following' ? 'Following' : 'Not Following'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Portfolio Value</div>
                    <div className="font-semibold text-gray-900">{whale.totalValue}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Win Rate</div>
                    <div className="font-semibold text-green-600">{whale.winRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Followers</div>
                    <div className="font-semibold text-gray-900">{whale.followers.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Avg Return</div>
                    <div className="font-semibold text-green-600">{whale.avgReturn}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Recent Activity</div>
                  <div className="text-sm text-gray-700">{whale.recentTrades} trades in last 30 days</div>
                </div>
                
                <button
                  onClick={() => whale.status === 'following' 
                    ? handleUnfollowWhale(whale.id)
                    : handleFollowWhale(whale.id)
                  }
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded font-medium text-sm ${
                    whale.status === 'following'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : whale.status === 'following' ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Whales You're Following</h2>
            </div>
            
            {followingWhales.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">You're not following any whale traders yet</p>
                <button
                  onClick={() => setActiveTab('whales')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Discover whale traders →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {followingWhales.map((whale) => (
                  <div key={whale.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-4">{whale.avatar}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{whale.name}</h3>
                          <p className="text-sm text-gray-500">{whale.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Portfolio</div>
                          <div className="font-semibold">{whale.totalValue}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Win Rate</div>
                          <div className="font-semibold text-green-600">{whale.winRate}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500">Return</div>
                          <div className="font-semibold text-green-600">{whale.avgReturn}</div>
                        </div>
                        <button
                          onClick={() => handleUnfollowWhale(whale.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
                        >
                          Unfollow
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copy Trades Tab */}
        {activeTab === 'trades' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Copy Trades</h2>
            </div>
            
            {copyTrades.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No copy trades executed yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Whale Trader
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Whale Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        My Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {copyTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{trade.whaleName}</div>
                          <div className="text-sm text-gray-500">{trade.whaleAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {trade.fromToken} → {trade.toToken}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trade.amount} {trade.fromToken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trade.myAmount} {trade.fromToken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {trade.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            trade.status === 'executed' 
                              ? 'bg-green-100 text-green-800'
                              : trade.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {copySettings.map((setting) => {
              const whale = whales.find(w => w.address === setting.whaleAddress)
              if (!whale) return null
              
              return (
                <div key={setting.whaleAddress} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{whale.avatar}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{whale.name}</h3>
                        <p className="text-sm text-gray-500">{whale.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-3">Copy Trading</span>
                      <button
                        onClick={() => handleUpdateSettings(setting.whaleAddress, { enabled: !setting.enabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Copy Percentage (%)
                      </label>
                      <input
                        type="number"
                        value={setting.copyPercentage}
                        onChange={(e) => handleUpdateSettings(setting.whaleAddress, { 
                          copyPercentage: parseFloat(e.target.value) 
                        })}
                        min="0.1"
                        max="100"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Copy {setting.copyPercentage}% of whale's trade size
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Amount Per Trade (USDC)
                      </label>
                      <input
                        type="number"
                        value={setting.maxAmountPerTrade}
                        onChange={(e) => handleUpdateSettings(setting.whaleAddress, { 
                          maxAmountPerTrade: e.target.value 
                        })}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum USDC value per copy trade
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Amount Per Trade (USDC)
                      </label>
                      <input
                        type="number"
                        value={setting.minAmountPerTrade}
                        onChange={(e) => handleUpdateSettings(setting.whaleAddress, { 
                          minAmountPerTrade: e.target.value 
                        })}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum USDC value to execute copy trade
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {copySettings.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-4">No copy trading settings configured</p>
                <button
                  onClick={() => setActiveTab('whales')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Follow a whale trader to configure settings →
                </button>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🔍 How Copy Trading Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Real-Time Monitoring</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Envio indexer monitors whale addresses 24/7</li>
                <li>• Detects Uniswap V3 swaps in real-time</li>
                <li>• Filters trades by minimum size and frequency</li>
                <li>• Analyzes trade patterns and success rates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Automated Execution</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Copies trades within seconds of detection</li>
                <li>• Respects your configured limits and percentages</li>
                <li>• Uses same DEX and routing as whale trader</li>
                <li>• Maintains proportional position sizing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}