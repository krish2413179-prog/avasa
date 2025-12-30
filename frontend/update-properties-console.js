// BROWSER CONSOLE SCRIPT - Copy and paste this into your browser console on the Properties page
// This will immediately update your investment data to show recurring investments

console.log('🔄 Updating Properties page with recurring investment data...');

// Check if we're on the right page
if (!window.location.pathname.includes('/properties')) {
  console.log('⚠️ Please navigate to the Properties page first, then run this script');
} else {
  console.log('✅ On Properties page - proceeding with update');
  
  // Investment data from blockchain analysis
  const address = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
  
  // Manhattan Luxury Apartments (Property ID: 1)
  localStorage.setItem(`investment_${address}_1`, JSON.stringify({
    amount: '$200',
    shares: '2.0%',
    type: 'recurring',
    executionCount: 28,
    lastUpdate: new Date().toISOString()
  }));
  
  // Miami Beach Condos (Property ID: 2)
  localStorage.setItem(`investment_${address}_2`, JSON.stringify({
    amount: '$40',
    shares: '0.4%',
    type: 'recurring',
    executionCount: 4,
    lastUpdate: new Date().toISOString()
  }));
  
  console.log('✅ Investment data updated in localStorage:');
  console.log('🏢 Manhattan Luxury Apartments: $200 (2.0% shares, 28 payments)');
  console.log('🏖️ Miami Beach Condos: $40 (0.4% shares, 4 payments)');
  console.log('');
  console.log('🔄 Now refreshing the page to show updated investments...');
  
  // Refresh the page to show the updated data
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Export to avoid global scope issues
export {};