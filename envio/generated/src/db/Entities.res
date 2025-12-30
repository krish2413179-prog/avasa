open Table
open Enums.EntityType
type id = string

type internalEntity = Internal.entity
module type Entity = {
  type t
  let index: int
  let name: string
  let schema: S.t<t>
  let rowsSchema: S.t<array<t>>
  let table: Table.table
  let entityHistory: EntityHistory.t<t>
}
external entityModToInternal: module(Entity with type t = 'a) => Internal.entityConfig = "%identity"
external entityModsToInternal: array<module(Entity)> => array<Internal.entityConfig> = "%identity"
external entitiesToInternal: array<'a> => array<Internal.entity> = "%identity"

@get
external getEntityId: internalEntity => string = "id"

// Use InMemoryTable.Entity.getEntityIdUnsafe instead of duplicating the logic
let getEntityIdUnsafe = InMemoryTable.Entity.getEntityIdUnsafe

//shorthand for punning
let isPrimaryKey = true
let isNullable = true
let isArray = true
let isIndex = true

@genType
type whereOperations<'entity, 'fieldType> = {
  eq: 'fieldType => promise<array<'entity>>,
  gt: 'fieldType => promise<array<'entity>>,
  lt: 'fieldType => promise<array<'entity>>
}

module AIRecommendation = {
  let name = (AIRecommendation :> string)
  let index = 0
  @genType
  type t = {
    amount: option<bigint>,
    confidence: int,
    executed: bool,
    expectedReturn: option<bigint>,
    id: id,
    propertyId: option<string>,
    reasoning: string,
    recommendationType: string,
    riskLevel: string,
    timestamp: bigint,
    user: string,
  }

  let schema = S.object((s): t => {
    amount: s.field("amount", S.null(BigInt.schema)),
    confidence: s.field("confidence", S.int),
    executed: s.field("executed", S.bool),
    expectedReturn: s.field("expectedReturn", S.null(BigInt.schema)),
    id: s.field("id", S.string),
    propertyId: s.field("propertyId", S.null(S.string)),
    reasoning: s.field("reasoning", S.string),
    recommendationType: s.field("recommendationType", S.string),
    riskLevel: s.field("riskLevel", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    user: s.field("user", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "amount", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "confidence", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "executed", 
      Boolean,
      ~fieldSchema=S.bool,
      
      
      
      
      
      ),
      mkField(
      "expectedReturn", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "reasoning", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "recommendationType", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "riskLevel", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "user", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module DailyMetrics = {
  let name = (DailyMetrics :> string)
  let index = 1
  @genType
  type t = {
    activeStreams: int,
    date: string,
    id: id,
    newInvestors: int,
    totalLendingVolume: bigint,
    totalSwapVolume: bigint,
    totalTransactions: int,
    totalVolume: bigint,
    totalYieldClaimed: bigint,
    uniqueUsers: int,
  }

  let schema = S.object((s): t => {
    activeStreams: s.field("activeStreams", S.int),
    date: s.field("date", S.string),
    id: s.field("id", S.string),
    newInvestors: s.field("newInvestors", S.int),
    totalLendingVolume: s.field("totalLendingVolume", BigInt.schema),
    totalSwapVolume: s.field("totalSwapVolume", BigInt.schema),
    totalTransactions: s.field("totalTransactions", S.int),
    totalVolume: s.field("totalVolume", BigInt.schema),
    totalYieldClaimed: s.field("totalYieldClaimed", BigInt.schema),
    uniqueUsers: s.field("uniqueUsers", S.int),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "activeStreams", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "date", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "newInvestors", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "totalLendingVolume", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalSwapVolume", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalTransactions", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "totalVolume", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalYieldClaimed", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "uniqueUsers", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module LendingTransaction = {
  let name = (LendingTransaction :> string)
  let index = 2
  @genType
  type t = {
    action: string,
    amount: bigint,
    blockNumber: bigint,
    borrowRate: option<bigint>,
    id: id,
    interestRateMode: option<int>,
    onBehalfOf: option<string>,
    referralCode: option<int>,
    repayer: option<string>,
    reserve: string,
    timestamp: bigint,
    transactionHash: string,
    useATokens: option<bool>,
    user: string,
  }

  let schema = S.object((s): t => {
    action: s.field("action", S.string),
    amount: s.field("amount", BigInt.schema),
    blockNumber: s.field("blockNumber", BigInt.schema),
    borrowRate: s.field("borrowRate", S.null(BigInt.schema)),
    id: s.field("id", S.string),
    interestRateMode: s.field("interestRateMode", S.null(S.int)),
    onBehalfOf: s.field("onBehalfOf", S.null(S.string)),
    referralCode: s.field("referralCode", S.null(S.int)),
    repayer: s.field("repayer", S.null(S.string)),
    reserve: s.field("reserve", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    transactionHash: s.field("transactionHash", S.string),
    useATokens: s.field("useATokens", S.null(S.bool)),
    user: s.field("user", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "action", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "amount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "borrowRate", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "interestRateMode", 
      Integer,
      ~fieldSchema=S.null(S.int),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "onBehalfOf", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "referralCode", 
      Integer,
      ~fieldSchema=S.null(S.int),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "repayer", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "reserve", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "useATokens", 
      Boolean,
      ~fieldSchema=S.null(S.bool),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "user", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module LivePortfolio = {
  let name = (LivePortfolio :> string)
  let index = 3
  @genType
  type t = {
    diversificationScore: int,
    id: id,
    lastUpdated: bigint,
    portfolioYieldRate: bigint,
    riskScore: int,
    totalValue: bigint,
    totalYield: bigint,
    user: string,
  }

  let schema = S.object((s): t => {
    diversificationScore: s.field("diversificationScore", S.int),
    id: s.field("id", S.string),
    lastUpdated: s.field("lastUpdated", BigInt.schema),
    portfolioYieldRate: s.field("portfolioYieldRate", BigInt.schema),
    riskScore: s.field("riskScore", S.int),
    totalValue: s.field("totalValue", BigInt.schema),
    totalYield: s.field("totalYield", BigInt.schema),
    user: s.field("user", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "diversificationScore", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastUpdated", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "portfolioYieldRate", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "riskScore", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "totalValue", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalYield", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "user", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module MarketTrend = {
  let name = (MarketTrend :> string)
  let index = 4
  @genType
  type t = {
    confidence: int,
    id: id,
    priceDirection: string,
    propertyId: option<string>,
    timeframe: string,
    timestamp: bigint,
    trendType: string,
    volumeChange: bigint,
    yieldTrend: string,
  }

  let schema = S.object((s): t => {
    confidence: s.field("confidence", S.int),
    id: s.field("id", S.string),
    priceDirection: s.field("priceDirection", S.string),
    propertyId: s.field("propertyId", S.null(S.string)),
    timeframe: s.field("timeframe", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    trendType: s.field("trendType", S.string),
    volumeChange: s.field("volumeChange", BigInt.schema),
    yieldTrend: s.field("yieldTrend", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "confidence", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "priceDirection", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.null(S.string),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "timeframe", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "trendType", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "volumeChange", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "yieldTrend", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module PropertyAnalytics = {
  let name = (PropertyAnalytics :> string)
  let index = 5
  @genType
  type t = {
    averageYieldRate: bigint,
    id: id,
    lastActivity: bigint,
    propertyAddress: string,
    propertyName: string,
    totalInvestors: int,
    totalSharesSold: bigint,
    totalValueLocked: bigint,
    totalYieldDistributed: bigint,
  }

  let schema = S.object((s): t => {
    averageYieldRate: s.field("averageYieldRate", BigInt.schema),
    id: s.field("id", S.string),
    lastActivity: s.field("lastActivity", BigInt.schema),
    propertyAddress: s.field("propertyAddress", S.string),
    propertyName: s.field("propertyName", S.string),
    totalInvestors: s.field("totalInvestors", S.int),
    totalSharesSold: s.field("totalSharesSold", BigInt.schema),
    totalValueLocked: s.field("totalValueLocked", BigInt.schema),
    totalYieldDistributed: s.field("totalYieldDistributed", BigInt.schema),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "averageYieldRate", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastActivity", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "propertyAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyName", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "totalInvestors", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "totalSharesSold", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalValueLocked", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalYieldDistributed", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module PropertyPerformance = {
  let name = (PropertyPerformance :> string)
  let index = 6
  @genType
  type t = {
    currentPrice: bigint,
    id: id,
    lastUpdated: bigint,
    marketCap: bigint,
    priceChange24h: bigint,
    propertyId: string,
    propertyName: string,
    totalInvestors: int,
    volume24h: bigint,
    yieldRate: bigint,
  }

  let schema = S.object((s): t => {
    currentPrice: s.field("currentPrice", BigInt.schema),
    id: s.field("id", S.string),
    lastUpdated: s.field("lastUpdated", BigInt.schema),
    marketCap: s.field("marketCap", BigInt.schema),
    priceChange24h: s.field("priceChange24h", BigInt.schema),
    propertyId: s.field("propertyId", S.string),
    propertyName: s.field("propertyName", S.string),
    totalInvestors: s.field("totalInvestors", S.int),
    volume24h: s.field("volume24h", BigInt.schema),
    yieldRate: s.field("yieldRate", BigInt.schema),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "currentPrice", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastUpdated", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "marketCap", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "priceChange24h", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyName", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "totalInvestors", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "volume24h", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "yieldRate", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module PropertyTransaction = {
  let name = (PropertyTransaction :> string)
  let index = 7
  @genType
  type t = {
    action: string,
    amount: option<bigint>,
    blockNumber: bigint,
    cost: option<bigint>,
    id: id,
    investor: string,
    propertyAddress: string,
    propertyId: string,
    propertyName: string,
    shares: option<bigint>,
    timestamp: bigint,
    transactionHash: string,
  }

  let schema = S.object((s): t => {
    action: s.field("action", S.string),
    amount: s.field("amount", S.null(BigInt.schema)),
    blockNumber: s.field("blockNumber", BigInt.schema),
    cost: s.field("cost", S.null(BigInt.schema)),
    id: s.field("id", S.string),
    investor: s.field("investor", S.string),
    propertyAddress: s.field("propertyAddress", S.string),
    propertyId: s.field("propertyId", S.string),
    propertyName: s.field("propertyName", S.string),
    shares: s.field("shares", S.null(BigInt.schema)),
    timestamp: s.field("timestamp", BigInt.schema),
    transactionHash: s.field("transactionHash", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "action", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "amount", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "cost", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "investor", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyName", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "shares", 
      Numeric,
      ~fieldSchema=S.null(BigInt.schema),
      
      ~isNullable,
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module PropertyUpdate = {
  let name = (PropertyUpdate :> string)
  let index = 8
  @genType
  type t = {
    blockNumber: bigint,
    id: id,
    pricePerShare: bigint,
    propertyId: string,
    propertyName: string,
    timestamp: bigint,
    transactionHash: string,
  }

  let schema = S.object((s): t => {
    blockNumber: s.field("blockNumber", BigInt.schema),
    id: s.field("id", S.string),
    pricePerShare: s.field("pricePerShare", BigInt.schema),
    propertyId: s.field("propertyId", S.string),
    propertyName: s.field("propertyName", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    transactionHash: s.field("transactionHash", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "pricePerShare", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyName", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module StreamTransaction = {
  let name = (StreamTransaction :> string)
  let index = 9
  @genType
  type t = {
    blockNumber: bigint,
    flowRate: bigint,
    id: id,
    receiver: string,
    sender: string,
    timestamp: bigint,
    token: string,
    totalReceiverFlowRate: bigint,
    totalSenderFlowRate: bigint,
    transactionHash: string,
  }

  let schema = S.object((s): t => {
    blockNumber: s.field("blockNumber", BigInt.schema),
    flowRate: s.field("flowRate", BigInt.schema),
    id: s.field("id", S.string),
    receiver: s.field("receiver", S.string),
    sender: s.field("sender", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    token: s.field("token", S.string),
    totalReceiverFlowRate: s.field("totalReceiverFlowRate", BigInt.schema),
    totalSenderFlowRate: s.field("totalSenderFlowRate", BigInt.schema),
    transactionHash: s.field("transactionHash", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "flowRate", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "receiver", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "sender", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "token", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "totalReceiverFlowRate", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalSenderFlowRate", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module SwapTransaction = {
  let name = (SwapTransaction :> string)
  let index = 10
  @genType
  type t = {
    amount0: bigint,
    amount1: bigint,
    blockNumber: bigint,
    id: id,
    liquidity: bigint,
    recipient: string,
    sender: string,
    sqrtPriceX96: bigint,
    tick: int,
    timestamp: bigint,
    transactionHash: string,
  }

  let schema = S.object((s): t => {
    amount0: s.field("amount0", BigInt.schema),
    amount1: s.field("amount1", BigInt.schema),
    blockNumber: s.field("blockNumber", BigInt.schema),
    id: s.field("id", S.string),
    liquidity: s.field("liquidity", BigInt.schema),
    recipient: s.field("recipient", S.string),
    sender: s.field("sender", S.string),
    sqrtPriceX96: s.field("sqrtPriceX96", BigInt.schema),
    tick: s.field("tick", S.int),
    timestamp: s.field("timestamp", BigInt.schema),
    transactionHash: s.field("transactionHash", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "amount0", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "amount1", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "liquidity", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "recipient", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "sender", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "sqrtPriceX96", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "tick", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module TransferTransaction = {
  let name = (TransferTransaction :> string)
  let index = 11
  @genType
  type t = {
    blockNumber: bigint,
    from: string,
    id: id,
    propertyAddress: string,
    propertyId: string,
    propertyName: string,
    timestamp: bigint,
    to: string,
    transactionHash: string,
    value: bigint,
  }

  let schema = S.object((s): t => {
    blockNumber: s.field("blockNumber", BigInt.schema),
    from: s.field("from", S.string),
    id: s.field("id", S.string),
    propertyAddress: s.field("propertyAddress", S.string),
    propertyId: s.field("propertyId", S.string),
    propertyName: s.field("propertyName", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    to: s.field("to", S.string),
    transactionHash: s.field("transactionHash", S.string),
    value: s.field("value", BigInt.schema),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "from", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "propertyAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyName", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "to", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "value", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module UserAnalytics = {
  let name = (UserAnalytics :> string)
  let index = 12
  @genType
  type t = {
    id: id,
    lastActivity: bigint,
    totalBorrowed: bigint,
    totalInvested: bigint,
    totalLent: bigint,
    totalPropertiesOwned: int,
    totalStreamsReceived: bigint,
    totalStreamsSent: bigint,
    totalSwapVolume: bigint,
    totalYieldEarned: bigint,
  }

  let schema = S.object((s): t => {
    id: s.field("id", S.string),
    lastActivity: s.field("lastActivity", BigInt.schema),
    totalBorrowed: s.field("totalBorrowed", BigInt.schema),
    totalInvested: s.field("totalInvested", BigInt.schema),
    totalLent: s.field("totalLent", BigInt.schema),
    totalPropertiesOwned: s.field("totalPropertiesOwned", S.int),
    totalStreamsReceived: s.field("totalStreamsReceived", BigInt.schema),
    totalStreamsSent: s.field("totalStreamsSent", BigInt.schema),
    totalSwapVolume: s.field("totalSwapVolume", BigInt.schema),
    totalYieldEarned: s.field("totalYieldEarned", BigInt.schema),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastActivity", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalBorrowed", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalInvested", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalLent", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalPropertiesOwned", 
      Integer,
      ~fieldSchema=S.int,
      
      
      
      
      
      ),
      mkField(
      "totalStreamsReceived", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalStreamsSent", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalSwapVolume", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalYieldEarned", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module UserPortfolio = {
  let name = (UserPortfolio :> string)
  let index = 13
  @genType
  type t = {
    id: id,
    lastUpdated: bigint,
    propertyId: string,
    totalInvested: bigint,
    totalShares: bigint,
    totalYieldClaimed: bigint,
    user: string,
  }

  let schema = S.object((s): t => {
    id: s.field("id", S.string),
    lastUpdated: s.field("lastUpdated", BigInt.schema),
    propertyId: s.field("propertyId", S.string),
    totalInvested: s.field("totalInvested", BigInt.schema),
    totalShares: s.field("totalShares", BigInt.schema),
    totalYieldClaimed: s.field("totalYieldClaimed", BigInt.schema),
    user: s.field("user", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastUpdated", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "totalInvested", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalShares", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "totalYieldClaimed", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "user", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module UserPreferences = {
  let name = (UserPreferences :> string)
  let index = 14
  @genType
  type t = {
    autoReinvestYield: bool,
    id: id,
    lastUpdated: bigint,
    maxInvestmentPerProperty: bigint,
    notificationSettings: string,
    preferredPropertyTypesJson: string,
    preferredRiskLevel: string,
    user: string,
  }

  let schema = S.object((s): t => {
    autoReinvestYield: s.field("autoReinvestYield", S.bool),
    id: s.field("id", S.string),
    lastUpdated: s.field("lastUpdated", BigInt.schema),
    maxInvestmentPerProperty: s.field("maxInvestmentPerProperty", BigInt.schema),
    notificationSettings: s.field("notificationSettings", S.string),
    preferredPropertyTypesJson: s.field("preferredPropertyTypesJson", S.string),
    preferredRiskLevel: s.field("preferredRiskLevel", S.string),
    user: s.field("user", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "autoReinvestYield", 
      Boolean,
      ~fieldSchema=S.bool,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "lastUpdated", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "maxInvestmentPerProperty", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "notificationSettings", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "preferredPropertyTypesJson", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "preferredRiskLevel", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "user", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

module YieldTransaction = {
  let name = (YieldTransaction :> string)
  let index = 15
  @genType
  type t = {
    action: string,
    amount: bigint,
    blockNumber: bigint,
    id: id,
    investor: string,
    propertyAddress: string,
    propertyId: string,
    propertyName: string,
    timestamp: bigint,
    transactionHash: string,
  }

  let schema = S.object((s): t => {
    action: s.field("action", S.string),
    amount: s.field("amount", BigInt.schema),
    blockNumber: s.field("blockNumber", BigInt.schema),
    id: s.field("id", S.string),
    investor: s.field("investor", S.string),
    propertyAddress: s.field("propertyAddress", S.string),
    propertyId: s.field("propertyId", S.string),
    propertyName: s.field("propertyName", S.string),
    timestamp: s.field("timestamp", BigInt.schema),
    transactionHash: s.field("transactionHash", S.string),
  })

  let rowsSchema = S.array(schema)

  @genType
  type indexedFieldOperations = {
    
  }

  let table = mkTable(
    (name :> string),
    ~fields=[
      mkField(
      "action", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "amount", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "blockNumber", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "id", 
      Text,
      ~fieldSchema=S.string,
      ~isPrimaryKey,
      
      
      
      
      ),
      mkField(
      "investor", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyAddress", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyId", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "propertyName", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
      mkField(
      "timestamp", 
      Numeric,
      ~fieldSchema=BigInt.schema,
      
      
      
      
      
      ),
      mkField(
      "transactionHash", 
      Text,
      ~fieldSchema=S.string,
      
      
      
      
      
      ),
    ],
  )

  let entityHistory = table->EntityHistory.fromTable(~schema, ~entityIndex=index)

  external castToInternal: t => Internal.entity = "%identity"
}

let userEntities = [
  module(AIRecommendation),
  module(DailyMetrics),
  module(LendingTransaction),
  module(LivePortfolio),
  module(MarketTrend),
  module(PropertyAnalytics),
  module(PropertyPerformance),
  module(PropertyTransaction),
  module(PropertyUpdate),
  module(StreamTransaction),
  module(SwapTransaction),
  module(TransferTransaction),
  module(UserAnalytics),
  module(UserPortfolio),
  module(UserPreferences),
  module(YieldTransaction),
]->entityModsToInternal

let allEntities =
  userEntities->Js.Array2.concat(
    [module(InternalTable.DynamicContractRegistry)]->entityModsToInternal,
  )

let byName =
  allEntities
  ->Js.Array2.map(entityConfig => {
    (entityConfig.name, entityConfig)
  })
  ->Js.Dict.fromArray
