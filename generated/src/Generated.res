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
          Config.name: "TestToken",
          abi: Types.TestToken.abi,
          addresses: [
            "0x4200000000000000000000000000000000000006"->Address.Evm.fromStringOrThrow
,
          ],
          events: [
            (Types.TestToken.Transfer.register() :> Internal.eventConfig),
          ],
          startBlock: None,
        },
      ]
      let chain = ChainMap.Chain.makeUnsafe(~chainId=84532)
      {
        Config.maxReorgDepth: 200,
        startBlock: 25000000,
        id: 84532,
        contracts,
        sources: NetworkSources.evm(~chain, ~contracts=[{name: "TestToken",events: [Types.TestToken.Transfer.register()],abi: Types.TestToken.abi}], ~hyperSync=Some("https://84532.hypersync.xyz"), ~allEventSignatures=[Types.TestToken.eventSignatures]->Belt.Array.concatMany, ~shouldUseHypersyncClientDecoder=true, ~rpcs=[], ~lowercaseAddresses=false)
      }
    },
  ]

  Config.make(
    ~shouldRollbackOnReorg=false,
    ~shouldSaveFullHistory=false,
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
    ~contractName="TestToken",
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
