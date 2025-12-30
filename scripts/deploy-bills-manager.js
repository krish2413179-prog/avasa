const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying BillsManager contract...");

  // USDC token address on Base Sepolia
  const USDC_ADDRESS = "0x6B0dacea6a72E759243c99Eaed840DEe9564C194";

  // Deploy BillsManager contract
  const BillsManager = await hre.ethers.getContractFactory("BillsManager");
  const billsManager = await BillsManager.deploy(USDC_ADDRESS);

  await billsManager.waitForDeployment();

  console.log("✅ BillsManager deployed to:", await billsManager.getAddress());
  console.log("📄 USDC Token Address:", USDC_ADDRESS);

  const contractAddress = await billsManager.getAddress();

  // Verify contract on Basescan (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await billsManager.deploymentTransaction().wait(6);

    console.log("🔍 Verifying contract on Basescan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [USDC_ADDRESS],
      });
      console.log("✅ Contract verified on Basescan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  // Update constants file
  const constantsPath = "./shared/constants-deployed.ts";
  const fs = require("fs");
  
  let constantsContent = "";
  if (fs.existsSync(constantsPath)) {
    constantsContent = fs.readFileSync(constantsPath, "utf8");
  }

  // Add or update BillsManager address
  if (constantsContent.includes("BILLS_MANAGER_ADDRESS")) {
    constantsContent = constantsContent.replace(
      /export const BILLS_MANAGER_ADDRESS = ".*";/,
      `export const BILLS_MANAGER_ADDRESS = "${contractAddress}";`
    );
  } else {
    constantsContent += `\n// Bills Manager Contract\nexport const BILLS_MANAGER_ADDRESS = "${contractAddress}";\n`;
  }

  fs.writeFileSync(constantsPath, constantsContent);
  console.log("📝 Updated constants file with BillsManager address");

  console.log("\n🎉 Deployment Summary:");
  console.log("========================");
  console.log("BillsManager Address:", contractAddress);
  console.log("USDC Token Address:", USDC_ADDRESS);
  console.log("Network:", hre.network.name);
  console.log("========================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });