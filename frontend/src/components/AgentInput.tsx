'use client'

import { useState } from 'react'
import { useAIParser } from '@/hooks/useAIParser'

interface AgentInputProps {
  onActionParsed: (action: any) => void
}

export function AgentInput({ onActionParsed }: AgentInputProps) {
  const [input, setInput] = useState('')
  const { parseIntent, isLoading } = useAIParser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      const parsedAction = await parseIntent(input)
      onActionParsed(parsedAction)
      setInput('')
    } catch (error) {
      console.error('Failed to parse intent:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">🤖 AI-Powered RWA Commands</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Invest $25000 in property #5' or 'Claim my rental income' or 'Rebalance portfolio aggressively'"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing RWA Command...' : 'Execute RWA Action'}
        </button>
      </form>
    </div>
  )
}