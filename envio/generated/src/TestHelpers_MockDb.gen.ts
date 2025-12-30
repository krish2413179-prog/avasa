/* TypeScript file generated from TestHelpers_MockDb.res by genType. */

/* eslint-disable */
/* tslint:disable */

const TestHelpers_MockDbJS = require('./TestHelpers_MockDb.res.js');

import type {AIRecommendation_t as Entities_AIRecommendation_t} from '../src/db/Entities.gen';

import type {DailyMetrics_t as Entities_DailyMetrics_t} from '../src/db/Entities.gen';

import type {DynamicContractRegistry_t as InternalTable_DynamicContractRegistry_t} from 'envio/src/db/InternalTable.gen';

import type {LendingTransaction_t as Entities_LendingTransaction_t} from '../src/db/Entities.gen';

import type {LivePortfolio_t as Entities_LivePortfolio_t} from '../src/db/Entities.gen';

import type {MarketTrend_t as Entities_MarketTrend_t} from '../src/db/Entities.gen';

import type {PropertyAnalytics_t as Entities_PropertyAnalytics_t} from '../src/db/Entities.gen';

import type {PropertyPerformance_t as Entities_PropertyPerformance_t} from '../src/db/Entities.gen';

import type {PropertyTransaction_t as Entities_PropertyTransaction_t} from '../src/db/Entities.gen';

import type {PropertyUpdate_t as Entities_PropertyUpdate_t} from '../src/db/Entities.gen';

import type {RawEvents_t as InternalTable_RawEvents_t} from 'envio/src/db/InternalTable.gen';

import type {StreamTransaction_t as Entities_StreamTransaction_t} from '../src/db/Entities.gen';

import type {SwapTransaction_t as Entities_SwapTransaction_t} from '../src/db/Entities.gen';

import type {TransferTransaction_t as Entities_TransferTransaction_t} from '../src/db/Entities.gen';

import type {UserAnalytics_t as Entities_UserAnalytics_t} from '../src/db/Entities.gen';

import type {UserPortfolio_t as Entities_UserPortfolio_t} from '../src/db/Entities.gen';

import type {UserPreferences_t as Entities_UserPreferences_t} from '../src/db/Entities.gen';

import type {YieldTransaction_t as Entities_YieldTransaction_t} from '../src/db/Entities.gen';

import type {eventLog as Types_eventLog} from './Types.gen';

import type {rawEventsKey as InMemoryStore_rawEventsKey} from 'envio/src/InMemoryStore.gen';

/** The mockDb type is simply an InMemoryStore internally. __dbInternal__ holds a reference
to an inMemoryStore and all the the accessor methods point to the reference of that inMemory
store */
export abstract class inMemoryStore { protected opaque!: any }; /* simulate opaque types */

export type t = {
  readonly __dbInternal__: inMemoryStore; 
  readonly entities: entities; 
  readonly rawEvents: storeOperations<InMemoryStore_rawEventsKey,InternalTable_RawEvents_t>; 
  readonly dynamicContractRegistry: entityStoreOperations<InternalTable_DynamicContractRegistry_t>; 
  readonly processEvents: (_1:Types_eventLog<unknown>[]) => Promise<t>
};

export type entities = {
  readonly AIRecommendation: entityStoreOperations<Entities_AIRecommendation_t>; 
  readonly DailyMetrics: entityStoreOperations<Entities_DailyMetrics_t>; 
  readonly LendingTransaction: entityStoreOperations<Entities_LendingTransaction_t>; 
  readonly LivePortfolio: entityStoreOperations<Entities_LivePortfolio_t>; 
  readonly MarketTrend: entityStoreOperations<Entities_MarketTrend_t>; 
  readonly PropertyAnalytics: entityStoreOperations<Entities_PropertyAnalytics_t>; 
  readonly PropertyPerformance: entityStoreOperations<Entities_PropertyPerformance_t>; 
  readonly PropertyTransaction: entityStoreOperations<Entities_PropertyTransaction_t>; 
  readonly PropertyUpdate: entityStoreOperations<Entities_PropertyUpdate_t>; 
  readonly StreamTransaction: entityStoreOperations<Entities_StreamTransaction_t>; 
  readonly SwapTransaction: entityStoreOperations<Entities_SwapTransaction_t>; 
  readonly TransferTransaction: entityStoreOperations<Entities_TransferTransaction_t>; 
  readonly UserAnalytics: entityStoreOperations<Entities_UserAnalytics_t>; 
  readonly UserPortfolio: entityStoreOperations<Entities_UserPortfolio_t>; 
  readonly UserPreferences: entityStoreOperations<Entities_UserPreferences_t>; 
  readonly YieldTransaction: entityStoreOperations<Entities_YieldTransaction_t>
};

export type entityStoreOperations<entity> = storeOperations<string,entity>;

export type storeOperations<entityKey,entity> = {
  readonly getAll: () => entity[]; 
  readonly get: (_1:entityKey) => (undefined | entity); 
  readonly set: (_1:entity) => t; 
  readonly delete: (_1:entityKey) => t
};

/** The constructor function for a mockDb. Call it and then set up the inital state by calling
any of the set functions it provides access to. A mockDb will be passed into a processEvent 
helper. Note, process event helpers will not mutate the mockDb but return a new mockDb with
new state so you can compare states before and after. */
export const createMockDb: () => t = TestHelpers_MockDbJS.createMockDb as any;
