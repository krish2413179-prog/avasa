module ContractType = {
  @genType
  type t = 
    | @as("AustinTechHubOffice") AustinTechHubOffice
    | @as("BostonHistoricBrownstones") BostonHistoricBrownstones
    | @as("ChicagoDowntownLofts") ChicagoDowntownLofts
    | @as("DenverMountainResort") DenverMountainResort
    | @as("LosAngelesStudioComplex") LosAngelesStudioComplex
    | @as("ManhattanLuxuryApartments") ManhattanLuxuryApartments
    | @as("MiamiBeachCondos") MiamiBeachCondos
    | @as("NashvilleMusicDistrict") NashvilleMusicDistrict
    | @as("PhoenixRetailPlaza") PhoenixRetailPlaza
    | @as("SeattleWarehouseDistrict") SeattleWarehouseDistrict

  let name = "CONTRACT_TYPE"
  let variants = [
    AustinTechHubOffice,
    BostonHistoricBrownstones,
    ChicagoDowntownLofts,
    DenverMountainResort,
    LosAngelesStudioComplex,
    ManhattanLuxuryApartments,
    MiamiBeachCondos,
    NashvilleMusicDistrict,
    PhoenixRetailPlaza,
    SeattleWarehouseDistrict,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

module EntityType = {
  @genType
  type t = 
    | @as("AIRecommendation") AIRecommendation
    | @as("DailyMetrics") DailyMetrics
    | @as("LendingTransaction") LendingTransaction
    | @as("LivePortfolio") LivePortfolio
    | @as("MarketTrend") MarketTrend
    | @as("PropertyAnalytics") PropertyAnalytics
    | @as("PropertyPerformance") PropertyPerformance
    | @as("PropertyTransaction") PropertyTransaction
    | @as("PropertyUpdate") PropertyUpdate
    | @as("StreamTransaction") StreamTransaction
    | @as("SwapTransaction") SwapTransaction
    | @as("TransferTransaction") TransferTransaction
    | @as("UserAnalytics") UserAnalytics
    | @as("UserPortfolio") UserPortfolio
    | @as("UserPreferences") UserPreferences
    | @as("YieldTransaction") YieldTransaction
    | @as("dynamic_contract_registry") DynamicContractRegistry

  let name = "ENTITY_TYPE"
  let variants = [
    AIRecommendation,
    DailyMetrics,
    LendingTransaction,
    LivePortfolio,
    MarketTrend,
    PropertyAnalytics,
    PropertyPerformance,
    PropertyTransaction,
    PropertyUpdate,
    StreamTransaction,
    SwapTransaction,
    TransferTransaction,
    UserAnalytics,
    UserPortfolio,
    UserPreferences,
    YieldTransaction,
    DynamicContractRegistry,
  ]
  let config = Internal.makeEnumConfig(~name, ~variants)
}

let allEnums = ([
  ContractType.config->Internal.fromGenericEnumConfig,
  EntityType.config->Internal.fromGenericEnumConfig,
])
