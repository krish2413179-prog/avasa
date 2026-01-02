import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('🔧 Environment loaded. Starting Memory-Safe Veda server...')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Track active intervals and listeners for cleanup
const activeIntervals: NodeJS.Timeout[] = []
const activeListeners: any[] = []

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Memory-Safe Veda backend is running',
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  })
})

// Simple AI parser endpoint (memory-safe version)
app.post('/api/parse', async (req, res) => {
  try {
    const { input, userAddress } = req.body
    
    console.log('🔍 Parsing input (memory-safe):', input)
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' })
    }
    
    // Simple, memory-efficient parsing without massive context loading
    const lowerInput = input.toLowerCase()
    
    let response = {
      type: 'market_analysis',
      description: `Analyzing: ${input}`,
      params: { message: 'Memory-safe parser active' }
    }
    
    // Basic investment detection
    if (lowerInput.includes('invest')) {
      response = {
        type: 'invest_real_estate',
        description: `Investment request: ${input}`,
        params: { 
          propertyId: '1',
          amount: '1000',
          message: 'Memory-safe investment parsing'
        }
      }
    }
    
    // Basic swap detection
    if (lowerInput.includes('swap') || lowerInput.includes('buy') || lowerInput.includes('sell')) {
      response = {
        type: 'schedule_swap',
        description: `Swap request: ${input}`,
        params: {
          tokenIn: 'USDC',
          tokenOut: 'ETH',
          amount: '100',
          recurrence: 'once'
        }
      }
    }
    
    res.json(response)
  } catch (error) {
    console.error('Parse error:', error)
    res.status(500).json({ error: 'Failed to parse input' })
  }
})

// Memory usage endpoint
app.get('/api/memory', (req, res) => {
  const usage = process.memoryUsage()
  res.json({
    memory: {
      rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(usage.external / 1024 / 1024)} MB`
    },
    uptime: `${Math.round(process.uptime())} seconds`,
    activeIntervals: activeIntervals.length,
    activeListeners: activeListeners.length
  })
})

// Cleanup endpoint
app.post('/api/cleanup', (req, res) => {
  console.log('🧹 Performing memory cleanup...')
  
  // Clear all intervals
  activeIntervals.forEach(interval => clearInterval(interval))
  activeIntervals.length = 0
  
  // Remove all listeners
  activeListeners.forEach(listener => {
    if (listener && typeof listener.removeAllListeners === 'function') {
      listener.removeAllListeners()
    }
  })
  activeListeners.length = 0
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc()
  }
  
  const usage = process.memoryUsage()
  res.json({
    message: 'Cleanup completed',
    memoryAfterCleanup: {
      rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`
    }
  })
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Memory-Safe Veda server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🧠 Memory monitor: http://localhost:${PORT}/api/memory`)
  console.log(`🧹 Cleanup endpoint: POST http://localhost:${PORT}/api/cleanup`)
})

// Graceful shutdown with proper cleanup
const gracefulShutdown = async () => {
  console.log('🛑 Shutting down server gracefully...')
  
  // Clear all intervals
  activeIntervals.forEach(interval => clearInterval(interval))
  activeIntervals.length = 0
  
  // Remove all listeners
  activeListeners.forEach(listener => {
    if (listener && typeof listener.removeAllListeners === 'function') {
      listener.removeAllListeners()
    }
  })
  activeListeners.length = 0
  
  // Close server
  server.close(() => {
    console.log('✅ Server closed successfully')
    process.exit(0)
  })
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.log('⚠️ Forcing exit after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

// Monitor memory usage
const memoryMonitor = setInterval(() => {
  const usage = process.memoryUsage()
  const rssGB = usage.rss / 1024 / 1024 / 1024
  
  if (rssGB > 1) { // Alert if over 1GB
    console.warn(`⚠️ High memory usage: ${rssGB.toFixed(2)} GB`)
    
    if (rssGB > 2) { // Emergency cleanup if over 2GB
      console.error('🚨 EMERGENCY: Memory usage over 2GB, performing cleanup')
      
      // Clear intervals
      activeIntervals.forEach(interval => clearInterval(interval))
      activeIntervals.length = 0
      
      // Force garbage collection
      if (global.gc) {
        global.gc()
      }
    }
  }
}, 30000) // Check every 30 seconds

activeIntervals.push(memoryMonitor)

console.log('✅ Memory-Safe Veda server initialized with leak protection!')