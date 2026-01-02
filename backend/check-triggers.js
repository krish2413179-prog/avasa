/**
 * Check active event triggers in the system
 */

async function checkTriggers() {
  console.log('🔍 CHECKING ACTIVE EVENT TRIGGERS');
  console.log('=' .repeat(40));
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
    const response = await fetch(`http://localhost:3001/api/event-triggers/${userAddress}`);
    
    if (!response.ok) {
      console.log('❌ Failed to fetch triggers:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log('📊 API Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.triggers) {
      console.log(`\n🎯 Found ${data.triggers.length} active triggers:`);
      
      data.triggers.forEach((trigger, index) => {
        console.log(`\n${index + 1}. Schedule ID: ${trigger.scheduleId}`);
        console.log(`   Type: ${trigger.triggerType}`);
        console.log(`   From: ${trigger.triggerFrom || 'any'}`);
        console.log(`   To: ${trigger.triggerTo || 'any'}`);
        console.log(`   Description: ${trigger.description}`);
        console.log(`   Active: ${trigger.isActive}`);
        console.log(`   Last Triggered: ${trigger.lastTriggered ? new Date(trigger.lastTriggered).toISOString() : 'never'}`);
      });
      
      if (data.triggers.length === 0) {
        console.log('❌ NO ACTIVE TRIGGERS FOUND!');
        console.log('   This explains why auto-forward didn\'t work');
        console.log('   The system needs an active event trigger to monitor for Diya\'s payments');
      }
    } else {
      console.log('❌ Unexpected response format:', data);
    }
    
  } catch (error) {
    console.error('❌ Error checking triggers:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
  }
}

checkTriggers();