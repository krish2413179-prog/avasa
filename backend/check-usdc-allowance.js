// Check and approve USDC allowance for AutoRecurringPayments
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';
const USDC_ADDRESS = '0x6B0dacea6a72E759243c99Eaed840DEe9564C194';
const PRIVATE_KEY = '4f2f402e4fa4fe0b24025ac812e7ff84118b80239728baebe5866795c560fa01';

const USDC_ABI = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

async function checkAndApproveUSDC() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, wallet);
    
    console.log('💰 Checking USDC allowance and balance...');
    console.log('🔑 User Address:', wallet.address);
    console.log('💳 USDC Contract:', USDC_ADDRESS);
    console.log('📋 AutoRecurringPayments:', AUTO_RECURRING_PAYMENTS_ADDRESS);
    
    // Check current balance
    const balance = await usdcContract.balanceOf(wallet.address);
    console.log(`💰 USDC Balance: ${ethers.utils.formatUnits(balance, 18)} USDC`);
    
    // Check current allowance
    const currentAllowance = await usdcContract.allowance(wallet.address, AUTO_RECURRING_PAYMENTS_ADDRESS);
    console.log(`🔓 Current Allowance: ${ethers.utils.formatUnits(currentAllowance, 18)} USDC`);
    
    // Calculate needed allowance for the failed transaction
    // 10 USDC × 4 executions = 40 USDC for payments
    // 1 USDC × 4 executions = 4 USDC for executor rewards  
    // Total needed: 44 USDC
    const neededAmount = ethers.utils.parseUnits('44', 18);
    console.log(`📊 Needed for transaction: ${ethers.utils.formatUnits(neededAmount, 18)} USDC`);
    
    if (currentAllowance.lt(neededAmount)) {
      console.log('⚠️ Insufficient allowance! Approving more USDC...');
      
      // Approve a generous amount for future transactions (1000 USDC)
      const approveAmount = ethers.utils.parseUnits('1000', 18);
      console.log(`🔓 Approving ${ethers.utils.formatUnits(approveAmount, 18)} USDC...`);
      
      const tx = await usdcContract.approve(AUTO_RECURRING_PAYMENTS_ADDRESS, approveAmount, {
        gasLimit: 100000
      });
      
      console.log(`📤 Approval transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      
      console.log(`✅ USDC approval successful!`);
      console.log(`🔗 Transaction: https://sepolia.basescan.org/tx/${tx.hash}`);
      
      // Check new allowance
      const newAllowance = await usdcContract.allowance(wallet.address, AUTO_RECURRING_PAYMENTS_ADDRESS);
      console.log(`🔓 New Allowance: ${ethers.utils.formatUnits(newAllowance, 18)} USDC`);
      
    } else {
      console.log('✅ Allowance is sufficient!');
    }
    
    // Check if balance is sufficient
    if (balance.lt(neededAmount)) {
      console.log(`⚠️ Warning: USDC balance (${ethers.utils.formatUnits(balance, 18)}) is less than needed (${ethers.utils.formatUnits(neededAmount, 18)})`);
      console.log('💡 You may need to get more USDC from a faucet or exchange');
    } else {
      console.log('✅ USDC balance is sufficient!');
    }
    
    console.log('\n🎉 Ready to create recurring investments!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAndApproveUSDC();