@val external require: string => unit = "require"

let registerContractHandlers = (
  ~contractName,
  ~handlerPathRelativeToRoot,
  ~handlerPathRelativeToConfig,
) => {
  try {
    require(`../${Path.relativePathToRootFromGenerated}/${handlerPathRelativeToRoot}`)
  } catch {
  | exn =>
    let params = {
      "Contract Name": contractName,
      "Expected Handler Path": handlerPathRelativeToConfig,
      "Code": "EE500",
    }
    let logger = Logging.createChild(~params)

    let errHandler = exn->ErrorHandling.make(~msg="Failed to import handler file", ~logger)
    errHandler->ErrorHandling.log
    errHandler->ErrorHandling.raiseExn
  }
}

let makeGeneratedConfig = () => {
  let chains = [
    {
      let contracts = [
        {
          Config.name: "ManhattanLuxuryApartments",
          abi: Types.ManhattanLuxuryApartments.abi,
          addresses: [
            "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.ManhattanLuxuryApartments.SharesPurchased.register() :> Internal.eventConfig),
            (Types.ManhattanLuxuryApartments.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.ManhattanLuxuryApartments.YieldDistributed.register() :> Internal.eventConfig),
            (Types.ManhattanLuxuryApartments.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.ManhattanLuxuryApartments.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "MiamiBeachCondos",
          abi: Types.MiamiBeachCondos.abi,
          addresses: [
            "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.MiamiBeachCondos.SharesPurchased.register() :> Internal.eventConfig),
            (Types.MiamiBeachCondos.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.MiamiBeachCondos.YieldDistributed.register() :> Internal.eventConfig),
            (Types.MiamiBeachCondos.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.MiamiBeachCondos.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "AustinTechHubOffice",
          abi: Types.AustinTechHubOffice.abi,
          addresses: [
            "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.AustinTechHubOffice.SharesPurchased.register() :> Internal.eventConfig),
            (Types.AustinTechHubOffice.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.AustinTechHubOffice.YieldDistributed.register() :> Internal.eventConfig),
            (Types.AustinTechHubOffice.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.AustinTechHubOffice.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "SeattleWarehouseDistrict",
          abi: Types.SeattleWarehouseDistrict.abi,
          addresses: [
            "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.SeattleWarehouseDistrict.SharesPurchased.register() :> Internal.eventConfig),
            (Types.SeattleWarehouseDistrict.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.SeattleWarehouseDistrict.YieldDistributed.register() :> Internal.eventConfig),
            (Types.SeattleWarehouseDistrict.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.SeattleWarehouseDistrict.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "DenverMountainResort",
          abi: Types.DenverMountainResort.abi,
          addresses: [
            "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.DenverMountainResort.SharesPurchased.register() :> Internal.eventConfig),
            (Types.DenverMountainResort.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.DenverMountainResort.YieldDistributed.register() :> Internal.eventConfig),
            (Types.DenverMountainResort.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.DenverMountainResort.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "ChicagoDowntownLofts",
          abi: Types.ChicagoDowntownLofts.abi,
          addresses: [
            "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.ChicagoDowntownLofts.SharesPurchased.register() :> Internal.eventConfig),
            (Types.ChicagoDowntownLofts.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.ChicagoDowntownLofts.YieldDistributed.register() :> Internal.eventConfig),
            (Types.ChicagoDowntownLofts.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.ChicagoDowntownLofts.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "LosAngelesStudioComplex",
          abi: Types.LosAngelesStudioComplex.abi,
          addresses: [
            "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.LosAngelesStudioComplex.SharesPurchased.register() :> Internal.eventConfig),
            (Types.LosAngelesStudioComplex.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.LosAngelesStudioComplex.YieldDistributed.register() :> Internal.eventConfig),
            (Types.LosAngelesStudioComplex.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.LosAngelesStudioComplex.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "PhoenixRetailPlaza",
          abi: Types.PhoenixRetailPlaza.abi,
          addresses: [
            "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.PhoenixRetailPlaza.SharesPurchased.register() :> Internal.eventConfig),
            (Types.PhoenixRetailPlaza.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.PhoenixRetailPlaza.YieldDistributed.register() :> Internal.eventConfig),
            (Types.PhoenixRetailPlaza.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.PhoenixRetailPlaza.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "BostonHistoricBrownstones",
          abi: Types.BostonHistoricBrownstones.abi,
          addresses: [
            "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.BostonHistoricBrownstones.SharesPurchased.register() :> Internal.eventConfig),
            (Types.BostonHistoricBrownstones.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.BostonHistoricBrownstones.YieldDistributed.register() :> Internal.eventConfig),
            (Types.BostonHistoricBrownstones.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.BostonHistoricBrownstones.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
        {
          Config.name: "NashvilleMusicDistrict",
          abi: Types.NashvilleMusicDistrict.abi,
          addresses: [
            "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.NashvilleMusicDistrict.SharesPurchased.register() :> Internal.eventConfig),
            (Types.NashvilleMusicDistrict.SharesWithdrawn.register() :> Internal.eventConfig),
            (Types.NashvilleMusicDistrict.YieldDistributed.register() :> Internal.eventConfig),
            (Types.NashvilleMusicDistrict.PropertyUpdated.register() :> Internal.eventConfig),
            (Types.NashvilleMusicDistrict.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
      ]
      let chain = ChainMap.Chain.makeUnsafe(~chainId=84532)
      {
        Config.maxReorgDepth: 200,
        startBlock: 0,
        id: 84532,
        contracts,
        sources: NetworkSources.evm(~chain, ~contracts=[{name: "ManhattanLuxuryApartments",events: [Types.ManhattanLuxuryApartments.SharesPurchased.register(), Types.ManhattanLuxuryApartments.SharesWithdrawn.register(), Types.ManhattanLuxuryApartments.YieldDistributed.register(), Types.ManhattanLuxuryApartments.PropertyUpdated.register(), Types.ManhattanLuxuryApartments.Transfer.register()],abi: Types.ManhattanLuxuryApartments.abi}, {name: "MiamiBeachCondos",events: [Types.MiamiBeachCondos.SharesPurchased.register(), Types.MiamiBeachCondos.SharesWithdrawn.register(), Types.MiamiBeachCondos.YieldDistributed.register(), Types.MiamiBeachCondos.PropertyUpdated.register(), Types.MiamiBeachCondos.Transfer.register()],abi: Types.MiamiBeachCondos.abi}, {name: "AustinTechHubOffice",events: [Types.AustinTechHubOffice.SharesPurchased.register(), Types.AustinTechHubOffice.SharesWithdrawn.register(), Types.AustinTechHubOffice.YieldDistributed.register(), Types.AustinTechHubOffice.PropertyUpdated.register(), Types.AustinTechHubOffice.Transfer.register()],abi: Types.AustinTechHubOffice.abi}, {name: "SeattleWarehouseDistrict",events: [Types.SeattleWarehouseDistrict.SharesPurchased.register(), Types.SeattleWarehouseDistrict.SharesWithdrawn.register(), Types.SeattleWarehouseDistrict.YieldDistributed.register(), Types.SeattleWarehouseDistrict.PropertyUpdated.register(), Types.SeattleWarehouseDistrict.Transfer.register()],abi: Types.SeattleWarehouseDistrict.abi}, {name: "DenverMountainResort",events: [Types.DenverMountainResort.SharesPurchased.register(), Types.DenverMountainResort.SharesWithdrawn.register(), Types.DenverMountainResort.YieldDistributed.register(), Types.DenverMountainResort.PropertyUpdated.register(), Types.DenverMountainResort.Transfer.register()],abi: Types.DenverMountainResort.abi}, {name: "ChicagoDowntownLofts",events: [Types.ChicagoDowntownLofts.SharesPurchased.register(), Types.ChicagoDowntownLofts.SharesWithdrawn.register(), Types.ChicagoDowntownLofts.YieldDistributed.register(), Types.ChicagoDowntownLofts.PropertyUpdated.register(), Types.ChicagoDowntownLofts.Transfer.register()],abi: Types.ChicagoDowntownLofts.abi}, {name: "LosAngelesStudioComplex",events: [Types.LosAngelesStudioComplex.SharesPurchased.register(), Types.LosAngelesStudioComplex.SharesWithdrawn.register(), Types.LosAngelesStudioComplex.YieldDistributed.register(), Types.LosAngelesStudioComplex.PropertyUpdated.register(), Types.LosAngelesStudioComplex.Transfer.register()],abi: Types.LosAngelesStudioComplex.abi}, {name: "PhoenixRetailPlaza",events: [Types.PhoenixRetailPlaza.SharesPurchased.register(), Types.PhoenixRetailPlaza.SharesWithdrawn.register(), Types.PhoenixRetailPlaza.YieldDistributed.register(), Types.PhoenixRetailPlaza.PropertyUpdated.register(), Types.PhoenixRetailPlaza.Transfer.register()],abi: Types.PhoenixRetailPlaza.abi}, {name: "BostonHistoricBrownstones",events: [Types.BostonHistoricBrownstones.SharesPurchased.register(), Types.BostonHistoricBrownstones.SharesWithdrawn.register(), Types.BostonHistoricBrownstones.YieldDistributed.register(), Types.BostonHistoricBrownstones.PropertyUpdated.register(), Types.BostonHistoricBrownstones.Transfer.register()],abi: Types.BostonHistoricBrownstones.abi}, {name: "NashvilleMusicDistrict",events: [Types.NashvilleMusicDistrict.SharesPurchased.register(), Types.NashvilleMusicDistrict.SharesWithdrawn.register(), Types.NashvilleMusicDistrict.YieldDistributed.register(), Types.NashvilleMusicDistrict.PropertyUpdated.register(), Types.NashvilleMusicDistrict.Transfer.register()],abi: Types.NashvilleMusicDistrict.abi}], ~hyperSync=Some("https://84532.hypersync.xyz"), ~allEventSignatures=[Types.ManhattanLuxuryApartments.eventSignatures, Types.MiamiBeachCondos.eventSignatures, Types.AustinTechHubOffice.eventSignatures, Types.SeattleWarehouseDistrict.eventSignatures, Types.DenverMountainResort.eventSignatures, Types.ChicagoDowntownLofts.eventSignatures, Types.LosAngelesStudioComplex.eventSignatures, Types.PhoenixRetailPlaza.eventSignatures, Types.BostonHistoricBrownstones.eventSignatures, Types.NashvilleMusicDistrict.eventSignatures]->Belt.Array.concatMany, ~shouldUseHypersyncClientDecoder=true, ~rpcs=[], ~lowercaseAddresses=false)
      }
    },
  ]

  Config.make(
    ~shouldRollbackOnReorg=true,
    ~shouldSaveFullHistory=true,
    ~multichain=if (
      Env.Configurable.isUnorderedMultichainMode->Belt.Option.getWithDefault(
        Env.Configurable.unstable__temp_unordered_head_mode->Belt.Option.getWithDefault(
          false,
        ),
      )
    ) {
      Unordered
    } else {
      Ordered
    },
    ~chains,
    ~enableRawEvents=false,
    ~batchSize=?Env.batchSize,
    ~preloadHandlers=false,
    ~lowercaseAddresses=false,
    ~shouldUseHypersyncClientDecoder=true,
  )
}

let configWithoutRegistrations = makeGeneratedConfig()

let registerAllHandlers = () => {
  EventRegister.startRegistration(
    ~ecosystem=configWithoutRegistrations.ecosystem,
    ~multichain=configWithoutRegistrations.multichain,
    ~preloadHandlers=configWithoutRegistrations.preloadHandlers,
  )

  registerContractHandlers(
    ~contractName="AustinTechHubOffice",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="BostonHistoricBrownstones",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="ChicagoDowntownLofts",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="DenverMountainResort",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="LosAngelesStudioComplex",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="ManhattanLuxuryApartments",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="MiamiBeachCondos",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="NashvilleMusicDistrict",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="PhoenixRetailPlaza",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )
  registerContractHandlers(
    ~contractName="SeattleWarehouseDistrict",
    ~handlerPathRelativeToRoot="src/EventHandlers.js",
    ~handlerPathRelativeToConfig="src/EventHandlers.js",
  )

  EventRegister.finishRegistration()
}

let initialSql = Db.makeClient()
let storagePgSchema = Env.Db.publicSchema
let makeStorage = (~sql, ~pgSchema=storagePgSchema, ~isHasuraEnabled=Env.Hasura.enabled) => {
  PgStorage.make(
    ~sql,
    ~pgSchema,
    ~pgHost=Env.Db.host,
    ~pgUser=Env.Db.user,
    ~pgPort=Env.Db.port,
    ~pgDatabase=Env.Db.database,
    ~pgPassword=Env.Db.password,
    ~onInitialize=?{
      if isHasuraEnabled {
        Some(
          () => {
            Hasura.trackDatabase(
              ~endpoint=Env.Hasura.graphqlEndpoint,
              ~auth={
                role: Env.Hasura.role,
                secret: Env.Hasura.secret,
              },
              ~pgSchema=storagePgSchema,
              ~userEntities=Entities.userEntities,
              ~responseLimit=Env.Hasura.responseLimit,
              ~schema=Db.schema,
              ~aggregateEntities=Env.Hasura.aggregateEntities,
            )->Promise.catch(err => {
              Logging.errorWithExn(
                err->Utils.prettifyExn,
                `EE803: Error tracking tables`,
              )->Promise.resolve
            })
          },
        )
      } else {
        None
      }
    },
    ~onNewTables=?{
      if isHasuraEnabled {
        Some(
          (~tableNames) => {
            Hasura.trackTables(
              ~endpoint=Env.Hasura.graphqlEndpoint,
              ~auth={
                role: Env.Hasura.role,
                secret: Env.Hasura.secret,
              },
              ~pgSchema=storagePgSchema,
              ~tableNames,
            )->Promise.catch(err => {
              Logging.errorWithExn(
                err->Utils.prettifyExn,
                `EE804: Error tracking new tables`,
              )->Promise.resolve
            })
          },
        )
      } else {
        None
      }
    },
    ~isHasuraEnabled,
  )
}

let codegenPersistence = Persistence.make(
  ~userEntities=Entities.userEntities,
  ~allEnums=Enums.allEnums,
  ~storage=makeStorage(~sql=initialSql),
  ~sql=initialSql,
)

%%private(let indexer: ref<option<Indexer.t>> = ref(None))
let getIndexer = () => {
  switch indexer.contents {
  | Some(indexer) => indexer
  | None =>
    let i = {
      Indexer.registrations: registerAllHandlers(),
      // Need to recreate initial config one more time,
      // since configWithoutRegistrations called register for event
      // before they were ready
      config: makeGeneratedConfig(),
      persistence: codegenPersistence,
    }
    indexer := Some(i)
    i
  }
}
