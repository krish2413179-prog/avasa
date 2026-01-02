const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

/**
 * Final test of the Envio client with correct schema
 */
async function testFinalEnvio() {
  const endpoint = process.env.ENVIO_GRAPHQL_ENDPOINT || 'https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql';
  
  console.log('🚀 Final Envio Client Test...');
  console.log('📡 Endpoint:', endpoint);
  
  const client = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  try {
    // Test 1: Health check
    console.log('\n1️⃣ Health Check...');
    try {
      const simpleQuery = `{ __typename }`;
      await client.request(simpleQuery);
      console.log('✅ Health check passed!');
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return;
    }

    // Test 2: Get recent payment executions
    console.log('\n2️⃣ Recent Payment Executions...');
    const paymentsQuery = `
      query GetRecentPayments {
        PaymentExecution(limit: 3, order_by: { timestamp: desc }) {
          id
          payer
          recipient
          amount
          timestamp
          executor
          executorReward
        }
      }
    `;
    
    const paymentsResult = await client.request(paymentsQuery);
    console.log('✅ Payment executions query successful!');
    console.log('💸 Found executions:', paymentsResult.PaymentExecution?.length || 0);
    if (paymentsResult.PaymentExecution?.length > 0) {
      const payment = paymentsResult.PaymentExecution[0];
      console.log(`📋 Latest payment: ${payment.amount} USDC from ${payment.payer} to ${payment.recipient}`);
    }

    // Test 3: Get protocol stats
    console.log('\n3️⃣ Protocol Statistics...');
    const statsQuery = `
      query GetProtocolStats {
        DailyProtocolStats(limit: 1, order_by: { date: desc }) {
          date
          totalPaymentVolume
          totalPayments
          totalPropertyVolume
          totalPropertyInvestments
          activePaymentSchedules
          totalExecutorRewards
        }
      }
    `;
    
    const statsResult = await client.request(statsQuery);
    console.log('✅ Protocol stats query successful!');
    if (statsResult.DailyProtocolStats?.length > 0) {
      const stats = statsResult.DailyProtocolStats[0];
      console.log(`📊 Latest stats (${stats.date}):`);
      console.log(`   • Total Payment Volume: ${stats.totalPaymentVolume} USDC`);
      console.log(`   • Total Payments: ${stats.totalPayments}`);
      console.log(`   • Active Schedules: ${stats.activePaymentSchedules}`);
      console.log(`   • Property Volume: ${stats.totalPropertyVolume} USDC`);
    }

    // Test 4: Get user activity for a specific address
    console.log('\n4️⃣ User Activity...');
    const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c'; // From the sample data
    const userQuery = `
      query GetUserActivity($userAddress: String!) {
        UserActivity(where: { user: { _eq: $userAddress } }) {
          id
          user
          totalPaymentVolumeSent
          totalPaymentVolumeReceived
          totalPropertyInvestments
          activePaymentSchedules
          firstActivity
          lastActivity
        }
      }
    `;
    
    const userResult = await client.request(userQuery, { userAddress });
    console.log('✅ User activity query successful!');
    if (userResult.UserActivity?.length > 0) {
      const activity = userResult.UserActivity[0];
      console.log(`👤 User ${activity.user}:`);
      console.log(`   • Payment Volume Sent: ${activity.totalPaymentVolumeSent} USDC`);
      console.log(`   • Payment Volume Received: ${activity.totalPaymentVolumeReceived} USDC`);
      console.log(`   • Property Investments: ${activity.totalPropertyInvestments} USDC`);
      console.log(`   • Active Schedules: ${activity.activePaymentSchedules}`);
    }

    // Test 5: Get USDC transfers
    console.log('\n5️⃣ USDC Transfers...');
    const transfersQuery = `
      query GetUSDCTransfers {
        USDCTransfer(limit: 3, order_by: { timestamp: desc }) {
          id
          from
          to
          value
          timestamp
          isPaymentRelated
          isPropertyRelated
        }
      }
    `;
    
    const transfersResult = await client.request(transfersQuery);
    console.log('✅ USDC transfers query successful!');
    console.log('💰 Found transfers:', transfersResult.USDCTransfer?.length || 0);
    if (transfersResult.USDCTransfer?.length > 0) {
      const transfer = transfersResult.USDCTransfer[0];
      console.log(`📋 Latest transfer: ${transfer.value} USDC from ${transfer.from} to ${transfer.to}`);
      console.log(`   • Payment related: ${transfer.isPaymentRelated}`);
      console.log(`   • Property related: ${transfer.isPropertyRelated}`);
    }

    console.log('\n🎉 All tests passed! Your Envio indexer is fully operational!');
    console.log('🚀 Ready for production use with zero-latency financial intelligence!');

  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('🔥 Error:', error.message);
    console.error('📋 Full error:', error);
  }
}

// Run the test
testFinalEnvio().catch(console.error);