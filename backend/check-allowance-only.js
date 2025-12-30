// Just check current USDC allowance
const { ethers } = require('ethers');

const AUTO_RECURRING_PAYMENTS_ADDRESS = '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96';
const USDC_ADDRESS = '0x6B0dacea6a72E759243c99Eaed840DEe9564C194';
const PRIVATE_KEY = '4f2f402e4fa4fe0b24025ac812e7ff84118b80239728baebe5866795c560fa01';

const USDC_ABI = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

async function checkAllowance() {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, wallet);
    
    console.log('💰 Current USDC status:');
    
    const balance = await usdcContract.balanceOf(wallet.address);
    console.log(`💰 Balance: ${ethers.utils.formatUnits(balance, 18)} USDC`);
    
    const allowance = await usdcContract.allowance(wallet.address, AUTO_RECURRING_PAYMENTS_ADDRESS);
    console.log(`🔓 Allowance: ${ethers.utils.formatUnits(allowance, 18)} USDC`);
    
    const needed = ethers.utils.parseUnits('44', 18);
    console.log(`📊 Needed: ${ethers.utils.formatUnits(needed, 18)} USDC`);
    
    if (allowance.gte(needed)) {
      console.log('✅ Allowance is sufficient for recurring investments!');
    } else {
      console.log('❌ Allowance is still insufficient');
      console.log(`💡 Need to approve ${ethers.utils.formatUnits(needed.sub(allowance), 18)} more USDC`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllowance();