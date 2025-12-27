import { TestToken, RecurringPayments } from "../generated/src/Handlers.gen";

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

// RecurringPayments Event Handlers
RecurringPayments.PermissionGranted.handler(async ({ event, context }) => {
  const permissionId = `${event.params.user}_${event.block.timestamp}`;
  
  const permissionEntity = {
    id: permissionId,
    user: event.params.user,
    maxAmountPerPayment: event.params.maxAmountPerPayment,
    maxTotalAmount: event.params.maxTotalAmount,
    validUntil: event.params.validUntil,
    timestamp: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  };

  context.PermissionGranted.set(permissionEntity);
  context.log.info(`Permission Granted: ${event.params.user}, Max: ${event.params.maxAmountPerPayment}`);
});

RecurringPayments.PaymentScheduleCreated.handler(async ({ event, context }) => {
  const scheduleEntity = {
    id: event.params.scheduleId,
    payer: event.params.payer,
    recipient: event.params.recipient,
    amount: event.params.amount,
    interval: event.params.interval,
    isActive: true,
    createdAt: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  };

  context.PaymentSchedule.set(scheduleEntity);
  context.log.info(`Payment Schedule Created: ${event.params.payer} -> ${event.params.recipient}, Amount: ${event.params.amount}`);
});

RecurringPayments.PaymentExecuted.handler(async ({ event, context }) => {
  const executionId = `${event.params.scheduleId}_${event.block.timestamp}`;
  
  const executionEntity = {
    id: executionId,
    scheduleId: event.params.scheduleId,
    payer: event.params.payer,
    recipient: event.params.recipient,
    amount: event.params.amount,
    executedAt: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  };

  context.PaymentExecution.set(executionEntity);
  context.log.info(`Payment Executed: ${event.params.payer} -> ${event.params.recipient}, Amount: ${event.params.amount}`);
});

RecurringPayments.PaymentScheduleCancelled.handler(async ({ event, context }) => {
  const cancellationId = `${event.params.scheduleId}_cancelled_${event.block.timestamp}`;
  
  const cancellationEntity = {
    id: cancellationId,
    scheduleId: event.params.scheduleId,
    cancelledAt: BigInt(event.block.timestamp),
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  };

  context.PaymentCancellation.set(cancellationEntity);
  context.log.info(`Payment Schedule Cancelled: ${event.params.scheduleId}`);
});