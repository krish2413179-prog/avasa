const { ethers } = require('hardhat');

async function main() {
  console.log('🏗️ Deploying Real Estate Properties...');
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log('📝 Deploying with account:', deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(await deployer.provider.getBalance(deployer.address)), 'ETH');
  
  // Deploy the factory first
  console.log('\n🏭 Deploying RealEstateFactory...');
  const RealEstateFactory = await ethers.getContractFactory('RealEstateFactory');
  const factory = await RealEstateFactory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log('✅ RealEstateFactory deployed to:', factoryAddress);
  
  // Property configurations
  const properties = [
    {
      name: "Manhattan Luxury Apartments",
      symbol: "MLA",
      location: "New York, NY",
      propertyType: "Residential",
      totalValue: ethers.parseEther("2500"), // $2.5M (assuming 1 ETH = $1000 for demo)
      totalShares: 25000,
      pricePerShare: ethers.parseEther("0.1"), // $100 per share
      annualYieldRate: 420 // 4.2%
    },
    {
      name: "Miami Beach Condos",
      symbol: "MBC",
      location: "Miami, FL",
      propertyType: "Residential",
      totalValue: ethers.parseEther("1800"),
      totalShares: 18000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 510 // 5.1%
    },
    {
      name: "Austin Tech Hub Office",
      symbol: "ATHO",
      location: "Austin, TX",
      propertyType: "Commercial",
      totalValue: ethers.parseEther("4200"),
      totalShares: 42000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 680 // 6.8%
    },
    {
      name: "Seattle Warehouse District",
      symbol: "SWD",
      location: "Seattle, WA",
      propertyType: "Industrial",
      totalValue: ethers.parseEther("3100"),
      totalShares: 31000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 720 // 7.2%
    },
    {
      name: "Denver Mountain Resort",
      symbol: "DMR",
      location: "Denver, CO",
      propertyType: "Hospitality",
      totalValue: ethers.parseEther("5500"),
      totalShares: 55000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 810 // 8.1%
    },
    {
      name: "Chicago Downtown Lofts",
      symbol: "CDL",
      location: "Chicago, IL",
      propertyType: "Residential",
      totalValue: ethers.parseEther("3200"),
      totalShares: 32000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 580 // 5.8%
    },
    {
      name: "Los Angeles Studio Complex",
      symbol: "LASC",
      location: "Los Angeles, CA",
      propertyType: "Commercial",
      totalValue: ethers.parseEther("6800"),
      totalShares: 68000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 650 // 6.5%
    },
    {
      name: "Phoenix Retail Plaza",
      symbol: "PRP",
      location: "Phoenix, AZ",
      propertyType: "Commercial",
      totalValue: ethers.parseEther("2800"),
      totalShares: 28000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 740 // 7.4%
    },
    {
      name: "Boston Historic Brownstones",
      symbol: "BHB",
      location: "Boston, MA",
      propertyType: "Residential",
      totalValue: ethers.parseEther("4500"),
      totalShares: 45000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 480 // 4.8%
    },
    {
      name: "Nashville Music District",
      symbol: "NMD",
      location: "Nashville, TN",
      propertyType: "Mixed-Use",
      totalValue: ethers.parseEther("3600"),
      totalShares: 36000,
      pricePerShare: ethers.parseEther("0.1"),
      annualYieldRate: 620 // 6.2%
    }
  ];
  
  console.log('\n🏠 Deploying 10 Real Estate Properties...');
  
  const deployedAddresses = [];
  
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    console.log(`\n${i + 1}. Deploying ${prop.name}...`);
    
    try {
      const tx = await factory.deployProperty(
        prop.name,
        prop.symbol,
        prop.location,
        prop.propertyType,
        prop.totalValue,
        prop.totalShares,
        prop.pricePerShare,
        prop.annualYieldRate
      );
      
      const receipt = await tx.wait();
      
      // Get the deployed address from the event
      const event = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === 'PropertyDeployed';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsedEvent = factory.interface.parseLog(event);
        const deployedAddress = parsedEvent.args.contractAddress;
        deployedAddresses.push({
          id: i + 1,
          name: prop.name,
          address: deployedAddress,
          symbol: prop.symbol,
          location: prop.location,
          totalValue: ethers.formatEther(prop.totalValue),
          pricePerShare: ethers.formatEther(prop.pricePerShare),
          annualYieldRate: (prop.annualYieldRate / 100).toFixed(1) + '%'
        });
        
        console.log(`   ✅ ${prop.name} deployed to: ${deployedAddress}`);
        console.log(`   📊 Total Value: ${ethers.formatEther(prop.totalValue)} ETH`);
        console.log(`   💰 Price per Share: ${ethers.formatEther(prop.pricePerShare)} ETH`);
        console.log(`   📈 Annual Yield: ${(prop.annualYieldRate / 100).toFixed(1)}%`);
      }
      
    } catch (error) {
      console.error(`   ❌ Failed to deploy ${prop.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Deployment Summary:');
  console.log('='.repeat(80));
  console.log(`🏭 Factory Address: ${factoryAddress}`);
  console.log(`🏠 Properties Deployed: ${deployedAddresses.length}/10`);
  console.log('\n📋 Property Registry:');
  
  deployedAddresses.forEach((prop, index) => {
    console.log(`${prop.id}. ${prop.name}`);
    console.log(`   📍 Location: ${prop.location}`);
    console.log(`   📄 Contract: ${prop.address}`);
    console.log(`   💎 Symbol: ${prop.symbol}`);
    console.log(`   💰 Value: ${prop.totalValue} ETH (${prop.pricePerShare} ETH/share)`);
    console.log(`   📈 Yield: ${prop.annualYieldRate}`);
    console.log('');
  });
  
  // Add initial yield to properties (simulate rental income)
  console.log('💰 Adding initial yield to properties...');
  
  const yieldAmounts = deployedAddresses.map(() => ethers.parseEther("0.1")); // 0.1 ETH yield per property
  const propertyIndices = deployedAddresses.map((_, index) => index);
  
  try {
    const totalYield = ethers.parseEther((0.1 * deployedAddresses.length).toString());
    const yieldTx = await factory.batchAddYield(propertyIndices, yieldAmounts, { value: totalYield });
    await yieldTx.wait();
    console.log('✅ Initial yield added to all properties');
  } catch (error) {
    console.error('❌ Failed to add initial yield:', error.message);
  }
  
  // Generate constants file for the frontend
  const constantsContent = `// Auto-generated contract addresses
export const REAL_ESTATE_FACTORY_ADDRESS = "${factoryAddress}";

export const REAL_ESTATE_PROPERTIES = {
${deployedAddresses.map(prop => 
  `  "${prop.id}": {
    name: "${prop.name}",
    address: "${prop.address}",
    symbol: "${prop.symbol}",
    location: "${prop.location}",
    totalValue: "${prop.totalValue}",
    pricePerShare: "${prop.pricePerShare}",
    annualYieldRate: "${prop.annualYieldRate}"
  }`).join(',\n')}
};

export const PROPERTY_ADDRESSES = {
${deployedAddresses.map(prop => `  "${prop.name}": "${prop.address}"`).join(',\n')}
};
`;
  
  // Write to constants file
  const fs = require('fs');
  const path = require('path');
  
  const constantsPath = path.join(__dirname, '../constants-deployed.ts');
  fs.writeFileSync(constantsPath, constantsContent);
  
  console.log(`📝 Contract addresses saved to: ${constantsPath}`);
  console.log('\n🚀 Ready for PropChain AI integration!');
  
  return {
    factoryAddress,
    properties: deployedAddresses
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });