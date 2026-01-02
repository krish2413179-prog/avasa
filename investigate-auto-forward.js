/**
 * Deep investigation into why auto-forward didn't execute
 */

const { ethers } = require('ethers');

async function investigateAutoForward() {
  console.log('🔍 INVESTIGATING AUTO-FORWARD FAILURE');
  console.log('=' .repeat(60));
  
  // Contract addresses and setup
  const RPC_URL = 'https://sepolia.base.org';
  const USDC_ADDRESS = '0x6B0dacea6a72E759243c99Eaed840DEe9564C194';
  const EXECUTOR_ADDRESS = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c'; // From backend logs
  
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  
  // USDC contract ABI for balance checking
  const USDC_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  
  const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
  
  try {
    console.log('\n📋 Step 1: Checking PaymentExecutor Agent Wallet Balance...');
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
    console.log('\n📊 Balance Analysis:');
    if (parseFloat(balanceFormatted) >= 100) {
      console.log('✅ USDC Balance: Sufficient for 100 USDC forward');
    } else {
      console.log('❌ USDC Balance: INSUFFICIENT for 100 USDC forward');
      console.log(`   Need: 100 USDC, Have: ${balanceFormatted} USDC`);
    }
    
    if (parseFloat(ethFormatted) > 0.001) {
      console.log('✅ ETH Balance: Sufficient for gas fees');
    } else {
      console.log('❌ ETH Balance: INSUFFICIENT for gas fees');
      console.log(`   Need: >0.001 ETH, Have: ${ethFormatted} ETH`);
    }
    
    console.log('\n📋 Step 2: Checking Recent USDC Transfers...');
    
    // Get recent blocks to check for transfers
    const currentBlock = await provider.getBlockNumber();
    console.log(`🔍 Current Block: ${currentBlock}`);
    
    // Check for Transfer events in recent blocks
    const fromBlock = currentBlock - 1000; // Last ~1000 blocks
    console.log(`🔍 Checking blocks ${fromBlock} to ${currentBlock}...`);
    
    const transferFilter = usdcContract.filters.Transfer(null, null);
    const events = await usdcContract.queryFilter(transferFilter, fromBlock, currentBlock);
    
    console.log(`📊 Found ${events.length} USDC transfer events in recent blocks`);
    
    // Look for transfers involving our addresses
    const diyaAddress = '0x51c2c01ed19c6377b881abf0eda20168386fde47';
    const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
    const krishAddress = '0xCb188d3dBab64d9B01C6b49193f76D762A00f268';
    
    const relevantEvents = events.filter(event => {
      const from = event.args.from.toLowerCase();
      const to = event.args.to.toLowerCase();
      return (
        (from === diyaAddress.toLowerCase() && to === userAddress.toLowerCase()) ||
        (from === userAddress.toLowerCase() && to === krishAddress.toLowerCase()) ||
        (from === EXECUTOR_ADDRESS.toLowerCase())
      );
    });
    
    console.log(`🎯 Found ${relevantEvents.length} relevant transfer events:`);
    
    relevantEvents.forEach((event, index) => {
      const from = event.args.from;
      const to = event.args.to;
      const value = ethers.utils.formatUnits(event.args.value, 18);
      
      console.log(`${index + 1}. Block ${event.blockNumber}:`);
      console.log(`   From: ${from}`);
      console.log(`   To: ${to}`);
      console.log(`   Amount: ${value} USDC`);
      console.log(`   Tx: ${event.transactionHash}`);
      
      if (from.toLowerCase() === diyaAddress.toLowerCase()) {
        console.log('   📥 This is Diya → You transfer');
      }
      if (to.toLowerCase() === krishAddress.toLowerCase()) {
        console.log('   📤 This is → Krish transfer (AUTO-FORWARD!)');
      }
    });
    
    console.log('\n🎯 INVESTIGATION SUMMARY:');
    console.log('=' .repeat(40));
    
    if (parseFloat(balanceFormatted) < 100) {
      console.log('🔍 ROOT CAUSE FOUND: PaymentExecutor wallet has insufficient USDC balance');
      console.log(`   The agent needs ${100 - parseFloat(balanceFormatted)} more USDC to forward payments`);
      console.log('   💡 Solution: Fund the PaymentExecutor wallet with USDC');
    } else if (parseFloat(ethFormatted) < 0.001) {
      console.log('🔍 ROOT CAUSE FOUND: PaymentExecutor wallet has insufficient ETH for gas');
      console.log('   💡 Solution: Fund the PaymentExecutor wallet with ETH for gas fees');
    } else {
      console.log('🔍 Balances are sufficient - investigating other causes...');
    }
    
    const autoForwardFound = relevantEvents.some(event => 
      event.args.to.toLowerCase() === krishAddress.toLowerCase()
    );
    
    if (autoForwardFound) {
      console.log('✅ AUTO-FORWARD TRANSACTION FOUND: Payment was forwarded to Krish!');
    } else {
      console.log('❌ NO AUTO-FORWARD TRANSACTION: Payment was NOT forwarded to Krish');
    }
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.message);
  }
}

investigateAutoForward();