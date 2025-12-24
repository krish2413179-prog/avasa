'use client'

import { useState } from 'react'
import { usePermissions } from '@/hooks/usePermissions'

interface ActionCardProps {
  action: {
    type: string
    description: string
    params: any
  }
  onExecuted: (result: string) => void
}

export function ActionCard({ action, onExecuted }: ActionCardProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const { requestPermission } = usePermissions()

  const handleConfirm = async () => {
    setIsExecuting(true)
    try {
      console.log('🔐 Requesting permissions for action:', action.type)
      
      // Request permission (with fallback handling)
      const permissionContext = await requestPermission(action)
      
      console.log('✅ Permission context received:', permissionContext.method)
      
      // Send to backend for execution
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          permissionContext
        })
      })

      const result = await response.json()
      
      if (result.success) {
        onExecuted(`✅ ${result.message}${result.txHash ? ` (TX: ${result.txHash.slice(0, 10)}...)` : ''}`)
      } else {
        onExecuted(`❌ ${result.error || 'Execution failed'}`)
      }
    } catch (error) {
      console.error('Execution failed:', error)
      onExecuted(`❌ Failed: ${error.message}`)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
      <div className="mb-4">
        <p className="text-gray-700 mb-2">{action.description}</p>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <strong>Type:</strong> {action.type}
          <br />
          <strong>Parameters:</strong> {JSON.stringify(action.params, null, 2)}
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={handleConfirm}
          disabled={isExecuting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isExecuting ? 'Executing...' : 'Confirm & Execute'}
        </button>
        <button
          onClick={() => onExecuted('Action cancelled')}
          disabled={isExecuting}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}