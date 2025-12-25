/*
 * PropChain AI - Hyper-Speed Portfolio Tracking Event Handlers
 * Real-time indexing for all RWA properties + DeFi protocols
 */

// Import generated contract handlers
const {
  ManhattanLuxuryApartments,
  MiamiBeachCondos,
  AustinTechHubOffice,
  SeattleWarehouseDistrict,
  DenverMountainResort,
  ChicagoDowntownLofts,
  LosAngelesStudioComplex,
  PhoenixRetailPlaza,
  BostonHistoricBrownstones,
  NashvilleMusicDistrict,
  // UniswapV3Router,
  // SuperfluidHost,
  // AaveV3Pool,
} = require("../generated");

// ========================================
// RWA PROPERTY EVENT HANDLERS
// ========================================

// Manhattan Luxury Apartments (#1)
ManhattanLuxuryApartments.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  
  // Update user portfolio
  await updateUserPortfolio(context, event.params.investor, "1", event.params.shares, event.params.amount, "purchase");
});

ManhattanLuxuryApartments.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  
  // Update user yield stats
  await updateUserYieldStats(context, event.params.investor, "1", event.params.amount);
});

// Miami Beach Condos (#2)
MiamiBeachCondos.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "2", event.params.shares, event.params.amount, "purchase");
});

MiamiBeachCondos.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "2", event.params.amount);
});

// Austin Tech Hub Office (#3)
AustinTechHubOffice.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "3", event.params.shares, event.params.amount, "purchase");
});

AustinTechHubOffice.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "3", event.params.amount);
});

// Seattle Warehouse District (#4)
SeattleWarehouseDistrict.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "4", event.params.shares, event.params.amount, "purchase");
});

SeattleWarehouseDistrict.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "4", event.params.amount);
});

// Denver Mountain Resort (#5)
DenverMountainResort.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "5", event.params.shares, event.params.amount, "purchase");
});

DenverMountainResort.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "5", event.params.amount);
});

// Chicago Downtown Lofts (#6)
ChicagoDowntownLofts.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "6", event.params.shares, event.params.amount, "purchase");
});

ChicagoDowntownLofts.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "6", event.params.amount);
});

// Los Angeles Studio Complex (#7)
LosAngelesStudioComplex.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "7", event.params.shares, event.params.amount, "purchase");
});

LosAngelesStudioComplex.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "7", event.params.amount);
});

// Phoenix Retail Plaza (#8)
PhoenixRetailPlaza.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "8", event.params.shares, event.params.amount, "purchase");
});

PhoenixRetailPlaza.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "8", event.params.amount);
});

// Boston Historic Brownstones (#9)
BostonHistoricBrownstones.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "9", event.params.shares, event.params.amount, "purchase");
});

BostonHistoricBrownstones.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "9", event.params.amount);
});

// Nashville Music District (#10)
NashvilleMusicDistrict.SharesPurchased.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "purchase",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "10", event.params.shares, event.params.amount, "purchase");
});

NashvilleMusicDistrict.YieldDistributed.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    investor: event.params.investor,
    amount: event.params.amount,
    action: "yield_claim",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.YieldTransaction.set(entity);
  await updateUserYieldStats(context, event.params.investor, "10", event.params.amount);
});

// ========================================
// DEFI PROTOCOL EVENT HANDLERS - TEMPORARILY DISABLED
// ========================================

// Uniswap V3 Swap Tracking
// UniswapV3Router.Swap.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     sender: event.params.sender,
//     recipient: event.params.recipient,
//     amount0: event.params.amount0,
//     amount1: event.params.amount1,
//     sqrtPriceX96: event.params.sqrtPriceX96,
//     liquidity: event.params.liquidity,
//     tick: event.params.tick,
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.SwapTransaction.set(entity);
// });

// Superfluid Stream Tracking
// SuperfluidHost.FlowUpdated.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     token: event.params.token,
//     sender: event.params.sender,
//     receiver: event.params.receiver,
//     flowRate: event.params.flowRate,
//     totalSenderFlowRate: event.params.totalSenderFlowRate,
//     totalReceiverFlowRate: event.params.totalReceiverFlowRate,
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.StreamTransaction.set(entity);
// });

// Aave V3 Supply Tracking
// AaveV3Pool.Supply.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     reserve: event.params.reserve,
//     user: event.params.user,
//     onBehalfOf: event.params.onBehalfOf,
//     repayer: "",
//     amount: event.params.amount,
//     interestRateMode: 0,
//     borrowRate: BigInt(0),
//     referralCode: event.params.referralCode,
//     useATokens: false,
//     action: "supply",
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.LendingTransaction.set(entity);
// });

// Aave V3 Borrow Tracking
// AaveV3Pool.Borrow.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     reserve: event.params.reserve,
//     user: event.params.user,
//     onBehalfOf: event.params.onBehalfOf,
//     repayer: "",
//     amount: event.params.amount,
//     interestRateMode: event.params.interestRateMode,
//     borrowRate: event.params.borrowRate,
//     referralCode: event.params.referralCode,
//     useATokens: false,
//     action: "borrow",
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.LendingTransaction.set(entity);
// });

// Aave V3 Repay Tracking
// AaveV3Pool.Repay.handler(async ({ event, context }) => {
//   const entity = {
//     id: `${event.transactionHash}_${event.logIndex}`,
//     reserve: event.params.reserve,
//     user: event.params.user,
//     onBehalfOf: "",
//     repayer: event.params.repayer,
//     amount: event.params.amount,
//     interestRateMode: 0,
//     borrowRate: BigInt(0),
//     referralCode: 0,
//     useATokens: event.params.useATokens,
//     action: "repay",
//     timestamp: event.block.timestamp,
//     blockNumber: event.block.number,
//     transactionHash: event.transactionHash,
//   };

//   context.LendingTransaction.set(entity);
// });

// ========================================
// TRANSFER EVENT HANDLERS FOR ALL PROPERTIES
// ========================================

// Manhattan Luxury Apartments Transfer
ManhattanLuxuryApartments.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Miami Beach Condos Transfer
MiamiBeachCondos.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Austin Tech Hub Office Transfer
AustinTechHubOffice.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Seattle Warehouse District Transfer
SeattleWarehouseDistrict.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Denver Mountain Resort Transfer
DenverMountainResort.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Chicago Downtown Lofts Transfer
ChicagoDowntownLofts.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Los Angeles Studio Complex Transfer
LosAngelesStudioComplex.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Phoenix Retail Plaza Transfer
PhoenixRetailPlaza.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Boston Historic Brownstones Transfer
BostonHistoricBrownstones.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// Nashville Music District Transfer
NashvilleMusicDistrict.Transfer.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.TransferTransaction.set(entity);
});

// ========================================
// SHARES WITHDRAWN EVENT HANDLERS
// ========================================

// Manhattan Luxury Apartments SharesWithdrawn
ManhattanLuxuryApartments.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "1",
    propertyName: "Manhattan Luxury Apartments",
    propertyAddress: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "1", event.params.shares, event.params.amount, "withdraw");
});

// Miami Beach Condos SharesWithdrawn
MiamiBeachCondos.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "2",
    propertyName: "Miami Beach Condos",
    propertyAddress: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "2", event.params.shares, event.params.amount, "withdraw");
});

// Austin Tech Hub Office SharesWithdrawn
AustinTechHubOffice.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "3",
    propertyName: "Austin Tech Hub Office",
    propertyAddress: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "3", event.params.shares, event.params.amount, "withdraw");
});

// Seattle Warehouse District SharesWithdrawn
SeattleWarehouseDistrict.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "4",
    propertyName: "Seattle Warehouse District",
    propertyAddress: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "4", event.params.shares, event.params.amount, "withdraw");
});

// Denver Mountain Resort SharesWithdrawn
DenverMountainResort.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "5",
    propertyName: "Denver Mountain Resort",
    propertyAddress: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "5", event.params.shares, event.params.amount, "withdraw");
});

// Chicago Downtown Lofts SharesWithdrawn
ChicagoDowntownLofts.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "6",
    propertyName: "Chicago Downtown Lofts",
    propertyAddress: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "6", event.params.shares, event.params.amount, "withdraw");
});

// Los Angeles Studio Complex SharesWithdrawn
LosAngelesStudioComplex.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "7",
    propertyName: "Los Angeles Studio Complex",
    propertyAddress: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "7", event.params.shares, event.params.amount, "withdraw");
});

// Phoenix Retail Plaza SharesWithdrawn
PhoenixRetailPlaza.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "8",
    propertyName: "Phoenix Retail Plaza",
    propertyAddress: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "8", event.params.shares, event.params.amount, "withdraw");
});

// Boston Historic Brownstones SharesWithdrawn
BostonHistoricBrownstones.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "9",
    propertyName: "Boston Historic Brownstones",
    propertyAddress: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "9", event.params.shares, event.params.amount, "withdraw");
});

// Nashville Music District SharesWithdrawn
NashvilleMusicDistrict.SharesWithdrawn.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: "10",
    propertyName: "Nashville Music District",
    propertyAddress: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
    investor: event.params.investor,
    shares: event.params.shares,
    cost: event.params.amount,
    amount: event.params.amount,
    action: "withdraw",
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyTransaction.set(entity);
  await updateUserPortfolio(context, event.params.investor, "10", event.params.shares, event.params.amount, "withdraw");
});

// ========================================
// PROPERTY UPDATED EVENT HANDLERS
// ========================================

// Manhattan Luxury Apartments PropertyUpdated
ManhattanLuxuryApartments.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Miami Beach Condos PropertyUpdated
MiamiBeachCondos.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Austin Tech Hub Office PropertyUpdated
AustinTechHubOffice.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Seattle Warehouse District PropertyUpdated
SeattleWarehouseDistrict.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Denver Mountain Resort PropertyUpdated
DenverMountainResort.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Chicago Downtown Lofts PropertyUpdated
ChicagoDowntownLofts.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Los Angeles Studio Complex PropertyUpdated
LosAngelesStudioComplex.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Phoenix Retail Plaza PropertyUpdated
PhoenixRetailPlaza.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Boston Historic Brownstones PropertyUpdated
BostonHistoricBrownstones.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// Nashville Music District PropertyUpdated
NashvilleMusicDistrict.PropertyUpdated.handler(async ({ event, context }) => {
  const entity = {
    id: `${event.transactionHash}_${event.logIndex}`,
    propertyId: event.params.propertyId.toString(),
    propertyName: event.params.name,
    pricePerShare: event.params.pricePerShare,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transactionHash,
  };

  context.PropertyUpdate.set(entity);
});

// ========================================
// HELPER FUNCTIONS
// ========================================

async function updateUserPortfolio(context, investor, propertyId, shares, cost, action) {
  const portfolioId = `${investor}_${propertyId}`;
  
  // Get existing portfolio or create new one
  let portfolio = await context.UserPortfolio.get(portfolioId);
  
  if (!portfolio) {
    portfolio = {
      id: portfolioId,
      user: investor,
      propertyId: propertyId,
      totalShares: BigInt(0),
      totalInvested: BigInt(0),
      totalYieldClaimed: BigInt(0),
      lastUpdated: BigInt(Date.now()),
    };
  }
  
  if (action === "purchase") {
    portfolio.totalShares += shares;
    portfolio.totalInvested += cost;
  } else if (action === "withdraw") {
    portfolio.totalShares -= shares;
  }
  
  portfolio.lastUpdated = BigInt(Date.now());
  context.UserPortfolio.set(portfolio);
}

async function updateUserYieldStats(context, investor, propertyId, amount) {
  const portfolioId = `${investor}_${propertyId}`;
  
  let portfolio = await context.UserPortfolio.get(portfolioId);
  
  if (portfolio) {
    portfolio.totalYieldClaimed += amount;
    portfolio.lastUpdated = BigInt(Date.now());
    context.UserPortfolio.set(portfolio);
  }
}