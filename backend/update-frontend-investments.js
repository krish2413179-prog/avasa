// Browser console script to update localStorage with recurring investment data
// Copy and paste this into the browser console on the frontend

console.log('🔄 Updating localStorage with recurring investment data...');

// Investment data from blockchain analysis
const investmentUpdates = [
  {
    address: '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c',
    propertyId: '1',
    data: {
      amount: '$200',
      shares: '2.0%',
      lastUpdate: new Date().toISOString(),
      type: 'recurring',
      executionCount: 28
    }
  },
  {
    address: '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c',
    propertyId: '2',
    data: {
      amount: '$40',
      shares: '0.4%',
      lastUpdate: new Date().toISOString(),
      type: 'recurring',
      executionCount: 4
    }
  }
];

// Apply updates
investmentUpdates.forEach(update => {
  const key = `investment_${update.address}_${update.propertyId}`;
  localStorage.setItem(key, JSON.stringify(update.data));
  console.log(`✅ Updated ${key}:`, update.data);
});

console.log('🎉 All investment data updated! Refresh the Properties page to see changes.');

// Also provide individual commands for manual execution
console.log('\n📝 Individual commands (if needed):');
investmentUpdates.forEach(update => {
  const key = `investment_${update.address}_${update.propertyId}`;
  console.log(`localStorage.setItem('${key}', '${JSON.stringify(update.data)}');`);
});

export {}; // Make this a module to avoid global scope issues