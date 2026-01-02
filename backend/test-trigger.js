/**
 * Test the event trigger by simulating Diya's payment
 */

async function testTrigger() {
  console.log('🧪 TESTING EVENT TRIGGER');
  console.log('=' .repeat(40));
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    // Simulate Diya sending 100 USDC to you
    const testData = {
      userAddress: '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c', // Your address
      fromAddress: '0x51c2c01ed19c6377b881abf0eda20168386fde47', // Diya's address
      amount: '100000000000000000000' // 100 USDC in 18 decimals
    };
    
    console.log('📋 Simulating Payment:');
    console.log(`   From (Diya): ${testData.fromAddress}`);
    console.log(`   To (You): ${testData.userAddress}`);
    console.log(`   Amount: 100 USDC`);
    
    const response = await fetch('http://localhost:3001/api/trigger-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      console.log('❌ Failed to test trigger:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const result = await response.json();
    
    console.log('\n✅ TRIGGER TEST COMPLETED!');
    console.log('📊 Response:', JSON.stringify(result, null, 2));
    
    console.log('\n🎯 Expected Result:');
    console.log('   ✅ System should detect Diya → You transfer');
    console.log('   ✅ System should automatically forward 100 USDC to Krish');
    console.log('   ✅ Check backend logs for execution details');
    
  } catch (error) {
    console.error('❌ Error testing trigger:', error.message);
  }
}

testTrigger();