'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'

interface Stream {
  id: string
  recipient: string
  flowRate: string
  token: string
  status: 'active' | 'paused' | 'stopped'
  totalStreamed: string
  startedAt: string
  lastUpdated: string
}

const STREAM_PRESETS = [
  { label: 'Salary (Monthly)', rate: '1000 USDC/month', description: 'Standard monthly salary' },
  { label: 'Freelance (Weekly)', rate: '250 USDC/week', description: 'Weekly freelance payment' },
  { label: 'Subscription (Daily)', rate: '10 USDC/day', description: 'Daily subscription fee' },
  { label: 'Hourly Rate', rate: '50 USDC/hour', description: 'Hourly consulting rate' },
  { label: 'Custom', rate: '', description: 'Set your own rate' },
]

export default function StreamsPage() {
  const { address, isConnected } = useAccount()
  const [streams, setStreams] = useState<Stream[]>([])
  const [recipient, setRecipient] = useState<string>('')
  const [streamRate, setStreamRate] = useState<string>('')
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Mock streams data
  useEffect(() => {
    if (isConnected) {
      setStreams([
        {
          id: '1',
          recipient: 'alice.base.eth',
          flowRate: '5 USDC/day',
          token: 'fUSDCx',
          status: 'active',
          totalStreamed: '150 USDC',
          startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          recipient: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
          flowRate: '10 USD/2 hours',
          token: 'fUSDCx',
          status: 'paused',
          totalStreamed: '240 USDC',
          startedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ])
    }
  }, [isConnected])

  const createStream = async () => {
    if (!recipient || !streamRate) {
      setMessage('Please enter recipient and stream rate')
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
            type: 'stream_money',
            description: `Create money stream of ${streamRate} to ${recipient}`,
            params: {
              action: 'create',
              recipient: recipient,
              streamRate: streamRate,
              superToken: 'fUSDCx'
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
        setMessage(`✅ Successfully created stream of ${streamRate} to ${recipient}`)
        // Add new stream to list
        const newStream: Stream = {
          id: Date.now().toString(),
          recipient,
          flowRate: streamRate,
          token: 'fUSDCx',
          status: 'active',
          totalStreamed: '0 USDC',
          startedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
        setStreams(prev => [newStream, ...prev])
        setRecipient('')
        setStreamRate('')
        setSelectedPreset('')
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error creating stream: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const stopStream = async (streamId: string, streamRecipient: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: {
            type: 'stream_money',
            description: `Stop money stream to ${streamRecipient}`,
            params: {
              action: 'stop',
              recipient: streamRecipient,
              superToken: 'fUSDCx'
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
        setMessage(`✅ Successfully stopped stream to ${streamRecipient}`)
        setStreams(prev => prev.map(stream => 
          stream.id === streamId 
            ? { ...stream, status: 'stopped' as const }
            : stream
        ))
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error stopping stream: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePresetSelect = (preset: string, rate: string) => {
    setSelectedPreset(preset)
    setStreamRate(rate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'stopped': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💧 Money Streams
          </h1>
          <p className="text-gray-600">
            Create continuous money streams using Superfluid protocol
          </p>
        </div>

        {/* Protocol Info */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🔗 Superfluid Protocol Integration</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700 mb-2"><strong>Host Contract:</strong></p>
              <p className="font-mono text-blue-600 text-xs">0x4C073B3baB6d88B6575C8743282064147A6A6903</p>
            </div>
            <div>
              <p className="text-blue-700 mb-2"><strong>fUSDCx Token:</strong></p>
              <p className="font-mono text-blue-600 text-xs">0x42bb40bF79730451B11f6De1CbA222F17b87Afd7</p>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {isConnected && (
          <>
            {/* Create Stream */}
            <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🆕 Create New Stream</h3>
              
              {/* Stream Presets */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Stream Presets
                </label>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {STREAM_PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetSelect(preset.label, preset.rate)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedPreset === preset.label
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm">{preset.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                      {preset.rate && (
                        <div className="text-xs font-mono mt-1">{preset.rate}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address or Basename
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="alice.base.eth or 0x123..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream Rate
                  </label>
                  <input
                    type="text"
                    value={streamRate}
                    onChange={(e) => setStreamRate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5 USDC/day or 10 USD/2 hours"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Examples: "5 USDC/day", "10 USD/2 hours", "100 USDC/week"
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={createStream}
                  disabled={loading || !recipient || !streamRate}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Creating Stream...' : '💧 Create Stream'}
                </button>

                {message && (
                  <div className="ml-4 p-3 bg-gray-50 rounded-lg flex-1">
                    <p className="text-sm text-gray-700">{message}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Streams */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🌊 Your Active Streams</h3>
              
              {streams.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No streams created yet.</p>
                  <p className="text-sm mt-2">Create your first money stream above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {streams.map(stream => (
                    <div key={stream.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Stream to {stream.recipient}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {stream.flowRate} • {stream.token}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stream.status)}`}>
                          {stream.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Total Streamed</p>
                          <p className="font-medium text-green-600">{stream.totalStreamed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Started</p>
                          <p className="font-medium text-gray-900">
                            {new Date(stream.startedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Updated</p>
                          <p className="font-medium text-gray-900">
                            {new Date(stream.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Flow Rate</p>
                          <p className="font-medium text-blue-600">{stream.flowRate}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        {stream.status === 'active' && (
                          <button
                            onClick={() => stopStream(stream.id, stream.recipient)}
                            disabled={loading}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                          >
                            🛑 Stop Stream
                          </button>
                        )}
                        <button
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
                        >
                          📊 View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}