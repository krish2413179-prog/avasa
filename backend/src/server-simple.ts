import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { parseUserIntent } from './ai/parser'
import { getPaymentExecutor, initializePaymentExecutor } from './agents/paymentExecutor'
import analyticsRoutes from './routes/analytics'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('🔧 Environment loaded. Starting simple server...')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize Payment Executor Agent
const privateKey = process.env.PRIVATE_KEY!
const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

console.log('🤖 Payment Executor Agent initialized')
const paymentExecutor = initializePaymentExecutor(privateKey, rpcUrl)

// Analytics routes powered by Envio indexer
app.use('/api/analytics', analyticsRoutes)

// Chat endpoint for AI-powered commands
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userAddress } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    console.log('💬 Processing message:', message)
    
    // Parse user intent using AI
    const result = await parseUserIntent(message, userAddress)
    
    if (result.actionForFrontend) {
      console.log('🎯 Action for frontend:', result.actionForFrontend.type)
      return res.json({
        response: result.response,
        actionForFrontend: result.actionForFrontend
      })
    }
    
    res.json({ response: result.response })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to process message' })
  }
})

// Payment Executor Agent status endpoint
app.get('/api/executor/status', async (req, res) => {
  try {
    if (!paymentExecutor) {
      return res.json({ isRunning: false, error: 'Payment executor not initialized' })
    }
    
    const status = paymentExecutor.getStatus()
    res.json(status)
  } catch (error) {
    console.error('Status error:', error)
    res.status(500).json({ error: 'Failed to get executor status' })
  }
})

// Start/stop executor endpoints
app.post('/api/executor/start', async (req, res) => {
  try {
    if (!paymentExecutor) {
      return res.status(400).json({ error: 'Payment executor not initialized' })
    }
    
    await paymentExecutor.start()
    res.json({ success: true, message: 'Payment executor started' })
  } catch (error) {
    console.error('Start executor error:', error)
    res.status(500).json({ error: 'Failed to start executor' })
  }
})

app.post('/api/executor/stop', async (req, res) => {
  try {
    if (!paymentExecutor) {
      return res.status(400).json({ error: 'Payment executor not initialized' })
    }
    
    await paymentExecutor.stop()
    res.json({ success: true, message: 'Payment executor stopped' })
  } catch (error) {
    console.error('Stop executor error:', error)
    res.status(500).json({ error: 'Failed to stop executor' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`)
})

// Auto-start the payment executor
if (paymentExecutor) {
  console.log('🚀 Starting Payment Executor Agent...')
  paymentExecutor.start().then(() => {
    console.log('🤖 Payment Executor Agent auto-started')
  }).catch(error => {
    console.error('Failed to auto-start Payment Executor Agent:', error)
  })
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...')
  if (paymentExecutor) {
    await paymentExecutor.stop()
  }
  process.exit(0)
})

// Handle analytics routes
async function analyticsRoutes(req: express.Request, res: express.Response, next: express.NextFunction) {
  // This will be handled by the imported analytics routes
  next()
}