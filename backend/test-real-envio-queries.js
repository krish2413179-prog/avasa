const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

/**
 * Test real queries against the actual Envio schema
 */
async function testRealQueries() {
  const endpoint = process.env.ENVIO_GRAPHQL_ENDPOINT || 'https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql';
  
  console.log('🚀 Testing Real Envio Queries...');
  console.log('📡 Endpoint:', endpoint);
  
  const client = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  try {
    // Test 1: Get recent payment executions
    console.log('\n1️⃣ Testing PaymentExecution queries...');
    const paymentsQuery = `
      query GetRecentPayments {
        PaymentExecution(limit: 5, order_by: { timestamp: desc }) {
          id
          user
          recipient
          amount
          timestamp
          transactionHash
          gasUsed
        }
      }
    `;
    
    const paymentsResult = await client.request(paymentsQuery);
    console.log('✅ PaymentExecution query successful!');
    console.log('💸 Found executions:', paymentsResult.PaymentExecution?.length || 0);
    if (paymentsResult.PaymentExecution?.length > 0) {
      console.log('📋 Sample execution:', paymentsResult.PaymentExecution[0]);
    }

    // Test 2: Get payment schedules
    console.log('\n2️⃣ Testing PaymentSchedule queries...');
    const schedulesQuery = `
      query GetPaymentSchedules {
        PaymentSchedule(limit: 5, order_by: { createdAt: desc }) {
          id
          user
          recipient
          amount
          interval
          isActive
          totalPaid
          paymentsCount
        }
      }
    `;
    
    const schedulesResult = await client.request(schedulesQuery);
    console.log('✅ PaymentSchedule query successful!');
    console.log('📅 Found schedules:', schedulesResult.PaymentSchedule?.length || 0);
    if (schedulesResult.PaymentSchedule?.length > 0) {
      console.log('📋 Sample schedule:', schedulesResult.PaymentSchedule[0]);
    }

    // Test 3: Get user portfolios
    console.log('\n3️⃣ Testing UserPortfolio queries...');
    const portfolioQuery = `
      query GetUserPortfolios {
        UserPortfolio(limit: 5, order_by: { totalInvested: desc }) {
          id
          totalInvested
          totalReturns
          activePositions
          lastActivityTimestamp
        }
      }
    `;
    
    const portfolioResult = await client.request(portfolioQuery);
    console.log('✅ UserPortfolio query successful!');
    console.log('👥 Found portfolios:', portfolioResult.UserPortfolio?.length || 0);
    if (portfolioResult.UserPortfolio?.length > 0) {
      console.log('📋 Sample portfolio:', portfolioResult.UserPortfolio[0]);
    }

    // Test 4: Get protocol stats
    console.log('\n4️⃣ Testing DailyProtocolStats queries...');
    const statsQuery = `
      query GetProtocolStats {
        DailyProtocolStats(limit: 5, order_by: { date: desc }) {
          id
          date
          totalVolume
          totalExecutions
          totalUsers
          averageGasUsed
          totalRewards
        }
      }
    `;
    
    const statsResult = await client.request(statsQuery);
    console.log('✅ DailyProtocolStats query successful!');
    console.log('📊 Found stats:', statsResult.DailyProtocolStats?.length || 0);
    if (statsResult.DailyProtocolStats?.length > 0) {
      console.log('📋 Sample stats:', statsResult.DailyProtocolStats[0]);
    }

    // Test 5: Get user activity
    console.log('\n5️⃣ Testing UserActivity queries...');
    const activityQuery = `
      query GetUserActivity {
        UserActivity(limit: 5, order_by: { timestamp: desc }) {
          id
          user
          activityType
          amount
          timestamp
          transactionHash
        }
      }
    `;
    
    const activityResult = await client.request(activityQuery);
    console.log('✅ UserActivity query successful!');
    console.log('🎯 Found activities:', activityResult.UserActivity?.length || 0);
    if (activityResult.UserActivity?.length > 0) {
      console.log('📋 Sample activity:', activityResult.UserActivity[0]);
    }

    // Test 6: Get USDC transfers
    console.log('\n6️⃣ Testing USDCTransfer queries...');
    const transferQuery = `
      query GetUSDCTransfers {
        USDCTransfer(limit: 5, order_by: { timestamp: desc }) {
          id
          from
          to
          value
          timestamp
          transactionHash
        }
      }
    `;
    
    const transferResult = await client.request(transferQuery);
    console.log('✅ USDCTransfer query successful!');
    console.log('💰 Found transfers:', transferResult.USDCTransfer?.length || 0);
    if (transferResult.USDCTransfer?.length > 0) {
      console.log('📋 Sample transfer:', transferResult.USDCTransfer[0]);
    }

    // Test 7: Test filtering by user address
    console.log('\n7️⃣ Testing user-specific queries...');
    const userAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'; // Example address
    const userQuery = `
      query GetUserData($userAddress: String!) {
        PaymentExecution(where: { user: { _eq: $userAddress } }, limit: 3) {
          id
          amount
          timestamp
          recipient
        }
        PaymentSchedule(where: { user: { _eq: $userAddress } }, limit: 3) {
          id
          amount
          isActive
          recipient
        }
      }
    `;
    
    const userResult = await client.request(userQuery, { userAddress });
    console.log('✅ User-specific query successful!');
    console.log('👤 User payments:', userResult.PaymentExecution?.length || 0);
    console.log('📅 User schedules:', userResult.PaymentSchedule?.length || 0);

    console.log('\n🎉 All real queries completed successfully!');
    console.log('🚀 Your Envio indexer is fully operational and ready for production!');

  } catch (error) {
    console.error('\n❌ Query test failed!');
    console.error('🔥 Error:', error.message);
    console.error('📋 Full error:', error);
  }
}

// Run the test
testRealQueries().catch(console.error);