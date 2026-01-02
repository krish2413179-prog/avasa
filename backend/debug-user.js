const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

async function debugUser() {
  const endpoint = process.env.ENVIO_GRAPHQL_ENDPOINT;
  const client = new GraphQLClient(endpoint);
  
  const userAddress = '0x24c80f19649c0Da8418011eF0B6Ed3e22007758c';
  
  console.log('🔍 Debugging user queries...');
  console.log('📍 Address:', userAddress);
  console.log('📍 Lowercase:', userAddress.toLowerCase());
  
  // Test 1: Check if UserActivity exists with exact case
  try {
    const query1 = `
      query TestUserActivity($userAddress: String!) {
        UserActivity(where: { user: { _eq: $userAddress } }) {
          id
          user
          totalPaymentVolumeSent
        }
      }
    `;
    
    const result1 = await client.request(query1, { userAddress });
    console.log('✅ Exact case result:', result1.UserActivity?.length || 0, 'records');
    if (result1.UserActivity?.length > 0) {
      console.log('📋 First record:', result1.UserActivity[0]);
    }
  } catch (error) {
    console.log('❌ Exact case failed:', error.message);
  }
  
  // Test 2: Check with lowercase
  try {
    const query2 = `
      query TestUserActivityLower($userAddress: String!) {
        UserActivity(where: { user: { _eq: $userAddress } }) {
          id
          user
          totalPaymentVolumeSent
        }
      }
    `;
    
    const result2 = await client.request(query2, { userAddress: userAddress.toLowerCase() });
    console.log('✅ Lowercase result:', result2.UserActivity?.length || 0, 'records');
    if (result2.UserActivity?.length > 0) {
      console.log('📋 First record:', result2.UserActivity[0]);
    }
  } catch (error) {
    console.log('❌ Lowercase failed:', error.message);
  }
  
  // Test 3: Get all UserActivity records to see what addresses exist
  try {
    const query3 = `
      query GetAllUserActivity {
        UserActivity(limit: 5) {
          id
          user
          totalPaymentVolumeSent
        }
      }
    `;
    
    const result3 = await client.request(query3);
    console.log('✅ All UserActivity records:', result3.UserActivity?.length || 0);
    result3.UserActivity?.forEach((activity, i) => {
      console.log(`📋 Record ${i + 1}: ${activity.user} (sent: ${activity.totalPaymentVolumeSent})`);
    });
  } catch (error) {
    console.log('❌ All records failed:', error.message);
  }
}

debugUser().catch(console.error);