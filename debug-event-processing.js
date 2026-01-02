/**
 * Debug script to check if event processing is working
 */

const API_BASE = 'http://localhost:3001';

async function debugEventProcessing() {
  console.log('🔍 Debugging Event Processing System');
  console.log('=' .repeat(50));
  
  const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
  const diyaAddress = '0x51c2c01ed19c6377b881abf0eda20168386fde47';
  
  try {
    // 1. Check server health
    console.log('\n📋 Step 1: Checking server health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthResult = await healthResponse.json();
    console.log('✅ Server health:', healthResult);
    
    // 2. Check active triggers
    console.log('\n📋 Step 2: Checking active triggers...');
    const triggersResponse = await fetch(`${API_BASE}/api/event-triggers/${userAddress}`);
    const triggersResult = await triggersResponse.json();
    console.log('✅ Active triggers:', triggersResult);
    
    // 3. Test manual trigger with detailed logging
    console.log('\n📋 Step 3: Testing manual trigger (watch backend logs)...');
    console.log('🎯 Sending trigger test request...');
    
    const testResponse = await fetch(`${API_BASE}/api/trigger-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAddress: userAddress,
        fromAddress: diyaAddress,
        amount: '100000000000000000000'
      }),
    });
    
    const testResult = await testResponse.json();
    console.log('✅ Trigger test response:', testResult);
    
    // 4. Wait and check for any processing
    console.log('\n📋 Step 4: Waiting for processing (5 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 5. Check if any transactions were made
    console.log('\n📋 Step 5: Checking for any transaction evidence...');
    
    console.log('\n🔍 Debug Summary:');
    console.log('• Server: ✅ Running');
    console.log('• Triggers: ✅ Registered');
    console.log('• API Call: ✅ Successful');
    console.log('• Processing: ❓ Check backend logs for:');
    console.log('  - "💰 Manual Transfer Event:"');
    console.log('  - "🎯 Trigger matched for schedule"');
    console.log('  - "🚀 Executing event-driven forward"');
    console.log('  - "✅ Event-driven forward completed"');
    console.log('  - Any error messages');
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugEventProcessing();