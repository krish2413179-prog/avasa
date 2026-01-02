/**
 * Simple balance check for PaymentExecutor wallet
 */

const { ethers } = require('ethers');

async function checkBalance() {
  console.log('🔍 CHECKING PAYMENTEXECUTOR WALLET BALANCE');
  console.log('=' .repeat(50));
  
  try {
    // Contract addresses and setup
    const RPC_URL = 'https://sepolia.base.org';
    const USDC_ADDRESS = '0x6B0dacea6a72E759243c99Eaed840DEe9564C194';
    const EXECUTOR_ADDRESS = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
    
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    
    // USDC contract ABI for balance checking
    const USDC_ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];
    
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
    
    console.log(`🔑 Executor Address: ${EXECUTOR_ADDRESS}`);
    
    // Check USDC balance
    const balance = await usdcContract.balanceOf(EXECUTOR_ADDRESS);
    const decimals = await usdcContract.decimals();
    const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
    
    console.log(`💰 USDC Balance: ${balanceFormatted} USDC`);
    console.log(`💰 Raw Balance: ${balance.toString()} wei`);
    
    // Check ETH balance for gas
    const ethBalance = await provider.getBalance(EXECUTOR_ADDRESS);
    const ethFormatted = ethers.utils.formatEther(ethBalance);
    
    console.log(`⛽ ETH Balance: ${ethFormatted} ETH`);
    
    // Analysis
    console.log('\n📊 BALANCE ANALYSIS:');
    if (parseFloat(balanceFormatted) >= 100) {
      console.log('✅ USDC Balance: SUFFICIENT for 100 USDC forward');
    } else {
      console.log('❌ USDC Balance: INSUFFICIENT for 100 USDC forward');
      console.log(`   Need: 100 USDC, Have: ${balanceFormatted} USDC`);
      console.log(`   Missing: ${100 - parseFloat(balanceFormatted)} USDC`);
    }
    
    if (parseFloat(ethFormatted) > 0.001) {
      console.log('✅ ETH Balance: SUFFICIENT for gas fees');
    } else {
      console.log('❌ ETH Balance: INSUFFICIENT for gas fees');
      console.log(`   Need: >0.001 ETH, Have: ${ethFormatted} ETH`);
    }
    
    console.log('\n🎯 ROOT CAUSE ANALYSIS:');
    if (parseFloat(balanceFormatted) < 100) {
      console.log('🔍 LIKELY ROOT CAUSE: PaymentExecutor wallet lacks USDC');
      console.log('💡 SOLUTION: Fund the PaymentExecutor wallet with USDC');
      console.log(`   Send ${100 - parseFloat(balanceFormatted)} USDC to: ${EXECUTOR_ADDRESS}`);
    } else if (parseFloat(ethFormatted) < 0.001) {
      console.log('🔍 LIKELY ROOT CAUSE: PaymentExecutor wallet lacks ETH for gas');
      console.log('💡 SOLUTION: Fund the PaymentExecutor wallet with ETH');
      console.log(`   Send 0.01 ETH to: ${EXECUTOR_ADDRESS}`);
    } else {
      console.log('🔍 Balances are sufficient - issue may be elsewhere');
      console.log('   Check: Event trigger configuration, blockchain monitoring, etc.');
    }
    
  } catch (error) {
    console.error('❌ Balance check failed:', error.message);
  }
}

checkBalance();