'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

interface Property {
  id: string
  name: string
  address: string
  location: string
  type: string
  totalValue: string
  yield: string
  pricePerShare: string
  totalShares: string
  availableShares: string
  userShares: string
  userInvestment: string
}

const PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Manhattan Luxury Apartments",
    address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    location: "New York, NY",
    type: "Residential",
    totalValue: "2500 ETH",
    yield: "4.2%",
    pricePerShare: "0.1 ETH",
    totalShares: "25000",
    availableShares: "12500",
    userShares: "0",
    userInvestment: "0 ETH"
  },
  {
    id: "2",
    name: "Miami Beach Condos",
    address: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    location: "Miami, FL",
    type: "Residential",
    totalValue: "1800 ETH",
    yield: "5.1%",
    pricePerShare: "0.1 ETH",
    totalShares: "18000",
    availableShares: "9000",
    userShares: "0",
    userInvestment: "0 ETH"
  },
  {
    id: "3",
    name: "Austin Tech Hub Office",
    address: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    location: "Austin, TX",
    type: "Commercial",
    totalValue: "4200 ETH",
    yield: "6.8%",
    pricePerShare: "0.1 ETH",
    totalShares: "42000",
    availableShares: "21000",
    userShares: "0",
    userInvestment: "0 ETH"
  },
  {
    id: "4",
    name: "Seattle Warehouse District",
    address: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    location: "Seattle, WA",
    type: "Industrial",
    totalValue: "3100 ETH",
    yield: "7.2%",
    pricePerShare: "0.1 ETH",
    totalShares: "31000",
    availableShares: "15500",
    userShares: "0",
    userInvestment: "0 ETH"
  },
  {
    id: "5",
    name: "Denver Mountain Resort",
    address: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    location: "Denver, CO",
    type: "Hospitality",
    totalValue: "5500 ETH",
    yield: "8.1%",
    pricePerShare: "0.1 ETH",
    totalShares: "55000",
    availableShares: "27500",
    userShares: "0",
    userInvestment: "0 ETH"
  }
]

export default function RWAPropertiesPage() {
  const { address, isConnected } = useAccount()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState<string>('1')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const filteredProperties = PROPERTIES.filter(property => 
    filter === 'all' || property.type.toLowerCase() === filter.toLowerCase()
  )

  const investInProperty = async (property: Property) => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setMessage('Please enter a valid investment amount')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: {
            type: 'invest_real_estate',
            description: `Invest ${investmentAmount} ETH in ${property.name}`,
            params: {
              propertyId: property.id,
              amount: investmentAmount,
              investmentStrategy: 'balanced',
              complianceLevel: 'enhanced'
            }
          },
          permissionContext: {
            userAddress: address,
            method: 'standard_rwa_enhanced',
            sessionKey: '0x449f7e2cc2cfbbfbf1f13d265c17f698d9f57f303e4d56d88c178196dc382951',
            chainId: 84532
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Successfully invested ${investmentAmount} ETH in ${property.name}`)
        setInvestmentAmount('1')
        setSelectedProperty(null)
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error investing: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential': return 'bg-blue-100 text-blue-800'
      case 'commercial': return 'bg-green-100 text-green-800'
      case 'industrial': return 'bg-orange-100 text-orange-800'
      case 'hospitality': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏢 Real Estate Properties
          </h1>
          <p className="text-gray-600">
            Invest in tokenized real world assets with automated yield distribution
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {isConnected && (
          <>
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Properties
              </button>
              <button
                onClick={() => setFilter('residential')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'residential' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Residential
              </button>
              <button
                onClick={() => setFilter('commercial')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'commercial' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Commercial
              </button>
              <button
                onClick={() => setFilter('industrial')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'industrial' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Industrial
              </button>
              <button
                onClick={() => setFilter('hospitality')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'hospitality' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hospitality
              </button>
            </div>

            {/* Properties Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProperties.map(property => (
                <div key={property.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
                      <p className="text-sm text-gray-600">{property.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(property.type)}`}>
                      {property.type}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Value</span>
                      <span className="text-sm font-medium">{property.totalValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Annual Yield</span>
                      <span className="text-sm font-medium text-green-600">{property.yield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Price per Share</span>
                      <span className="text-sm font-medium">{property.pricePerShare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Available Shares</span>
                      <span className="text-sm font-medium">{property.availableShares}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    💰 Invest Now
                  </button>
                </div>
              ))}
            </div>

            {/* Investment Modal */}
            {selectedProperty && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Invest in {selectedProperty.name}
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Amount (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1.0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Shares to acquire: {(parseFloat(investmentAmount || '0') / 0.1).toFixed(1)}
                    </p>
                  </div>

                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Investment:</span>
                        <span className="font-medium">{investmentAmount} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Annual Yield:</span>
                        <span className="font-medium text-green-600">
                          {(parseFloat(investmentAmount || '0') * parseFloat(selectedProperty.yield) / 100).toFixed(3)} ETH
                        </span>
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{message}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => investInProperty(selectedProperty)}
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Investing...' : '🚀 Confirm Investment'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProperty(null)
                        setMessage('')
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}