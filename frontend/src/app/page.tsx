'use client'

import { useState } from 'react'
import { AgentInput } from '@/components/AgentInput'
import { ActionCard } from '@/components/ActionCard'
import { WalletConnect } from '@/components/WalletConnect'
import { Layout } from '@/components/Layout'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()
  const [parsedAction, setParsedAction] = useState(null)
  const [actionLog, setActionLog] = useState<string[]>([])

  const handleActionParsed = (action: any) => {
    setParsedAction(action)
    setActionLog(prev => [...prev, `🤖 AI Parsed: ${action.description}`])
  }

  const handleActionExecuted = (result: string) => {
    setActionLog(prev => [...prev, `✅ ${result}`])
    setParsedAction(null)
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏢 PropChain AI
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Real World Asset (RWA) Investment Platform
          </p>
          <p className="text-lg text-gray-500">
            AI-Powered • MetaMask Advanced Permissions • Envio Indexing
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">🏠 Tokenized Real Estate</h3>
            <p className="text-sm text-gray-600">Fractional ownership of properties with automated yield distribution</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Portfolio Management</h3>
            <p className="text-sm text-gray-600">Groq AI analyzes market data for optimal investment strategies</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
            <h3 className="font-semibold text-gray-900 mb-2">🔐 Advanced Permissions</h3>
            <p className="text-sm text-gray-600">EIP-7702 smart accounts with compliance automation</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Real-time Analytics</h3>
            <p className="text-sm text-gray-600">Envio indexer provides live performance metrics</p>
          </div>
        </div>

        {/* New Advanced DeFi Features */}
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">🚀 Advanced Trading Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">⚖️ Auto-Rebalance Portfolio</h4>
              <p className="text-sm text-blue-700 mb-3">Intelligent robo-advisor that maintains target allocations</p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• "Keep my portfolio 60% Real Estate and 40% ETH"</div>
                <div>• Automatic weekly/monthly rebalancing</div>
                <div>• Chainlink price feeds + Uniswap V3</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-2">👥 Copy Trading</h4>
              <p className="text-sm text-green-700 mb-3">Follow whale trades automatically with Envio monitoring</p>
              <div className="text-xs text-green-600 space-y-1">
                <div>• "Copy every trade from nancy.base.eth"</div>
                <div>• Real-time Envio swap detection</div>
                <div>• Configurable copy percentage & limits</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-2">📋 Limit Orders</h4>
              <p className="text-sm text-purple-700 mb-3">Buy the dip with AI-powered price monitoring</p>
              <div className="text-xs text-purple-600 space-y-1">
                <div>• "Buy ETH if price drops below $1500"</div>
                <div>• Chainlink price monitoring</div>
                <div>• Automatic execution on Uniswap V3</div>
              </div>
            </div>
          </div>
        </div>

        {/* EIP-7715 Advanced Permission Strategies */}
        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-emerald-800 mb-4">🔐 EIP-7715 Advanced Permission Strategies</h3>
          <p className="text-sm text-emerald-700 mb-4">
            The "Best Use" of MetaMask Advanced Permissions for automated wealth management with compound interest
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-2">🌾 Yield Farmer (Auto-Compounding)</h4>
              <p className="text-sm text-yellow-700 mb-3">Automatically reinvest rental income for compound growth</p>
              <div className="text-xs text-yellow-600 space-y-1 mb-3">
                <div>• "Turn on Auto-Compound for property 1"</div>
                <div>• Only spend funds from yield claims</div>
                <div>• Creates infinite compound interest</div>
                <div>• One signature = Automated growth</div>
              </div>
              <a 
                href="/yield-farmer"
                className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm font-medium"
              >
                🌾 Manage Yield Farmer
              </a>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">📈 Smart DCA (Dollar Cost Averaging)</h4>
              <p className="text-sm text-blue-700 mb-3">Weekly investments with rate limits and day restrictions</p>
              <div className="text-xs text-blue-600 space-y-1 mb-3">
                <div>• "Invest $50 every Monday in property 2"</div>
                <div>• Rate limit: 50 USDC per week maximum</div>
                <div>• Only executes on Mondays (safety)</div>
                <div>• Even if hacked, only $50/week at risk</div>
              </div>
              <a 
                href="/smart-dca"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                📈 Manage Smart DCA
              </a>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-400">
              <h4 className="font-semibold text-red-800 mb-2">🚨 Emergency Brake (Stop-Loss)</h4>
              <p className="text-sm text-red-700 mb-3">Dormant permission that activates on price triggers</p>
              <div className="text-xs text-red-600 space-y-1 mb-3">
                <div>• "Emergency sell if ETH drops below $1500"</div>
                <div>• Dormant until price trigger activated</div>
                <div>• Institutional-grade risk management</div>
                <div>• Automatic ETH → USDC protection</div>
              </div>
              <a 
                href="/emergency-brake"
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                🚨 Manage Emergency Brake
              </a>
            </div>
          </div>
        </div>

        {/* Original DeFi Features */}
        <div className="mb-8 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-cyan-800 mb-4">💧 Core DeFi Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">💧 Stream Money (Superfluid)</h4>
              <p className="text-sm text-blue-700 mb-3">Continuous money streaming for salaries & subscriptions</p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• Host: 0x4C073B3baB6d88B6575C8743282064147A6A6903</div>
                <div>• fUSDCx: 0x42bb40bF79730451B11f6De1CbA222F17b87Afd7</div>
                <div>• "Stream 5 USDC/day to alice.base.eth"</div>
                <div>• "Stream 10 USD/2 hours to ales"</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
              <h4 className="font-semibold text-green-800 mb-2">🏷️ Use Human Names (Basenames)</h4>
              <p className="text-sm text-green-700 mb-3">ENS resolution on Base for human-readable addresses</p>
              <div className="text-xs text-green-600 space-y-1">
                <div>• L2 Resolver: 0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA</div>
                <div>• "Resolve alice.base.eth"</div>
                <div>• "Set myname.base.eth to 0x123..."</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-2">🏦 Borrow Against Assets (Aave V3)</h4>
              <p className="text-sm text-purple-700 mb-3">Leverage your assets with decentralized lending</p>
              <div className="text-xs text-purple-600 space-y-1">
                <div>• Pool Provider: 0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A</div>
                <div>• "Borrow 500 USDC against 1 WETH"</div>
                <div>• "Repay my 500 USDC loan"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {isConnected && (
          <>
            {/* RWA Information Panel */}
            <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🏢 Available Properties & Smart Commands</h3>
              
              {/* Property Registry */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">🏠 Property Registry (10 Deployed Contracts):</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <div className="font-medium text-blue-800">#1 Manhattan Luxury Apartments</div>
                    <div className="text-blue-600">2500 ETH • 4.2% yield • "this property"</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <div className="font-medium text-green-800">#2 Miami Beach Condos</div>
                    <div className="text-green-600">1800 ETH • 5.1% yield • "beachfront"</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                    <div className="font-medium text-purple-800">#3 Austin Tech Hub Office</div>
                    <div className="text-purple-600">4200 ETH • 6.8% yield • "office space"</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                    <div className="font-medium text-orange-800">#4 Seattle Warehouse District</div>
                    <div className="text-orange-600">3100 ETH • 7.2% yield • "warehouse"</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                    <div className="font-medium text-red-800">#5 Denver Mountain Resort</div>
                    <div className="text-red-600">5500 ETH • 8.1% yield • "resort"</div>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                    <div className="font-medium text-indigo-800">#6 Chicago Downtown Lofts</div>
                    <div className="text-indigo-600">3200 ETH • 5.8% yield • "downtown lofts"</div>
                  </div>
                  <div className="bg-pink-50 p-3 rounded border-l-4 border-pink-400">
                    <div className="font-medium text-pink-800">#7 Los Angeles Studio Complex</div>
                    <div className="text-pink-600">6800 ETH • 6.5% yield • "studio complex"</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <div className="font-medium text-yellow-800">#8 Phoenix Retail Plaza</div>
                    <div className="text-yellow-600">2800 ETH • 7.4% yield • "retail plaza"</div>
                  </div>
                  <div className="bg-teal-50 p-3 rounded border-l-4 border-teal-400">
                    <div className="font-medium text-teal-800">#9 Boston Historic Brownstones</div>
                    <div className="text-teal-600">4500 ETH • 4.8% yield • "brownstones"</div>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded border-l-4 border-cyan-400">
                    <div className="font-medium text-cyan-800">#10 Nashville Music District</div>
                    <div className="text-cyan-600">3600 ETH • 6.2% yield • "music district"</div>
                  </div>
                </div>
              </div>
              
              {/* Smart Commands */}
              <div className="grid md:grid-cols-5 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🤖 Smart Investment Commands:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• "Invest 5 ETH in the beachfront property"</li>
                    <li>• "Put 10 ETH in downtown lofts with aggressive strategy"</li>
                    <li>• "Buy shares in the music district"</li>
                    <li>• "Invest in the studio complex"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">📅 Scheduling & Automation:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• "Sell $1000 worth ETH daily and invest in brownstones"</li>
                    <li>• "Swap 2 ETH to USDC weekly"</li>
                    <li>• "Rebalance my portfolio monthly"</li>
                    <li>• "Claim yield from all properties"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🚀 Advanced DeFi Features:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• "Stream 5 USDC/day to alice.base.eth"</li>
                    <li>• "Stream 10 USD/2 hours to ales"</li>
                    <li>• "Resolve alice.base.eth to address"</li>
                    <li>• "Borrow 500 USDC against 1 WETH"</li>
                    <li>• "Repay my 500 USDC loan"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🤖 Advanced Trading:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• "Keep my portfolio 60% Real Estate and 40% ETH"</li>
                    <li>• "Copy every trade from nancy.base.eth"</li>
                    <li>• "Buy ETH if price drops below $1500"</li>
                    <li>• "Sell 2 ETH when price hits $4000"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🔐 EIP-7715 Strategies:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• "Turn on Auto-Compound for property 1"</li>
                    <li>• "Invest $50 every Monday in property 2"</li>
                    <li>• "Emergency sell if ETH drops below $1500"</li>
                    <li>• "Execute yield farming for property 3"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* EIP-7702 Permission Info */}
            <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">🔐 Advanced Permission System</h3>
              <p className="text-sm text-purple-700 mb-3">
                This platform uses MetaMask Advanced Permissions (EIP-7702) for secure, automated RWA transactions 
                with compliance controls and session key management.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">EIP-7702 Smart Accounts</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">KYC/AML Compliance</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">Session Key Automation</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Policy-Based Execution</span>
              </div>
            </div>

            {/* AI Input */}
            <div className="mb-8">
              <AgentInput onActionParsed={handleActionParsed} />
            </div>

            {/* Action Confirmation */}
            {parsedAction && (
              <div className="mb-8">
                <ActionCard 
                  action={parsedAction} 
                  onExecuted={handleActionExecuted}
                />
              </div>
            )}

            {/* Action Log */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">📋 Transaction Log</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {actionLog.length === 0 ? (
                  <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded">
                    <p className="mb-3">🚀 <strong>Try these advanced AI commands:</strong></p>
                    <div className="grid md:grid-cols-5 gap-4">
                      <div>
                        <p className="font-medium text-gray-700 mb-2">💰 Smart Investments:</p>
                        <ul className="space-y-1 ml-4 text-xs">
                          <li>• "Invest $25000 in the beachfront property with aggressive strategy"</li>
                          <li>• "Put $10000 in the office space"</li>
                          <li>• "Buy shares in the resort property"</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-2">📅 Automated Trading:</p>
                        <ul className="space-y-1 ml-4 text-xs">
                          <li>• "Sell $1000 worth ETH daily and invest in this property"</li>
                          <li>• "Swap $500 of USDC to ETH weekly"</li>
                          <li>• "Rebalance my portfolio monthly"</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-2">🚀 Advanced DeFi:</p>
                        <ul className="space-y-1 ml-4 text-xs">
                          <li>• "Stream 5 USDC/day to alice.base.eth"</li>
                          <li>• "Stream 10 USD/2 hours to ales"</li>
                          <li>• "Resolve alice.base.eth to address"</li>
                          <li>• "Borrow 500 USDC against 1 WETH"</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-2">🤖 Robo-Advisor:</p>
                        <ul className="space-y-1 ml-4 text-xs">
                          <li>• "Keep my portfolio 60% Real Estate and 40% ETH"</li>
                          <li>• "Copy every trade from nancy.base.eth"</li>
                          <li>• "Buy ETH if price drops below $1500"</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-2">🔐 EIP-7715 Strategies:</p>
                        <ul className="space-y-1 ml-4 text-xs">
                          <li>• "Turn on Auto-Compound for property 1"</li>
                          <li>• "Invest $50 every Monday in property 2"</li>
                          <li>• "Emergency sell if ETH drops below $1500"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  actionLog.map((log, index) => (
                    <div key={index} className="text-sm text-gray-700 p-3 bg-gray-50 rounded border-l-4 border-blue-200">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Technology Stack Info */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Technology Stack</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">AI & Automation:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Groq AI for natural language processing</li>
                    <li>• OpenAI Function Calling</li>
                    <li>• Intelligent portfolio optimization</li>
                    <li>• Automated compliance checking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Blockchain & Permissions:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Base Sepolia (EIP-7702 support)</li>
                    <li>• MetaMask Advanced Permissions</li>
                    <li>• Session key management</li>
                    <li>• Policy-based execution</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Advanced DeFi Protocols:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Superfluid money streaming</li>
                    <li>• Basenames ENS resolution</li>
                    <li>• Aave V3 lending/borrowing</li>
                    <li>• Real estate tokenization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Data & Analytics:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Envio real-time indexing</li>
                    <li>• Property performance tracking</li>
                    <li>• Yield distribution analytics</li>
                    <li>• Multi-protocol monitoring</li>
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