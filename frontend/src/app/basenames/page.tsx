'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

export default function BasenamesPage() {
  const { address, isConnected } = useAccount()
  const [basename, setBasename] = useState<string>('')
  const [targetAddress, setTargetAddress] = useState<string>('')
  const [resolveResult, setResolveResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'resolve' | 'set'>('resolve')

  const resolveBasename = async () => {
    if (!basename) {
      setMessage('Please enter a basename')
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
            type: 'resolve_basename',
            description: `Resolve ${basename} to wallet address`,
            params: {
              action: 'resolve',
              basename: basename
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
        setResolveResult(data)
        setMessage(`✅ Successfully resolved ${basename}`)
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error resolving basename: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const setBasenameRecord = async () => {
    if (!basename || !targetAddress) {
      setMessage('Please enter both basename and target address')
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
            type: 'resolve_basename',
            description: `Set ${basename} to point to ${targetAddress}`,
            params: {
              action: 'set',
              basename: basename,
              address: targetAddress
            }
          },
          permissionContext: {
            userAddress: address,
            method: 'eip7715_advanced',
            sessionKey: '0x449f7e2cc2cfbbfbf1f13d265c17f698d9f57f303e4d56d88c178196dc382951',
            chainId: 84532
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ Successfully set ${basename} to point to ${targetAddress}`)
        setBasename('')
        setTargetAddress('')
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error setting basename: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏷️ Basenames Management
          </h1>
          <p className="text-gray-600">
            Resolve and manage human-readable addresses on Base using ENS
          </p>
        </div>

        {/* Protocol Info */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">🔗 Base ENS Integration</h3>
          <div className="text-sm">
            <p className="text-green-700 mb-2"><strong>L2 Resolver:</strong></p>
            <p className="font-mono text-green-600 text-xs">0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA</p>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {isConnected && (
          <>
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('resolve')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'resolve'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🔍 Resolve Basename
                  </button>
                  <button
                    onClick={() => setActiveTab('set')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'set'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📝 Set Basename Record
                  </button>
                </nav>
              </div>
            </div>

            {/* Resolve Tab */}
            {activeTab === 'resolve' && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🔍 Resolve Basename to Address</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Basename (e.g., alice.base.eth)
                    </label>
                    <input
                      type="text"
                      value={basename}
                      onChange={(e) => setBasename(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="alice.base.eth"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={resolveBasename}
                      disabled={loading || !basename}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Resolving...' : '🔍 Resolve Address'}
                    </button>
                  </div>
                </div>

                {resolveResult && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Resolution Result</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-green-600">Basename:</span>
                        <span className="ml-2 font-mono">{resolveResult.basename}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Resolved Address:</span>
                        <span className="ml-2 font-mono text-xs">{resolveResult.resolvedAddress}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Namehash:</span>
                        <span className="ml-2 font-mono text-xs">{resolveResult.namehash}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Set Tab */}
            {activeTab === 'set' && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 Set Basename Record</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Basename (e.g., myname.base.eth)
                    </label>
                    <input
                      type="text"
                      value={basename}
                      onChange={(e) => setBasename(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="myname.base.eth"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Address
                    </label>
                    <input
                      type="text"
                      value={targetAddress}
                      onChange={(e) => setTargetAddress(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6"
                    />
                  </div>
                  
                  <button
                    onClick={setBasenameRecord}
                    disabled={loading || !basename || !targetAddress}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Setting Record...' : '📝 Set Basename Record'}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Setting basename records requires advanced permissions (EIP-7715)</li>
                    <li>• You must own the basename to set its records</li>
                    <li>• This operation may require gas fees</li>
                    <li>• Changes may take a few minutes to propagate</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{message}</p>
                </div>
              </div>
            )}

            {/* Examples */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Examples</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Common Basenames to Resolve:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• alice.base.eth</li>
                    <li>• bob.base.eth</li>
                    <li>• charlie.base.eth</li>
                    <li>• defi.base.eth</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">AI Commands:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "Resolve alice.base.eth to address"</li>
                    <li>• "Set myname.base.eth to 0x123..."</li>
                    <li>• "Look up bob.base.eth"</li>
                    <li>• "Update my basename record"</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}