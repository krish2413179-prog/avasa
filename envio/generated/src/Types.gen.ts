/* TypeScript file generated from Types.res by genType. */

/* eslint-disable */
/* tslint:disable */

import type {AIRecommendation_t as Entities_AIRecommendation_t} from '../src/db/Entities.gen';

import type {DailyMetrics_t as Entities_DailyMetrics_t} from '../src/db/Entities.gen';

import type {HandlerContext as $$handlerContext} from './Types.ts';

import type {HandlerWithOptions as $$fnWithEventConfig} from './bindings/OpaqueTypes.ts';

import type {LendingTransaction_t as Entities_LendingTransaction_t} from '../src/db/Entities.gen';

import type {LivePortfolio_t as Entities_LivePortfolio_t} from '../src/db/Entities.gen';

import type {LoaderContext as $$loaderContext} from './Types.ts';

import type {MarketTrend_t as Entities_MarketTrend_t} from '../src/db/Entities.gen';

import type {PropertyAnalytics_t as Entities_PropertyAnalytics_t} from '../src/db/Entities.gen';

import type {PropertyPerformance_t as Entities_PropertyPerformance_t} from '../src/db/Entities.gen';

import type {PropertyTransaction_t as Entities_PropertyTransaction_t} from '../src/db/Entities.gen';

import type {PropertyUpdate_t as Entities_PropertyUpdate_t} from '../src/db/Entities.gen';

import type {SingleOrMultiple as $$SingleOrMultiple_t} from './bindings/OpaqueTypes';

import type {StreamTransaction_t as Entities_StreamTransaction_t} from '../src/db/Entities.gen';

import type {SwapTransaction_t as Entities_SwapTransaction_t} from '../src/db/Entities.gen';

import type {TransferTransaction_t as Entities_TransferTransaction_t} from '../src/db/Entities.gen';

import type {UserAnalytics_t as Entities_UserAnalytics_t} from '../src/db/Entities.gen';

import type {UserPortfolio_t as Entities_UserPortfolio_t} from '../src/db/Entities.gen';

import type {UserPreferences_t as Entities_UserPreferences_t} from '../src/db/Entities.gen';

import type {YieldTransaction_t as Entities_YieldTransaction_t} from '../src/db/Entities.gen';

import type {entityHandlerContext as Internal_entityHandlerContext} from 'envio/src/Internal.gen';

import type {eventOptions as Internal_eventOptions} from 'envio/src/Internal.gen';

import type {genericContractRegisterArgs as Internal_genericContractRegisterArgs} from 'envio/src/Internal.gen';

import type {genericContractRegister as Internal_genericContractRegister} from 'envio/src/Internal.gen';

import type {genericEvent as Internal_genericEvent} from 'envio/src/Internal.gen';

import type {genericHandlerArgs as Internal_genericHandlerArgs} from 'envio/src/Internal.gen';

import type {genericHandlerWithLoader as Internal_genericHandlerWithLoader} from 'envio/src/Internal.gen';

import type {genericHandler as Internal_genericHandler} from 'envio/src/Internal.gen';

import type {genericLoaderArgs as Internal_genericLoaderArgs} from 'envio/src/Internal.gen';

import type {genericLoader as Internal_genericLoader} from 'envio/src/Internal.gen';

import type {logger as Envio_logger} from 'envio/src/Envio.gen';

import type {t as Address_t} from 'envio/src/Address.gen';

export type id = string;
export type Id = id;

export type contractRegistrations = {
  readonly log: Envio_logger; 
  readonly addAustinTechHubOffice: (_1:Address_t) => void; 
  readonly addBostonHistoricBrownstones: (_1:Address_t) => void; 
  readonly addChicagoDowntownLofts: (_1:Address_t) => void; 
  readonly addDenverMountainResort: (_1:Address_t) => void; 
  readonly addLosAngelesStudioComplex: (_1:Address_t) => void; 
  readonly addManhattanLuxuryApartments: (_1:Address_t) => void; 
  readonly addMiamiBeachCondos: (_1:Address_t) => void; 
  readonly addNashvilleMusicDistrict: (_1:Address_t) => void; 
  readonly addPhoenixRetailPlaza: (_1:Address_t) => void; 
  readonly addSeattleWarehouseDistrict: (_1:Address_t) => void
};

export type entityLoaderContext<entity,indexedFieldOperations> = {
  readonly get: (_1:id) => Promise<(undefined | entity)>; 
  readonly getOrThrow: (_1:id, message:(undefined | string)) => Promise<entity>; 
  readonly getWhere: indexedFieldOperations; 
  readonly getOrCreate: (_1:entity) => Promise<entity>; 
  readonly set: (_1:entity) => void; 
  readonly deleteUnsafe: (_1:id) => void
};

export type loaderContext = $$loaderContext;

export type entityHandlerContext<entity> = Internal_entityHandlerContext<entity>;

export type handlerContext = $$handlerContext;

export type aIRecommendation = Entities_AIRecommendation_t;
export type AIRecommendation = aIRecommendation;

export type dailyMetrics = Entities_DailyMetrics_t;
export type DailyMetrics = dailyMetrics;

export type lendingTransaction = Entities_LendingTransaction_t;
export type LendingTransaction = lendingTransaction;

export type livePortfolio = Entities_LivePortfolio_t;
export type LivePortfolio = livePortfolio;

export type marketTrend = Entities_MarketTrend_t;
export type MarketTrend = marketTrend;

export type propertyAnalytics = Entities_PropertyAnalytics_t;
export type PropertyAnalytics = propertyAnalytics;

export type propertyPerformance = Entities_PropertyPerformance_t;
export type PropertyPerformance = propertyPerformance;

export type propertyTransaction = Entities_PropertyTransaction_t;
export type PropertyTransaction = propertyTransaction;

export type propertyUpdate = Entities_PropertyUpdate_t;
export type PropertyUpdate = propertyUpdate;

export type streamTransaction = Entities_StreamTransaction_t;
export type StreamTransaction = streamTransaction;

export type swapTransaction = Entities_SwapTransaction_t;
export type SwapTransaction = swapTransaction;

export type transferTransaction = Entities_TransferTransaction_t;
export type TransferTransaction = transferTransaction;

export type userAnalytics = Entities_UserAnalytics_t;
export type UserAnalytics = userAnalytics;

export type userPortfolio = Entities_UserPortfolio_t;
export type UserPortfolio = userPortfolio;

export type userPreferences = Entities_UserPreferences_t;
export type UserPreferences = userPreferences;

export type yieldTransaction = Entities_YieldTransaction_t;
export type YieldTransaction = yieldTransaction;

export type Transaction_t = {
  readonly hash: string; 
  readonly from: (undefined | Address_t); 
  readonly to: (undefined | Address_t); 
  readonly value: bigint; 
  readonly gasUsed: bigint; 
  readonly gasPrice: (undefined | bigint)
};

export type Block_t = {
  readonly number: number; 
  readonly timestamp: number; 
  readonly hash: string
};

export type AggregatedBlock_t = {
  readonly hash: string; 
  readonly number: number; 
  readonly timestamp: number
};

export type AggregatedTransaction_t = {
  readonly from: (undefined | Address_t); 
  readonly gasPrice: (undefined | bigint); 
  readonly gasUsed: bigint; 
  readonly hash: string; 
  readonly to: (undefined | Address_t); 
  readonly value: bigint
};

export type eventLog<params> = Internal_genericEvent<params,Block_t,Transaction_t>;
export type EventLog<params> = eventLog<params>;

export type SingleOrMultiple_t<a> = $$SingleOrMultiple_t<a>;

export type HandlerTypes_args<eventArgs,context> = { readonly event: eventLog<eventArgs>; readonly context: context };

export type HandlerTypes_contractRegisterArgs<eventArgs> = Internal_genericContractRegisterArgs<eventLog<eventArgs>,contractRegistrations>;

export type HandlerTypes_contractRegister<eventArgs> = Internal_genericContractRegister<HandlerTypes_contractRegisterArgs<eventArgs>>;

export type HandlerTypes_loaderArgs<eventArgs> = Internal_genericLoaderArgs<eventLog<eventArgs>,loaderContext>;

export type HandlerTypes_loader<eventArgs,loaderReturn> = Internal_genericLoader<HandlerTypes_loaderArgs<eventArgs>,loaderReturn>;

export type HandlerTypes_handlerArgs<eventArgs,loaderReturn> = Internal_genericHandlerArgs<eventLog<eventArgs>,handlerContext,loaderReturn>;

export type HandlerTypes_handler<eventArgs,loaderReturn> = Internal_genericHandler<HandlerTypes_handlerArgs<eventArgs,loaderReturn>>;

export type HandlerTypes_loaderHandler<eventArgs,loaderReturn,eventFilters> = Internal_genericHandlerWithLoader<HandlerTypes_loader<eventArgs,loaderReturn>,HandlerTypes_handler<eventArgs,loaderReturn>,eventFilters>;

export type HandlerTypes_eventConfig<eventFilters> = Internal_eventOptions<eventFilters>;

export type fnWithEventConfig<fn,eventConfig> = $$fnWithEventConfig<fn,eventConfig>;

export type handlerWithOptions<eventArgs,loaderReturn,eventFilters> = fnWithEventConfig<HandlerTypes_handler<eventArgs,loaderReturn>,HandlerTypes_eventConfig<eventFilters>>;

export type contractRegisterWithOptions<eventArgs,eventFilters> = fnWithEventConfig<HandlerTypes_contractRegister<eventArgs>,HandlerTypes_eventConfig<eventFilters>>;

export type AustinTechHubOffice_chainId = 84532;

export type AustinTechHubOffice_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type AustinTechHubOffice_SharesPurchased_block = Block_t;

export type AustinTechHubOffice_SharesPurchased_transaction = Transaction_t;

export type AustinTechHubOffice_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: AustinTechHubOffice_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: AustinTechHubOffice_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: AustinTechHubOffice_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: AustinTechHubOffice_SharesPurchased_block
};

export type AustinTechHubOffice_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<AustinTechHubOffice_SharesPurchased_event,loaderContext>;

export type AustinTechHubOffice_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<AustinTechHubOffice_SharesPurchased_loaderArgs,loaderReturn>;

export type AustinTechHubOffice_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<AustinTechHubOffice_SharesPurchased_event,handlerContext,loaderReturn>;

export type AustinTechHubOffice_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<AustinTechHubOffice_SharesPurchased_handlerArgs<loaderReturn>>;

export type AustinTechHubOffice_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<AustinTechHubOffice_SharesPurchased_event,contractRegistrations>>;

export type AustinTechHubOffice_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type AustinTechHubOffice_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: AustinTechHubOffice_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type AustinTechHubOffice_SharesPurchased_eventFiltersDefinition = 
    AustinTechHubOffice_SharesPurchased_eventFilter
  | AustinTechHubOffice_SharesPurchased_eventFilter[];

export type AustinTechHubOffice_SharesPurchased_eventFilters = 
    AustinTechHubOffice_SharesPurchased_eventFilter
  | AustinTechHubOffice_SharesPurchased_eventFilter[]
  | ((_1:AustinTechHubOffice_SharesPurchased_eventFiltersArgs) => AustinTechHubOffice_SharesPurchased_eventFiltersDefinition);

export type AustinTechHubOffice_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type AustinTechHubOffice_SharesWithdrawn_block = Block_t;

export type AustinTechHubOffice_SharesWithdrawn_transaction = Transaction_t;

export type AustinTechHubOffice_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: AustinTechHubOffice_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: AustinTechHubOffice_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: AustinTechHubOffice_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: AustinTechHubOffice_SharesWithdrawn_block
};

export type AustinTechHubOffice_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<AustinTechHubOffice_SharesWithdrawn_event,loaderContext>;

export type AustinTechHubOffice_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<AustinTechHubOffice_SharesWithdrawn_loaderArgs,loaderReturn>;

export type AustinTechHubOffice_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<AustinTechHubOffice_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type AustinTechHubOffice_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<AustinTechHubOffice_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type AustinTechHubOffice_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<AustinTechHubOffice_SharesWithdrawn_event,contractRegistrations>>;

export type AustinTechHubOffice_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type AustinTechHubOffice_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: AustinTechHubOffice_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type AustinTechHubOffice_SharesWithdrawn_eventFiltersDefinition = 
    AustinTechHubOffice_SharesWithdrawn_eventFilter
  | AustinTechHubOffice_SharesWithdrawn_eventFilter[];

export type AustinTechHubOffice_SharesWithdrawn_eventFilters = 
    AustinTechHubOffice_SharesWithdrawn_eventFilter
  | AustinTechHubOffice_SharesWithdrawn_eventFilter[]
  | ((_1:AustinTechHubOffice_SharesWithdrawn_eventFiltersArgs) => AustinTechHubOffice_SharesWithdrawn_eventFiltersDefinition);

export type AustinTechHubOffice_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type AustinTechHubOffice_YieldDistributed_block = Block_t;

export type AustinTechHubOffice_YieldDistributed_transaction = Transaction_t;

export type AustinTechHubOffice_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: AustinTechHubOffice_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: AustinTechHubOffice_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: AustinTechHubOffice_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: AustinTechHubOffice_YieldDistributed_block
};

export type AustinTechHubOffice_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<AustinTechHubOffice_YieldDistributed_event,loaderContext>;

export type AustinTechHubOffice_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<AustinTechHubOffice_YieldDistributed_loaderArgs,loaderReturn>;

export type AustinTechHubOffice_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<AustinTechHubOffice_YieldDistributed_event,handlerContext,loaderReturn>;

export type AustinTechHubOffice_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<AustinTechHubOffice_YieldDistributed_handlerArgs<loaderReturn>>;

export type AustinTechHubOffice_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<AustinTechHubOffice_YieldDistributed_event,contractRegistrations>>;

export type AustinTechHubOffice_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type AustinTechHubOffice_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: AustinTechHubOffice_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type AustinTechHubOffice_YieldDistributed_eventFiltersDefinition = 
    AustinTechHubOffice_YieldDistributed_eventFilter
  | AustinTechHubOffice_YieldDistributed_eventFilter[];

export type AustinTechHubOffice_YieldDistributed_eventFilters = 
    AustinTechHubOffice_YieldDistributed_eventFilter
  | AustinTechHubOffice_YieldDistributed_eventFilter[]
  | ((_1:AustinTechHubOffice_YieldDistributed_eventFiltersArgs) => AustinTechHubOffice_YieldDistributed_eventFiltersDefinition);

export type AustinTechHubOffice_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type AustinTechHubOffice_PropertyUpdated_block = Block_t;

export type AustinTechHubOffice_PropertyUpdated_transaction = Transaction_t;

export type AustinTechHubOffice_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: AustinTechHubOffice_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: AustinTechHubOffice_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: AustinTechHubOffice_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: AustinTechHubOffice_PropertyUpdated_block
};

export type AustinTechHubOffice_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<AustinTechHubOffice_PropertyUpdated_event,loaderContext>;

export type AustinTechHubOffice_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<AustinTechHubOffice_PropertyUpdated_loaderArgs,loaderReturn>;

export type AustinTechHubOffice_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<AustinTechHubOffice_PropertyUpdated_event,handlerContext,loaderReturn>;

export type AustinTechHubOffice_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<AustinTechHubOffice_PropertyUpdated_handlerArgs<loaderReturn>>;

export type AustinTechHubOffice_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<AustinTechHubOffice_PropertyUpdated_event,contractRegistrations>>;

export type AustinTechHubOffice_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type AustinTechHubOffice_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: AustinTechHubOffice_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type AustinTechHubOffice_PropertyUpdated_eventFiltersDefinition = 
    AustinTechHubOffice_PropertyUpdated_eventFilter
  | AustinTechHubOffice_PropertyUpdated_eventFilter[];

export type AustinTechHubOffice_PropertyUpdated_eventFilters = 
    AustinTechHubOffice_PropertyUpdated_eventFilter
  | AustinTechHubOffice_PropertyUpdated_eventFilter[]
  | ((_1:AustinTechHubOffice_PropertyUpdated_eventFiltersArgs) => AustinTechHubOffice_PropertyUpdated_eventFiltersDefinition);

export type AustinTechHubOffice_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type AustinTechHubOffice_Transfer_block = Block_t;

export type AustinTechHubOffice_Transfer_transaction = Transaction_t;

export type AustinTechHubOffice_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: AustinTechHubOffice_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: AustinTechHubOffice_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: AustinTechHubOffice_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: AustinTechHubOffice_Transfer_block
};

export type AustinTechHubOffice_Transfer_loaderArgs = Internal_genericLoaderArgs<AustinTechHubOffice_Transfer_event,loaderContext>;

export type AustinTechHubOffice_Transfer_loader<loaderReturn> = Internal_genericLoader<AustinTechHubOffice_Transfer_loaderArgs,loaderReturn>;

export type AustinTechHubOffice_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<AustinTechHubOffice_Transfer_event,handlerContext,loaderReturn>;

export type AustinTechHubOffice_Transfer_handler<loaderReturn> = Internal_genericHandler<AustinTechHubOffice_Transfer_handlerArgs<loaderReturn>>;

export type AustinTechHubOffice_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<AustinTechHubOffice_Transfer_event,contractRegistrations>>;

export type AustinTechHubOffice_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type AustinTechHubOffice_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: AustinTechHubOffice_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type AustinTechHubOffice_Transfer_eventFiltersDefinition = 
    AustinTechHubOffice_Transfer_eventFilter
  | AustinTechHubOffice_Transfer_eventFilter[];

export type AustinTechHubOffice_Transfer_eventFilters = 
    AustinTechHubOffice_Transfer_eventFilter
  | AustinTechHubOffice_Transfer_eventFilter[]
  | ((_1:AustinTechHubOffice_Transfer_eventFiltersArgs) => AustinTechHubOffice_Transfer_eventFiltersDefinition);

export type BostonHistoricBrownstones_chainId = 84532;

export type BostonHistoricBrownstones_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type BostonHistoricBrownstones_SharesPurchased_block = Block_t;

export type BostonHistoricBrownstones_SharesPurchased_transaction = Transaction_t;

export type BostonHistoricBrownstones_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: BostonHistoricBrownstones_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: BostonHistoricBrownstones_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: BostonHistoricBrownstones_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: BostonHistoricBrownstones_SharesPurchased_block
};

export type BostonHistoricBrownstones_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<BostonHistoricBrownstones_SharesPurchased_event,loaderContext>;

export type BostonHistoricBrownstones_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<BostonHistoricBrownstones_SharesPurchased_loaderArgs,loaderReturn>;

export type BostonHistoricBrownstones_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<BostonHistoricBrownstones_SharesPurchased_event,handlerContext,loaderReturn>;

export type BostonHistoricBrownstones_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<BostonHistoricBrownstones_SharesPurchased_handlerArgs<loaderReturn>>;

export type BostonHistoricBrownstones_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<BostonHistoricBrownstones_SharesPurchased_event,contractRegistrations>>;

export type BostonHistoricBrownstones_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type BostonHistoricBrownstones_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: BostonHistoricBrownstones_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type BostonHistoricBrownstones_SharesPurchased_eventFiltersDefinition = 
    BostonHistoricBrownstones_SharesPurchased_eventFilter
  | BostonHistoricBrownstones_SharesPurchased_eventFilter[];

export type BostonHistoricBrownstones_SharesPurchased_eventFilters = 
    BostonHistoricBrownstones_SharesPurchased_eventFilter
  | BostonHistoricBrownstones_SharesPurchased_eventFilter[]
  | ((_1:BostonHistoricBrownstones_SharesPurchased_eventFiltersArgs) => BostonHistoricBrownstones_SharesPurchased_eventFiltersDefinition);

export type BostonHistoricBrownstones_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type BostonHistoricBrownstones_SharesWithdrawn_block = Block_t;

export type BostonHistoricBrownstones_SharesWithdrawn_transaction = Transaction_t;

export type BostonHistoricBrownstones_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: BostonHistoricBrownstones_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: BostonHistoricBrownstones_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: BostonHistoricBrownstones_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: BostonHistoricBrownstones_SharesWithdrawn_block
};

export type BostonHistoricBrownstones_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<BostonHistoricBrownstones_SharesWithdrawn_event,loaderContext>;

export type BostonHistoricBrownstones_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<BostonHistoricBrownstones_SharesWithdrawn_loaderArgs,loaderReturn>;

export type BostonHistoricBrownstones_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<BostonHistoricBrownstones_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type BostonHistoricBrownstones_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<BostonHistoricBrownstones_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type BostonHistoricBrownstones_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<BostonHistoricBrownstones_SharesWithdrawn_event,contractRegistrations>>;

export type BostonHistoricBrownstones_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type BostonHistoricBrownstones_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: BostonHistoricBrownstones_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type BostonHistoricBrownstones_SharesWithdrawn_eventFiltersDefinition = 
    BostonHistoricBrownstones_SharesWithdrawn_eventFilter
  | BostonHistoricBrownstones_SharesWithdrawn_eventFilter[];

export type BostonHistoricBrownstones_SharesWithdrawn_eventFilters = 
    BostonHistoricBrownstones_SharesWithdrawn_eventFilter
  | BostonHistoricBrownstones_SharesWithdrawn_eventFilter[]
  | ((_1:BostonHistoricBrownstones_SharesWithdrawn_eventFiltersArgs) => BostonHistoricBrownstones_SharesWithdrawn_eventFiltersDefinition);

export type BostonHistoricBrownstones_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type BostonHistoricBrownstones_YieldDistributed_block = Block_t;

export type BostonHistoricBrownstones_YieldDistributed_transaction = Transaction_t;

export type BostonHistoricBrownstones_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: BostonHistoricBrownstones_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: BostonHistoricBrownstones_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: BostonHistoricBrownstones_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: BostonHistoricBrownstones_YieldDistributed_block
};

export type BostonHistoricBrownstones_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<BostonHistoricBrownstones_YieldDistributed_event,loaderContext>;

export type BostonHistoricBrownstones_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<BostonHistoricBrownstones_YieldDistributed_loaderArgs,loaderReturn>;

export type BostonHistoricBrownstones_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<BostonHistoricBrownstones_YieldDistributed_event,handlerContext,loaderReturn>;

export type BostonHistoricBrownstones_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<BostonHistoricBrownstones_YieldDistributed_handlerArgs<loaderReturn>>;

export type BostonHistoricBrownstones_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<BostonHistoricBrownstones_YieldDistributed_event,contractRegistrations>>;

export type BostonHistoricBrownstones_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type BostonHistoricBrownstones_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: BostonHistoricBrownstones_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type BostonHistoricBrownstones_YieldDistributed_eventFiltersDefinition = 
    BostonHistoricBrownstones_YieldDistributed_eventFilter
  | BostonHistoricBrownstones_YieldDistributed_eventFilter[];

export type BostonHistoricBrownstones_YieldDistributed_eventFilters = 
    BostonHistoricBrownstones_YieldDistributed_eventFilter
  | BostonHistoricBrownstones_YieldDistributed_eventFilter[]
  | ((_1:BostonHistoricBrownstones_YieldDistributed_eventFiltersArgs) => BostonHistoricBrownstones_YieldDistributed_eventFiltersDefinition);

export type BostonHistoricBrownstones_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type BostonHistoricBrownstones_PropertyUpdated_block = Block_t;

export type BostonHistoricBrownstones_PropertyUpdated_transaction = Transaction_t;

export type BostonHistoricBrownstones_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: BostonHistoricBrownstones_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: BostonHistoricBrownstones_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: BostonHistoricBrownstones_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: BostonHistoricBrownstones_PropertyUpdated_block
};

export type BostonHistoricBrownstones_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<BostonHistoricBrownstones_PropertyUpdated_event,loaderContext>;

export type BostonHistoricBrownstones_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<BostonHistoricBrownstones_PropertyUpdated_loaderArgs,loaderReturn>;

export type BostonHistoricBrownstones_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<BostonHistoricBrownstones_PropertyUpdated_event,handlerContext,loaderReturn>;

export type BostonHistoricBrownstones_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<BostonHistoricBrownstones_PropertyUpdated_handlerArgs<loaderReturn>>;

export type BostonHistoricBrownstones_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<BostonHistoricBrownstones_PropertyUpdated_event,contractRegistrations>>;

export type BostonHistoricBrownstones_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type BostonHistoricBrownstones_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: BostonHistoricBrownstones_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type BostonHistoricBrownstones_PropertyUpdated_eventFiltersDefinition = 
    BostonHistoricBrownstones_PropertyUpdated_eventFilter
  | BostonHistoricBrownstones_PropertyUpdated_eventFilter[];

export type BostonHistoricBrownstones_PropertyUpdated_eventFilters = 
    BostonHistoricBrownstones_PropertyUpdated_eventFilter
  | BostonHistoricBrownstones_PropertyUpdated_eventFilter[]
  | ((_1:BostonHistoricBrownstones_PropertyUpdated_eventFiltersArgs) => BostonHistoricBrownstones_PropertyUpdated_eventFiltersDefinition);

export type BostonHistoricBrownstones_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type BostonHistoricBrownstones_Transfer_block = Block_t;

export type BostonHistoricBrownstones_Transfer_transaction = Transaction_t;

export type BostonHistoricBrownstones_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: BostonHistoricBrownstones_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: BostonHistoricBrownstones_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: BostonHistoricBrownstones_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: BostonHistoricBrownstones_Transfer_block
};

export type BostonHistoricBrownstones_Transfer_loaderArgs = Internal_genericLoaderArgs<BostonHistoricBrownstones_Transfer_event,loaderContext>;

export type BostonHistoricBrownstones_Transfer_loader<loaderReturn> = Internal_genericLoader<BostonHistoricBrownstones_Transfer_loaderArgs,loaderReturn>;

export type BostonHistoricBrownstones_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<BostonHistoricBrownstones_Transfer_event,handlerContext,loaderReturn>;

export type BostonHistoricBrownstones_Transfer_handler<loaderReturn> = Internal_genericHandler<BostonHistoricBrownstones_Transfer_handlerArgs<loaderReturn>>;

export type BostonHistoricBrownstones_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<BostonHistoricBrownstones_Transfer_event,contractRegistrations>>;

export type BostonHistoricBrownstones_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type BostonHistoricBrownstones_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: BostonHistoricBrownstones_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type BostonHistoricBrownstones_Transfer_eventFiltersDefinition = 
    BostonHistoricBrownstones_Transfer_eventFilter
  | BostonHistoricBrownstones_Transfer_eventFilter[];

export type BostonHistoricBrownstones_Transfer_eventFilters = 
    BostonHistoricBrownstones_Transfer_eventFilter
  | BostonHistoricBrownstones_Transfer_eventFilter[]
  | ((_1:BostonHistoricBrownstones_Transfer_eventFiltersArgs) => BostonHistoricBrownstones_Transfer_eventFiltersDefinition);

export type ChicagoDowntownLofts_chainId = 84532;

export type ChicagoDowntownLofts_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type ChicagoDowntownLofts_SharesPurchased_block = Block_t;

export type ChicagoDowntownLofts_SharesPurchased_transaction = Transaction_t;

export type ChicagoDowntownLofts_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ChicagoDowntownLofts_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ChicagoDowntownLofts_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ChicagoDowntownLofts_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ChicagoDowntownLofts_SharesPurchased_block
};

export type ChicagoDowntownLofts_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<ChicagoDowntownLofts_SharesPurchased_event,loaderContext>;

export type ChicagoDowntownLofts_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<ChicagoDowntownLofts_SharesPurchased_loaderArgs,loaderReturn>;

export type ChicagoDowntownLofts_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ChicagoDowntownLofts_SharesPurchased_event,handlerContext,loaderReturn>;

export type ChicagoDowntownLofts_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<ChicagoDowntownLofts_SharesPurchased_handlerArgs<loaderReturn>>;

export type ChicagoDowntownLofts_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ChicagoDowntownLofts_SharesPurchased_event,contractRegistrations>>;

export type ChicagoDowntownLofts_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type ChicagoDowntownLofts_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ChicagoDowntownLofts_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ChicagoDowntownLofts_SharesPurchased_eventFiltersDefinition = 
    ChicagoDowntownLofts_SharesPurchased_eventFilter
  | ChicagoDowntownLofts_SharesPurchased_eventFilter[];

export type ChicagoDowntownLofts_SharesPurchased_eventFilters = 
    ChicagoDowntownLofts_SharesPurchased_eventFilter
  | ChicagoDowntownLofts_SharesPurchased_eventFilter[]
  | ((_1:ChicagoDowntownLofts_SharesPurchased_eventFiltersArgs) => ChicagoDowntownLofts_SharesPurchased_eventFiltersDefinition);

export type ChicagoDowntownLofts_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type ChicagoDowntownLofts_SharesWithdrawn_block = Block_t;

export type ChicagoDowntownLofts_SharesWithdrawn_transaction = Transaction_t;

export type ChicagoDowntownLofts_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ChicagoDowntownLofts_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ChicagoDowntownLofts_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ChicagoDowntownLofts_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ChicagoDowntownLofts_SharesWithdrawn_block
};

export type ChicagoDowntownLofts_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<ChicagoDowntownLofts_SharesWithdrawn_event,loaderContext>;

export type ChicagoDowntownLofts_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<ChicagoDowntownLofts_SharesWithdrawn_loaderArgs,loaderReturn>;

export type ChicagoDowntownLofts_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ChicagoDowntownLofts_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type ChicagoDowntownLofts_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<ChicagoDowntownLofts_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type ChicagoDowntownLofts_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ChicagoDowntownLofts_SharesWithdrawn_event,contractRegistrations>>;

export type ChicagoDowntownLofts_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type ChicagoDowntownLofts_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ChicagoDowntownLofts_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ChicagoDowntownLofts_SharesWithdrawn_eventFiltersDefinition = 
    ChicagoDowntownLofts_SharesWithdrawn_eventFilter
  | ChicagoDowntownLofts_SharesWithdrawn_eventFilter[];

export type ChicagoDowntownLofts_SharesWithdrawn_eventFilters = 
    ChicagoDowntownLofts_SharesWithdrawn_eventFilter
  | ChicagoDowntownLofts_SharesWithdrawn_eventFilter[]
  | ((_1:ChicagoDowntownLofts_SharesWithdrawn_eventFiltersArgs) => ChicagoDowntownLofts_SharesWithdrawn_eventFiltersDefinition);

export type ChicagoDowntownLofts_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type ChicagoDowntownLofts_YieldDistributed_block = Block_t;

export type ChicagoDowntownLofts_YieldDistributed_transaction = Transaction_t;

export type ChicagoDowntownLofts_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ChicagoDowntownLofts_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ChicagoDowntownLofts_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ChicagoDowntownLofts_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ChicagoDowntownLofts_YieldDistributed_block
};

export type ChicagoDowntownLofts_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<ChicagoDowntownLofts_YieldDistributed_event,loaderContext>;

export type ChicagoDowntownLofts_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<ChicagoDowntownLofts_YieldDistributed_loaderArgs,loaderReturn>;

export type ChicagoDowntownLofts_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ChicagoDowntownLofts_YieldDistributed_event,handlerContext,loaderReturn>;

export type ChicagoDowntownLofts_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<ChicagoDowntownLofts_YieldDistributed_handlerArgs<loaderReturn>>;

export type ChicagoDowntownLofts_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ChicagoDowntownLofts_YieldDistributed_event,contractRegistrations>>;

export type ChicagoDowntownLofts_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type ChicagoDowntownLofts_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ChicagoDowntownLofts_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ChicagoDowntownLofts_YieldDistributed_eventFiltersDefinition = 
    ChicagoDowntownLofts_YieldDistributed_eventFilter
  | ChicagoDowntownLofts_YieldDistributed_eventFilter[];

export type ChicagoDowntownLofts_YieldDistributed_eventFilters = 
    ChicagoDowntownLofts_YieldDistributed_eventFilter
  | ChicagoDowntownLofts_YieldDistributed_eventFilter[]
  | ((_1:ChicagoDowntownLofts_YieldDistributed_eventFiltersArgs) => ChicagoDowntownLofts_YieldDistributed_eventFiltersDefinition);

export type ChicagoDowntownLofts_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type ChicagoDowntownLofts_PropertyUpdated_block = Block_t;

export type ChicagoDowntownLofts_PropertyUpdated_transaction = Transaction_t;

export type ChicagoDowntownLofts_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ChicagoDowntownLofts_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ChicagoDowntownLofts_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ChicagoDowntownLofts_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ChicagoDowntownLofts_PropertyUpdated_block
};

export type ChicagoDowntownLofts_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<ChicagoDowntownLofts_PropertyUpdated_event,loaderContext>;

export type ChicagoDowntownLofts_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<ChicagoDowntownLofts_PropertyUpdated_loaderArgs,loaderReturn>;

export type ChicagoDowntownLofts_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ChicagoDowntownLofts_PropertyUpdated_event,handlerContext,loaderReturn>;

export type ChicagoDowntownLofts_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<ChicagoDowntownLofts_PropertyUpdated_handlerArgs<loaderReturn>>;

export type ChicagoDowntownLofts_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ChicagoDowntownLofts_PropertyUpdated_event,contractRegistrations>>;

export type ChicagoDowntownLofts_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type ChicagoDowntownLofts_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ChicagoDowntownLofts_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ChicagoDowntownLofts_PropertyUpdated_eventFiltersDefinition = 
    ChicagoDowntownLofts_PropertyUpdated_eventFilter
  | ChicagoDowntownLofts_PropertyUpdated_eventFilter[];

export type ChicagoDowntownLofts_PropertyUpdated_eventFilters = 
    ChicagoDowntownLofts_PropertyUpdated_eventFilter
  | ChicagoDowntownLofts_PropertyUpdated_eventFilter[]
  | ((_1:ChicagoDowntownLofts_PropertyUpdated_eventFiltersArgs) => ChicagoDowntownLofts_PropertyUpdated_eventFiltersDefinition);

export type ChicagoDowntownLofts_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type ChicagoDowntownLofts_Transfer_block = Block_t;

export type ChicagoDowntownLofts_Transfer_transaction = Transaction_t;

export type ChicagoDowntownLofts_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ChicagoDowntownLofts_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ChicagoDowntownLofts_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ChicagoDowntownLofts_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ChicagoDowntownLofts_Transfer_block
};

export type ChicagoDowntownLofts_Transfer_loaderArgs = Internal_genericLoaderArgs<ChicagoDowntownLofts_Transfer_event,loaderContext>;

export type ChicagoDowntownLofts_Transfer_loader<loaderReturn> = Internal_genericLoader<ChicagoDowntownLofts_Transfer_loaderArgs,loaderReturn>;

export type ChicagoDowntownLofts_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ChicagoDowntownLofts_Transfer_event,handlerContext,loaderReturn>;

export type ChicagoDowntownLofts_Transfer_handler<loaderReturn> = Internal_genericHandler<ChicagoDowntownLofts_Transfer_handlerArgs<loaderReturn>>;

export type ChicagoDowntownLofts_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ChicagoDowntownLofts_Transfer_event,contractRegistrations>>;

export type ChicagoDowntownLofts_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type ChicagoDowntownLofts_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ChicagoDowntownLofts_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ChicagoDowntownLofts_Transfer_eventFiltersDefinition = 
    ChicagoDowntownLofts_Transfer_eventFilter
  | ChicagoDowntownLofts_Transfer_eventFilter[];

export type ChicagoDowntownLofts_Transfer_eventFilters = 
    ChicagoDowntownLofts_Transfer_eventFilter
  | ChicagoDowntownLofts_Transfer_eventFilter[]
  | ((_1:ChicagoDowntownLofts_Transfer_eventFiltersArgs) => ChicagoDowntownLofts_Transfer_eventFiltersDefinition);

export type DenverMountainResort_chainId = 84532;

export type DenverMountainResort_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type DenverMountainResort_SharesPurchased_block = Block_t;

export type DenverMountainResort_SharesPurchased_transaction = Transaction_t;

export type DenverMountainResort_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: DenverMountainResort_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: DenverMountainResort_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: DenverMountainResort_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: DenverMountainResort_SharesPurchased_block
};

export type DenverMountainResort_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<DenverMountainResort_SharesPurchased_event,loaderContext>;

export type DenverMountainResort_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<DenverMountainResort_SharesPurchased_loaderArgs,loaderReturn>;

export type DenverMountainResort_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<DenverMountainResort_SharesPurchased_event,handlerContext,loaderReturn>;

export type DenverMountainResort_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<DenverMountainResort_SharesPurchased_handlerArgs<loaderReturn>>;

export type DenverMountainResort_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<DenverMountainResort_SharesPurchased_event,contractRegistrations>>;

export type DenverMountainResort_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type DenverMountainResort_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: DenverMountainResort_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type DenverMountainResort_SharesPurchased_eventFiltersDefinition = 
    DenverMountainResort_SharesPurchased_eventFilter
  | DenverMountainResort_SharesPurchased_eventFilter[];

export type DenverMountainResort_SharesPurchased_eventFilters = 
    DenverMountainResort_SharesPurchased_eventFilter
  | DenverMountainResort_SharesPurchased_eventFilter[]
  | ((_1:DenverMountainResort_SharesPurchased_eventFiltersArgs) => DenverMountainResort_SharesPurchased_eventFiltersDefinition);

export type DenverMountainResort_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type DenverMountainResort_SharesWithdrawn_block = Block_t;

export type DenverMountainResort_SharesWithdrawn_transaction = Transaction_t;

export type DenverMountainResort_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: DenverMountainResort_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: DenverMountainResort_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: DenverMountainResort_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: DenverMountainResort_SharesWithdrawn_block
};

export type DenverMountainResort_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<DenverMountainResort_SharesWithdrawn_event,loaderContext>;

export type DenverMountainResort_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<DenverMountainResort_SharesWithdrawn_loaderArgs,loaderReturn>;

export type DenverMountainResort_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<DenverMountainResort_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type DenverMountainResort_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<DenverMountainResort_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type DenverMountainResort_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<DenverMountainResort_SharesWithdrawn_event,contractRegistrations>>;

export type DenverMountainResort_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type DenverMountainResort_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: DenverMountainResort_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type DenverMountainResort_SharesWithdrawn_eventFiltersDefinition = 
    DenverMountainResort_SharesWithdrawn_eventFilter
  | DenverMountainResort_SharesWithdrawn_eventFilter[];

export type DenverMountainResort_SharesWithdrawn_eventFilters = 
    DenverMountainResort_SharesWithdrawn_eventFilter
  | DenverMountainResort_SharesWithdrawn_eventFilter[]
  | ((_1:DenverMountainResort_SharesWithdrawn_eventFiltersArgs) => DenverMountainResort_SharesWithdrawn_eventFiltersDefinition);

export type DenverMountainResort_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type DenverMountainResort_YieldDistributed_block = Block_t;

export type DenverMountainResort_YieldDistributed_transaction = Transaction_t;

export type DenverMountainResort_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: DenverMountainResort_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: DenverMountainResort_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: DenverMountainResort_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: DenverMountainResort_YieldDistributed_block
};

export type DenverMountainResort_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<DenverMountainResort_YieldDistributed_event,loaderContext>;

export type DenverMountainResort_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<DenverMountainResort_YieldDistributed_loaderArgs,loaderReturn>;

export type DenverMountainResort_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<DenverMountainResort_YieldDistributed_event,handlerContext,loaderReturn>;

export type DenverMountainResort_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<DenverMountainResort_YieldDistributed_handlerArgs<loaderReturn>>;

export type DenverMountainResort_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<DenverMountainResort_YieldDistributed_event,contractRegistrations>>;

export type DenverMountainResort_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type DenverMountainResort_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: DenverMountainResort_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type DenverMountainResort_YieldDistributed_eventFiltersDefinition = 
    DenverMountainResort_YieldDistributed_eventFilter
  | DenverMountainResort_YieldDistributed_eventFilter[];

export type DenverMountainResort_YieldDistributed_eventFilters = 
    DenverMountainResort_YieldDistributed_eventFilter
  | DenverMountainResort_YieldDistributed_eventFilter[]
  | ((_1:DenverMountainResort_YieldDistributed_eventFiltersArgs) => DenverMountainResort_YieldDistributed_eventFiltersDefinition);

export type DenverMountainResort_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type DenverMountainResort_PropertyUpdated_block = Block_t;

export type DenverMountainResort_PropertyUpdated_transaction = Transaction_t;

export type DenverMountainResort_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: DenverMountainResort_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: DenverMountainResort_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: DenverMountainResort_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: DenverMountainResort_PropertyUpdated_block
};

export type DenverMountainResort_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<DenverMountainResort_PropertyUpdated_event,loaderContext>;

export type DenverMountainResort_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<DenverMountainResort_PropertyUpdated_loaderArgs,loaderReturn>;

export type DenverMountainResort_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<DenverMountainResort_PropertyUpdated_event,handlerContext,loaderReturn>;

export type DenverMountainResort_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<DenverMountainResort_PropertyUpdated_handlerArgs<loaderReturn>>;

export type DenverMountainResort_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<DenverMountainResort_PropertyUpdated_event,contractRegistrations>>;

export type DenverMountainResort_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type DenverMountainResort_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: DenverMountainResort_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type DenverMountainResort_PropertyUpdated_eventFiltersDefinition = 
    DenverMountainResort_PropertyUpdated_eventFilter
  | DenverMountainResort_PropertyUpdated_eventFilter[];

export type DenverMountainResort_PropertyUpdated_eventFilters = 
    DenverMountainResort_PropertyUpdated_eventFilter
  | DenverMountainResort_PropertyUpdated_eventFilter[]
  | ((_1:DenverMountainResort_PropertyUpdated_eventFiltersArgs) => DenverMountainResort_PropertyUpdated_eventFiltersDefinition);

export type DenverMountainResort_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type DenverMountainResort_Transfer_block = Block_t;

export type DenverMountainResort_Transfer_transaction = Transaction_t;

export type DenverMountainResort_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: DenverMountainResort_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: DenverMountainResort_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: DenverMountainResort_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: DenverMountainResort_Transfer_block
};

export type DenverMountainResort_Transfer_loaderArgs = Internal_genericLoaderArgs<DenverMountainResort_Transfer_event,loaderContext>;

export type DenverMountainResort_Transfer_loader<loaderReturn> = Internal_genericLoader<DenverMountainResort_Transfer_loaderArgs,loaderReturn>;

export type DenverMountainResort_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<DenverMountainResort_Transfer_event,handlerContext,loaderReturn>;

export type DenverMountainResort_Transfer_handler<loaderReturn> = Internal_genericHandler<DenverMountainResort_Transfer_handlerArgs<loaderReturn>>;

export type DenverMountainResort_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<DenverMountainResort_Transfer_event,contractRegistrations>>;

export type DenverMountainResort_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type DenverMountainResort_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: DenverMountainResort_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type DenverMountainResort_Transfer_eventFiltersDefinition = 
    DenverMountainResort_Transfer_eventFilter
  | DenverMountainResort_Transfer_eventFilter[];

export type DenverMountainResort_Transfer_eventFilters = 
    DenverMountainResort_Transfer_eventFilter
  | DenverMountainResort_Transfer_eventFilter[]
  | ((_1:DenverMountainResort_Transfer_eventFiltersArgs) => DenverMountainResort_Transfer_eventFiltersDefinition);

export type LosAngelesStudioComplex_chainId = 84532;

export type LosAngelesStudioComplex_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type LosAngelesStudioComplex_SharesPurchased_block = Block_t;

export type LosAngelesStudioComplex_SharesPurchased_transaction = Transaction_t;

export type LosAngelesStudioComplex_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: LosAngelesStudioComplex_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: LosAngelesStudioComplex_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: LosAngelesStudioComplex_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: LosAngelesStudioComplex_SharesPurchased_block
};

export type LosAngelesStudioComplex_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<LosAngelesStudioComplex_SharesPurchased_event,loaderContext>;

export type LosAngelesStudioComplex_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<LosAngelesStudioComplex_SharesPurchased_loaderArgs,loaderReturn>;

export type LosAngelesStudioComplex_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<LosAngelesStudioComplex_SharesPurchased_event,handlerContext,loaderReturn>;

export type LosAngelesStudioComplex_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<LosAngelesStudioComplex_SharesPurchased_handlerArgs<loaderReturn>>;

export type LosAngelesStudioComplex_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<LosAngelesStudioComplex_SharesPurchased_event,contractRegistrations>>;

export type LosAngelesStudioComplex_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type LosAngelesStudioComplex_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: LosAngelesStudioComplex_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type LosAngelesStudioComplex_SharesPurchased_eventFiltersDefinition = 
    LosAngelesStudioComplex_SharesPurchased_eventFilter
  | LosAngelesStudioComplex_SharesPurchased_eventFilter[];

export type LosAngelesStudioComplex_SharesPurchased_eventFilters = 
    LosAngelesStudioComplex_SharesPurchased_eventFilter
  | LosAngelesStudioComplex_SharesPurchased_eventFilter[]
  | ((_1:LosAngelesStudioComplex_SharesPurchased_eventFiltersArgs) => LosAngelesStudioComplex_SharesPurchased_eventFiltersDefinition);

export type LosAngelesStudioComplex_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type LosAngelesStudioComplex_SharesWithdrawn_block = Block_t;

export type LosAngelesStudioComplex_SharesWithdrawn_transaction = Transaction_t;

export type LosAngelesStudioComplex_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: LosAngelesStudioComplex_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: LosAngelesStudioComplex_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: LosAngelesStudioComplex_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: LosAngelesStudioComplex_SharesWithdrawn_block
};

export type LosAngelesStudioComplex_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<LosAngelesStudioComplex_SharesWithdrawn_event,loaderContext>;

export type LosAngelesStudioComplex_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<LosAngelesStudioComplex_SharesWithdrawn_loaderArgs,loaderReturn>;

export type LosAngelesStudioComplex_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<LosAngelesStudioComplex_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type LosAngelesStudioComplex_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<LosAngelesStudioComplex_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type LosAngelesStudioComplex_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<LosAngelesStudioComplex_SharesWithdrawn_event,contractRegistrations>>;

export type LosAngelesStudioComplex_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type LosAngelesStudioComplex_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: LosAngelesStudioComplex_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type LosAngelesStudioComplex_SharesWithdrawn_eventFiltersDefinition = 
    LosAngelesStudioComplex_SharesWithdrawn_eventFilter
  | LosAngelesStudioComplex_SharesWithdrawn_eventFilter[];

export type LosAngelesStudioComplex_SharesWithdrawn_eventFilters = 
    LosAngelesStudioComplex_SharesWithdrawn_eventFilter
  | LosAngelesStudioComplex_SharesWithdrawn_eventFilter[]
  | ((_1:LosAngelesStudioComplex_SharesWithdrawn_eventFiltersArgs) => LosAngelesStudioComplex_SharesWithdrawn_eventFiltersDefinition);

export type LosAngelesStudioComplex_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type LosAngelesStudioComplex_YieldDistributed_block = Block_t;

export type LosAngelesStudioComplex_YieldDistributed_transaction = Transaction_t;

export type LosAngelesStudioComplex_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: LosAngelesStudioComplex_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: LosAngelesStudioComplex_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: LosAngelesStudioComplex_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: LosAngelesStudioComplex_YieldDistributed_block
};

export type LosAngelesStudioComplex_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<LosAngelesStudioComplex_YieldDistributed_event,loaderContext>;

export type LosAngelesStudioComplex_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<LosAngelesStudioComplex_YieldDistributed_loaderArgs,loaderReturn>;

export type LosAngelesStudioComplex_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<LosAngelesStudioComplex_YieldDistributed_event,handlerContext,loaderReturn>;

export type LosAngelesStudioComplex_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<LosAngelesStudioComplex_YieldDistributed_handlerArgs<loaderReturn>>;

export type LosAngelesStudioComplex_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<LosAngelesStudioComplex_YieldDistributed_event,contractRegistrations>>;

export type LosAngelesStudioComplex_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type LosAngelesStudioComplex_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: LosAngelesStudioComplex_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type LosAngelesStudioComplex_YieldDistributed_eventFiltersDefinition = 
    LosAngelesStudioComplex_YieldDistributed_eventFilter
  | LosAngelesStudioComplex_YieldDistributed_eventFilter[];

export type LosAngelesStudioComplex_YieldDistributed_eventFilters = 
    LosAngelesStudioComplex_YieldDistributed_eventFilter
  | LosAngelesStudioComplex_YieldDistributed_eventFilter[]
  | ((_1:LosAngelesStudioComplex_YieldDistributed_eventFiltersArgs) => LosAngelesStudioComplex_YieldDistributed_eventFiltersDefinition);

export type LosAngelesStudioComplex_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type LosAngelesStudioComplex_PropertyUpdated_block = Block_t;

export type LosAngelesStudioComplex_PropertyUpdated_transaction = Transaction_t;

export type LosAngelesStudioComplex_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: LosAngelesStudioComplex_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: LosAngelesStudioComplex_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: LosAngelesStudioComplex_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: LosAngelesStudioComplex_PropertyUpdated_block
};

export type LosAngelesStudioComplex_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<LosAngelesStudioComplex_PropertyUpdated_event,loaderContext>;

export type LosAngelesStudioComplex_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<LosAngelesStudioComplex_PropertyUpdated_loaderArgs,loaderReturn>;

export type LosAngelesStudioComplex_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<LosAngelesStudioComplex_PropertyUpdated_event,handlerContext,loaderReturn>;

export type LosAngelesStudioComplex_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<LosAngelesStudioComplex_PropertyUpdated_handlerArgs<loaderReturn>>;

export type LosAngelesStudioComplex_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<LosAngelesStudioComplex_PropertyUpdated_event,contractRegistrations>>;

export type LosAngelesStudioComplex_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type LosAngelesStudioComplex_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: LosAngelesStudioComplex_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type LosAngelesStudioComplex_PropertyUpdated_eventFiltersDefinition = 
    LosAngelesStudioComplex_PropertyUpdated_eventFilter
  | LosAngelesStudioComplex_PropertyUpdated_eventFilter[];

export type LosAngelesStudioComplex_PropertyUpdated_eventFilters = 
    LosAngelesStudioComplex_PropertyUpdated_eventFilter
  | LosAngelesStudioComplex_PropertyUpdated_eventFilter[]
  | ((_1:LosAngelesStudioComplex_PropertyUpdated_eventFiltersArgs) => LosAngelesStudioComplex_PropertyUpdated_eventFiltersDefinition);

export type LosAngelesStudioComplex_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type LosAngelesStudioComplex_Transfer_block = Block_t;

export type LosAngelesStudioComplex_Transfer_transaction = Transaction_t;

export type LosAngelesStudioComplex_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: LosAngelesStudioComplex_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: LosAngelesStudioComplex_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: LosAngelesStudioComplex_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: LosAngelesStudioComplex_Transfer_block
};

export type LosAngelesStudioComplex_Transfer_loaderArgs = Internal_genericLoaderArgs<LosAngelesStudioComplex_Transfer_event,loaderContext>;

export type LosAngelesStudioComplex_Transfer_loader<loaderReturn> = Internal_genericLoader<LosAngelesStudioComplex_Transfer_loaderArgs,loaderReturn>;

export type LosAngelesStudioComplex_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<LosAngelesStudioComplex_Transfer_event,handlerContext,loaderReturn>;

export type LosAngelesStudioComplex_Transfer_handler<loaderReturn> = Internal_genericHandler<LosAngelesStudioComplex_Transfer_handlerArgs<loaderReturn>>;

export type LosAngelesStudioComplex_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<LosAngelesStudioComplex_Transfer_event,contractRegistrations>>;

export type LosAngelesStudioComplex_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type LosAngelesStudioComplex_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: LosAngelesStudioComplex_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type LosAngelesStudioComplex_Transfer_eventFiltersDefinition = 
    LosAngelesStudioComplex_Transfer_eventFilter
  | LosAngelesStudioComplex_Transfer_eventFilter[];

export type LosAngelesStudioComplex_Transfer_eventFilters = 
    LosAngelesStudioComplex_Transfer_eventFilter
  | LosAngelesStudioComplex_Transfer_eventFilter[]
  | ((_1:LosAngelesStudioComplex_Transfer_eventFiltersArgs) => LosAngelesStudioComplex_Transfer_eventFiltersDefinition);

export type ManhattanLuxuryApartments_chainId = 84532;

export type ManhattanLuxuryApartments_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type ManhattanLuxuryApartments_SharesPurchased_block = Block_t;

export type ManhattanLuxuryApartments_SharesPurchased_transaction = Transaction_t;

export type ManhattanLuxuryApartments_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ManhattanLuxuryApartments_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ManhattanLuxuryApartments_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ManhattanLuxuryApartments_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ManhattanLuxuryApartments_SharesPurchased_block
};

export type ManhattanLuxuryApartments_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<ManhattanLuxuryApartments_SharesPurchased_event,loaderContext>;

export type ManhattanLuxuryApartments_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<ManhattanLuxuryApartments_SharesPurchased_loaderArgs,loaderReturn>;

export type ManhattanLuxuryApartments_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ManhattanLuxuryApartments_SharesPurchased_event,handlerContext,loaderReturn>;

export type ManhattanLuxuryApartments_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<ManhattanLuxuryApartments_SharesPurchased_handlerArgs<loaderReturn>>;

export type ManhattanLuxuryApartments_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ManhattanLuxuryApartments_SharesPurchased_event,contractRegistrations>>;

export type ManhattanLuxuryApartments_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type ManhattanLuxuryApartments_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ManhattanLuxuryApartments_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ManhattanLuxuryApartments_SharesPurchased_eventFiltersDefinition = 
    ManhattanLuxuryApartments_SharesPurchased_eventFilter
  | ManhattanLuxuryApartments_SharesPurchased_eventFilter[];

export type ManhattanLuxuryApartments_SharesPurchased_eventFilters = 
    ManhattanLuxuryApartments_SharesPurchased_eventFilter
  | ManhattanLuxuryApartments_SharesPurchased_eventFilter[]
  | ((_1:ManhattanLuxuryApartments_SharesPurchased_eventFiltersArgs) => ManhattanLuxuryApartments_SharesPurchased_eventFiltersDefinition);

export type ManhattanLuxuryApartments_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type ManhattanLuxuryApartments_SharesWithdrawn_block = Block_t;

export type ManhattanLuxuryApartments_SharesWithdrawn_transaction = Transaction_t;

export type ManhattanLuxuryApartments_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ManhattanLuxuryApartments_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ManhattanLuxuryApartments_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ManhattanLuxuryApartments_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ManhattanLuxuryApartments_SharesWithdrawn_block
};

export type ManhattanLuxuryApartments_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<ManhattanLuxuryApartments_SharesWithdrawn_event,loaderContext>;

export type ManhattanLuxuryApartments_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<ManhattanLuxuryApartments_SharesWithdrawn_loaderArgs,loaderReturn>;

export type ManhattanLuxuryApartments_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ManhattanLuxuryApartments_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type ManhattanLuxuryApartments_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<ManhattanLuxuryApartments_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type ManhattanLuxuryApartments_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ManhattanLuxuryApartments_SharesWithdrawn_event,contractRegistrations>>;

export type ManhattanLuxuryApartments_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type ManhattanLuxuryApartments_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ManhattanLuxuryApartments_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ManhattanLuxuryApartments_SharesWithdrawn_eventFiltersDefinition = 
    ManhattanLuxuryApartments_SharesWithdrawn_eventFilter
  | ManhattanLuxuryApartments_SharesWithdrawn_eventFilter[];

export type ManhattanLuxuryApartments_SharesWithdrawn_eventFilters = 
    ManhattanLuxuryApartments_SharesWithdrawn_eventFilter
  | ManhattanLuxuryApartments_SharesWithdrawn_eventFilter[]
  | ((_1:ManhattanLuxuryApartments_SharesWithdrawn_eventFiltersArgs) => ManhattanLuxuryApartments_SharesWithdrawn_eventFiltersDefinition);

export type ManhattanLuxuryApartments_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type ManhattanLuxuryApartments_YieldDistributed_block = Block_t;

export type ManhattanLuxuryApartments_YieldDistributed_transaction = Transaction_t;

export type ManhattanLuxuryApartments_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ManhattanLuxuryApartments_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ManhattanLuxuryApartments_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ManhattanLuxuryApartments_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ManhattanLuxuryApartments_YieldDistributed_block
};

export type ManhattanLuxuryApartments_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<ManhattanLuxuryApartments_YieldDistributed_event,loaderContext>;

export type ManhattanLuxuryApartments_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<ManhattanLuxuryApartments_YieldDistributed_loaderArgs,loaderReturn>;

export type ManhattanLuxuryApartments_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ManhattanLuxuryApartments_YieldDistributed_event,handlerContext,loaderReturn>;

export type ManhattanLuxuryApartments_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<ManhattanLuxuryApartments_YieldDistributed_handlerArgs<loaderReturn>>;

export type ManhattanLuxuryApartments_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ManhattanLuxuryApartments_YieldDistributed_event,contractRegistrations>>;

export type ManhattanLuxuryApartments_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type ManhattanLuxuryApartments_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ManhattanLuxuryApartments_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ManhattanLuxuryApartments_YieldDistributed_eventFiltersDefinition = 
    ManhattanLuxuryApartments_YieldDistributed_eventFilter
  | ManhattanLuxuryApartments_YieldDistributed_eventFilter[];

export type ManhattanLuxuryApartments_YieldDistributed_eventFilters = 
    ManhattanLuxuryApartments_YieldDistributed_eventFilter
  | ManhattanLuxuryApartments_YieldDistributed_eventFilter[]
  | ((_1:ManhattanLuxuryApartments_YieldDistributed_eventFiltersArgs) => ManhattanLuxuryApartments_YieldDistributed_eventFiltersDefinition);

export type ManhattanLuxuryApartments_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type ManhattanLuxuryApartments_PropertyUpdated_block = Block_t;

export type ManhattanLuxuryApartments_PropertyUpdated_transaction = Transaction_t;

export type ManhattanLuxuryApartments_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ManhattanLuxuryApartments_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ManhattanLuxuryApartments_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ManhattanLuxuryApartments_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ManhattanLuxuryApartments_PropertyUpdated_block
};

export type ManhattanLuxuryApartments_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<ManhattanLuxuryApartments_PropertyUpdated_event,loaderContext>;

export type ManhattanLuxuryApartments_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<ManhattanLuxuryApartments_PropertyUpdated_loaderArgs,loaderReturn>;

export type ManhattanLuxuryApartments_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ManhattanLuxuryApartments_PropertyUpdated_event,handlerContext,loaderReturn>;

export type ManhattanLuxuryApartments_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<ManhattanLuxuryApartments_PropertyUpdated_handlerArgs<loaderReturn>>;

export type ManhattanLuxuryApartments_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ManhattanLuxuryApartments_PropertyUpdated_event,contractRegistrations>>;

export type ManhattanLuxuryApartments_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type ManhattanLuxuryApartments_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ManhattanLuxuryApartments_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ManhattanLuxuryApartments_PropertyUpdated_eventFiltersDefinition = 
    ManhattanLuxuryApartments_PropertyUpdated_eventFilter
  | ManhattanLuxuryApartments_PropertyUpdated_eventFilter[];

export type ManhattanLuxuryApartments_PropertyUpdated_eventFilters = 
    ManhattanLuxuryApartments_PropertyUpdated_eventFilter
  | ManhattanLuxuryApartments_PropertyUpdated_eventFilter[]
  | ((_1:ManhattanLuxuryApartments_PropertyUpdated_eventFiltersArgs) => ManhattanLuxuryApartments_PropertyUpdated_eventFiltersDefinition);

export type ManhattanLuxuryApartments_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type ManhattanLuxuryApartments_Transfer_block = Block_t;

export type ManhattanLuxuryApartments_Transfer_transaction = Transaction_t;

export type ManhattanLuxuryApartments_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: ManhattanLuxuryApartments_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: ManhattanLuxuryApartments_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: ManhattanLuxuryApartments_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: ManhattanLuxuryApartments_Transfer_block
};

export type ManhattanLuxuryApartments_Transfer_loaderArgs = Internal_genericLoaderArgs<ManhattanLuxuryApartments_Transfer_event,loaderContext>;

export type ManhattanLuxuryApartments_Transfer_loader<loaderReturn> = Internal_genericLoader<ManhattanLuxuryApartments_Transfer_loaderArgs,loaderReturn>;

export type ManhattanLuxuryApartments_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<ManhattanLuxuryApartments_Transfer_event,handlerContext,loaderReturn>;

export type ManhattanLuxuryApartments_Transfer_handler<loaderReturn> = Internal_genericHandler<ManhattanLuxuryApartments_Transfer_handlerArgs<loaderReturn>>;

export type ManhattanLuxuryApartments_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<ManhattanLuxuryApartments_Transfer_event,contractRegistrations>>;

export type ManhattanLuxuryApartments_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type ManhattanLuxuryApartments_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: ManhattanLuxuryApartments_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type ManhattanLuxuryApartments_Transfer_eventFiltersDefinition = 
    ManhattanLuxuryApartments_Transfer_eventFilter
  | ManhattanLuxuryApartments_Transfer_eventFilter[];

export type ManhattanLuxuryApartments_Transfer_eventFilters = 
    ManhattanLuxuryApartments_Transfer_eventFilter
  | ManhattanLuxuryApartments_Transfer_eventFilter[]
  | ((_1:ManhattanLuxuryApartments_Transfer_eventFiltersArgs) => ManhattanLuxuryApartments_Transfer_eventFiltersDefinition);

export type MiamiBeachCondos_chainId = 84532;

export type MiamiBeachCondos_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type MiamiBeachCondos_SharesPurchased_block = Block_t;

export type MiamiBeachCondos_SharesPurchased_transaction = Transaction_t;

export type MiamiBeachCondos_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: MiamiBeachCondos_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: MiamiBeachCondos_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: MiamiBeachCondos_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: MiamiBeachCondos_SharesPurchased_block
};

export type MiamiBeachCondos_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<MiamiBeachCondos_SharesPurchased_event,loaderContext>;

export type MiamiBeachCondos_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<MiamiBeachCondos_SharesPurchased_loaderArgs,loaderReturn>;

export type MiamiBeachCondos_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<MiamiBeachCondos_SharesPurchased_event,handlerContext,loaderReturn>;

export type MiamiBeachCondos_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<MiamiBeachCondos_SharesPurchased_handlerArgs<loaderReturn>>;

export type MiamiBeachCondos_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<MiamiBeachCondos_SharesPurchased_event,contractRegistrations>>;

export type MiamiBeachCondos_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type MiamiBeachCondos_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: MiamiBeachCondos_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type MiamiBeachCondos_SharesPurchased_eventFiltersDefinition = 
    MiamiBeachCondos_SharesPurchased_eventFilter
  | MiamiBeachCondos_SharesPurchased_eventFilter[];

export type MiamiBeachCondos_SharesPurchased_eventFilters = 
    MiamiBeachCondos_SharesPurchased_eventFilter
  | MiamiBeachCondos_SharesPurchased_eventFilter[]
  | ((_1:MiamiBeachCondos_SharesPurchased_eventFiltersArgs) => MiamiBeachCondos_SharesPurchased_eventFiltersDefinition);

export type MiamiBeachCondos_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type MiamiBeachCondos_SharesWithdrawn_block = Block_t;

export type MiamiBeachCondos_SharesWithdrawn_transaction = Transaction_t;

export type MiamiBeachCondos_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: MiamiBeachCondos_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: MiamiBeachCondos_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: MiamiBeachCondos_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: MiamiBeachCondos_SharesWithdrawn_block
};

export type MiamiBeachCondos_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<MiamiBeachCondos_SharesWithdrawn_event,loaderContext>;

export type MiamiBeachCondos_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<MiamiBeachCondos_SharesWithdrawn_loaderArgs,loaderReturn>;

export type MiamiBeachCondos_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<MiamiBeachCondos_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type MiamiBeachCondos_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<MiamiBeachCondos_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type MiamiBeachCondos_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<MiamiBeachCondos_SharesWithdrawn_event,contractRegistrations>>;

export type MiamiBeachCondos_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type MiamiBeachCondos_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: MiamiBeachCondos_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type MiamiBeachCondos_SharesWithdrawn_eventFiltersDefinition = 
    MiamiBeachCondos_SharesWithdrawn_eventFilter
  | MiamiBeachCondos_SharesWithdrawn_eventFilter[];

export type MiamiBeachCondos_SharesWithdrawn_eventFilters = 
    MiamiBeachCondos_SharesWithdrawn_eventFilter
  | MiamiBeachCondos_SharesWithdrawn_eventFilter[]
  | ((_1:MiamiBeachCondos_SharesWithdrawn_eventFiltersArgs) => MiamiBeachCondos_SharesWithdrawn_eventFiltersDefinition);

export type MiamiBeachCondos_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type MiamiBeachCondos_YieldDistributed_block = Block_t;

export type MiamiBeachCondos_YieldDistributed_transaction = Transaction_t;

export type MiamiBeachCondos_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: MiamiBeachCondos_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: MiamiBeachCondos_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: MiamiBeachCondos_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: MiamiBeachCondos_YieldDistributed_block
};

export type MiamiBeachCondos_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<MiamiBeachCondos_YieldDistributed_event,loaderContext>;

export type MiamiBeachCondos_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<MiamiBeachCondos_YieldDistributed_loaderArgs,loaderReturn>;

export type MiamiBeachCondos_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<MiamiBeachCondos_YieldDistributed_event,handlerContext,loaderReturn>;

export type MiamiBeachCondos_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<MiamiBeachCondos_YieldDistributed_handlerArgs<loaderReturn>>;

export type MiamiBeachCondos_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<MiamiBeachCondos_YieldDistributed_event,contractRegistrations>>;

export type MiamiBeachCondos_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type MiamiBeachCondos_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: MiamiBeachCondos_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type MiamiBeachCondos_YieldDistributed_eventFiltersDefinition = 
    MiamiBeachCondos_YieldDistributed_eventFilter
  | MiamiBeachCondos_YieldDistributed_eventFilter[];

export type MiamiBeachCondos_YieldDistributed_eventFilters = 
    MiamiBeachCondos_YieldDistributed_eventFilter
  | MiamiBeachCondos_YieldDistributed_eventFilter[]
  | ((_1:MiamiBeachCondos_YieldDistributed_eventFiltersArgs) => MiamiBeachCondos_YieldDistributed_eventFiltersDefinition);

export type MiamiBeachCondos_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type MiamiBeachCondos_PropertyUpdated_block = Block_t;

export type MiamiBeachCondos_PropertyUpdated_transaction = Transaction_t;

export type MiamiBeachCondos_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: MiamiBeachCondos_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: MiamiBeachCondos_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: MiamiBeachCondos_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: MiamiBeachCondos_PropertyUpdated_block
};

export type MiamiBeachCondos_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<MiamiBeachCondos_PropertyUpdated_event,loaderContext>;

export type MiamiBeachCondos_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<MiamiBeachCondos_PropertyUpdated_loaderArgs,loaderReturn>;

export type MiamiBeachCondos_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<MiamiBeachCondos_PropertyUpdated_event,handlerContext,loaderReturn>;

export type MiamiBeachCondos_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<MiamiBeachCondos_PropertyUpdated_handlerArgs<loaderReturn>>;

export type MiamiBeachCondos_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<MiamiBeachCondos_PropertyUpdated_event,contractRegistrations>>;

export type MiamiBeachCondos_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type MiamiBeachCondos_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: MiamiBeachCondos_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type MiamiBeachCondos_PropertyUpdated_eventFiltersDefinition = 
    MiamiBeachCondos_PropertyUpdated_eventFilter
  | MiamiBeachCondos_PropertyUpdated_eventFilter[];

export type MiamiBeachCondos_PropertyUpdated_eventFilters = 
    MiamiBeachCondos_PropertyUpdated_eventFilter
  | MiamiBeachCondos_PropertyUpdated_eventFilter[]
  | ((_1:MiamiBeachCondos_PropertyUpdated_eventFiltersArgs) => MiamiBeachCondos_PropertyUpdated_eventFiltersDefinition);

export type MiamiBeachCondos_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type MiamiBeachCondos_Transfer_block = Block_t;

export type MiamiBeachCondos_Transfer_transaction = Transaction_t;

export type MiamiBeachCondos_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: MiamiBeachCondos_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: MiamiBeachCondos_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: MiamiBeachCondos_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: MiamiBeachCondos_Transfer_block
};

export type MiamiBeachCondos_Transfer_loaderArgs = Internal_genericLoaderArgs<MiamiBeachCondos_Transfer_event,loaderContext>;

export type MiamiBeachCondos_Transfer_loader<loaderReturn> = Internal_genericLoader<MiamiBeachCondos_Transfer_loaderArgs,loaderReturn>;

export type MiamiBeachCondos_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<MiamiBeachCondos_Transfer_event,handlerContext,loaderReturn>;

export type MiamiBeachCondos_Transfer_handler<loaderReturn> = Internal_genericHandler<MiamiBeachCondos_Transfer_handlerArgs<loaderReturn>>;

export type MiamiBeachCondos_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<MiamiBeachCondos_Transfer_event,contractRegistrations>>;

export type MiamiBeachCondos_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type MiamiBeachCondos_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: MiamiBeachCondos_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type MiamiBeachCondos_Transfer_eventFiltersDefinition = 
    MiamiBeachCondos_Transfer_eventFilter
  | MiamiBeachCondos_Transfer_eventFilter[];

export type MiamiBeachCondos_Transfer_eventFilters = 
    MiamiBeachCondos_Transfer_eventFilter
  | MiamiBeachCondos_Transfer_eventFilter[]
  | ((_1:MiamiBeachCondos_Transfer_eventFiltersArgs) => MiamiBeachCondos_Transfer_eventFiltersDefinition);

export type NashvilleMusicDistrict_chainId = 84532;

export type NashvilleMusicDistrict_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type NashvilleMusicDistrict_SharesPurchased_block = Block_t;

export type NashvilleMusicDistrict_SharesPurchased_transaction = Transaction_t;

export type NashvilleMusicDistrict_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: NashvilleMusicDistrict_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: NashvilleMusicDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: NashvilleMusicDistrict_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: NashvilleMusicDistrict_SharesPurchased_block
};

export type NashvilleMusicDistrict_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<NashvilleMusicDistrict_SharesPurchased_event,loaderContext>;

export type NashvilleMusicDistrict_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<NashvilleMusicDistrict_SharesPurchased_loaderArgs,loaderReturn>;

export type NashvilleMusicDistrict_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<NashvilleMusicDistrict_SharesPurchased_event,handlerContext,loaderReturn>;

export type NashvilleMusicDistrict_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<NashvilleMusicDistrict_SharesPurchased_handlerArgs<loaderReturn>>;

export type NashvilleMusicDistrict_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<NashvilleMusicDistrict_SharesPurchased_event,contractRegistrations>>;

export type NashvilleMusicDistrict_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type NashvilleMusicDistrict_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: NashvilleMusicDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type NashvilleMusicDistrict_SharesPurchased_eventFiltersDefinition = 
    NashvilleMusicDistrict_SharesPurchased_eventFilter
  | NashvilleMusicDistrict_SharesPurchased_eventFilter[];

export type NashvilleMusicDistrict_SharesPurchased_eventFilters = 
    NashvilleMusicDistrict_SharesPurchased_eventFilter
  | NashvilleMusicDistrict_SharesPurchased_eventFilter[]
  | ((_1:NashvilleMusicDistrict_SharesPurchased_eventFiltersArgs) => NashvilleMusicDistrict_SharesPurchased_eventFiltersDefinition);

export type NashvilleMusicDistrict_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type NashvilleMusicDistrict_SharesWithdrawn_block = Block_t;

export type NashvilleMusicDistrict_SharesWithdrawn_transaction = Transaction_t;

export type NashvilleMusicDistrict_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: NashvilleMusicDistrict_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: NashvilleMusicDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: NashvilleMusicDistrict_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: NashvilleMusicDistrict_SharesWithdrawn_block
};

export type NashvilleMusicDistrict_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<NashvilleMusicDistrict_SharesWithdrawn_event,loaderContext>;

export type NashvilleMusicDistrict_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<NashvilleMusicDistrict_SharesWithdrawn_loaderArgs,loaderReturn>;

export type NashvilleMusicDistrict_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<NashvilleMusicDistrict_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type NashvilleMusicDistrict_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<NashvilleMusicDistrict_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type NashvilleMusicDistrict_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<NashvilleMusicDistrict_SharesWithdrawn_event,contractRegistrations>>;

export type NashvilleMusicDistrict_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type NashvilleMusicDistrict_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: NashvilleMusicDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type NashvilleMusicDistrict_SharesWithdrawn_eventFiltersDefinition = 
    NashvilleMusicDistrict_SharesWithdrawn_eventFilter
  | NashvilleMusicDistrict_SharesWithdrawn_eventFilter[];

export type NashvilleMusicDistrict_SharesWithdrawn_eventFilters = 
    NashvilleMusicDistrict_SharesWithdrawn_eventFilter
  | NashvilleMusicDistrict_SharesWithdrawn_eventFilter[]
  | ((_1:NashvilleMusicDistrict_SharesWithdrawn_eventFiltersArgs) => NashvilleMusicDistrict_SharesWithdrawn_eventFiltersDefinition);

export type NashvilleMusicDistrict_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type NashvilleMusicDistrict_YieldDistributed_block = Block_t;

export type NashvilleMusicDistrict_YieldDistributed_transaction = Transaction_t;

export type NashvilleMusicDistrict_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: NashvilleMusicDistrict_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: NashvilleMusicDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: NashvilleMusicDistrict_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: NashvilleMusicDistrict_YieldDistributed_block
};

export type NashvilleMusicDistrict_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<NashvilleMusicDistrict_YieldDistributed_event,loaderContext>;

export type NashvilleMusicDistrict_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<NashvilleMusicDistrict_YieldDistributed_loaderArgs,loaderReturn>;

export type NashvilleMusicDistrict_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<NashvilleMusicDistrict_YieldDistributed_event,handlerContext,loaderReturn>;

export type NashvilleMusicDistrict_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<NashvilleMusicDistrict_YieldDistributed_handlerArgs<loaderReturn>>;

export type NashvilleMusicDistrict_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<NashvilleMusicDistrict_YieldDistributed_event,contractRegistrations>>;

export type NashvilleMusicDistrict_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type NashvilleMusicDistrict_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: NashvilleMusicDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type NashvilleMusicDistrict_YieldDistributed_eventFiltersDefinition = 
    NashvilleMusicDistrict_YieldDistributed_eventFilter
  | NashvilleMusicDistrict_YieldDistributed_eventFilter[];

export type NashvilleMusicDistrict_YieldDistributed_eventFilters = 
    NashvilleMusicDistrict_YieldDistributed_eventFilter
  | NashvilleMusicDistrict_YieldDistributed_eventFilter[]
  | ((_1:NashvilleMusicDistrict_YieldDistributed_eventFiltersArgs) => NashvilleMusicDistrict_YieldDistributed_eventFiltersDefinition);

export type NashvilleMusicDistrict_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type NashvilleMusicDistrict_PropertyUpdated_block = Block_t;

export type NashvilleMusicDistrict_PropertyUpdated_transaction = Transaction_t;

export type NashvilleMusicDistrict_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: NashvilleMusicDistrict_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: NashvilleMusicDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: NashvilleMusicDistrict_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: NashvilleMusicDistrict_PropertyUpdated_block
};

export type NashvilleMusicDistrict_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<NashvilleMusicDistrict_PropertyUpdated_event,loaderContext>;

export type NashvilleMusicDistrict_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<NashvilleMusicDistrict_PropertyUpdated_loaderArgs,loaderReturn>;

export type NashvilleMusicDistrict_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<NashvilleMusicDistrict_PropertyUpdated_event,handlerContext,loaderReturn>;

export type NashvilleMusicDistrict_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<NashvilleMusicDistrict_PropertyUpdated_handlerArgs<loaderReturn>>;

export type NashvilleMusicDistrict_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<NashvilleMusicDistrict_PropertyUpdated_event,contractRegistrations>>;

export type NashvilleMusicDistrict_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type NashvilleMusicDistrict_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: NashvilleMusicDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type NashvilleMusicDistrict_PropertyUpdated_eventFiltersDefinition = 
    NashvilleMusicDistrict_PropertyUpdated_eventFilter
  | NashvilleMusicDistrict_PropertyUpdated_eventFilter[];

export type NashvilleMusicDistrict_PropertyUpdated_eventFilters = 
    NashvilleMusicDistrict_PropertyUpdated_eventFilter
  | NashvilleMusicDistrict_PropertyUpdated_eventFilter[]
  | ((_1:NashvilleMusicDistrict_PropertyUpdated_eventFiltersArgs) => NashvilleMusicDistrict_PropertyUpdated_eventFiltersDefinition);

export type NashvilleMusicDistrict_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type NashvilleMusicDistrict_Transfer_block = Block_t;

export type NashvilleMusicDistrict_Transfer_transaction = Transaction_t;

export type NashvilleMusicDistrict_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: NashvilleMusicDistrict_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: NashvilleMusicDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: NashvilleMusicDistrict_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: NashvilleMusicDistrict_Transfer_block
};

export type NashvilleMusicDistrict_Transfer_loaderArgs = Internal_genericLoaderArgs<NashvilleMusicDistrict_Transfer_event,loaderContext>;

export type NashvilleMusicDistrict_Transfer_loader<loaderReturn> = Internal_genericLoader<NashvilleMusicDistrict_Transfer_loaderArgs,loaderReturn>;

export type NashvilleMusicDistrict_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<NashvilleMusicDistrict_Transfer_event,handlerContext,loaderReturn>;

export type NashvilleMusicDistrict_Transfer_handler<loaderReturn> = Internal_genericHandler<NashvilleMusicDistrict_Transfer_handlerArgs<loaderReturn>>;

export type NashvilleMusicDistrict_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<NashvilleMusicDistrict_Transfer_event,contractRegistrations>>;

export type NashvilleMusicDistrict_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type NashvilleMusicDistrict_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: NashvilleMusicDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type NashvilleMusicDistrict_Transfer_eventFiltersDefinition = 
    NashvilleMusicDistrict_Transfer_eventFilter
  | NashvilleMusicDistrict_Transfer_eventFilter[];

export type NashvilleMusicDistrict_Transfer_eventFilters = 
    NashvilleMusicDistrict_Transfer_eventFilter
  | NashvilleMusicDistrict_Transfer_eventFilter[]
  | ((_1:NashvilleMusicDistrict_Transfer_eventFiltersArgs) => NashvilleMusicDistrict_Transfer_eventFiltersDefinition);

export type PhoenixRetailPlaza_chainId = 84532;

export type PhoenixRetailPlaza_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type PhoenixRetailPlaza_SharesPurchased_block = Block_t;

export type PhoenixRetailPlaza_SharesPurchased_transaction = Transaction_t;

export type PhoenixRetailPlaza_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: PhoenixRetailPlaza_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: PhoenixRetailPlaza_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: PhoenixRetailPlaza_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: PhoenixRetailPlaza_SharesPurchased_block
};

export type PhoenixRetailPlaza_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<PhoenixRetailPlaza_SharesPurchased_event,loaderContext>;

export type PhoenixRetailPlaza_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<PhoenixRetailPlaza_SharesPurchased_loaderArgs,loaderReturn>;

export type PhoenixRetailPlaza_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<PhoenixRetailPlaza_SharesPurchased_event,handlerContext,loaderReturn>;

export type PhoenixRetailPlaza_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<PhoenixRetailPlaza_SharesPurchased_handlerArgs<loaderReturn>>;

export type PhoenixRetailPlaza_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<PhoenixRetailPlaza_SharesPurchased_event,contractRegistrations>>;

export type PhoenixRetailPlaza_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type PhoenixRetailPlaza_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: PhoenixRetailPlaza_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type PhoenixRetailPlaza_SharesPurchased_eventFiltersDefinition = 
    PhoenixRetailPlaza_SharesPurchased_eventFilter
  | PhoenixRetailPlaza_SharesPurchased_eventFilter[];

export type PhoenixRetailPlaza_SharesPurchased_eventFilters = 
    PhoenixRetailPlaza_SharesPurchased_eventFilter
  | PhoenixRetailPlaza_SharesPurchased_eventFilter[]
  | ((_1:PhoenixRetailPlaza_SharesPurchased_eventFiltersArgs) => PhoenixRetailPlaza_SharesPurchased_eventFiltersDefinition);

export type PhoenixRetailPlaza_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type PhoenixRetailPlaza_SharesWithdrawn_block = Block_t;

export type PhoenixRetailPlaza_SharesWithdrawn_transaction = Transaction_t;

export type PhoenixRetailPlaza_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: PhoenixRetailPlaza_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: PhoenixRetailPlaza_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: PhoenixRetailPlaza_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: PhoenixRetailPlaza_SharesWithdrawn_block
};

export type PhoenixRetailPlaza_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<PhoenixRetailPlaza_SharesWithdrawn_event,loaderContext>;

export type PhoenixRetailPlaza_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<PhoenixRetailPlaza_SharesWithdrawn_loaderArgs,loaderReturn>;

export type PhoenixRetailPlaza_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<PhoenixRetailPlaza_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type PhoenixRetailPlaza_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<PhoenixRetailPlaza_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type PhoenixRetailPlaza_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<PhoenixRetailPlaza_SharesWithdrawn_event,contractRegistrations>>;

export type PhoenixRetailPlaza_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type PhoenixRetailPlaza_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: PhoenixRetailPlaza_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type PhoenixRetailPlaza_SharesWithdrawn_eventFiltersDefinition = 
    PhoenixRetailPlaza_SharesWithdrawn_eventFilter
  | PhoenixRetailPlaza_SharesWithdrawn_eventFilter[];

export type PhoenixRetailPlaza_SharesWithdrawn_eventFilters = 
    PhoenixRetailPlaza_SharesWithdrawn_eventFilter
  | PhoenixRetailPlaza_SharesWithdrawn_eventFilter[]
  | ((_1:PhoenixRetailPlaza_SharesWithdrawn_eventFiltersArgs) => PhoenixRetailPlaza_SharesWithdrawn_eventFiltersDefinition);

export type PhoenixRetailPlaza_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type PhoenixRetailPlaza_YieldDistributed_block = Block_t;

export type PhoenixRetailPlaza_YieldDistributed_transaction = Transaction_t;

export type PhoenixRetailPlaza_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: PhoenixRetailPlaza_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: PhoenixRetailPlaza_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: PhoenixRetailPlaza_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: PhoenixRetailPlaza_YieldDistributed_block
};

export type PhoenixRetailPlaza_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<PhoenixRetailPlaza_YieldDistributed_event,loaderContext>;

export type PhoenixRetailPlaza_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<PhoenixRetailPlaza_YieldDistributed_loaderArgs,loaderReturn>;

export type PhoenixRetailPlaza_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<PhoenixRetailPlaza_YieldDistributed_event,handlerContext,loaderReturn>;

export type PhoenixRetailPlaza_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<PhoenixRetailPlaza_YieldDistributed_handlerArgs<loaderReturn>>;

export type PhoenixRetailPlaza_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<PhoenixRetailPlaza_YieldDistributed_event,contractRegistrations>>;

export type PhoenixRetailPlaza_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type PhoenixRetailPlaza_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: PhoenixRetailPlaza_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type PhoenixRetailPlaza_YieldDistributed_eventFiltersDefinition = 
    PhoenixRetailPlaza_YieldDistributed_eventFilter
  | PhoenixRetailPlaza_YieldDistributed_eventFilter[];

export type PhoenixRetailPlaza_YieldDistributed_eventFilters = 
    PhoenixRetailPlaza_YieldDistributed_eventFilter
  | PhoenixRetailPlaza_YieldDistributed_eventFilter[]
  | ((_1:PhoenixRetailPlaza_YieldDistributed_eventFiltersArgs) => PhoenixRetailPlaza_YieldDistributed_eventFiltersDefinition);

export type PhoenixRetailPlaza_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type PhoenixRetailPlaza_PropertyUpdated_block = Block_t;

export type PhoenixRetailPlaza_PropertyUpdated_transaction = Transaction_t;

export type PhoenixRetailPlaza_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: PhoenixRetailPlaza_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: PhoenixRetailPlaza_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: PhoenixRetailPlaza_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: PhoenixRetailPlaza_PropertyUpdated_block
};

export type PhoenixRetailPlaza_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<PhoenixRetailPlaza_PropertyUpdated_event,loaderContext>;

export type PhoenixRetailPlaza_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<PhoenixRetailPlaza_PropertyUpdated_loaderArgs,loaderReturn>;

export type PhoenixRetailPlaza_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<PhoenixRetailPlaza_PropertyUpdated_event,handlerContext,loaderReturn>;

export type PhoenixRetailPlaza_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<PhoenixRetailPlaza_PropertyUpdated_handlerArgs<loaderReturn>>;

export type PhoenixRetailPlaza_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<PhoenixRetailPlaza_PropertyUpdated_event,contractRegistrations>>;

export type PhoenixRetailPlaza_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type PhoenixRetailPlaza_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: PhoenixRetailPlaza_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type PhoenixRetailPlaza_PropertyUpdated_eventFiltersDefinition = 
    PhoenixRetailPlaza_PropertyUpdated_eventFilter
  | PhoenixRetailPlaza_PropertyUpdated_eventFilter[];

export type PhoenixRetailPlaza_PropertyUpdated_eventFilters = 
    PhoenixRetailPlaza_PropertyUpdated_eventFilter
  | PhoenixRetailPlaza_PropertyUpdated_eventFilter[]
  | ((_1:PhoenixRetailPlaza_PropertyUpdated_eventFiltersArgs) => PhoenixRetailPlaza_PropertyUpdated_eventFiltersDefinition);

export type PhoenixRetailPlaza_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type PhoenixRetailPlaza_Transfer_block = Block_t;

export type PhoenixRetailPlaza_Transfer_transaction = Transaction_t;

export type PhoenixRetailPlaza_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: PhoenixRetailPlaza_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: PhoenixRetailPlaza_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: PhoenixRetailPlaza_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: PhoenixRetailPlaza_Transfer_block
};

export type PhoenixRetailPlaza_Transfer_loaderArgs = Internal_genericLoaderArgs<PhoenixRetailPlaza_Transfer_event,loaderContext>;

export type PhoenixRetailPlaza_Transfer_loader<loaderReturn> = Internal_genericLoader<PhoenixRetailPlaza_Transfer_loaderArgs,loaderReturn>;

export type PhoenixRetailPlaza_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<PhoenixRetailPlaza_Transfer_event,handlerContext,loaderReturn>;

export type PhoenixRetailPlaza_Transfer_handler<loaderReturn> = Internal_genericHandler<PhoenixRetailPlaza_Transfer_handlerArgs<loaderReturn>>;

export type PhoenixRetailPlaza_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<PhoenixRetailPlaza_Transfer_event,contractRegistrations>>;

export type PhoenixRetailPlaza_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type PhoenixRetailPlaza_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: PhoenixRetailPlaza_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type PhoenixRetailPlaza_Transfer_eventFiltersDefinition = 
    PhoenixRetailPlaza_Transfer_eventFilter
  | PhoenixRetailPlaza_Transfer_eventFilter[];

export type PhoenixRetailPlaza_Transfer_eventFilters = 
    PhoenixRetailPlaza_Transfer_eventFilter
  | PhoenixRetailPlaza_Transfer_eventFilter[]
  | ((_1:PhoenixRetailPlaza_Transfer_eventFiltersArgs) => PhoenixRetailPlaza_Transfer_eventFiltersDefinition);

export type SeattleWarehouseDistrict_chainId = 84532;

export type SeattleWarehouseDistrict_SharesPurchased_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type SeattleWarehouseDistrict_SharesPurchased_block = Block_t;

export type SeattleWarehouseDistrict_SharesPurchased_transaction = Transaction_t;

export type SeattleWarehouseDistrict_SharesPurchased_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: SeattleWarehouseDistrict_SharesPurchased_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: SeattleWarehouseDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: SeattleWarehouseDistrict_SharesPurchased_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: SeattleWarehouseDistrict_SharesPurchased_block
};

export type SeattleWarehouseDistrict_SharesPurchased_loaderArgs = Internal_genericLoaderArgs<SeattleWarehouseDistrict_SharesPurchased_event,loaderContext>;

export type SeattleWarehouseDistrict_SharesPurchased_loader<loaderReturn> = Internal_genericLoader<SeattleWarehouseDistrict_SharesPurchased_loaderArgs,loaderReturn>;

export type SeattleWarehouseDistrict_SharesPurchased_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<SeattleWarehouseDistrict_SharesPurchased_event,handlerContext,loaderReturn>;

export type SeattleWarehouseDistrict_SharesPurchased_handler<loaderReturn> = Internal_genericHandler<SeattleWarehouseDistrict_SharesPurchased_handlerArgs<loaderReturn>>;

export type SeattleWarehouseDistrict_SharesPurchased_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<SeattleWarehouseDistrict_SharesPurchased_event,contractRegistrations>>;

export type SeattleWarehouseDistrict_SharesPurchased_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type SeattleWarehouseDistrict_SharesPurchased_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: SeattleWarehouseDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type SeattleWarehouseDistrict_SharesPurchased_eventFiltersDefinition = 
    SeattleWarehouseDistrict_SharesPurchased_eventFilter
  | SeattleWarehouseDistrict_SharesPurchased_eventFilter[];

export type SeattleWarehouseDistrict_SharesPurchased_eventFilters = 
    SeattleWarehouseDistrict_SharesPurchased_eventFilter
  | SeattleWarehouseDistrict_SharesPurchased_eventFilter[]
  | ((_1:SeattleWarehouseDistrict_SharesPurchased_eventFiltersArgs) => SeattleWarehouseDistrict_SharesPurchased_eventFiltersDefinition);

export type SeattleWarehouseDistrict_SharesWithdrawn_eventArgs = {
  readonly investor: Address_t; 
  readonly shares: bigint; 
  readonly amount: bigint
};

export type SeattleWarehouseDistrict_SharesWithdrawn_block = Block_t;

export type SeattleWarehouseDistrict_SharesWithdrawn_transaction = Transaction_t;

export type SeattleWarehouseDistrict_SharesWithdrawn_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: SeattleWarehouseDistrict_SharesWithdrawn_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: SeattleWarehouseDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: SeattleWarehouseDistrict_SharesWithdrawn_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: SeattleWarehouseDistrict_SharesWithdrawn_block
};

export type SeattleWarehouseDistrict_SharesWithdrawn_loaderArgs = Internal_genericLoaderArgs<SeattleWarehouseDistrict_SharesWithdrawn_event,loaderContext>;

export type SeattleWarehouseDistrict_SharesWithdrawn_loader<loaderReturn> = Internal_genericLoader<SeattleWarehouseDistrict_SharesWithdrawn_loaderArgs,loaderReturn>;

export type SeattleWarehouseDistrict_SharesWithdrawn_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<SeattleWarehouseDistrict_SharesWithdrawn_event,handlerContext,loaderReturn>;

export type SeattleWarehouseDistrict_SharesWithdrawn_handler<loaderReturn> = Internal_genericHandler<SeattleWarehouseDistrict_SharesWithdrawn_handlerArgs<loaderReturn>>;

export type SeattleWarehouseDistrict_SharesWithdrawn_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<SeattleWarehouseDistrict_SharesWithdrawn_event,contractRegistrations>>;

export type SeattleWarehouseDistrict_SharesWithdrawn_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type SeattleWarehouseDistrict_SharesWithdrawn_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: SeattleWarehouseDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type SeattleWarehouseDistrict_SharesWithdrawn_eventFiltersDefinition = 
    SeattleWarehouseDistrict_SharesWithdrawn_eventFilter
  | SeattleWarehouseDistrict_SharesWithdrawn_eventFilter[];

export type SeattleWarehouseDistrict_SharesWithdrawn_eventFilters = 
    SeattleWarehouseDistrict_SharesWithdrawn_eventFilter
  | SeattleWarehouseDistrict_SharesWithdrawn_eventFilter[]
  | ((_1:SeattleWarehouseDistrict_SharesWithdrawn_eventFiltersArgs) => SeattleWarehouseDistrict_SharesWithdrawn_eventFiltersDefinition);

export type SeattleWarehouseDistrict_YieldDistributed_eventArgs = { readonly investor: Address_t; readonly amount: bigint };

export type SeattleWarehouseDistrict_YieldDistributed_block = Block_t;

export type SeattleWarehouseDistrict_YieldDistributed_transaction = Transaction_t;

export type SeattleWarehouseDistrict_YieldDistributed_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: SeattleWarehouseDistrict_YieldDistributed_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: SeattleWarehouseDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: SeattleWarehouseDistrict_YieldDistributed_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: SeattleWarehouseDistrict_YieldDistributed_block
};

export type SeattleWarehouseDistrict_YieldDistributed_loaderArgs = Internal_genericLoaderArgs<SeattleWarehouseDistrict_YieldDistributed_event,loaderContext>;

export type SeattleWarehouseDistrict_YieldDistributed_loader<loaderReturn> = Internal_genericLoader<SeattleWarehouseDistrict_YieldDistributed_loaderArgs,loaderReturn>;

export type SeattleWarehouseDistrict_YieldDistributed_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<SeattleWarehouseDistrict_YieldDistributed_event,handlerContext,loaderReturn>;

export type SeattleWarehouseDistrict_YieldDistributed_handler<loaderReturn> = Internal_genericHandler<SeattleWarehouseDistrict_YieldDistributed_handlerArgs<loaderReturn>>;

export type SeattleWarehouseDistrict_YieldDistributed_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<SeattleWarehouseDistrict_YieldDistributed_event,contractRegistrations>>;

export type SeattleWarehouseDistrict_YieldDistributed_eventFilter = { readonly investor?: SingleOrMultiple_t<Address_t> };

export type SeattleWarehouseDistrict_YieldDistributed_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: SeattleWarehouseDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type SeattleWarehouseDistrict_YieldDistributed_eventFiltersDefinition = 
    SeattleWarehouseDistrict_YieldDistributed_eventFilter
  | SeattleWarehouseDistrict_YieldDistributed_eventFilter[];

export type SeattleWarehouseDistrict_YieldDistributed_eventFilters = 
    SeattleWarehouseDistrict_YieldDistributed_eventFilter
  | SeattleWarehouseDistrict_YieldDistributed_eventFilter[]
  | ((_1:SeattleWarehouseDistrict_YieldDistributed_eventFiltersArgs) => SeattleWarehouseDistrict_YieldDistributed_eventFiltersDefinition);

export type SeattleWarehouseDistrict_PropertyUpdated_eventArgs = {
  readonly propertyId: bigint; 
  readonly name: string; 
  readonly pricePerShare: bigint
};

export type SeattleWarehouseDistrict_PropertyUpdated_block = Block_t;

export type SeattleWarehouseDistrict_PropertyUpdated_transaction = Transaction_t;

export type SeattleWarehouseDistrict_PropertyUpdated_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: SeattleWarehouseDistrict_PropertyUpdated_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: SeattleWarehouseDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: SeattleWarehouseDistrict_PropertyUpdated_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: SeattleWarehouseDistrict_PropertyUpdated_block
};

export type SeattleWarehouseDistrict_PropertyUpdated_loaderArgs = Internal_genericLoaderArgs<SeattleWarehouseDistrict_PropertyUpdated_event,loaderContext>;

export type SeattleWarehouseDistrict_PropertyUpdated_loader<loaderReturn> = Internal_genericLoader<SeattleWarehouseDistrict_PropertyUpdated_loaderArgs,loaderReturn>;

export type SeattleWarehouseDistrict_PropertyUpdated_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<SeattleWarehouseDistrict_PropertyUpdated_event,handlerContext,loaderReturn>;

export type SeattleWarehouseDistrict_PropertyUpdated_handler<loaderReturn> = Internal_genericHandler<SeattleWarehouseDistrict_PropertyUpdated_handlerArgs<loaderReturn>>;

export type SeattleWarehouseDistrict_PropertyUpdated_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<SeattleWarehouseDistrict_PropertyUpdated_event,contractRegistrations>>;

export type SeattleWarehouseDistrict_PropertyUpdated_eventFilter = { readonly propertyId?: SingleOrMultiple_t<bigint> };

export type SeattleWarehouseDistrict_PropertyUpdated_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: SeattleWarehouseDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type SeattleWarehouseDistrict_PropertyUpdated_eventFiltersDefinition = 
    SeattleWarehouseDistrict_PropertyUpdated_eventFilter
  | SeattleWarehouseDistrict_PropertyUpdated_eventFilter[];

export type SeattleWarehouseDistrict_PropertyUpdated_eventFilters = 
    SeattleWarehouseDistrict_PropertyUpdated_eventFilter
  | SeattleWarehouseDistrict_PropertyUpdated_eventFilter[]
  | ((_1:SeattleWarehouseDistrict_PropertyUpdated_eventFiltersArgs) => SeattleWarehouseDistrict_PropertyUpdated_eventFiltersDefinition);

export type SeattleWarehouseDistrict_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type SeattleWarehouseDistrict_Transfer_block = Block_t;

export type SeattleWarehouseDistrict_Transfer_transaction = Transaction_t;

export type SeattleWarehouseDistrict_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: SeattleWarehouseDistrict_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: SeattleWarehouseDistrict_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: SeattleWarehouseDistrict_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: SeattleWarehouseDistrict_Transfer_block
};

export type SeattleWarehouseDistrict_Transfer_loaderArgs = Internal_genericLoaderArgs<SeattleWarehouseDistrict_Transfer_event,loaderContext>;

export type SeattleWarehouseDistrict_Transfer_loader<loaderReturn> = Internal_genericLoader<SeattleWarehouseDistrict_Transfer_loaderArgs,loaderReturn>;

export type SeattleWarehouseDistrict_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<SeattleWarehouseDistrict_Transfer_event,handlerContext,loaderReturn>;

export type SeattleWarehouseDistrict_Transfer_handler<loaderReturn> = Internal_genericHandler<SeattleWarehouseDistrict_Transfer_handlerArgs<loaderReturn>>;

export type SeattleWarehouseDistrict_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<SeattleWarehouseDistrict_Transfer_event,contractRegistrations>>;

export type SeattleWarehouseDistrict_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type SeattleWarehouseDistrict_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: SeattleWarehouseDistrict_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type SeattleWarehouseDistrict_Transfer_eventFiltersDefinition = 
    SeattleWarehouseDistrict_Transfer_eventFilter
  | SeattleWarehouseDistrict_Transfer_eventFilter[];

export type SeattleWarehouseDistrict_Transfer_eventFilters = 
    SeattleWarehouseDistrict_Transfer_eventFilter
  | SeattleWarehouseDistrict_Transfer_eventFilter[]
  | ((_1:SeattleWarehouseDistrict_Transfer_eventFiltersArgs) => SeattleWarehouseDistrict_Transfer_eventFiltersDefinition);

export type chainId = number;

export type chain = 84532;
