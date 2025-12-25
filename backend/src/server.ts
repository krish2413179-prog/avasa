import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { initDatabase } from './db/schema'
import { executeOrder } from './executor/agentKit'
import { parseUserIntent } from './ai/parser'
import portfolioRoutes from './routes/portfolio'
import permissionsRoutes from './routes/permissions'
import enhancedPropertiesRoutes from './routes/enhancedProperties'
import { tradingMonitor } from './services/tradingMonitor'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('🔧 Environment loaded. Private key present:', !!process.env.PRIVATE_KEY)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize database
initDatabase()

// Start trading monitor for advanced features
tradingMonitor.start()

// Routes
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/permissions', permissionsRoutes)
app.use('/api/enhanced-properties', enhancedPropertiesRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    envio: {
      endpoint: process.env.ENVIO_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql',
      configured: !!process.env.ENVIO_GRAPHQL_ENDPOINT
    },
    tradingMonitor: tradingMonitor.getStatus()
  })
})

// Trading monitor health check
app.get('/api/trading/health', async (req, res) => {
  try {
    const health = await tradingMonitor.getHealthCheck()
    res.json(health)
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: (error as Error).message
    })
  }
})

// Parse user intent
app.post('/api/parse', async (req, res) => {
  try {
    const { input } = req.body
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' })
    }

    const parsedAction = await parseUserIntent(input)
    res.json(parsedAction)
  } catch (error) {
    console.error('Parse error:', error)
    res.status(500).json({ error: 'Failed to parse intent' })
  }
})

// Submit order for later execution
app.post('/api/orders', async (req, res) => {
  try {
    const { userAddress, action, params, permissionContext } = req.body
    
    // Store order in database for scheduled execution
    const orderId = Date.now().toString()
    
    // TODO: Save to database
    console.log('Order received:', { orderId, userAddress, action, params })
    
    res.json({ 
      orderId, 
      status: 'scheduled',
      message: 'Order scheduled for execution'
    })
  } catch (error) {
    console.error('Order submission error:', error)
    res.status(500).json({ error: 'Failed to submit order' })
  }
})

// Execute action immediately
app.post('/api/execute', async (req, res) => {
  try {
    const { action, permissionContext } = req.body
    
    console.log('🚀 Executing REAL action:', action.type, 'for user:', permissionContext.userAddress)
    console.log('📋 Permission method:', permissionContext.method || 'unknown')
    
    // Execute real transaction using the agent kit
    const result = await executeOrder(action, permissionContext)
    
    console.log('✅ Real execution completed:', result)
    
    res.json({
      success: true,
      message: `${action.description} executed successfully`,
      txHash: (result as any).txHash,
      permissionMethod: permissionContext.method,
      gasUsed: (result as any).gasUsed,
      blockNumber: (result as any).blockNumber
    })
  } catch (error) {
    console.error('❌ Execution error:', error)
    res.status(500).json({ 
      success: false,
      error: (error as Error).message 
    })
  }
})

// Get order status
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params
  
  // TODO: Query database for order status
  res.json({
    orderId,
    status: 'pending',
    message: 'Order is being processed'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})