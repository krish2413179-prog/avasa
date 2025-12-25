/* TypeScript file generated from Entities.res by genType. */

/* eslint-disable */
/* tslint:disable */

export type id = string;

export type whereOperations<entity,fieldType> = {
  readonly eq: (_1:fieldType) => Promise<entity[]>; 
  readonly gt: (_1:fieldType) => Promise<entity[]>; 
  readonly lt: (_1:fieldType) => Promise<entity[]>
};

export type Transfer_t = {
  readonly blockNumber: bigint; 
  readonly from: string; 
  readonly id: id; 
  readonly timestamp: bigint; 
  readonly to: string; 
  readonly transactionHash: string; 
  readonly value: bigint
};

export type Transfer_indexedFieldOperations = {};
