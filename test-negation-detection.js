// PropChain AI - Negation Detection Test
// Tests the AI's ability to handle negative commands properly

const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testNegationDetection() {
  console.log('🧠 PropChain AI - Negation Detection Test');
  console.log('==========================================\n');

  const testCases = [
    // NEGATIVE COMMANDS (should be rejected)
    {
      input: "dont invest 100 dollar in property 2",
      expected: "REJECTED",
      description: "Direct negation with 'dont'"
    },
    {
      input: "do not invest in Miami Beach Condos", 
      expected: "REJECTED",
      description: "Formal negation with 'do not'"
    },
    {
      input: "cancel my investment in property 3",
      expected: "REJECTED", 
      description: "Cancellation command"
    },
    {
      input: "never invest in Denver Mountain Resort",
      expected: "REJECTED",
      description: "Strong negation with 'never'"
    },
    {
      input: "no investment in property 5",
      expected: "REJECTED",
      description: "Negation with 'no investment'"
    },
    {
      input: "I do not want to invest in property 1",
      expected: "REJECTED",
      description: "Complex negation sentence"
    },
    
    // POSITIVE COMMANDS (should be allowed)
    {
      input: "invest 100 dollars in property 2",
      expected: "ALLOWED",
      description: "Direct positive investment"
    },
    {
      input: "buy shares in Miami Beach Condos",
      expected: "ALLOWED", 
      description: "Alternative positive phrasing"
    },
    {
      input: "invest in property that is not expensive",
      expected: "ALLOWED",
      description: "Positive command with descriptive 'not'"
    },
    {
      input: "purchase property shares for retirement",
      expected: "ALLOWED",
      description: "Positive investment for purpose"
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    try {
      const response = await axios.post(`${API_BASE}/api/parse`, {
        input: testCase.input
      });
      
      const isRejected = response.data.type === 'market_analysis' && 
                        (response.data.params?.error === 'NEGATION_DETECTED' ||
                         response.data.description.includes('rejected') ||
                         response.data.description.includes('cancelled') ||
                         response.data.description.includes('declined') ||
                         response.data.description.includes('denied') ||
                         response.data.description.includes('Negation detected') ||
                         response.data.description.includes('avoid investment'));
      
      const actualResult = isRejected ? "REJECTED" : "ALLOWED";
      const testPassed = actualResult === testCase.expected;
      
      console.log(`${testPassed ? '✅' : '❌'} ${testCase.description}`);
      console.log(`   Input: "${testCase.input}"`);
      console.log(`   Expected: ${testCase.expected} | Actual: ${actualResult}`);
      console.log(`   Action: ${response.data.type}`);
      console.log(`   Description: ${response.data.description}`);
      console.log('');
      
      if (testPassed) passedTests++;
      
    } catch (error) {
      console.log(`❌ ${testCase.description}`);
      console.log(`   Input: "${testCase.input}"`);
      console.log(`   Error: ${error.message}`);
      console.log('');
    }
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed (${Math.round(passedTests/totalTests*100)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! AI negation detection is working perfectly.');
  } else {
    console.log('⚠️  Some tests failed. AI negation detection needs improvement.');
  }
}

// Run the test
testNegationDetection().catch(console.error);