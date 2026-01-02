const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

/**
 * Discover the actual schema structure of the Envio indexer
 */
async function discoverSchema() {
  const endpoint = process.env.ENVIO_GRAPHQL_ENDPOINT || 'https://indexer.dev.hyperindex.xyz/fd320ab/v1/graphql';
  
  console.log('🔍 Discovering Envio Schema Structure...');
  console.log('📡 Endpoint:', endpoint);
  
  const client = new GraphQLClient(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  try {
    // Get detailed schema information
    const schemaQuery = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
            fields {
              name
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    `;
    
    const schemaResult = await client.request(schemaQuery);
    
    // Focus on the main entity types we're interested in
    const entityTypes = ['PaymentExecution', 'PaymentSchedule', 'UserPortfolio', 'DailyProtocolStats', 'UserActivity', 'USDCTransfer'];
    
    entityTypes.forEach(typeName => {
      const type = schemaResult.__schema.types.find(t => t.name === typeName);
      if (type && type.fields) {
        console.log(`\n📊 ${typeName} fields:`);
        type.fields.forEach(field => {
          const fieldType = field.type.name || field.type.ofType?.name || 'Unknown';
          console.log(`  • ${field.name}: ${fieldType}`);
        });
      } else {
        console.log(`\n❌ ${typeName} not found in schema`);
      }
    });

    // Test simple queries for each entity
    console.log('\n🧪 Testing simple queries...');
    
    for (const entityType of entityTypes) {
      try {
        const simpleQuery = `
          query Test${entityType} {
            ${entityType}(limit: 1) {
              id
            }
          }
        `;
        
        const result = await client.request(simpleQuery);
        const count = result[entityType]?.length || 0;
        console.log(`✅ ${entityType}: ${count} records found`);
        
        if (count > 0) {
          // Get the first record to see all available fields
          const type = schemaResult.__schema.types.find(t => t.name === entityType);
          if (type && type.fields) {
            const fieldNames = type.fields.map(f => f.name).slice(0, 10); // First 10 fields
            const detailQuery = `
              query Detail${entityType} {
                ${entityType}(limit: 1) {
                  ${fieldNames.join('\n                  ')}
                }
              }
            `;
            
            try {
              const detailResult = await client.request(detailQuery);
              console.log(`📋 Sample ${entityType}:`, JSON.stringify(detailResult[entityType][0], null, 2));
            } catch (error) {
              console.log(`⚠️ Could not fetch detailed ${entityType}:`, error.message);
            }
          }
        }
      } catch (error) {
        console.log(`❌ ${entityType} query failed:`, error.message);
      }
    }

  } catch (error) {
    console.error('\n❌ Schema discovery failed!');
    console.error('🔥 Error:', error.message);
  }
}

// Run the discovery
discoverSchema().catch(console.error);