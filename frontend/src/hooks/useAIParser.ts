import { useState } from 'react'

export function useAIParser() {
  const [isLoading, setIsLoading] = useState(false)

  const parseIntent = async (input: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input })
      })

      if (!response.ok) {
        throw new Error('Failed to parse intent')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('AI parsing error:', error)
      throw new Error('Failed to parse intent')
    } finally {
      setIsLoading(false)
    }
  }

  return { parseIntent, isLoading }
}