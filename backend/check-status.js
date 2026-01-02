/**
 * Check PaymentExecutor agent status
 */

async function checkStatus() {
  console.log('📊 CHECKING PAYMENTEXECUTOR STATUS');
  console.log('=' .repeat(40));
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('http://localhost:3001/health');
    
    if (!response.ok) {
      console.log('❌ Failed to get status:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log('📊 Health Check Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Also check active triggers
    console.log('\n🎯 Checking Active Triggers:');
    const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
    const triggersResponse = await fetch(`http://localhost:3001/api/event-triggers/${userAddress}`);
    
    if (triggersResponse.ok) {
      const triggersData = await triggersResponse.json();
      console.log('Active Triggers:', JSON.stringify(triggersData, null, 2));
    } else {
      console.log('❌ Failed to get triggers');
    }
    
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
  }
}

checkStatus();