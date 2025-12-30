const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Real-Time Home Ownership System...");

  // Get contract addresses
  const USDC_ADDRESS = "0x6B0dacea6a72E759243c99Eaed840DEe9564C194";
  const AUTO_RECURRING_PAYMENTS_ADDRESS = "0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96";

  // Deploy PropertyShare contracts for each property
  const PropertyShare = await ethers.getContractFactory("PropertyShare");
  
  const properties = [
    {
      id: "1",
      name: "Manhattan Luxury Apartments",
      symbol: "MNHTN",
      location: "New York, NY",
      totalValue: ethers.parseEther("2500000"), // $2.5M property value
      totalShares: 100000, // 100,000 shares (0.001% precision)
      rentToShareRate: ethers.parseEther("1000") // 1000 USDC = 1 share
    },
    {
      id: "2", 
      name: "Miami Beach Condos",
      symbol: "MIAMI",
      location: "Miami, FL",
      totalValue: ethers.parseEther("1800000"), // $1.8M property value
      totalShares: 100000,
      rentToShareRate: ethers.parseEther("800") // 800 USDC = 1 share
    },
    {
      id: "3",
      name: "Austin Tech Hub Office", 
      symbol: "AUSTIN",
      location: "Austin, TX",
      totalValue: ethers.parseEther("4200000"), // $4.2M property value
      totalShares: 100000,
      rentToShareRate: ethers.parseEther("1500") // 1500 USDC = 1 share
    }
  ];

  const deployedPropertyShares = [];

  for (const property of properties) {
    console.log(`\n📍 Deploying PropertyShare for ${property.name}...`);
    
    const propertyShare = await PropertyShare.deploy(
      property.name + " Shares",
      property.symbol,
      property.name,
      property.location,
      property.totalValue,
      property.totalShares,
      property.rentToShareRate
    );
    
    await propertyShare.waitForDeployment();
    const address = await propertyShare.getAddress();
    
    console.log(`✅ ${property.name} PropertyShare deployed to: ${address}`);
    
    deployedPropertyShares.push({
      ...property,
      address: address,
      contract: propertyShare
    });
  }

  // Deploy RentToOwnAdapter
  console.log("\n🏠 Deploying RentToOwnAdapter...");
  const RentToOwnAdapter = await ethers.getContractFactory("RentToOwnAdapter");
  const rentToOwnAdapter = await RentToOwnAdapter.deploy(
    USDC_ADDRESS,
    AUTO_RECURRING_PAYMENTS_ADDRESS
  );
  
  await rentToOwnAdapter.waitForDeployment();
  const adapterAddress = await rentToOwnAdapter.getAddress();
  console.log(`✅ RentToOwnAdapter deployed to: ${adapterAddress}`);

  // Set RentToOwnAdapter as the rent adapter for each PropertyShare
  console.log("\n🔗 Linking PropertyShare contracts to RentToOwnAdapter...");
  for (const property of deployedPropertyShares) {
    console.log(`Setting rent adapter for ${property.name}...`);
    await property.contract.setRentAdapter(adapterAddress);
    console.log(`✅ ${property.name} linked to RentToOwnAdapter`);
  }

  // Generate frontend configuration
  console.log("\n📝 Generating frontend configuration...");
  
  const frontendConfig = {
    RENT_TO_OWN_ADAPTER_ADDRESS: adapterAddress,
    PROPERTY_SHARE_ADDRESSES: {}
  };
  
  deployedPropertyShares.forEach(property => {
    frontendConfig.PROPERTY_SHARE_ADDRESSES[property.id] = property.address;
  });

  console.log("\n🎉 Deployment Complete!");
  console.log("\n📋 Contract Addresses:");
  console.log(`RentToOwnAdapter: ${adapterAddress}`);
  console.log("\nPropertyShare Contracts:");
  deployedPropertyShares.forEach(property => {
    console.log(`  ${property.name} (ID: ${property.id}): ${property.address}`);
  });

  console.log("\n🔧 Frontend Configuration:");
  console.log("Add these addresses to your frontend/src/app/page.tsx:");
  console.log(`const RENT_TO_OWN_ADAPTER_ADDRESS = "${adapterAddress}";`);
  console.log("const PROPERTY_SHARE_ADDRESSES: { [key: string]: string } = {");
  deployedPropertyShares.forEach(property => {
    console.log(`  "${property.id}": "${property.address}",`);
  });
  console.log("};");

  console.log("\n🧪 Testing rent-to-own calculation...");
  
  // Test calculation for 5% ownership of Manhattan property
  const manhattanShare = deployedPropertyShares[0].contract;
  const targetOwnership = 500; // 5% in basis points
  const targetMonths = 12;
  
  const requiredUSDC = await manhattanShare.calculateUSDCForOwnership(targetOwnership);
  const monthlyRent = await rentToOwnAdapter.calculateRentForOwnership(
    deployedPropertyShares[0].address,
    targetOwnership,
    targetMonths
  );
  
  console.log(`\n📊 Example: 5% ownership of ${deployedPropertyShares[0].name} in 12 months:`);
  console.log(`Total USDC needed: ${ethers.formatEther(requiredUSDC)} USDC`);
  console.log(`Monthly rent required: ${ethers.formatEther(monthlyRent)} USDC`);
  
  console.log("\n🎊 Real-Time Home Ownership system is ready!");
  console.log("\n💡 Users can now:");
  console.log("1. Say: 'I want to own 5% of Manhattan by December'");
  console.log("2. Set up monthly rent payments that unlock property shares");
  console.log("3. Watch their ownership percentage grow in real-time");
  console.log("4. Transform rent payments into equity building!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });