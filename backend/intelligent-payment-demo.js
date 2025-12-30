/**
 * Intelligent Payment Executor Demo
 * Shows how the AI agent protects users with gas optimization and safety brakes
 */

const { initializePaymentExecutor } = require('./src/agents/paymentExecutor');

async function demonstrateIntelligentFeatures() {
  console.log('🚀 Intelligent Payment Executor Demo');
  console.log('=====================================\n');

  // Initialize the payment executor
  const privateKey = process.env.EXECUTOR_PRIVATE_KEY;
  const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
  
  if (!privateKey) {
    console.error('❌ Please set EXECUTOR_PRIVATE_KEY in your .env file');
    return;
  }

  const executor = initializePaymentExecutor(privateKey, rpcUrl);
  
  console.log('🛡️ INTELLIGENT SAFETY FEATURES DEMO\n');
  
  // Demo 1: Gas Price Protection
  console.log('📊 Demo 1: Gas Price Protection');
  console.log('User Command: "Pay my rent of 2000 USDC on the 1st, but ONLY if gas is below 20 gwei"');
  
  const scheduleId1 = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  executor.addSafetyRule(scheduleId1, {
    maxGasPrice: 20, // 20 gwei max
    retryIntervalMinutes: 60 // Retry every hour
  });
  
  console.log('✅ Safety rule added - will only execute when gas < 20 gwei\n');
  
  // Demo 2: Emergency Brake
  console.log('📊 Demo 2: Emergency Brake Protection');
  console.log('User Command: "Stream 50 USDC every hour to Chicago property, but PAUSE if my balance drops below 500 USDC"');
  
  const scheduleId2 = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
  executor.addSafetyRule(scheduleId2, {
    emergencyBrakeBalance: '500', // Emergency stop at 500 USDC
    minWalletBalance: '600', // Warning at 600 USDC
    retryIntervalMinutes: 30 // Check every 30 minutes
  });
  
  console.log('✅ Emergency brake set - will stop if balance < 500 USDC\n');
  
  // Demo 3: Combined Protection
  console.log('📊 Demo 3: Combined Protection');
  console.log('User Command: "Invest $100 in Manhattan every 10 minutes, but only when gas is cheap and keep 1000 USDC safety buffer"');
  
  const scheduleId3 = '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321';
  executor.addSafetyRule(scheduleId3, {
    maxGasPrice: 15, // Only when gas is really cheap
    minWalletBalance: '1000', // Keep 1000 USDC buffer
    emergencyBrakeBalance: '500', // Emergency stop at 500 USDC
    retryIntervalMinutes: 10 // Check every 10 minutes
  });
  
  console.log('✅ Multi-layer protection active\n');
  
  // Show current safety rules
  console.log('🛡️ ACTIVE SAFETY RULES:');
  const safetyRules = executor.getSafetyRules();
  Object.entries(safetyRules).forEach(([scheduleId, rule]) => {
    console.log(`\n📋 Schedule: ${scheduleId.substring(0, 10)}...`);
    if (rule.maxGasPrice) console.log(`   ⛽ Max Gas: ${rule.maxGasPrice} gwei`);
    if (rule.minWalletBalance) console.log(`   💰 Min Balance: ${rule.minWalletBalance} USDC`);
    if (rule.emergencyBrakeBalance) console.log(`   🚨 Emergency Brake: ${rule.emergencyBrakeBalance} USDC`);
    if (rule.retryIntervalMinutes) console.log(`   🔄 Retry Interval: ${rule.retryIntervalMinutes} minutes`);
  });
  
  console.log('\n🎯 KEY BENEFITS:');
  console.log('• Smart contracts are dumb - they execute even with $500 gas fees');
  console.log('• Your AI agent is smart - it protects you from bad conditions');
  console.log('• Gas optimization saves money automatically');
  console.log('• Emergency brakes prevent wallet drainage');
  console.log('• Smart retries wait for better conditions');
  console.log('• No manual intervention needed - AI handles everything');
  
  console.log('\n🚀 REAL-WORLD SCENARIOS:');
  console.log('1. Gas spike to 200 gwei → AI waits for < 20 gwei');
  console.log('2. Wallet balance drops → AI pauses payments');
  console.log('3. Network congestion → AI retries every hour');
  console.log('4. Emergency situation → AI stops all payments');
  console.log('5. Conditions improve → AI resumes automatically');
  
  console.log('\n💡 This is the future of DeFi automation:');
  console.log('   Intelligent agents that protect users from blockchain\'s rough edges');
  
  // Demo pause/unpause
  console.log('\n🎮 MANUAL CONTROLS:');
  executor.pauseSchedule(scheduleId1, 'User requested pause for vacation');
  console.log('⏸️ Schedule paused manually');
  
  setTimeout(() => {
    executor.unpauseSchedule(scheduleId1);
    console.log('▶️ Schedule resumed');
    
    console.log('\n✨ Demo complete! The AI agent is now protecting your transactions.');
  }, 1000);
}

// Run the demo
demonstrateIntelligentFeatures().catch(console.error);