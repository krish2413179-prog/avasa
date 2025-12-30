import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { parseUserIntent } from './ai/parser'
import { getPaymentExecutor, initializePaymentExecutor } from './agents/paymentExecutor'
import friendsRoutes from './routes/friends'
// import analyticsRoutes from './routes/analytics'

// Temporarily disable analytics routes due to encoding issue
// TODO: Fix envio indexer encoding and re-enable

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('🔧 Environment loaded. Starting Veda server...')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize Payment Executor Agent
const privateKey = process.env.PRIVATE_KEY!
const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'

console.log('🤖 Payment Executor Agent initialized (auto-start disabled for debugging)')
const paymentExecutor = initializePaymentExecutor(privateKey, rpcUrl)
// Temporarily disable auto-start to reduce log noise
// paymentExecutor.start().catch(console.error)

// Friends management routes
app.use('/api/friends', friendsRoutes)

// Analytics routes powered by Envio indexer (temporarily disabled)
// app.use('/api/analytics', analyticsRoutes)

// Recurring investment tracking endpoint
app.get('/api/recurring-investments/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    console.log('📊 Fetching recurring investment data for:', address);
    
    // This would normally query the blockchain for PaymentExecuted events
    // For now, return the calculated data from our analysis
    const investmentData = {
      '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c': {
        '1': { amount: '$200', shares: '2.0%', executionCount: 28, type: 'recurring' },
        '2': { amount: '$40', shares: '0.4%', executionCount: 4, type: 'recurring' }
      }
    };
    
    const userInvestments = investmentData[address.toLowerCase()] || {};
    
    res.json({
      success: true,
      address,
      investments: userInvestments,
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching recurring investments:', error);
    res.status(500).json({ error: 'Failed to fetch recurring investment data' });
  }
});

// AI parser endpoint for frontend compatibility
app.post('/api/parse', async (req, res) => {
  try {
    const { input, userAddress } = req.body
    
    console.log('🔍 Parsing input:', input)
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' })
    }
    
    // Parse user intent using AI
    const result = await parseUserIntent(input, userAddress)
    
    console.log('✅ Parse result:', result)
    
    if (result.actionForFrontend) {
      console.log('🎯 Action for frontend:', result.actionForFrontend.type)
      return res.json({
        type: result.actionForFrontend.type,
        description: result.response,
        params: result.actionForFrontend.params || {}
      })
    }
    
    res.json({ 
      type: result.type,
      description: result.description,
      params: result.params || {}
    })
  } catch (error) {
    console.error('Parse error:', error)
    res.status(500).json({ error: 'Failed to parse input' })
  }
})

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
  console.log(`🚀 Veda server running on port ${PORT}`)
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

// Remove the duplicate analytics function at the bottom
// The analytics routes are already handled by the imported router