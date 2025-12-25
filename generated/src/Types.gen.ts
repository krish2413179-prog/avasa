/* TypeScript file generated from Types.res by genType. */

/* eslint-disable */
/* tslint:disable */

import type {HandlerContext as $$handlerContext} from './Types.ts';

import type {HandlerWithOptions as $$fnWithEventConfig} from './bindings/OpaqueTypes.ts';

import type {LoaderContext as $$loaderContext} from './Types.ts';

import type {SingleOrMultiple as $$SingleOrMultiple_t} from './bindings/OpaqueTypes';

import type {Transfer_t as Entities_Transfer_t} from '../src/db/Entities.gen';

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

export type contractRegistrations = { readonly log: Envio_logger; readonly addTestToken: (_1:Address_t) => void };

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

export type transfer = Entities_Transfer_t;
export type Transfer = transfer;

export type Transaction_t = {
  readonly hash: string; 
  readonly from: (undefined | Address_t); 
  readonly to: (undefined | Address_t); 
  readonly value: bigint
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

export type TestToken_chainId = 84532;

export type TestToken_Transfer_eventArgs = {
  readonly from: Address_t; 
  readonly to: Address_t; 
  readonly value: bigint
};

export type TestToken_Transfer_block = Block_t;

export type TestToken_Transfer_transaction = Transaction_t;

export type TestToken_Transfer_event = {
  /** The parameters or arguments associated with this event. */
  readonly params: TestToken_Transfer_eventArgs; 
  /** The unique identifier of the blockchain network where this event occurred. */
  readonly chainId: TestToken_chainId; 
  /** The address of the contract that emitted this event. */
  readonly srcAddress: Address_t; 
  /** The index of this event's log within the block. */
  readonly logIndex: number; 
  /** The transaction that triggered this event. Configurable in `config.yaml` via the `field_selection` option. */
  readonly transaction: TestToken_Transfer_transaction; 
  /** The block in which this event was recorded. Configurable in `config.yaml` via the `field_selection` option. */
  readonly block: TestToken_Transfer_block
};

export type TestToken_Transfer_loaderArgs = Internal_genericLoaderArgs<TestToken_Transfer_event,loaderContext>;

export type TestToken_Transfer_loader<loaderReturn> = Internal_genericLoader<TestToken_Transfer_loaderArgs,loaderReturn>;

export type TestToken_Transfer_handlerArgs<loaderReturn> = Internal_genericHandlerArgs<TestToken_Transfer_event,handlerContext,loaderReturn>;

export type TestToken_Transfer_handler<loaderReturn> = Internal_genericHandler<TestToken_Transfer_handlerArgs<loaderReturn>>;

export type TestToken_Transfer_contractRegister = Internal_genericContractRegister<Internal_genericContractRegisterArgs<TestToken_Transfer_event,contractRegistrations>>;

export type TestToken_Transfer_eventFilter = { readonly from?: SingleOrMultiple_t<Address_t>; readonly to?: SingleOrMultiple_t<Address_t> };

export type TestToken_Transfer_eventFiltersArgs = { 
/** The unique identifier of the blockchain network where this event occurred. */
readonly chainId: TestToken_chainId; 
/** Addresses of the contracts indexing the event. */
readonly addresses: Address_t[] };

export type TestToken_Transfer_eventFiltersDefinition = 
    TestToken_Transfer_eventFilter
  | TestToken_Transfer_eventFilter[];

export type TestToken_Transfer_eventFilters = 
    TestToken_Transfer_eventFilter
  | TestToken_Transfer_eventFilter[]
  | ((_1:TestToken_Transfer_eventFiltersArgs) => TestToken_Transfer_eventFiltersDefinition);

export type chainId = number;

export type chain = 84532;
