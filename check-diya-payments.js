/**
 * Check if Diya has sent any USDC payments recently
 */

const API_BASE = 'http://localhost:3001';

async function checkDiyaPayments() {
  console.log('🔍 Checking if Diya has sent any USDC payments...');
  console.log('=' .repeat(50));
  
  const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
  const diyaAddress = '0x51c2c01ed19c6377b881abf0eda20168386fde47';
  
  try {
    // Check for payments from Diya to user
    console.log(`\n📋 Checking payments from Diya (${diyaAddress}) to you (${userAddress})...`);
    
    const response = await fetch(`${API_BASE}/api/check-payment/${userAddress}/${diyaAddress}`);
    const result = await response.json();
    
    console.log('📊 Payment check result:', result);
    
    if (result.success && result.recentPayments && result.recentPayments.length > 0) {
      console.log('\n💰 Recent payments found:');
      result.recentPayments.forEach((payment, index) => {
        console.log(`${index + 1}. From: ${payment.from}`);
        console.log(`   To: ${payment.to}`);
        console.log(`   Amount: ${payment.amount} (${parseFloat(payment.amount) / 1e18} USDC)`);
        console.log(`   Timestamp: ${new Date(payment.timestamp).toISOString()}`);
        console.log(`   Detected: ${payment.detected ? '✅ YES' : '❌ NO'}`);
        console.log('');
      });
    } else {
      console.log('\n📭 No recent payments found from Diya');
    }
    
    // Check active event triggers
    console.log('\n🎯 Checking active event triggers...');
    const triggersResponse = await fetch(`${API_BASE}/api/event-triggers/${userAddress}`);
    const triggersResult = await triggersResponse.json();
    
    if (triggersResult.success && triggersResult.triggers) {
      console.log(`📋 Active triggers: ${Object.keys(triggersResult.triggers).length}`);
      Object.entries(triggersResult.triggers).forEach(([scheduleId, trigger]) => {
        console.log(`• ${scheduleId}: ${trigger.description}`);
        console.log(`  Watching: ${trigger.triggerFrom} → ${trigger.triggerTo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking payments:', error.message);
  }
}

checkDiyaPayments();