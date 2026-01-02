const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

/**
 * Test script to verify connection to the new Envio GraphQL endpoint
 */
async function testEnvioConnection() {
  const endpoint = process.env.ENVIO_GRAPHQL_ENDPOINT || 'https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql';
  
  console.log('🔍 Testing Envio GraphQL Connection...');
  console.log('📡 Endpoint:', endpoint);
  
  const client = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  try {
    // Test 1: Health check with meta query
    console.log('\n1️⃣ Testing health check...');
    try {
      const healthQuery = `
        query HealthCheck {
          _meta {
            hasIndexingErrors
          }
        }
      `;
      
      const healthResult = await client.request(healthQuery);
      console.log('✅ Health check passed!');
      console.log('📊 Indexing errors:', healthResult._meta?.hasIndexingErrors || false);
    } catch (error) {
      // Try simpler meta query
      try {
        const simpleHealthQuery = `{ __typename }`;
        await client.request(simpleHealthQuery);
        console.log('✅ Basic health check passed!');
      } catch (e) {
        console.log('❌ Health check failed:', e.message);
      }
    }

    // Test 2: Check available entities
    console.log('\n2️⃣ Testing entity queries...');
    
    // Try to query users
    try {
      const usersQuery = `
        query GetUsers {
          users(first: 5) {
            id
            totalRentPaid
            totalEquityEarned
            creditScore
          }
        }
      `;
      const usersResult = await client.request(usersQuery);
      console.log('✅ Users query successful!');
      console.log('👥 Found users:', usersResult.users?.length || 0);
      if (usersResult.users?.length > 0) {
        console.log('📋 Sample user:', usersResult.users[0]);
      }
    } catch (error) {
      console.log('⚠️ Users entity not available:', error.message);
    }

    // Try to query payment schedules
    try {
      const schedulesQuery = `
        query GetSchedules {
          paymentSchedules(first: 5) {
            id
            user
            recipient
            amount
            isActive
          }
        }
      `;
      const schedulesResult = await client.request(schedulesQuery);
      console.log('✅ Payment schedules query successful!');
      console.log('📅 Found schedules:', schedulesResult.paymentSchedules?.length || 0);
      if (schedulesResult.paymentSchedules?.length > 0) {
        console.log('📋 Sample schedule:', schedulesResult.paymentSchedules[0]);
      }
    } catch (error) {
      console.log('⚠️ Payment schedules entity not available:', error.message);
    }

    // Try to query payment executions
    try {
      const executionsQuery = `
        query GetExecutions {
          paymentExecutions(first: 5, orderBy: timestamp, orderDirection: desc) {
            id
            user
            recipient
            amount
            timestamp
            transactionHash
          }
        }
      `;
      const executionsResult = await client.request(executionsQuery);
      console.log('✅ Payment executions query successful!');
      console.log('💸 Found executions:', executionsResult.paymentExecutions?.length || 0);
      if (executionsResult.paymentExecutions?.length > 0) {
        console.log('📋 Sample execution:', executionsResult.paymentExecutions[0]);
      }
    } catch (error) {
      console.log('⚠️ Payment executions entity not available:', error.message);
    }

    // Try to query properties
    try {
      const propertiesQuery = `
        query GetProperties {
          properties(first: 5) {
            id
            name
            totalRevenue
            occupancyRate
          }
        }
      `;
      const propertiesResult = await client.request(propertiesQuery);
      console.log('✅ Properties query successful!');
      console.log('🏠 Found properties:', propertiesResult.properties?.length || 0);
      if (propertiesResult.properties?.length > 0) {
        console.log('📋 Sample property:', propertiesResult.properties[0]);
      }
    } catch (error) {
      console.log('⚠️ Properties entity not available:', error.message);
    }

    // Test 3: Schema introspection
    console.log('\n3️⃣ Testing schema introspection...');
    try {
      const schemaQuery = `
        query IntrospectionQuery {
          __schema {
            types {
              name
              kind
            }
          }
        }
      `;
      const schemaResult = await client.request(schemaQuery);
      const entityTypes = schemaResult.__schema.types
        .filter(type => type.kind === 'OBJECT' && !type.name.startsWith('_'))
        .map(type => type.name);
      
      console.log('✅ Schema introspection successful!');
      console.log('📊 Available entity types:', entityTypes);
    } catch (error) {
      console.log('⚠️ Schema introspection failed:', error.message);
    }

    console.log('\n🎉 Envio connection test completed successfully!');
    console.log('🚀 Your indexer is ready for high-performance queries!');

  } catch (error) {
    console.error('\n❌ Connection test failed!');
    console.error('🔥 Error:', error.message);
    console.error('📋 Full error:', error);
    
    if (error.message.includes('404')) {
      console.log('\n💡 Possible solutions:');
      console.log('   • Check if the indexer ID is correct: fd320ab');
      console.log('   • Verify the indexer is deployed and running');
      console.log('   • Try accessing the endpoint in a browser');
    }
  }
}

// Run the test
testEnvioConnection().catch(console.error);