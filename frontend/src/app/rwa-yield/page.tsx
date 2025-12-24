'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useAccount } from 'wagmi'

interface Property {
  id: number
  name: string
  address: string
  totalInvestment: string
  availableYield: string
  lastClaim: string
  yieldRate: string
}

export default function RWAYieldPage() {
  const { isConnected, address } = useAccount()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [claimingId, setClaimingId] = useState<number | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    setProperties([
      {
        id: 1,
        name: 'Manhattan Luxury Apartments',
        address: '0x1234...5678',
        totalInvestment: '5.2 ETH',
        availableYield: '0.18 ETH',
        lastClaim: '2024-12-20',
        yieldRate: '4.2%'
      },
      {
        id: 2,
        name: 'Miami Beach Condos',
        address: '0x2345...6789',
        totalInvestment: '3.1 ETH',
        availableYield: '0.12 ETH',
        lastClaim: '2024-12-18',
        yieldRate: '5.1%'
      },
      {
        id: 3,
        name: 'Austin Tech Hub Office',
        address: '0x3456...7890',
        totalInvestment: '8.5 ETH',
        availableYield: '0.31 ETH',
        lastClaim: '2024-12-15',
        yieldRate: '6.8%'
      }
    ])
  }, [])

  const handleClaimYield = async (propertyId: number) => {
    if (!isConnected) return
    
    setClaimingId(propertyId)
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update the property to show claimed yield
      setProperties(prev => prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, availableYield: '0.00 ETH', lastClaim: new Date().toISOString().split('T')[0] }
          : prop
      ))
      
      alert(`Successfully claimed yield from ${properties.find(p => p.id === propertyId)?.name}`)
    } catch (error) {
      alert('Failed to claim yield. Please try again.')
    } finally {
      setClaimingId(null)
      setLoading(false)
    }
  }

  const handleClaimAll = async () => {
    if (!isConnected) return
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Update all properties
      setProperties(prev => prev.map(prop => ({
        ...prop,
        availableYield: '0.00 ETH',
        lastClaim: new Date().toISOString().split('T')[0]
      })))
      
      alert('Successfully claimed yield from all properties!')
    } catch (error) {
      alert('Failed to claim all yields. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalAvailableYield = properties.reduce((sum, prop) => {
    const yield_amount = parseFloat(prop.availableYield.split(' ')[0])
    return sum + yield_amount
  }, 0)

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">💰 RWA Yield Claims</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to view and claim rental income from your properties</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 RWA Yield Claims</h1>
          <p className="text-gray-600">Claim rental income from your tokenized real estate investments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Available Yield</h3>
            <p className="text-2xl font-bold text-green-600">{totalAvailableYield.toFixed(3)} ETH</p>
            <p className="text-sm text-gray-500">≈ ${(totalAvailableYield * 2500).toFixed(2)} USD</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Properties Owned</h3>
            <p className="text-2xl font-bold text-blue-600">{properties.length}</p>
            <p className="text-sm text-gray-500">Active investments</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Yield Rate</h3>
            <p className="text-2xl font-bold text-purple-600">5.4%</p>
            <p className="text-sm text-gray-500">Annual percentage</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Next Distribution</h3>
            <p className="text-2xl font-bold text-orange-600">Dec 31</p>
            <p className="text-sm text-gray-500">Estimated date</p>
          </div>
        </div>

        {/* Claim All Button */}
        {totalAvailableYield > 0 && (
          <div className="mb-6">
            <button
              onClick={handleClaimAll}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Claiming All...' : `💰 Claim All Yield (${totalAvailableYield.toFixed(3)} ETH)`}
            </button>
          </div>
        )}

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Property Investments</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yield Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Yield
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Claim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500">{property.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.totalInvestment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {property.yieldRate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.availableYield}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.lastClaim}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {parseFloat(property.availableYield.split(' ')[0]) > 0 ? (
                        <button
                          onClick={() => handleClaimYield(property.id)}
                          disabled={claimingId === property.id}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {claimingId === property.id ? 'Claiming...' : 'Claim Yield'}
                        </button>
                      ) : (
                        <span className="text-gray-400">No yield available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yield Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 How Yield Distribution Works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Automatic Distribution</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Rental income collected monthly from tenants</li>
                <li>• Property management fees deducted (5-8%)</li>
                <li>• Net income distributed to token holders</li>
                <li>• Yield calculated based on ownership percentage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Claiming Process</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Yield accumulates in smart contract</li>
                <li>• Claim anytime after distribution</li>
                <li>• Gas fees paid by claimant</li>
                <li>• Automatic reinvestment options available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}