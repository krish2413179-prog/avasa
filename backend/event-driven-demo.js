/**
 * Event-Driven Payment Demo - "If This Then That" (IFTTT) for Web3
 * Shows how the AI agent monitors blockchain events and triggers payments
 */

const { initializePaymentExecutor } = require('./src/agents/paymentExecutor');

async function demonstrateEventDrivenPayments() {
  console.log('🚀 Event-Driven Payment System Demo');
  console.log('====================================\n');

  // Initialize the payment executor
  const privateKey = process.env.EXECUTOR_PRIVATE_KEY;
  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
  
  if (!privateKey) {
    console.error('❌ Please set EXECUTOR_PRIVATE_KEY in your .env file');
    return;
  }

  const executor = initializePaymentExecutor(privateKey, rpcUrl);
  
  console.log('🎯 EVENT-DRIVEN ARCHITECTURE: "If This Then That" for Web3\n');
  
  // Demo 1: Salary-Based Rent Payment
  console.log('📊 Demo 1: Salary-Based Rent Payment');
  console.log('User Command: "Pay my rent when Diya sends me money"');
  console.log('Translation: When USDC Transfer from Diya → Execute rent payment\n');
  
  const rentScheduleId = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const diyaAddress = '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6'; // Example address
  
  executor.addEventTrigger(rentScheduleId, {
    triggerType: 'usdc_received',
    triggerFrom: diyaAddress,
    triggerTo: executor.wallet?.address, // Your address
    triggerAmount: '1000', // Minimum 1000 USDC to trigger
    description: 'Pay rent when Diya sends salary',
    isActive: true
  });
  
  console.log('✅ Event trigger configured - monitoring blockchain for Diya\'s payment\n');
  
  // Demo 2: Investment Automation
  console.log('📊 Demo 2: Investment Automation');
  console.log('User Command: "When my salary arrives, automatically invest 20% in Manhattan property"');
  console.log('Translation: When USDC Transfer from employer → Execute property investment\n');
  
  const investmentScheduleId = '0x2222222222222222222222222222222222222222222222222222222222222222';
  const employerAddress = '0x123456789abcdef123456789abcdef123456789a'; // Example employer
  
  executor.addEventTrigger(investmentScheduleId, {
    triggerType: 'usdc_received',
    triggerFrom: employerAddress,
    triggerAmount: '5000', // Minimum salary amount
    description: 'Auto-invest 20% of salary in Manhattan property',
    isActive: true
  });
  
  console.log('✅ Investment trigger configured - will invest when salary arrives\n');
  
  // Demo 3: Emergency Bill Payment
  console.log('📊 Demo 3: Emergency Bill Payment');
  console.log('User Command: "If I receive 1000+ USDC from anyone, pay all my bills"');
  console.log('Translation: When USDC Transfer ≥ 1000 from any address → Execute bill payments\n');
  
  const billsScheduleId = '0x3333333333333333333333333333333333333333333333333333333333333333';
  
  executor.addEventTrigger(billsScheduleId, {
    triggerType: 'usdc_received',
    // No triggerFrom = accept from any address
    triggerAmount: '1000', // Minimum 1000 USDC
    description: 'Pay bills when receiving large payment',
    isActive: true
  });
  
  console.log('✅ Emergency bill trigger configured - monitoring for large payments\n');
  
  // Start the system
  console.log('🎬 STARTING THE WATCHTOWER...\n');
  await executor.start();
  
  console.log('👁️ BLOCKCHAIN WATCHTOWER ACTIVE');
  console.log('🔍 Monitoring USDC Transfer events...');
  console.log('⚡ Ready to execute payments when triggers fire\n');
  
  // Show active triggers
  console.log('🎯 ACTIVE EVENT TRIGGERS:');
  const triggers = executor.getEventTriggers();
  Object.entries(triggers).forEach(([scheduleId, trigger]) => {
    console.log(`\n📋 Schedule: ${scheduleId.substring(0, 10)}...`);
    console.log(`   Type: ${trigger.triggerType}`);
    console.log(`   Description: ${trigger.description}`);
    if (trigger.triggerFrom) console.log(`   From: ${trigger.triggerFrom}`);
    if (trigger.triggerAmount) console.log(`   Min Amount: ${trigger.triggerAmount} USDC`);
    console.log(`   Status: ${trigger.isActive ? '🟢 Active' : '🔴 Inactive'}`);
  });
  
  console.log('\n🔄 THE CHAIN REACTION:');
  console.log('1. Diya sends 2000 USDC to your wallet');
  console.log('2. Watchtower detects Transfer event');
  console.log('3. Checks: from == Diya ✓, amount >= 1000 ✓');
  console.log('4. Triggers rent payment execution');
  console.log('5. Safety checks: gas price ✓, wallet balance ✓');
  console.log('6. Executes rent payment automatically');
  console.log('7. User gets notification: "Rent paid via Diya trigger"');
  
  console.log('\n💡 KEY ADVANTAGES:');
  console.log('• No manual intervention needed');
  console.log('• Instant response to blockchain events');
  console.log('• Combines with safety features (gas optimization, emergency brakes)');
  console.log('• Works with any ERC-20 token or ETH');
  console.log('• Can trigger multiple payments from one event');
  console.log('• Fully decentralized - no centralized servers needed');
  
  console.log('\n🚀 REAL-WORLD USE CASES:');
  console.log('1. Salary → Automatic bill payments');
  console.log('2. Freelance payment → Tax withholding');
  console.log('3. Investment returns → Reinvestment');
  console.log('4. Insurance payout → Emergency fund allocation');
  console.log('5. Loan repayment → Credit score improvement actions');
  
  console.log('\n🎯 This is Web3 automation done right:');
  console.log('   Event-driven, safe, and intelligent');
  
  // Simulate an event (for demo purposes)
  setTimeout(() => {
    console.log('\n🎬 SIMULATING EVENT...');
    console.log('💰 Simulated: Diya sends 2000 USDC');
    console.log('👁️ Watchtower would detect this and trigger rent payment');
    console.log('🎉 Chain reaction complete!');
    
    console.log('\n✨ Demo complete! The system is now monitoring for real events.');
  }, 2000);
}

// Run the demo
demonstrateEventDrivenPayments().catch(console.error);