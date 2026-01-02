'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Bot, User, BarChart3, Home, Clock } from 'lucide-react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  message: string
  timestamp: string
  countdown?: number
}

export default function VedaAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: '🏠 Welcome to Veda! I\'m your Real-Time Financial Intelligence assistant.\n\nI can help you with:\n• 📊 Portfolio analytics and insights\n• 💰 Property investments (e.g., "invest $10 in Manhattan")\n• 🏡 Recurring investment scheduling\n• 📈 Protocol statistics and trends\n• ⚡ Zero-latency financial data\n\nWhat would you like to explore today?',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [countdown])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Start countdown for response time
    setCountdown(10) // 10 second countdown

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          userAddress: '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c',
          executeAction: true
        })
      })

      const data = await response.json()

      // Clear countdown when response arrives
      setCountdown(0)

      let botResponse = data.response || 'Sorry, I couldn\'t process that request.'
      
      // Add action information if available
      if (data.action) {
        botResponse += `\n\n🎯 Action Identified: ${data.action.type}\n📋 ${data.action.description}`
        
        if (data.action.params) {
          botResponse += `\n⚙️ Parameters: ${JSON.stringify(data.action.params, null, 2)}`
        }
      }

      // Add execution information if available
      if (data.execution) {
        if (data.execution.success) {
          botResponse += `\n\n✅ **EXECUTION COMPLETED**`
          botResponse += `\n🔗 Transaction: ${data.execution.txHash}`
          if (data.execution.blockNumber) {
            botResponse += `\n📦 Block: ${data.execution.blockNumber}`
          }
          if (data.execution.gasUsed) {
            botResponse += `\n⛽ Gas Used: ${data.execution.gasUsed}`
          }
          if (data.execution.realTransaction) {
            botResponse += `\n🌐 **REAL BLOCKCHAIN TRANSACTION** ✅`
          } else {
            botResponse += `\n🎭 Demo Mode (Simulated Transaction)`
          }
        } else {
          botResponse += `\n\n❌ **EXECUTION FAILED**`
          botResponse += `\n💬 Error: ${data.execution.error || 'Unknown error'}`
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setCountdown(0)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: '❌ Sorry, I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatCountdown = (seconds: number) => {
    return `${seconds}s`
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Home className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Veda AI Assistant
            </h1>
          </div>
          <p className="text-xl text-gray-300">Your Real-Time Financial Intelligence Companion</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">System Healthy</span>
            </div>
            {countdown > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
                <span className="text-sm text-yellow-400 font-mono">
                  Processing... {formatCountdown(countdown)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4">
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Assistant
            </Button>
            <Link href="/analytics">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="pb-4 border-b border-gray-700">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg">Veda AI</div>
                <div className="text-sm text-gray-400 font-normal">Real-Time Financial Intelligence</div>
              </div>
              <div className="ml-auto flex items-center gap-3">
                {countdown > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Clock className="h-3 w-3 animate-spin" />
                    <span className="text-xs font-mono">{formatCountdown(countdown)}</span>
                  </div>
                )}
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="h-96 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md shadow-lg'
                        : 'bg-gray-700 text-gray-100 rounded-bl-md shadow-lg'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.message}</div>
                    <div className={`text-xs mt-2 opacity-70 flex items-center gap-2 ${
                      msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      {msg.countdown && msg.countdown > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatCountdown(msg.countdown)}
                        </span>
                      )}
                    </div>
                  </div>
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-700 text-gray-100 p-4 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      {countdown > 0 && (
                        <div className="flex items-center gap-1 text-yellow-400 ml-2">
                          <Clock className="h-3 w-3 animate-spin" />
                          <span className="text-xs font-mono">{formatCountdown(countdown)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Veda AI about investments, portfolio, or properties..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 transition-all duration-200 hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage("invest $25 in Manhattan")}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 hover:scale-105"
                >
                  💰 Invest in Manhattan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage("show me my portfolio")}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 hover:scale-105"
                >
                  📊 My Portfolio
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage("invest $10 in Miami Beach every minute for 5 minutes")}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 hover:scale-105"
                >
                  🔄 Recurring Investment
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage("claim yield from my properties")}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 hover:scale-105"
                >
                  🏡 Claim Yield
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Envio GraphQL • Zero-latency financial intelligence</p>
          <p className="mt-1 text-xs text-gray-600">
            Messages auto-scroll • Response time tracking • Real-time AI processing
          </p>
        </div>
      </div>
    </div>
  )
}