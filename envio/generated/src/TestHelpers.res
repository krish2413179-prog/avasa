/***** TAKE NOTE ******
This is a hack to get genType to work!

In order for genType to produce recursive types, it needs to be at the 
root module of a file. If it's defined in a nested module it does not 
work. So all the MockDb types and internal functions are defined in TestHelpers_MockDb
and only public functions are recreated and exported from this module.

the following module:
```rescript
module MyModule = {
  @genType
  type rec a = {fieldB: b}
  @genType and b = {fieldA: a}
}
```

produces the following in ts:
```ts
// tslint:disable-next-line:interface-over-type-literal
export type MyModule_a = { readonly fieldB: b };

// tslint:disable-next-line:interface-over-type-literal
export type MyModule_b = { readonly fieldA: MyModule_a };
```

fieldB references type b which doesn't exist because it's defined
as MyModule_b
*/

module MockDb = {
  @genType
  let createMockDb = TestHelpers_MockDb.createMockDb
}

@genType
module Addresses = {
  include TestHelpers_MockAddresses
}

module EventFunctions = {
  //Note these are made into a record to make operate in the same way
  //for Res, JS and TS.

  /**
  The arguements that get passed to a "processEvent" helper function
  */
  @genType
  type eventProcessorArgs<'event> = {
    event: 'event,
    mockDb: TestHelpers_MockDb.t,
    @deprecated("Set the chainId for the event instead")
    chainId?: int,
  }

  @genType
  type eventProcessor<'event> = eventProcessorArgs<'event> => promise<TestHelpers_MockDb.t>

  /**
  A function composer to help create individual processEvent functions
  */
  let makeEventProcessor = (~register) => args => {
    let {event, mockDb, ?chainId} =
      args->(Utils.magic: eventProcessorArgs<'event> => eventProcessorArgs<Internal.event>)

    // Have the line here, just in case the function is called with
    // a manually created event. We don't want to break the existing tests here.
    let _ =
      TestHelpers_MockDb.mockEventRegisters->Utils.WeakMap.set(event, register)
    TestHelpers_MockDb.makeProcessEvents(mockDb, ~chainId=?chainId)([event->(Utils.magic: Internal.event => Types.eventLog<unknown>)])
  }

  module MockBlock = {
    @genType
    type t = {
      hash?: string,
      number?: int,
      timestamp?: int,
    }

    let toBlock = (_mock: t) => {
      hash: _mock.hash->Belt.Option.getWithDefault("foo"),
      number: _mock.number->Belt.Option.getWithDefault(0),
      timestamp: _mock.timestamp->Belt.Option.getWithDefault(0),
    }->(Utils.magic: Types.AggregatedBlock.t => Internal.eventBlock)
  }

  module MockTransaction = {
    @genType
    type t = {
      from?: option<Address.t>,
      gasPrice?: option<bigint>,
      gasUsed?: bigint,
      hash?: string,
      to?: option<Address.t>,
      value?: bigint,
    }

    let toTransaction = (_mock: t) => {
      from: _mock.from->Belt.Option.getWithDefault(None),
      gasPrice: _mock.gasPrice->Belt.Option.getWithDefault(None),
      gasUsed: _mock.gasUsed->Belt.Option.getWithDefault(0n),
      hash: _mock.hash->Belt.Option.getWithDefault("foo"),
      to: _mock.to->Belt.Option.getWithDefault(None),
      value: _mock.value->Belt.Option.getWithDefault(0n),
    }->(Utils.magic: Types.AggregatedTransaction.t => Internal.eventTransaction)
  }

  @genType
  type mockEventData = {
    chainId?: int,
    srcAddress?: Address.t,
    logIndex?: int,
    block?: MockBlock.t,
    transaction?: MockTransaction.t,
  }

  /**
  Applies optional paramters with defaults for all common eventLog field
  */
  let makeEventMocker = (
    ~params: Internal.eventParams,
    ~mockEventData: option<mockEventData>,
    ~register: unit => Internal.eventConfig,
  ): Internal.event => {
    let {?block, ?transaction, ?srcAddress, ?chainId, ?logIndex} =
      mockEventData->Belt.Option.getWithDefault({})
    let block = block->Belt.Option.getWithDefault({})->MockBlock.toBlock
    let transaction = transaction->Belt.Option.getWithDefault({})->MockTransaction.toTransaction
    let event: Internal.event = {
      params,
      transaction,
      chainId: switch chainId {
      | Some(chainId) => chainId
      | None =>
        switch Generated.configWithoutRegistrations.defaultChain {
        | Some(chainConfig) => chainConfig.id
        | None =>
          Js.Exn.raiseError(
            "No default chain Id found, please add at least 1 chain to your config.yaml",
          )
        }
      },
      block,
      srcAddress: srcAddress->Belt.Option.getWithDefault(Addresses.defaultAddress),
      logIndex: logIndex->Belt.Option.getWithDefault(0),
    }
    // Since currently it's not possible to figure out the event config from the event
    // we store a reference to the register function by event in a weak map
    let _ = TestHelpers_MockDb.mockEventRegisters->Utils.WeakMap.set(event, register)
    event
  }
}


module AustinTechHubOffice = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.AustinTechHubOffice.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.AustinTechHubOffice.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.AustinTechHubOffice.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.AustinTechHubOffice.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.AustinTechHubOffice.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.AustinTechHubOffice.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.AustinTechHubOffice.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.AustinTechHubOffice.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.AustinTechHubOffice.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.AustinTechHubOffice.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.AustinTechHubOffice.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.AustinTechHubOffice.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.AustinTechHubOffice.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.AustinTechHubOffice.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.AustinTechHubOffice.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.AustinTechHubOffice.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.AustinTechHubOffice.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.AustinTechHubOffice.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.AustinTechHubOffice.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.AustinTechHubOffice.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.AustinTechHubOffice.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.AustinTechHubOffice.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.AustinTechHubOffice.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.AustinTechHubOffice.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.AustinTechHubOffice.Transfer.event)
    }
  }

}


module BostonHistoricBrownstones = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.BostonHistoricBrownstones.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.BostonHistoricBrownstones.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.BostonHistoricBrownstones.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.BostonHistoricBrownstones.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.BostonHistoricBrownstones.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.BostonHistoricBrownstones.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.BostonHistoricBrownstones.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.BostonHistoricBrownstones.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.BostonHistoricBrownstones.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.BostonHistoricBrownstones.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.BostonHistoricBrownstones.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.BostonHistoricBrownstones.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.BostonHistoricBrownstones.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.BostonHistoricBrownstones.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.BostonHistoricBrownstones.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.BostonHistoricBrownstones.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.BostonHistoricBrownstones.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.BostonHistoricBrownstones.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.BostonHistoricBrownstones.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.BostonHistoricBrownstones.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.BostonHistoricBrownstones.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.BostonHistoricBrownstones.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.BostonHistoricBrownstones.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.BostonHistoricBrownstones.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.BostonHistoricBrownstones.Transfer.event)
    }
  }

}


module ChicagoDowntownLofts = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ChicagoDowntownLofts.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ChicagoDowntownLofts.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ChicagoDowntownLofts.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ChicagoDowntownLofts.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ChicagoDowntownLofts.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ChicagoDowntownLofts.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ChicagoDowntownLofts.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ChicagoDowntownLofts.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ChicagoDowntownLofts.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ChicagoDowntownLofts.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ChicagoDowntownLofts.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ChicagoDowntownLofts.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ChicagoDowntownLofts.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ChicagoDowntownLofts.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ChicagoDowntownLofts.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ChicagoDowntownLofts.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ChicagoDowntownLofts.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ChicagoDowntownLofts.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ChicagoDowntownLofts.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ChicagoDowntownLofts.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ChicagoDowntownLofts.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ChicagoDowntownLofts.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ChicagoDowntownLofts.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ChicagoDowntownLofts.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ChicagoDowntownLofts.Transfer.event)
    }
  }

}


module DenverMountainResort = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.DenverMountainResort.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.DenverMountainResort.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.DenverMountainResort.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.DenverMountainResort.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.DenverMountainResort.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.DenverMountainResort.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.DenverMountainResort.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.DenverMountainResort.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.DenverMountainResort.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.DenverMountainResort.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.DenverMountainResort.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.DenverMountainResort.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.DenverMountainResort.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.DenverMountainResort.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.DenverMountainResort.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.DenverMountainResort.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.DenverMountainResort.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.DenverMountainResort.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.DenverMountainResort.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.DenverMountainResort.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.DenverMountainResort.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.DenverMountainResort.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.DenverMountainResort.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.DenverMountainResort.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.DenverMountainResort.Transfer.event)
    }
  }

}


module LosAngelesStudioComplex = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.LosAngelesStudioComplex.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.LosAngelesStudioComplex.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.LosAngelesStudioComplex.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.LosAngelesStudioComplex.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.LosAngelesStudioComplex.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.LosAngelesStudioComplex.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.LosAngelesStudioComplex.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.LosAngelesStudioComplex.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.LosAngelesStudioComplex.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.LosAngelesStudioComplex.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.LosAngelesStudioComplex.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.LosAngelesStudioComplex.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.LosAngelesStudioComplex.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.LosAngelesStudioComplex.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.LosAngelesStudioComplex.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.LosAngelesStudioComplex.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.LosAngelesStudioComplex.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.LosAngelesStudioComplex.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.LosAngelesStudioComplex.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.LosAngelesStudioComplex.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.LosAngelesStudioComplex.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.LosAngelesStudioComplex.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.LosAngelesStudioComplex.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.LosAngelesStudioComplex.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.LosAngelesStudioComplex.Transfer.event)
    }
  }

}


module ManhattanLuxuryApartments = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ManhattanLuxuryApartments.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ManhattanLuxuryApartments.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ManhattanLuxuryApartments.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ManhattanLuxuryApartments.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ManhattanLuxuryApartments.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ManhattanLuxuryApartments.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ManhattanLuxuryApartments.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ManhattanLuxuryApartments.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ManhattanLuxuryApartments.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ManhattanLuxuryApartments.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ManhattanLuxuryApartments.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ManhattanLuxuryApartments.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ManhattanLuxuryApartments.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ManhattanLuxuryApartments.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ManhattanLuxuryApartments.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ManhattanLuxuryApartments.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ManhattanLuxuryApartments.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ManhattanLuxuryApartments.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ManhattanLuxuryApartments.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ManhattanLuxuryApartments.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.ManhattanLuxuryApartments.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.ManhattanLuxuryApartments.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.ManhattanLuxuryApartments.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.ManhattanLuxuryApartments.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.ManhattanLuxuryApartments.Transfer.event)
    }
  }

}


module MiamiBeachCondos = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.MiamiBeachCondos.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.MiamiBeachCondos.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.MiamiBeachCondos.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.MiamiBeachCondos.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.MiamiBeachCondos.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.MiamiBeachCondos.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.MiamiBeachCondos.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.MiamiBeachCondos.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.MiamiBeachCondos.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.MiamiBeachCondos.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.MiamiBeachCondos.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.MiamiBeachCondos.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.MiamiBeachCondos.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.MiamiBeachCondos.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.MiamiBeachCondos.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.MiamiBeachCondos.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.MiamiBeachCondos.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.MiamiBeachCondos.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.MiamiBeachCondos.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.MiamiBeachCondos.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.MiamiBeachCondos.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.MiamiBeachCondos.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.MiamiBeachCondos.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.MiamiBeachCondos.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.MiamiBeachCondos.Transfer.event)
    }
  }

}


module NashvilleMusicDistrict = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.NashvilleMusicDistrict.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.NashvilleMusicDistrict.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.NashvilleMusicDistrict.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.NashvilleMusicDistrict.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.NashvilleMusicDistrict.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.NashvilleMusicDistrict.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.NashvilleMusicDistrict.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.NashvilleMusicDistrict.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.NashvilleMusicDistrict.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.NashvilleMusicDistrict.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.NashvilleMusicDistrict.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.NashvilleMusicDistrict.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.NashvilleMusicDistrict.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.NashvilleMusicDistrict.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.NashvilleMusicDistrict.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.NashvilleMusicDistrict.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.NashvilleMusicDistrict.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.NashvilleMusicDistrict.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.NashvilleMusicDistrict.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.NashvilleMusicDistrict.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.NashvilleMusicDistrict.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.NashvilleMusicDistrict.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.NashvilleMusicDistrict.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.NashvilleMusicDistrict.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.NashvilleMusicDistrict.Transfer.event)
    }
  }

}


module PhoenixRetailPlaza = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.PhoenixRetailPlaza.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.PhoenixRetailPlaza.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.PhoenixRetailPlaza.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.PhoenixRetailPlaza.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.PhoenixRetailPlaza.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.PhoenixRetailPlaza.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.PhoenixRetailPlaza.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.PhoenixRetailPlaza.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.PhoenixRetailPlaza.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.PhoenixRetailPlaza.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.PhoenixRetailPlaza.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.PhoenixRetailPlaza.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.PhoenixRetailPlaza.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.PhoenixRetailPlaza.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.PhoenixRetailPlaza.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.PhoenixRetailPlaza.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.PhoenixRetailPlaza.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.PhoenixRetailPlaza.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.PhoenixRetailPlaza.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.PhoenixRetailPlaza.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.PhoenixRetailPlaza.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.PhoenixRetailPlaza.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.PhoenixRetailPlaza.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.PhoenixRetailPlaza.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.PhoenixRetailPlaza.Transfer.event)
    }
  }

}


module SeattleWarehouseDistrict = {
  module SharesPurchased = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.SeattleWarehouseDistrict.SharesPurchased.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.SeattleWarehouseDistrict.SharesPurchased.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.SeattleWarehouseDistrict.SharesPurchased.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.SeattleWarehouseDistrict.SharesPurchased.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.SeattleWarehouseDistrict.SharesPurchased.event)
    }
  }

  module SharesWithdrawn = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.SeattleWarehouseDistrict.SharesWithdrawn.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.SeattleWarehouseDistrict.SharesWithdrawn.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("shares")
      shares?: bigint,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?shares,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       shares: shares->Belt.Option.getWithDefault(0n),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.SeattleWarehouseDistrict.SharesWithdrawn.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.SeattleWarehouseDistrict.SharesWithdrawn.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.SeattleWarehouseDistrict.SharesWithdrawn.event)
    }
  }

  module YieldDistributed = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.SeattleWarehouseDistrict.YieldDistributed.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.SeattleWarehouseDistrict.YieldDistributed.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("investor")
      investor?: Address.t,
      @as("amount")
      amount?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?investor,
        ?amount,
        ?mockEventData,
      } = args

      let params = 
      {
       investor: investor->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       amount: amount->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.SeattleWarehouseDistrict.YieldDistributed.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.SeattleWarehouseDistrict.YieldDistributed.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.SeattleWarehouseDistrict.YieldDistributed.event)
    }
  }

  module PropertyUpdated = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.SeattleWarehouseDistrict.PropertyUpdated.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.SeattleWarehouseDistrict.PropertyUpdated.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("propertyId")
      propertyId?: bigint,
      @as("name")
      name?: string,
      @as("pricePerShare")
      pricePerShare?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?propertyId,
        ?name,
        ?pricePerShare,
        ?mockEventData,
      } = args

      let params = 
      {
       propertyId: propertyId->Belt.Option.getWithDefault(0n),
       name: name->Belt.Option.getWithDefault("foo"),
       pricePerShare: pricePerShare->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.SeattleWarehouseDistrict.PropertyUpdated.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.SeattleWarehouseDistrict.PropertyUpdated.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.SeattleWarehouseDistrict.PropertyUpdated.event)
    }
  }

  module Transfer = {
    @genType
    let processEvent: EventFunctions.eventProcessor<Types.SeattleWarehouseDistrict.Transfer.event> = EventFunctions.makeEventProcessor(
      ~register=(Types.SeattleWarehouseDistrict.Transfer.register :> unit => Internal.eventConfig),
    )

    @genType
    type createMockArgs = {
      @as("from")
      from?: Address.t,
      @as("to")
      to?: Address.t,
      @as("value")
      value?: bigint,
      mockEventData?: EventFunctions.mockEventData,
    }

    @genType
    let createMockEvent = args => {
      let {
        ?from,
        ?to,
        ?value,
        ?mockEventData,
      } = args

      let params = 
      {
       from: from->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       to: to->Belt.Option.getWithDefault(TestHelpers_MockAddresses.defaultAddress),
       value: value->Belt.Option.getWithDefault(0n),
      }
->(Utils.magic: Types.SeattleWarehouseDistrict.Transfer.eventArgs => Internal.eventParams)

      EventFunctions.makeEventMocker(
        ~params,
        ~mockEventData,
        ~register=(Types.SeattleWarehouseDistrict.Transfer.register :> unit => Internal.eventConfig),
      )->(Utils.magic: Internal.event => Types.SeattleWarehouseDistrict.Transfer.event)
    }
  }

}

