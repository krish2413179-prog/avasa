'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

interface SmartDCAPermission {
  id: number
  propertyId: string
  propertyName: string
  weeklyAmount: string
  isActive: boolean
  createdAt: string
  expiresAt: string
  executionDay: string
  totalInvested: string
  executionCount: number
  nextExecution: string
}

interface DCAHistory {
  id: number
  amount: string
  pricePerShare: string
  sharesAcquired: string
  executedAt: string
  txHash?: string
}

const PROPERTIES = [
  { id: "1", name: "Manhattan Luxury Apartments", yield: "4.2%" },
  { id: "2", name: "Miami Beach Condos", yield: "5.1%" },
  { id: "3", name: "Austin Tech Hub Office", yield: "6.8%" },
  { id: "4", name: "Seattle Warehouse District", yield: "7.2%" },
  { id: "5", name: "Denver Mountain Resort", yield: "8.1%" },
]

export default function SmartDCAPage() {
  const { address, isConnected } = useAccount()
  const [permissions, setPermissions] = useState<SmartDCAPermission[]>([])
  const [dcaHistory, setDcaHistory] = useState<DCAHistory[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string>('')
  const [weeklyAmount, setWeeklyAmount] = useState<string>('0.1')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isConnected && address) {
      loadPermissions()
      loadDCAHistory()
    }
  }, [isConnected, address])

  const loadPermissions = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/permissions/user/${address}`)
      const data = await response.json()
      
      if (data.success) {
        const dcaPermissions = data.permissions
          .filter((p: any) => p.permission_type === 'smart_dca')
          .map((p: any) => ({
            id: p.id,
            propertyId: p.contract_address.slice(-1),
            propertyName: PROPERTIES.find(prop => prop.id === p.contract_address.slice(-1))?.name || 'Unknown Property',
            weeklyAmount: '0.1 ETH', // Would be parsed from restrictions
            isActive: p.is_active,
            createdAt: p.created_at,
            expiresAt: p.expires_at,
            executionDay: 'Monday',
            totalInvested: '5.2 ETH',
            executionCount: 12,
            nextExecution: 'Next Monday'
          }))
        
        setPermissions(dcaPermissions)
      }
    } catch (error) {
      console.error('Error loading permissions:', error)
    }
  }

  const loadDCAHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/permissions/dca-history/${address}`)
      const data = await response.json()
      
      if (data.success) {
        setDcaHistory(data.history.map((h: any) => ({
          id: h.id,
          amount: h.amount,
          pricePerShare: h.price_per_share,
          sharesAcquired: h.shares_acquired,
          executedAt: h.executed_at,
          txHash: h.tx_hash
        })))
      }
    } catch (error) {
      console.error('Error loading DCA history:', error)
    }
  }

  const createSmartDCAPermission = async () => {
    if (!selectedProperty || !weeklyAmount) {
      setMessage('Please select a property and enter weekly amount')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/permissions/smart-dca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          weeklyAmount: weeklyAmount,
          propertyId: selectedProperty
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Smart DCA permission created: ${weeklyAmount} ETH weekly into ${PROPERTIES.find(p => p.id === selectedProperty)?.name}`)
        loadPermissions()
        setSelectedProperty('')
        setWeeklyAmount('0.1')
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error creating permission: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const executeSmartDCA = async (propertyId: string, amount: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/permissions/execute/smart-dca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          propertyId: propertyId,
          weeklyAmount: amount
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Smart DCA executed: ${amount} ETH into Property #${propertyId}`)
        loadDCAHistory()
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error executing Smart DCA: ${error}`)
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

  const isMonday = () => {
    return new Date().getDay() === 1
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📈 Smart DCA Management
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            EIP-7715 Dollar Cost Averaging Strategy
          </p>
          <p className="text-lg text-gray-500">
            Weekly investments with rate limits and day restrictions
          </p>
        </div>

        {/* Strategy Explanation */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">🔐 How Smart DCA Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Permission Strategy:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Rate limit: Maximum amount per week</li>
                <li>• Day restriction: Only executes on Mondays</li>
                <li>• Time window: 604800 seconds (1 week) reset period</li>
                <li>• Hack protection: Limited to weekly allowance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Benefits:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Reduces market timing risk</li>
                <li>• Averages out price volatility</li>
                <li>• Automated consistent investing</li>
                <li>• Maximum security with rate limits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Day Status */}
        <div className="mb-8 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h4>
              <p className="text-sm text-gray-600">
                {isMonday() ? '✅ DCA execution day - You can execute Smart DCA today!' : '⏳ DCA executes on Mondays only'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              isMonday() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {isMonday() ? 'Execution Day' : 'Waiting for Monday'}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🆕 Create Smart DCA Permission</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Property
                  </label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a property...</option>
                    {PROPERTIES.map(property => (
                      <option key={property.id} value={property.id}>
                        #{property.id} {property.name} - {property.yield} yield
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10"
                    value={weeklyAmount}
                    onChange={(e) => setWeeklyAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ ${(parseFloat(weeklyAmount || '0') * 3000).toFixed(0)} USD at current prices
                  </p>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={createSmartDCAPermission}
                    disabled={loading || !selectedProperty || !weeklyAmount}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Creating Permission...' : '📈 Create Smart DCA Permission'}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔐 Active Smart DCA Permissions</h3>
              
              {permissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No Smart DCA permissions created yet.</p>
                  <p className="text-sm mt-2">Create your first permission above to start dollar cost averaging!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {permissions.map(permission => (
                    <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{permission.propertyName}</h4>
                          <p className="text-sm text-gray-600">
                            {permission.weeklyAmount} weekly • Executes on {permission.executionDay}s
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
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
                          <p className="text-xs text-gray-500">Total Invested</p>
                          <p className="font-medium text-gray-900">{permission.totalInvested}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Executions</p>
                          <p className="font-medium text-gray-900">{permission.executionCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Next Execution</p>
                          <p className="font-medium text-gray-900">{permission.nextExecution}</p>
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
                          onClick={() => executeSmartDCA(permission.propertyId, permission.weeklyAmount.split(' ')[0])}
                          disabled={loading || !permission.isActive || !isMonday()}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {isMonday() ? '🚀 Execute DCA Now' : '⏳ Wait for Monday'}
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
                  ))}
                </div>
              )}
            </div>

            {/* DCA History */}
            {dcaHistory.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 DCA Execution History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Price/Share</th>
                        <th className="text-left py-2">Shares Acquired</th>
                        <th className="text-left py-2">Transaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dcaHistory.map((execution) => (
                        <tr key={execution.id} className="border-b border-gray-100">
                          <td className="py-2">
                            {new Date(execution.executedAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 font-medium text-blue-600">
                            {execution.amount} ETH
                          </td>
                          <td className="py-2">
                            {execution.pricePerShare} ETH
                          </td>
                          <td className="py-2 font-medium text-green-600">
                            {execution.sharesAcquired}
                          </td>
                          <td className="py-2">
                            <span className="text-xs text-gray-500">
                              {execution.txHash ? `${execution.txHash.slice(0, 10)}...` : 'Simulated'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}