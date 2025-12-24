import cron from 'node-cron'
import { executeScheduledOrders } from '../executor/agentKit'

// Run every hour to check for due orders
cron.schedule('0 * * * *', async () => {
  console.log('Checking for scheduled orders...')
  
  try {
    await executeScheduledOrders()
    console.log('Scheduled orders check completed')
  } catch (error) {
    console.error('Scheduler error:', error)
  }
})

// Run immediately if this file is executed directly
if (require.main === module) {
  console.log('Starting scheduler...')
  executeScheduledOrders()
}