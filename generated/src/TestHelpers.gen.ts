/* TypeScript file generated from TestHelpers.res by genType. */

/* eslint-disable */
/* tslint:disable */

const TestHelpersJS = require('./TestHelpers.res.js');

import type {TestToken_Transfer_event as Types_TestToken_Transfer_event} from './Types.gen';

import type {t as Address_t} from 'envio/src/Address.gen';

import type {t as TestHelpers_MockDb_t} from './TestHelpers_MockDb.gen';

/** The arguements that get passed to a "processEvent" helper function */
export type EventFunctions_eventProcessorArgs<event> = {
  readonly event: event; 
  readonly mockDb: TestHelpers_MockDb_t; 
  readonly chainId?: number
};

export type EventFunctions_eventProcessor<event> = (_1:EventFunctions_eventProcessorArgs<event>) => Promise<TestHelpers_MockDb_t>;

export type EventFunctions_MockBlock_t = {
  readonly hash?: string; 
  readonly number?: number; 
  readonly timestamp?: number
};

export type EventFunctions_MockTransaction_t = {
  readonly from?: (undefined | Address_t); 
  readonly hash?: string; 
  readonly to?: (undefined | Address_t); 
  readonly value?: bigint
};

export type EventFunctions_mockEventData = {
  readonly chainId?: number; 
  readonly srcAddress?: Address_t; 
  readonly logIndex?: number; 
  readonly block?: EventFunctions_MockBlock_t; 
  readonly transaction?: EventFunctions_MockTransaction_t
};

export type TestToken_Transfer_createMockArgs = {
  readonly from?: Address_t; 
  readonly to?: Address_t; 
  readonly value?: bigint; 
  readonly mockEventData?: EventFunctions_mockEventData
};

export const MockDb_createMockDb: () => TestHelpers_MockDb_t = TestHelpersJS.MockDb.createMockDb as any;

export const Addresses_mockAddresses: Address_t[] = TestHelpersJS.Addresses.mockAddresses as any;

export const Addresses_defaultAddress: Address_t = TestHelpersJS.Addresses.defaultAddress as any;

export const TestToken_Transfer_processEvent: EventFunctions_eventProcessor<Types_TestToken_Transfer_event> = TestHelpersJS.TestToken.Transfer.processEvent as any;

export const TestToken_Transfer_createMockEvent: (args:TestToken_Transfer_createMockArgs) => Types_TestToken_Transfer_event = TestHelpersJS.TestToken.Transfer.createMockEvent as any;

export const Addresses: { mockAddresses: Address_t[]; defaultAddress: Address_t } = TestHelpersJS.Addresses as any;

export const TestToken: { Transfer: { processEvent: EventFunctions_eventProcessor<Types_TestToken_Transfer_event>; createMockEvent: (args:TestToken_Transfer_createMockArgs) => Types_TestToken_Transfer_event } } = TestHelpersJS.TestToken as any;

export const MockDb: { createMockDb: () => TestHelpers_MockDb_t } = TestHelpersJS.MockDb as any;
