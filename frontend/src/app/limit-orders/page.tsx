'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useAccount } from 'wagmi'

interface LimitOrder {
  id: string
  type: 'buy' | 'sell'
  fromToken: string
  toToken: string
  amount: string
  targetPrice: string
  currentPrice: string
  status: 'active' | 'executed' | 'cancelled' | 'expired'
  createdAt: string
  expiresAt: string
  executedAt?: string
}

interface PriceAlert {
  id: string
  token: string
  condition: 'above' | 'below'
  targetPrice: string
  currentPrice: string
  status: 'active' | 'triggered'
  createdAt: string
}

export default function LimitOrdersPage() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState<'orders' | 'create' | 'alerts'>('orders')
  const [orders, setOrders] = useState<LimitOrder[]>([])
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [loading, setLoading] = useState(false)
  
  const [newOrder, setNewOrder] = useState({
    type: 'buy' as 'buy' | 'sell',
    fromToken: 'USDC',
    toToken: 'ETH',
    amount: '',
    targetPrice: '',
    expiryDays: 7
  })
  
  const [newAlert, setNewAlert] = useState({
    token: 'ETH',
    condition: 'below' as 'above' | 'below',
    targetPrice: ''
  })

  // Mock current prices
  const currentPrices = {
    'ETH': '2450.00',
    'WBTC': '42500.00',
    'USDC': '1.00'
  }

  // Mock data
  useEffect(() => {
    setOrders([
      {
        id: '1',
        type: 'buy',
        fromToken: 'USDC',
        toToken: 'ETH',
        amount: '1000',
        targetPrice: '2200.00',
        currentPrice: '2450.00',
        status: 'active',
        createdAt: '2024-12-23',
        expiresAt: '2024-12-30'
      },
      {
        id: '2',
        type: 'sell',
        fromToken: 'ETH',
        toToken: 'USDC',
        amount: '0.5',
        targetPrice: '2800.00',
        currentPrice: '2450.00',
        status: 'active',
        createdAt: '2024-12-22',
        expiresAt: '2024-12-29'
      },
      {
        id: '3',
        type: 'buy',
        fromToken: 'USDC',
        toToken: 'WBTC',
        amount: '2000',
        targetPrice: '40000.00',
        currentPrice: '42500.00',
        status: 'executed',
        createdAt: '2024-12-20',
        expiresAt: '2024-12-27',
        executedAt: '2024-12-21'
      }
    ])

    setAlerts([
      {
        id: '1',
        token: 'ETH',
        condition: 'below',
        targetPrice: '2300.00',
        currentPrice: '2450.00',
        status: 'active',
        createdAt: '2024-12-23'
      },
      {
        id: '2',
        token: 'WBTC',
        condition: 'above',
        targetPrice: '45000.00',
        currentPrice: '42500.00',
        status: 'active',
        createdAt: '2024-12-22'
      }
    ])
  }, [])

  const handleCreateOrder = async () => {
    if (!isConnected) return
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const order: LimitOrder = {
        id: Date.now().toString(),
        type: newOrder.type,
        fromToken: newOrder.fromToken,
        toToken: newOrder.toToken,
        amount: newOrder.amount,
        targetPrice: newOrder.targetPrice,
        currentPrice: currentPrices[newOrder.toToken as keyof typeof currentPrices] || '0',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + newOrder.expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      
      setOrders(prev => [...prev, order])
      setNewOrder({
        type: 'buy',
        fromToken: 'USDC',
        toToken: 'ETH',
        amount: '',
        targetPrice: '',
        expiryDays: 7
      })
      setActiveTab('orders')
      
      alert('Limit order created successfully!')
    } catch (error) {
      alert('Failed to create limit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlert = async () => {
    if (!isConnected) return
    
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const alert: PriceAlert = {
        id: Date.now().toString(),
        token: newAlert.token,
        condition: newAlert.condition,
        targetPrice: newAlert.targetPrice,
        currentPrice: currentPrices[newAlert.token as keyof typeof currentPrices] || '0',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setAlerts(prev => [...prev, alert])
      setNewAlert({
        token: 'ETH',
        condition: 'below',
        targetPrice: ''
      })
      
      alert('Price alert created successfully!')
    } catch (error) {
      alert('Failed to create price alert.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      ))
      
      alert('Order cancelled successfully.')
    } catch (error) {
      alert('Failed to cancel order.')
    } finally {
      setLoading(false)
    }
  }

  const activeOrders = orders.filter(order => order.status === 'active')
  const executedOrders = orders.filter(order => order.status === 'executed')
  const activeAlerts = alerts.filter(alert => alert.status === 'active')

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">📋 Limit Orders</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to set up price-triggered trades</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Limit Orders</h1>
          <p className="text-gray-600">Buy the dip with AI-powered price monitoring and automatic execution</p>
        </div>

        {/* Current Prices */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">📊 Current Market Prices</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(currentPrices).map(([token, price]) => (
              <div key={token} className="bg-white rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{token}</span>
                  <span className="text-lg font-bold text-green-600">${price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Active Orders</h3>
            <p className="text-2xl font-bold text-blue-600">{activeOrders.length}</p>
            <p className="text-sm text-gray-500">Waiting for execution</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Executed Orders</h3>
            <p className="text-2xl font-bold text-green-600">{executedOrders.length}</p>
            <p className="text-sm text-gray-500">Successfully filled</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Price Alerts</h3>
            <p className="text-2xl font-bold text-purple-600">{activeAlerts.length}</p>
            <p className="text-sm text-gray-500">Active monitoring</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Success Rate</h3>
            <p className="text-2xl font-bold text-orange-600">
              {orders.length > 0 ? Math.round((executedOrders.length / orders.length) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-500">Order execution</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 My Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ➕ Create Order
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'alerts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔔 Price Alerts ({alerts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Limit Orders</h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No limit orders created yet</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first limit order →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expires
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.type === 'buy' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.fromToken} → {order.toToken}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount} {order.fromToken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.targetPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.currentPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'active' 
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'executed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'cancelled'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.expiresAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {order.status === 'active' ? (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={loading}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 text-xs"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Order Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Create Limit Order</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setNewOrder(prev => ({ ...prev, type: 'buy' }))}
                    className={`px-4 py-2 rounded-md font-medium ${
                      newOrder.type === 'buy'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Buy Order
                  </button>
                  <button
                    onClick={() => setNewOrder(prev => ({ ...prev, type: 'sell' }))}
                    className={`px-4 py-2 rounded-md font-medium ${
                      newOrder.type === 'sell'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Sell Order
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Token
                  </label>
                  <select
                    value={newOrder.fromToken}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, fromToken: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USDC">💵 USDC</option>
                    <option value="ETH">🔷 ETH</option>
                    <option value="WBTC">₿ WBTC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Token
                  </label>
                  <select
                    value={newOrder.toToken}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, toToken: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ETH">🔷 ETH</option>
                    <option value="WBTC">₿ WBTC</option>
                    <option value="USDC">💵 USDC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ({newOrder.fromToken})
                  </label>
                  <input
                    type="number"
                    value={newOrder.amount}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Price (USD)
                  </label>
                  <input
                    type="number"
                    value={newOrder.targetPrice}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, targetPrice: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: ${currentPrices[newOrder.toToken as keyof typeof currentPrices]}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry (Days)
                  </label>
                  <select
                    value={newOrder.expiryDays}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, expiryDays: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 Day</option>
                    <option value={7}>1 Week</option>
                    <option value={30}>1 Month</option>
                    <option value={90}>3 Months</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleCreateOrder}
                disabled={loading || !newOrder.amount || !newOrder.targetPrice}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Creating Order...' : `Create ${newOrder.type.toUpperCase()} Order`}
              </button>
            </div>
          </div>
        )}

        {/* Price Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Create Alert Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Price Alert</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                  <select
                    value={newAlert.token}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, token: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ETH">🔷 ETH</option>
                    <option value="WBTC">₿ WBTC</option>
                    <option value="USDC">💵 USDC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, condition: e.target.value as 'above' | 'below' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Price (USD)</label>
                  <input
                    type="number"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={handleCreateAlert}
                disabled={loading || !newAlert.targetPrice}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Creating...' : 'Create Alert'}
              </button>
            </div>
            
            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active Price Alerts</h3>
              </div>
              
              {alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No price alerts configured</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-6 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {alert.token} {alert.condition} ${alert.targetPrice}
                        </div>
                        <div className="text-sm text-gray-500">
                          Current: ${alert.currentPrice} • Created: {alert.createdAt}
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        alert.status === 'active' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">⚡ How Limit Orders Work</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Price Monitoring</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Chainlink price feeds provide real-time data</li>
                <li>• Orders monitored 24/7 for trigger conditions</li>
                <li>• Sub-second execution when price targets hit</li>
                <li>• Automatic expiry handling for time-based orders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Smart Execution</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Executes on Uniswap V3 with optimal routing</li>
                <li>• Slippage protection and MEV resistance</li>
                <li>• Gas optimization for cost-effective trades</li>
                <li>• Partial fills supported for large orders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}