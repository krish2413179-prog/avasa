'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

interface YieldFarmerPermission {
  id: number
  propertyId: string
  propertyName: string
  isActive: boolean
  createdAt: string
  expiresAt: string
  autoCompounding: boolean
  yieldClaimed: string
  sharesAcquired: string
}

interface PropertyOption {
  id: string
  name: string
  address: string
  yield: string
  pricePerShare: string
}

const PROPERTIES: PropertyOption[] = [
  { id: "1", name: "Manhattan Luxury Apartments", address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be", yield: "4.2%", pricePerShare: "0.1 ETH" },
  { id: "2", name: "Miami Beach Condos", address: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968", yield: "5.1%", pricePerShare: "0.1 ETH" },
  { id: "3", name: "Austin Tech Hub Office", address: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883", yield: "6.8%", pricePerShare: "0.1 ETH" },
  { id: "4", name: "Seattle Warehouse District", address: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26", yield: "7.2%", pricePerShare: "0.1 ETH" },
  { id: "5", name: "Denver Mountain Resort", address: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC", yield: "8.1%", pricePerShare: "0.1 ETH" },
]

export default function YieldFarmerPage() {
  const { address, isConnected } = useAccount()
  const [permissions, setPermissions] = useState<YieldFarmerPermission[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [executionResults, setExecutionResults] = useState<any[]>([])

  // Load user's yield farmer permissions
  useEffect(() => {
    if (isConnected && address) {
      loadPermissions()
    }
  }, [isConnected, address])

  const loadPermissions = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/permissions/user/${address}`)
      const data = await response.json()
      
      if (data.success) {
        const yieldFarmerPermissions = data.permissions
          .filter((p: any) => p.permission_type === 'yield_farmer')
          .map((p: any) => ({
            id: p.id,
            propertyId: p.contract_address.slice(-1), // Extract property ID from contract address
            propertyName: PROPERTIES.find(prop => prop.address === p.contract_address)?.name || 'Unknown Property',
            isActive: p.is_active,
            createdAt: p.created_at,
            expiresAt: p.expires_at,
            autoCompounding: true,
            yieldClaimed: '0.05 ETH',
            sharesAcquired: '0.5'
          }))
        
        setPermissions(yieldFarmerPermissions)
      }
    } catch (error) {
      console.error('Error loading permissions:', error)
    }
  }

  const createYieldFarmerPermission = async () => {
    if (!selectedProperty) {
      setMessage('Please select a property')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/permissions/yield-farmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          propertyId: selectedProperty
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Yield Farmer permission created for ${PROPERTIES.find(p => p.id === selectedProperty)?.name}`)
        loadPermissions() // Reload permissions
        setSelectedProperty('')
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error creating permission: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const executeYieldFarming = async (propertyId: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/permissions/execute/yield-farmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          propertyId: propertyId
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Yield farming executed for Property #${propertyId}`)
        setExecutionResults(prev => [data.result, ...prev])
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error executing yield farming: ${error}`)
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

  return (
    <Layout>
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌾 Yield Farmer Management
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            EIP-7715 Auto-Compounding Strategy
          </p>
          <p className="text-lg text-gray-500">
            Automatically reinvest rental income for compound growth
          </p>
        </div>

        {/* Strategy Explanation */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">🔐 How Yield Farmer Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-700 mb-2">Permission Strategy:</h4>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Only spend funds generated from yield claims</li>
                <li>• Automatic reinvestment in the same property</li>
                <li>• One signature enables infinite compound growth</li>
                <li>• Cannot access your original investment funds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-700 mb-2">Benefits:</h4>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Creates compound interest automatically</li>
                <li>• No manual claiming and reinvesting needed</li>
                <li>• Maximizes long-term returns</li>
                <li>• Gas-efficient batch operations</li>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🆕 Create Yield Farmer Permission</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Property for Auto-Compounding
                  </label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Choose a property...</option>
                    {PROPERTIES.map(property => (
                      <option key={property.id} value={property.id}>
                        #{property.id} {property.name} - {property.yield} yield
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={createYieldFarmerPermission}
                    disabled={loading || !selectedProperty}
                    className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Creating Permission...' : '🌾 Create Yield Farmer Permission'}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔐 Active Yield Farmer Permissions</h3>
              
              {permissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No yield farmer permissions created yet.</p>
                  <p className="text-sm mt-2">Create your first permission above to start auto-compounding!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {permissions.map(permission => (
                    <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{permission.propertyName}</h4>
                          <p className="text-sm text-gray-600">Property #{permission.propertyId}</p>
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
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Yield Claimed</p>
                          <p className="font-medium text-gray-900">{permission.yieldClaimed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Shares Acquired</p>
                          <p className="font-medium text-gray-900">{permission.sharesAcquired}</p>
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
                          onClick={() => executeYieldFarming(permission.propertyId)}
                          disabled={loading || !permission.isActive}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          🚀 Execute Yield Farming
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

            {/* Execution Results */}
            {executionResults.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Recent Executions</h3>
                <div className="space-y-4">
                  {executionResults.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Yield Claimed</p>
                          <p className="font-medium text-green-600">{result.yieldClaimed || '0.05 ETH'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Shares Acquired</p>
                          <p className="font-medium text-blue-600">{result.sharesAcquired || '0.5'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Compound Effect</p>
                          <p className="font-medium text-purple-600">{result.compoundEffect || '2.6 ETH/year'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Transaction</p>
                          <p className="font-medium text-gray-600 text-xs">
                            {result.txHashes?.[0]?.slice(0, 10) || 'Simulated'}...
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{result.message}</p>
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