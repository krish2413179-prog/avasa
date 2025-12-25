import { TestToken } from "../generated/src/Handlers.gen";

TestToken.Transfer.handler(async ({ event, context }) => {
  // Create a unique ID for this transfer
  const transferId = `${event.transaction.hash}_${event.logIndex}`;
  
  // Create the Transfer entity
  const transferEntity = {
    id: transferId,
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
    timestamp: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  };

  // Save the entity using context
  context.Transfer.set(transferEntity);
  
  context.log.info(`Indexed Transfer: ${event.params.from} -> ${event.params.to}, Value: ${event.params.value}`);
});