'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useAccount } from 'wagmi'

interface LendingPosition {
  id: string
  asset: string
  amount: string
  collateral: string
  collateralAmount: string
  interestRate: string
  healthFactor: string
  liquidationPrice: string
  status: 'active' | 'repaid'
}

interface AvailableAsset {
  symbol: string
  name: string
  icon: string
  borrowRate: string
  availableLiquidity: string
  ltv: string
}

export default function LendingPage() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState<'borrow' | 'positions'>('borrow')
  const [positions, setPositions] = useState<LendingPosition[]>([])
  const [availableAssets] = useState<AvailableAsset[]>([
    {
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '💵',
      borrowRate: '3.2%',
      availableLiquidity: '1.2M',
      ltv: '80%'
    },
    {
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      icon: '🔷',
      borrowRate: '2.8%',
      availableLiquidity: '450',
      ltv: '75%'
    },
    {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      icon: '₿',
      borrowRate: '4.1%',
      availableLiquidity: '12.5',
      ltv: '70%'
    }
  ])
  
  const [borrowForm, setBorrowForm] = useState({
    asset: 'USDC',
    amount: '',
    collateral: 'WETH',
    collateralAmount: ''
  })
  const [loading, setLoading] = useState(false)

  // Mock positions data
  useEffect(() => {
    setPositions([
      {
        id: '1',
        asset: 'USDC',
        amount: '500',
        collateral: 'WETH',
        collateralAmount: '0.5',
        interestRate: '3.2%',
        healthFactor: '2.1',
        liquidationPrice: '$1,800',
        status: 'active'
      },
      {
        id: '2',
        asset: 'WETH',
        amount: '0.2',
        collateral: 'WBTC',
        collateralAmount: '0.01',
        interestRate: '2.8%',
        healthFactor: '1.8',
        liquidationPrice: '$38,000',
        status: 'active'
      }
    ])
  }, [])

  const handleBorrow = async () => {
    if (!isConnected) return
    
    setLoading(true)
    
    try {
      // Simulate API call to Aave
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add new position
      const newPosition: LendingPosition = {
        id: Date.now().toString(),
        asset: borrowForm.asset,
        amount: borrowForm.amount,
        collateral: borrowForm.collateral,
        collateralAmount: borrowForm.collateralAmount,
        interestRate: availableAssets.find(a => a.symbol === borrowForm.asset)?.borrowRate || '3.0%',
        healthFactor: '2.5',
        liquidationPrice: borrowForm.collateral === 'WETH' ? '$1,600' : '$35,000',
        status: 'active'
      }
      
      setPositions(prev => [...prev, newPosition])
      setBorrowForm({ asset: 'USDC', amount: '', collateral: 'WETH', collateralAmount: '' })
      setActiveTab('positions')
      
      alert(`Successfully borrowed ${borrowForm.amount} ${borrowForm.asset}`)
    } catch (error) {
      alert('Failed to borrow. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRepay = async (positionId: string) => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPositions(prev => prev.map(pos => 
        pos.id === positionId ? { ...pos, status: 'repaid' as const } : pos
      ))
      
      alert('Successfully repaid loan')
    } catch (error) {
      alert('Failed to repay. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">🏦 Aave V3 Lending</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to borrow against your assets</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏦 Aave V3 Lending</h1>
          <p className="text-gray-600">Borrow assets against your collateral with competitive rates</p>
        </div>

        {/* Protocol Info */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Aave V3 on Base Sepolia</h3>
              <p className="text-sm text-blue-700">Pool Addresses Provider: 0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700">Total Value Locked</div>
              <div className="font-semibold text-blue-800">$2.4M</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('borrow')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'borrow'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💰 Borrow Assets
              </button>
              <button
                onClick={() => setActiveTab('positions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'positions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 My Positions ({positions.filter(p => p.status === 'active').length})
              </button>
            </nav>
          </div>
        </div>

        {/* Borrow Tab */}
        {activeTab === 'borrow' && (
          <div className="space-y-6">
            {/* Available Assets */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Available Assets to Borrow</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borrow Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Liquidity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Max LTV
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availableAssets.map((asset) => (
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {asset.borrowRate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.availableLiquidity} {asset.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.ltv}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Borrow Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Borrow Position</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset to Borrow
                  </label>
                  <select
                    value={borrowForm.asset}
                    onChange={(e) => setBorrowForm(prev => ({ ...prev, asset: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableAssets.map(asset => (
                      <option key={asset.symbol} value={asset.symbol}>
                        {asset.icon} {asset.symbol} - {asset.borrowRate}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Borrow
                  </label>
                  <input
                    type="number"
                    value={borrowForm.amount}
                    onChange={(e) => setBorrowForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collateral Asset
                  </label>
                  <select
                    value={borrowForm.collateral}
                    onChange={(e) => setBorrowForm(prev => ({ ...prev, collateral: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="WETH">🔷 WETH - 75% LTV</option>
                    <option value="WBTC">₿ WBTC - 70% LTV</option>
                    <option value="USDC">💵 USDC - 80% LTV</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collateral Amount
                  </label>
                  <input
                    type="number"
                    value={borrowForm.collateralAmount}
                    onChange={(e) => setBorrowForm(prev => ({ ...prev, collateralAmount: e.target.value }))}
                    placeholder="0.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleBorrow}
                  disabled={loading || !borrowForm.amount || !borrowForm.collateralAmount}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Creating Position...' : 'Borrow Assets'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Positions Tab */}
        {activeTab === 'positions' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Lending Positions</h2>
            </div>
            
            {positions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No lending positions found</p>
                <button
                  onClick={() => setActiveTab('borrow')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first position →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borrowed Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collateral
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Health Factor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liquidation Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {positions.map((position) => (
                      <tr key={position.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {position.amount} {position.asset}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {position.collateralAmount} {position.collateral}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {position.interestRate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            parseFloat(position.healthFactor) > 2 
                              ? 'bg-green-100 text-green-800'
                              : parseFloat(position.healthFactor) > 1.5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {position.healthFactor}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {position.liquidationPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            position.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {position.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {position.status === 'active' ? (
                            <button
                              onClick={() => handleRepay(position.id)}
                              disabled={loading}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Repay
                            </button>
                          ) : (
                            <span className="text-gray-400">Repaid</span>
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

        {/* Risk Warning */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Risk Warning</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-red-800 mb-2">Liquidation Risk</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Monitor your health factor closely</li>
                <li>• Health factor below 1.0 triggers liquidation</li>
                <li>• Volatile assets increase liquidation risk</li>
                <li>• Consider adding more collateral if needed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-800 mb-2">Interest Rates</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Variable rates change based on utilization</li>
                <li>• Interest accrues continuously</li>
                <li>• Repay early to minimize interest costs</li>
                <li>• Monitor rate changes regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}