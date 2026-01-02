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
import friendsRoutes from './routes/friends'
import { tradingMonitor } from './services/tradingMonitor'
import { PaymentExecutorService } from './agents/paymentExecutor'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

console.log('🔧 Environment loaded. Private key present:', !!process.env.PRIVATE_KEY)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize database
initDatabase()

// Initialize Payment Executor Service for event-driven payments
const paymentExecutor = new PaymentExecutorService()

// Start the payment executor agent
paymentExecutor.start().then(() => {
  console.log('✅ PaymentExecutorService started successfully')
}).catch((error) => {
  console.error('❌ Failed to start PaymentExecutorService:', error)
})

// Start trading monitor for advanced features
tradingMonitor.start()

// Routes
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/permissions', permissionsRoutes)
app.use('/api/enhanced-properties', enhancedPropertiesRoutes)
app.use('/api/friends', friendsRoutes)

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
    const { input, userAddress } = req.body
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' })
    }

    const parsedAction = await parseUserIntent(input, userAddress)
    res.json(parsedAction)
  } catch (error) {
    console.error('Parse error:', error)
    res.status(500).json({ error: 'Failed to parse intent' })
  }
})

// Chat endpoint for AI-powered commands with real execution
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userAddress } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    console.log('💬 Processing chat message:', message)
    console.log('👤 User address:', userAddress)
    
    // Parse user intent using AI
    const parsedAction = await parseUserIntent(message, userAddress)
    
    console.log('🎯 Parsed action:', parsedAction.type)
    console.log('📋 Action params:', parsedAction.params)
    
    // Create permission context for execution
    const permissionContext = {
      userAddress: userAddress || '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c',
      method: 'chat_command',
      timestamp: Date.now()
    }
    
    // Execute the action if it's an executable type
    const executableTypes = ['invest_real_estate', 'claim_yield', 'schedule_swap', 'stream_money', 'resolve_basename', 'borrow_against_assets']
    
    if (executableTypes.includes(parsedAction.type)) {
      try {
        console.log('🚀 Executing action:', parsedAction.type)
        
        // Execute real transaction using the agent kit
        const result = await executeOrder(parsedAction, permissionContext)
        
        console.log('✅ Execution completed:', result)
        
        // Return success response with transaction details
        return res.json({
          response: `🎯 ${parsedAction.description}\n\n✅ **EXECUTION SUCCESSFUL!**\n\nSuccessfully executed ${parsedAction.description}\n\n📋 **Transaction Details:**\n• Transaction Hash: \`${(result as any).txHash}\`\n• Block Number: ${(result as any).blockNumber}\n• Gas Used: ${(result as any).gasUsed}\n• **REAL BLOCKCHAIN TRANSACTION** ✅\n\n🏠 ${parsedAction.params?.propertyName ? `Property: ${parsedAction.params.propertyName}` : ''}\n📊 ${parsedAction.params?.amount ? `Investment: ${parsedAction.params.amount} ${parsedAction.type === 'invest_real_estate' ? 'USDC' : ''}` : ''}\n💰 ${(result as any).investmentAmount ? `Cost: ${(result as any).investmentAmount}` : ''}\n\nYour investment is now LIVE on the blockchain! 🚀`,
          actionForFrontend: {
            type: parsedAction.type,
            params: {
              ...parsedAction.params,
              txHash: (result as any).txHash,
              blockNumber: (result as any).blockNumber,
              gasUsed: (result as any).gasUsed,
              realTransaction: true
            }
          }
        })
      } catch (executionError) {
        console.error('❌ Execution failed:', executionError)
        
        // Return execution error
        return res.json({
          response: `🎯 ${parsedAction.description}\n\n⚠️ **EXECUTION ERROR**\n\nI understood your request but couldn't execute it: ${(executionError as Error).message}\n\n**Possible reasons:**\n• Insufficient funds in wallet\n• Network congestion\n• Invalid parameters\n• Contract interaction failed\n\nPlease check your wallet balance and try again.`,
          actionForFrontend: {
            type: parsedAction.type,
            params: {
              ...parsedAction.params,
              error: (executionError as Error).message,
              realTransaction: false
            }
          }
        })
      }
    } else {
      // Non-executable action (like market_analysis)
      return res.json({
        response: parsedAction.description,
        actionForFrontend: {
          type: parsedAction.type,
          params: parsedAction.params || {}
        }
      })
    }
  } catch (error) {
    console.error('❌ Chat error:', error)
    res.status(500).json({ 
      response: 'Sorry, I encountered an error processing your request. Please try again.',
      error: (error as Error).message 
    })
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

// Manual event trigger check
app.get('/api/check-payment/:userAddress/:fromAddress', async (req, res) => {
  try {
    const { userAddress, fromAddress } = req.params
    
    console.log('🔍 Checking for payments from', fromAddress, 'to', userAddress)
    
    // This would check recent USDC transfers
    // For now, return a mock response
    res.json({
      success: true,
      message: 'Payment check completed',
      recentPayments: [
        {
          from: fromAddress,
          to: userAddress,
          amount: '100000000000000000000', // 100 USDC in 18 decimals
          timestamp: Date.now(),
          detected: true
        }
      ]
    })
  } catch (error) {
    console.error('❌ Payment check error:', error)
    res.status(500).json({ 
      success: false,
      error: (error as Error).message 
    })
  }
})

// Register event trigger with payment agent
app.post('/api/event-trigger', async (req, res) => {
  try {
    const { scheduleId, eventTrigger, triggerFrom, triggerDescription, userAddress, recipient } = req.body
    
    console.log('🎯 Registering event trigger:', { scheduleId, eventTrigger, triggerFrom, triggerDescription })
    
    // Add event trigger to payment executor agent
    paymentExecutor.addEventTrigger(scheduleId, {
      triggerType: eventTrigger,
      triggerFrom: triggerFrom,
      triggerTo: userAddress, // User's address (recipient of the trigger event)
      description: triggerDescription,
      scheduleId: scheduleId,
      isActive: true,
      // Store the target recipient for forwarding
      forwardTo: recipient
    })
    
    console.log('✅ Event trigger registered with payment executor')
    
    res.json({
      success: true,
      message: 'Event trigger registered successfully',
      scheduleId,
      triggerType: eventTrigger,
      description: triggerDescription,
      monitoring: `Watching for ${eventTrigger} from ${triggerFrom} to ${userAddress}`
    })
  } catch (error) {
    console.error('❌ Event trigger registration error:', error)
    res.status(500).json({ 
      success: false,
      error: (error as Error).message 
    })
  }
})

// Get active event triggers
app.get('/api/event-triggers/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params
    
    const triggers = paymentExecutor.getEventTriggers()
    const userTriggers = Object.entries(triggers).filter(([_, trigger]) => 
      trigger.triggerTo === userAddress
    )
    
    res.json({
      success: true,
      triggers: userTriggers.map(([scheduleId, trigger]) => ({
        scheduleId,
        ...trigger
      }))
    })
  } catch (error) {
    console.error('❌ Get triggers error:', error)
    res.status(500).json({ 
      success: false,
      error: (error as Error).message 
    })
  }
})

// Remove event trigger
app.delete('/api/event-trigger/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params
    
    console.log('🗑️ Removing event trigger:', scheduleId)
    
    // Remove trigger from payment executor agent
    paymentExecutor.removeEventTrigger(scheduleId)
    
    console.log('✅ Event trigger removed successfully')
    
    res.json({
      success: true,
      message: 'Event trigger removed successfully',
      scheduleId: scheduleId
    })
  } catch (error) {
    console.error('❌ Remove trigger error:', error)
    res.status(500).json({ 
      success: false,
      error: (error as Error).message 
    })
  }
})

// Manual trigger test endpoint
app.post('/api/trigger-test', async (req, res) => {
  try {
    const { userAddress, fromAddress, amount } = req.body
    
    console.log('🧪 Testing manual trigger:', { userAddress, fromAddress, amount })
    
    // Simulate a USDC transfer event
    const mockEvent = {
      from: fromAddress,
      to: userAddress,
      value: amount,
      transactionHash: '0x' + Date.now().toString(16),
      blockNumber: 12345678
    }
    
    // Manually trigger the event processing
    await paymentExecutor.processTransferEvent(mockEvent)
    
    res.json({
      success: true,
      message: 'Manual trigger test completed',
      event: mockEvent
    })
  } catch (error) {
    console.error('❌ Manual trigger test error:', error)
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