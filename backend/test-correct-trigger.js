/**
 * Test the corrected event trigger
 */

async function testCorrectTrigger() {
  console.log('🧪 TESTING CORRECTED EVENT TRIGGER');
  console.log('=' .repeat(45));
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    // Simulate Diya sending 100 USDC to you (with correct checksums)
    const testData = {
      userAddress: '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c', // Your address
      fromAddress: '0x51c2c01eD19C6377b881Abf0eda20168386FDE47', // Diya's address (correct checksum)
      amount: '100000000000000000000' // 100 USDC in 18 decimals
    };
    
    console.log('📋 Simulating Payment (Correct Checksums):');
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
    
    console.log('\n✅ TRIGGER TEST SENT!');
    console.log('📊 Response:', JSON.stringify(result, null, 2));
    
    console.log('\n🎯 Expected Result:');
    console.log('   ✅ System detects Diya → You transfer (correct checksums)');
    console.log('   ✅ System automatically forwards 100 USDC to Krish');
    console.log('   ✅ Check backend logs for execution details');
    console.log('   ✅ Should see blockchain transaction to Krish');
    
    // Wait a moment for processing
    console.log('\n⏳ Waiting 3 seconds for processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Check backend logs now for execution results!');
    
  } catch (error) {
    console.error('❌ Error testing trigger:', error.message);
  }
}

testCorrectTrigger();