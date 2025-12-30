import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('🔧 Environment loaded. Starting Veda server...')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Veda backend is running' })
})

// AI parser endpoint for frontend compatibility
app.post('/api/parse', async (req, res) => {
  try {
    const { input, userAddress } = req.body
    
    console.log('🔍 Parsing input:', input)
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' })
    }
    
    // Simple mock response for now
    res.json({ 
      type: 'market_analysis',
      description: `Analyzing: ${input}`,
      params: { message: 'Backend is running but AI parser is temporarily disabled for debugging' }
    })
  } catch (error) {
    console.error('Parse error:', error)
    res.status(500).json({ error: 'Failed to parse input' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Veda server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...')
  process.exit(0)
})