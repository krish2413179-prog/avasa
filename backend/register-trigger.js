/**
 * Register the event trigger for "if diya paid me money send it to krish"
 */

async function registerTrigger() {
  console.log('🎯 REGISTERING EVENT TRIGGER');
  console.log('=' .repeat(40));
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    // Addresses from the context
    const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c'; // Your address
    const diyaAddress = '0x51c2c01ed19c6377b881abf0eda20168386fde47'; // Diya's address from friends list
    const krishAddress = '0xCb188d3dBab64d9B01C6b49193f76D762A00f268'; // Krish's address
    
    const triggerData = {
      scheduleId: 'diya-to-krish-forward-' + Date.now(),
      eventTrigger: 'usdc_received',
      triggerFrom: diyaAddress,
      triggerDescription: 'If Diya paid me money, send it to Krish',
      userAddress: userAddress,
      recipient: krishAddress
    };
    
    console.log('📋 Trigger Configuration:');
    console.log(`   Schedule ID: ${triggerData.scheduleId}`);
    console.log(`   Type: ${triggerData.eventTrigger}`);
    console.log(`   From (Diya): ${triggerData.triggerFrom}`);
    console.log(`   To (You): ${triggerData.userAddress}`);
    console.log(`   Forward To (Krish): ${triggerData.recipient}`);
    console.log(`   Description: ${triggerData.triggerDescription}`);
    
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
    
    console.log('\n🎯 IFTTT Rule Active:');
    console.log('   IF: Diya sends USDC to you');
    console.log('   THEN: Automatically forward same amount to Krish');
    console.log('   STATUS: ✅ Monitoring blockchain events');
    
  } catch (error) {
    console.error('❌ Error registering trigger:', error.message);
  }
}

registerTrigger();