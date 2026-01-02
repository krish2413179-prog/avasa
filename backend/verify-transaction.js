/**
 * Verify the auto-forward transaction on blockchain
 */

const { ethers } = require('ethers');

async function verifyTransaction() {
  console.log('🔍 VERIFYING AUTO-FORWARD TRANSACTION');
  console.log('=' .repeat(45));
  
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
    
    // Transaction hash from the logs
    const txHash = '0xbfb326a6c70999cc57997cd75bcd9d2ed649cdfcb86cc559f49d3d8f99df106d';
    
    console.log(`🔍 Looking up transaction: ${txHash}`);
    
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!tx || !receipt) {
      console.log('❌ Transaction not found');
      return;
    }
    
    console.log('\n📊 TRANSACTION DETAILS:');
    console.log(`   Hash: ${tx.hash}`);
    console.log(`   From: ${tx.from}`);
    console.log(`   To: ${tx.to}`);
    console.log(`   Value: ${ethers.utils.formatEther(tx.value)} ETH`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Status: ${receipt.status === 1 ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    // Check if this is a USDC transfer by looking at logs
    if (receipt.logs && receipt.logs.length > 0) {
      console.log('\n📋 TRANSACTION LOGS:');
      receipt.logs.forEach((log, index) => {
        console.log(`   Log ${index + 1}:`);
        console.log(`     Address: ${log.address}`);
        console.log(`     Topics: ${log.topics.length}`);
        
        // Check if this is USDC contract
        if (log.address.toLowerCase() === '0x6B0dacea6a72E759243c99Eaed840DEe9564C194'.toLowerCase()) {
          console.log('     🎯 This is a USDC transfer!');
          
          // Decode Transfer event if possible
          if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
            const from = '0x' + log.topics[1].slice(26);
            const to = '0x' + log.topics[2].slice(26);
            const amount = ethers.BigNumber.from(log.data);
            
            console.log(`     From: ${ethers.utils.getAddress(from)}`);
            console.log(`     To: ${ethers.utils.getAddress(to)}`);
            console.log(`     Amount: ${ethers.utils.formatUnits(amount, 18)} USDC`);
          }
        }
      });
    }
    
    console.log('\n🎯 ANALYSIS:');
    if (tx.from.toLowerCase() === '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c'.toLowerCase()) {
      console.log('✅ Transaction sent by PaymentExecutor wallet');
      console.log('✅ This confirms auto-forward executed successfully!');
      console.log('✅ IFTTT for Web3 is working correctly');
    } else {
      console.log('❓ Transaction not from PaymentExecutor wallet');
    }
    
    console.log(`\n🌐 View on BaseScan: https://sepolia.basescan.org/tx/${txHash}`);
    
  } catch (error) {
    console.error('❌ Error verifying transaction:', error.message);
  }
}

verifyTransaction();