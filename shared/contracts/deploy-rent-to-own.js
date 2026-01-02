const { ethers } = require("hardhat");

async function main() {
  console.log("🏠 Deploying Real-Time Home Ownership contracts...");
  
  // Get the USDC token address from environment
  const USDC_TOKEN_ADDRESS = process.env.USDC_TOKEN_ADDRESS || "0x6B0dacea6a72E759243c99Eaed840DEe9564C194";
  
  console.log("📍 Using USDC token:", USDC_TOKEN_ADDRESS);
  
  // Deploy PropertyShare contracts for each property
  const PropertyShare = await ethers.getContractFactory("PropertyShare");
  
  const properties = [
    { name: "Manhattan Luxury Apartments Share", symbol: "MNHTN" },
    { name: "Miami Beach Condos Share", symbol: "MIAMI" },
    { name: "Austin Tech Hub Office Share", symbol: "AUSTIN" },
    { name: "Seattle Warehouse District Share", symbol: "SEATTLE" },
    { name: "Denver Mountain Resort Share", symbol: "DENVER" }
  ];
  
  const propertyShares = {};
  
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    console.log(`\n📋 Deploying ${property.name}...`);
    
    const propertyShare = await PropertyShare.deploy(property.name, property.symbol);
    await propertyShare.waitForDeployment();
    
    const address = await propertyShare.getAddress();
    propertyShares[i + 1] = address;
    
    console.log(`✅ ${property.name} deployed to:`, address);
  }
  
  // Deploy RentToOwnAdapter
  console.log("\n🏗️  Deploying RentToOwnAdapter...");
  const RentToOwnAdapter = await ethers.getContractFactory("RentToOwnAdapter");
  const rentToOwnAdapter = await RentToOwnAdapter.deploy(USDC_TOKEN_ADDRESS);
  await rentToOwnAdapter.waitForDeployment();
  
  const adapterAddress = await rentToOwnAdapter.getAddress();
  console.log("✅ RentToOwnAdapter deployed to:", adapterAddress);
  
  // Set the adapter address in each PropertyShare contract
  console.log("\n🔗 Connecting PropertyShare contracts to RentToOwnAdapter...");
  for (let i = 0; i < properties.length; i++) {
    const propertyId = i + 1;
    const propertyShare = await ethers.getContractAt("PropertyShare", propertyShares[propertyId]);
    
    console.log(`Setting adapter for Property ${propertyId}...`);
    const tx = await propertyShare.setRentToOwnAdapter(adapterAddress);
    await tx.wait();
    console.log(`✅ Property ${propertyId} connected to adapter`);
  }
  
  console.log("\n🎉 Real-Time Home Ownership deployment complete!");
  console.log("\n📋 Contract Addresses:");
  console.log("RentToOwnAdapter:", adapterAddress);
  console.log("\nPropertyShare Contracts:");
  for (let i = 1; i <= properties.length; i++) {
    console.log(`Property ${i} (${properties[i-1].symbol}):`, propertyShares[i]);
  }
  
  console.log("\n🔧 Update your .env file:");
  console.log(`RENT_TO_OWN_ADAPTER_ADDRESS=${adapterAddress}`);
  
  console.log("\n🔧 Update your frontend constants:");
  console.log("const RENT_TO_OWN_ADAPTER_ADDRESS =", `"${adapterAddress}";`);
  console.log("const PROPERTY_SHARE_ADDRESSES = {");
  for (let i = 1; i <= properties.length; i++) {
    console.log(`  "${i}": "${propertyShares[i]}",`);
  }
  console.log("};");
  
  // Test the setup
  console.log("\n🧪 Testing contract setup...");
  try {
    // Test creating a rent-to-own schedule
    const [deployer] = await ethers.getSigners();
    const testTenant = deployer.address;
    const testLandlord = "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6"; // Default landlord
    const propertyShareAddress = propertyShares[1]; // Manhattan property
    const monthlyRent = ethers.parseEther("2000"); // $2000/month
    const targetOwnership = 500; // 5% (500 basis points)
    const targetMonths = 12;
    
    console.log("Creating test rent-to-own schedule...");
    const scheduleId = await rentToOwnAdapter.createRentToOwnSchedule(
      testTenant,
      testLandlord,
      propertyShareAddress,
      monthlyRent,
      targetOwnership,
      targetMonths
    );
    
    console.log("✅ Test schedule creation successful!");
    
    // Test calculation
    const calculatedRent = await rentToOwnAdapter.calculateRentForOwnership(
      propertyShareAddress,
      targetOwnership,
      targetMonths
    );
    
    console.log(`📊 Calculated monthly rent for 5% ownership in 12 months: ${ethers.formatEther(calculatedRent)} USDC`);
    
  } catch (error) {
    console.log("⚠️ Test failed (this is normal if contracts need setup):", error.message);
  }
  
  console.log("\n🚀 Ready for Real-Time Home Ownership!");
  console.log("💡 Try: 'I want to own 5% of Manhattan property by December'");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });