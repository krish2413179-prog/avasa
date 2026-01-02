/**
 * Fix the trigger with proper address checksum
 */

const { ethers } = require('ethers');

async function fixTrigger() {
  console.log('🔧 FIXING TRIGGER WITH PROPER ADDRESS CHECKSUM');
  console.log('=' .repeat(50));
  
  try {
    const fetch = (await import('node-fetch')).default;
    
    // First, remove the old trigger
    const oldScheduleId = 'diya-to-krish-forward-1767284144479';
    
    console.log('🗑️ Removing old trigger...');
    const deleteResponse = await fetch(`http://localhost:3001/api/event-trigger/${oldScheduleId}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Old trigger removed');
    } else {
      console.log('⚠️ Failed to remove old trigger, continuing...');
    }
    
    // Addresses with proper checksum
    const userAddress = ethers.utils.getAddress('0x24c80f19649c0Da8418011eF0B6Ed3e22007758c'); // Your address
    const diyaAddress = ethers.utils.getAddress('0x51c2c01ed19c6377b881abf0eda20168386fde47'); // Diya's address
    const krishAddress = ethers.utils.getAddress('0xCb188d3dBab64d9B01C6b49193f76D762A00f268'); // Krish's address
    
    console.log('📋 Addresses with proper checksum:');
    console.log(`   Your address: ${userAddress}`);
    console.log(`   Diya address: ${diyaAddress}`);
    console.log(`   Krish address: ${krishAddress}`);
    
    const triggerData = {
      scheduleId: 'diya-to-krish-forward-fixed-' + Date.now(),
      eventTrigger: 'usdc_received',
      triggerFrom: diyaAddress,
      triggerDescription: 'If Diya paid me money, send it to Krish (fixed checksum)',
      userAddress: userAddress,
      recipient: krishAddress
    };
    
    console.log('\n🎯 Registering fixed trigger...');
    const response = await fetch('http://localhost:3001/api/event-trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(triggerData)
    });
    
    if (!response.ok) {
      console.log('❌ Failed to register fixed trigger:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
      return;
    }
    
    const result = await response.json();
    
    console.log('\n✅ FIXED TRIGGER REGISTERED SUCCESSFULLY!');
    console.log('📊 Response:', JSON.stringify(result, null, 2));
    
    console.log('\n🎯 IFTTT Rule Active (Fixed):');
    console.log('   IF: Diya sends USDC to you');
    console.log('   THEN: Automatically forward same amount to Krish');
    console.log('   STATUS: ✅ Monitoring blockchain events with proper checksums');
    
  } catch (error) {
    console.error('❌ Error fixing trigger:', error.message);
  }
}

fixTrigger();