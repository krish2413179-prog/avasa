/**
 * Check and fix address checksums
 */

const { ethers } = require('ethers');

function checkAddresses() {
  console.log('🔍 CHECKING ADDRESS CHECKSUMS');
  console.log('=' .repeat(40));
  
  const addresses = [
    '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c', // Your address
    '0x51c2c01ed19c6377b881abf0eda20168386fde47', // Diya's address
    '0xCb188d3dBab64d9B01C6b49193f76D762A00f268'  // Krish's address (problematic)
  ];
  
  const names = ['Your address', 'Diya address', 'Krish address'];
  
  addresses.forEach((addr, index) => {
    try {
      const checksummed = ethers.utils.getAddress(addr);
      console.log(`✅ ${names[index]}:`);
      console.log(`   Original: ${addr}`);
      console.log(`   Checksum: ${checksummed}`);
      console.log(`   Valid: ${addr === checksummed ? 'YES' : 'NO - NEEDS FIX'}`);
    } catch (error) {
      console.log(`❌ ${names[index]}: ${addr}`);
      console.log(`   Error: ${error.message}`);
      
      // Try to fix by converting to lowercase and then checksumming
      try {
        const fixed = ethers.utils.getAddress(addr.toLowerCase());
        console.log(`   Fixed: ${fixed}`);
      } catch (fixError) {
        console.log(`   Cannot fix: ${fixError.message}`);
      }
    }
    console.log('');
  });
}

checkAddresses();