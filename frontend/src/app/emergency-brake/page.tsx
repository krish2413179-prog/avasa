'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

interface EmergencyBrakePermission {
  id: number
  triggerPrice: string
  isActive: boolean
  isDormant: boolean
  createdAt: string
  expiresAt: string
  maxExecutions: number
  executionsUsed: number
  cooldownPeriod: string
  lastTriggered?: string
}

interface PriceData {
  currentPrice: number
  priceChange24h: number
  lastUpdated: string
}

interface EmergencyExecution {
  id: number
  triggerPrice: string
  currentPrice: string
  ethSwapped: string
  usdcReceived: string
  executedAt: string
  txHash?: string
}

export default function EmergencyBrakePage() {
  const { address, isConnected } = useAccount()
  const [permissions, setPermissions] = useState<EmergencyBrakePermission[]>([])
  const [executions, setExecutions] = useState<EmergencyExecution[]>([])
  const [triggerPrice, setTriggerPrice] = useState<string>('1500')
  const [currentPrice, setCurrentPrice] = useState<PriceData>({
    currentPrice: 2000,
    priceChange24h: -2.5,
    lastUpdated: new Date().toISOString()
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isConnected && address) {
      loadPermissions()
      loadExecutions()
    }
    // Simulate price updates
    const interval = setInterval(updatePrice, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [isConnected, address])

  const updatePrice = () => {
    setCurrentPrice(prev => ({
      currentPrice: prev.currentPrice + (Math.random() - 0.5) * 50, // ±$25 variation
      priceChange24h: (Math.random() - 0.5) * 10, // ±5% change
      lastUpdated: new Date().toISOString()
    }))
  }

  const loadPermissions = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/permissions/user/${address}`)
      const data = await response.json()
      
      if (data.success) {
        const emergencyPermissions = data.permissions
          .filter((p: any) => p.permission_type === 'emergency_brake')
          .map((p: any) => ({
            id: p.id,
            triggerPrice: '1500', // Would be parsed from restrictions
            isActive: p.is_active,
            isDormant: true,
            createdAt: p.created_at,
            expiresAt: p.expires_at,
            maxExecutions: 5,
            executionsUsed: 0,
            cooldownPeriod: '1 hour',
            lastTriggered: undefined
          }))
        
        setPermissions(emergencyPermissions)
      }
    } catch (error) {
      console.error('Error loading permissions:', error)
    }
  }

  const loadExecutions = async () => {
    // Mock execution history
    setExecutions([
      {
        id: 1,
        triggerPrice: '1800',
        currentPrice: '1750',
        ethSwapped: '2.5 ETH',
        usdcReceived: '4,375 USDC',
        executedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        txHash: '0x1234567890abcdef'
      }
    ])
  }

  const createEmergencyBrakePermission = async () => {
    if (!triggerPrice || parseFloat(triggerPrice) <= 0) {
      setMessage('Please enter a valid trigger price')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/permissions/emergency-brake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          triggerPrice: triggerPrice
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Emergency Brake permission created: Trigger at ETH < $${triggerPrice}`)
        loadPermissions()
        setTriggerPrice('1500')
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error creating permission: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const checkEmergencyBrake = async (permissionTriggerPrice: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/permissions/check/emergency-brake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          triggerPrice: permissionTriggerPrice
        })
      })

      const data = await response.json()

      if (data.success) {
        if (data.result.shouldTrigger) {
          setMessage(`🚨 Emergency brake triggered! ETH price $${data.result.currentPrice} is below trigger $${data.result.triggerPrice}`)
          if (data.result.executed) {
            setExecutions(prev => [{
              id: Date.now(),
              triggerPrice: permissionTriggerPrice,
              currentPrice: data.result.currentPrice.toString(),
              ethSwapped: data.result.ethSwapped || '2.5 ETH',
              usdcReceived: data.result.usdcReceived || '4,750 USDC',
              executedAt: new Date().toISOString(),
              txHash: data.result.txHash
            }, ...prev])
          }
        } else {
          setMessage(`✅ Emergency brake not triggered. ETH price $${data.result.currentPrice} is above trigger $${data.result.triggerPrice}`)
        }
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error checking emergency brake: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const deactivatePermission = async (permissionId: number) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/permissions/deactivate/${permissionId}`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        setMessage('✅ Permission deactivated')
        loadPermissions()
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error deactivating permission: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const getPriceStatus = (triggerPrice: string) => {
    const trigger = parseFloat(triggerPrice)
    const current = currentPrice.currentPrice
    
    if (current <= trigger) {
      return { status: 'danger', text: 'TRIGGER ACTIVATED', color: 'bg-red-100 text-red-800' }
    } else if (current <= trigger * 1.1) {
      return { status: 'warning', text: 'APPROACHING TRIGGER', color: 'bg-yellow-100 text-yellow-800' }
    } else {
      return { status: 'safe', text: 'SAFE', color: 'bg-green-100 text-green-800' }
    }
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-red-50 to-pink-100 min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚨 Emergency Brake Management
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            EIP-7715 Stop-Loss Protection Strategy
          </p>
          <p className="text-lg text-gray-500">
            Dormant permissions that activate on price triggers
          </p>
        </div>

        {/* Current Price Display */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                ETH Price: ${currentPrice.currentPrice.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-600">
                Last updated: {new Date(currentPrice.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-lg font-semibold ${
              currentPrice.priceChange24h >= 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {currentPrice.priceChange24h >= 0 ? '+' : ''}{currentPrice.priceChange24h.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Strategy Explanation */}
        <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-800 mb-4">🔐 How Emergency Brake Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-700 mb-2">Permission Strategy:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Dormant until price trigger is activated</li>
                <li>• Automatic ETH → USDC swap on price drops</li>
                <li>• Maximum 5 executions per year</li>
                <li>• 1-hour cooldown between triggers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-2">Benefits:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Institutional-grade risk management</li>
                <li>• Protects against market crashes</li>
                <li>• No manual monitoring required</li>
                <li>• Preserves capital in stable assets</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {isConnected && (
          <>
            {/* Create New Permission */}
            <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🆕 Create Emergency Brake Permission</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger Price (USD)
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    max="10000"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="1500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Emergency swap will trigger if ETH drops below this price
                  </p>
                  <div className="mt-2">
                    {parseFloat(triggerPrice) > 0 && (
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriceStatus(triggerPrice).color}`}>
                        Current Status: {getPriceStatus(triggerPrice).text}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={createEmergencyBrakePermission}
                    disabled={loading || !triggerPrice}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Creating Permission...' : '🚨 Create Emergency Brake Permission'}
                  </button>
                </div>
              </div>

              {message && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{message}</p>
                </div>
              )}
            </div>

            {/* Active Permissions */}
            <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔐 Active Emergency Brake Permissions</h3>
              
              {permissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No emergency brake permissions created yet.</p>
                  <p className="text-sm mt-2">Create your first permission above to start protecting your assets!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {permissions.map(permission => {
                    const priceStatus = getPriceStatus(permission.triggerPrice)
                    return (
                      <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Trigger Price: ${permission.triggerPrice}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {permission.isDormant ? 'Dormant' : 'Active'} • 
                              {permission.executionsUsed}/{permission.maxExecutions} executions used
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priceStatus.color}`}>
                              {priceStatus.text}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              permission.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {permission.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Current ETH Price</p>
                            <p className="font-medium text-gray-900">${currentPrice.currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Distance to Trigger</p>
                            <p className="font-medium text-gray-900">
                              ${(currentPrice.currentPrice - parseFloat(permission.triggerPrice)).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Cooldown Period</p>
                            <p className="font-medium text-gray-900">{permission.cooldownPeriod}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Expires</p>
                            <p className="font-medium text-gray-900">
                              {new Date(permission.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => checkEmergencyBrake(permission.triggerPrice)}
                            disabled={loading || !permission.isActive}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            🔍 Check Trigger Status
                          </button>
                          <button
                            onClick={() => deactivatePermission(permission.id)}
                            disabled={loading || !permission.isActive}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            🛑 Deactivate
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Execution History */}
            {executions.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🚨 Emergency Brake Execution History</h3>
                <div className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-red-800">
                            Emergency Swap Executed
                          </h4>
                          <p className="text-sm text-red-600">
                            {new Date(execution.executedAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          TRIGGERED
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-red-500">Trigger Price</p>
                          <p className="font-medium text-red-700">${execution.triggerPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-500">Execution Price</p>
                          <p className="font-medium text-red-700">${execution.currentPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-500">ETH Swapped</p>
                          <p className="font-medium text-red-700">{execution.ethSwapped}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-500">USDC Received</p>
                          <p className="font-medium text-green-700">{execution.usdcReceived}</p>
                        </div>
                      </div>
                      
                      {execution.txHash && (
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <p className="text-xs text-red-500">Transaction Hash</p>
                          <p className="font-mono text-sm text-red-600">
                            {execution.txHash}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}