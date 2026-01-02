/**
 * Register trigger with correct checksummed addresses
 */

async function registerCorrectTrigger() {
  console.log('🎯 REGISTERING TRIGGER WITH CORRECT CHECKSUMS');
  console.log('=' .repeat(50));
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    // Correct checksummed addresses
    const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c'; // Your address (already correct)
    const diyaAddress = '0x51c2c01eD19C6377b881Abf0eda20168386FDE47'; // Diya's address (fixed checksum)
    const krishAddress = '0xCb188D3DBAb64D9B01c6B49193F76d762a00f268'; // Krish's address (fixed checksum)
    
    console.log('📋 Correct Checksummed Addresses:');
    console.log(`   Your address: ${userAddress}`);
    console.log(`   Diya address: ${diyaAddress}`);
    console.log(`   Krish address: ${krishAddress}`);
    
    const triggerData = {
      scheduleId: 'diya-to-krish-forward-correct-' + Date.now(),
      eventTrigger: 'usdc_received',
      triggerFrom: diyaAddress,
      triggerDescription: 'If Diya paid me money, send it to Krish (correct checksums)',
      userAddress: userAddress,
      recipient: krishAddress
    };
    
    console.log('\n🎯 Registering trigger...');
    const response = await fetch('http://localhost:3001/api/event-trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(triggerData)
    });
    
    if (!response.ok) {
      console.log('❌ Failed to register trigger:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const result = await response.json();
    
    console.log('\n✅ TRIGGER REGISTERED SUCCESSFULLY!');
    console.log('📊 Response:', JSON.stringify(result, null, 2));
    
    console.log('\n🎯 IFTTT Rule Active (Correct Checksums):');
    console.log('   IF: Diya sends USDC to you');
    console.log('   THEN: Automatically forward same amount to Krish');
    console.log('   STATUS: ✅ Monitoring blockchain events');
    
  } catch (error) {
    console.error('❌ Error registering trigger:', error.message);
  }
}

registerCorrectTrigger();