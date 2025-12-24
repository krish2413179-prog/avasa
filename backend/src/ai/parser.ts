export interface ParsedAction {
  type: 'schedule_swap' | 'invest_real_estate' | 'claim_yield' | 'transfer_shares' | 'kyc_update' | 'portfolio_rebalance' | 'market_analysis' | 'stream_money' | 'resolve_basename' | 'borrow_against_assets' | 'auto_rebalance' | 'copy_trading' | 'limit_order' | 'yield_farmer' | 'smart_dca' | 'emergency_brake'
  description: string
  params: {
    // Scheduling parameters
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'once'
    startDate?: string
    endDate?: string
    
    // Swap parameters
    tokenIn?: string
    tokenOut?: string
    fiatAmount?: string // "$1000 worth"
    exactAmount?: string
    slippage?: number
    
    // Real estate parameters
    propertyId?: string
    propertyAddress?: string
    propertyName?: string
    amount?: string
    investmentStrategy?: 'conservative' | 'balanced' | 'aggressive' | 'analytical'
    
    // Streaming parameters (Superfluid)
    recipient?: string
    streamRate?: string // "5 USDC/day"
    flowRate?: string // Flow rate per second
    superToken?: string // fUSDCx, etc.
    
    // Basename parameters (ENS)
    basename?: string // "alice.base.eth"
    resolvedAddress?: string
    address?: string // For setting basename records
    
    // Borrowing parameters (Aave)
    collateralToken?: string
    borrowToken?: string
    collateralAmount?: string
    borrowAmount?: string
    ltv?: number // Loan-to-value ratio
    
    // Auto-Rebalance parameters
    targetAllocations?: { [asset: string]: number } // e.g., { 'RealEstate': 60, 'ETH': 40 }
    rebalanceFrequency?: 'daily' | 'weekly' | 'monthly'
    rebalanceThreshold?: number // Minimum deviation % to trigger
    
    // Copy Trading parameters
    whaleAddress?: string
    copyPercentage?: number // What % of whale's trade to copy
    maxTradeSize?: string // Maximum ETH per trade
    allowedTokens?: string[]
    
    // Limit Order parameters
    targetPrice?: string // Target price for execution
    orderType?: 'buy' | 'sell'
    expiresIn?: string // "24h", "7d", etc.
    
    // EIP-7715 Advanced Permission Strategy parameters
    weeklyAmount?: string // For Smart DCA
    triggerPrice?: string // For Emergency Brake
    permissionType?: 'yield_farmer' | 'smart_dca' | 'emergency_brake'
    
    // Action type for different operations
    action?: string // 'create', 'stop', 'resolve', 'set', 'borrow', 'repay', 'activate', 'deactivate', 'execute', 'check'
    
    // Error handling
    error?: string
    originalCommand?: string
    message?: string
    
    // Other parameters
    complianceLevel?: 'basic' | 'enhanced' | 'institutional'
  }
}

// Property Registry - This gives AI context about available properties
const PROPERTY_REGISTRY = {
  properties: [
    {
      id: "1",
      name: "Manhattan Luxury Apartments",
      address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
      location: "New York, NY",
      type: "Residential",
      price: "2500 ETH",
      yield: "4.2%",
      description: "Premium luxury apartments in Manhattan with high rental yield"
    },
    {
      id: "2", 
      name: "Miami Beach Condos",
      address: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968",
      location: "Miami, FL",
      type: "Residential",
      price: "1800 ETH",
      yield: "5.1%",
      description: "Beachfront condominiums with vacation rental potential"
    },
    {
      id: "3",
      name: "Austin Tech Hub Office",
      address: "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
      location: "Austin, TX", 
      type: "Commercial",
      price: "4200 ETH",
      yield: "6.8%",
      description: "Modern office space in Austin's growing tech district"
    },
    {
      id: "4",
      name: "Seattle Warehouse District",
      address: "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
      location: "Seattle, WA",
      type: "Industrial",
      price: "3100 ETH", 
      yield: "7.2%",
      description: "Industrial warehouse space with logistics potential"
    },
    {
      id: "5",
      name: "Denver Mountain Resort",
      address: "0x603E1BD79259EbcbAaeD0c83eeC09cA0B89a5bcC",
      location: "Denver, CO",
      type: "Hospitality",
      price: "5500 ETH",
      yield: "8.1%",
      description: "Mountain resort property with seasonal rental income"
    },
    {
      id: "6",
      name: "Chicago Downtown Lofts",
      address: "0x86337dDaF2661A069D0DcB5D160585acC2d15E9a",
      location: "Chicago, IL",
      type: "Residential",
      price: "3200 ETH",
      yield: "5.8%",
      description: "Modern downtown lofts in Chicago's business district"
    },
    {
      id: "7",
      name: "Los Angeles Studio Complex",
      address: "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
      location: "Los Angeles, CA",
      type: "Commercial",
      price: "6800 ETH",
      yield: "6.5%",
      description: "Entertainment industry studio complex in Hollywood"
    },
    {
      id: "8",
      name: "Phoenix Retail Plaza",
      address: "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
      location: "Phoenix, AZ",
      type: "Commercial",
      price: "2800 ETH",
      yield: "7.4%",
      description: "High-traffic retail plaza in growing Phoenix market"
    },
    {
      id: "9",
      name: "Boston Historic Brownstones",
      address: "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
      location: "Boston, MA",
      type: "Residential",
      price: "4500 ETH",
      yield: "4.8%",
      description: "Historic brownstone properties in prestigious Boston neighborhoods"
    },
    {
      id: "10",
      name: "Nashville Music District",
      address: "0x07e7876A32feEc2cE734aae93d9aB7623EaEF4a3",
      location: "Nashville, TN",
      type: "Mixed-Use",
      price: "3600 ETH",
      yield: "6.2%",
      description: "Mixed-use development in Nashville's vibrant music district"
    }
  ],
  tokens: [
    { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000" },
    { symbol: "USDC", name: "USD Coin", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
    { symbol: "WETH", name: "Wrapped Ethereum", address: "0x4200000000000000000000000000000000000006" },
    { symbol: "DAI", name: "Dai Stablecoin", address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb" }
  ]
}

export async function parseUserIntent(input: string): Promise<ParsedAction> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    
    // Try Groq Function Calling first (cost-effective and powerful)
    if (groqApiKey && groqApiKey.startsWith('gsk_')) {
      console.log('🚀 Using Groq Function Calling for advanced RWA parsing:', input);
      return await callGroqWithTools(input, groqApiKey);
    }
    
    console.log('ℹ️  No Groq API key found, using enhanced RWA mock parser');
    return enhancedMockRWAParser(input);
    
  } catch (error) {
    console.error('❌ AI parsing error:', (error as Error).message);
    console.log('🔄 Falling back to enhanced RWA mock parser');
    return enhancedMockRWAParser(input);
  }
}

// Advanced Groq Function Calling Implementation (fallback to enhanced prompting)
async function callGroqWithTools(input: string, apiKey: string): Promise<ParsedAction> {
  // Since Groq function calling models are being decommissioned, 
  // we'll use enhanced prompting with the stable model
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `You are PropChain AI, an advanced Real World Asset (RWA) investment parser with context awareness.

PROPERTY REGISTRY CONTEXT:
${JSON.stringify(PROPERTY_REGISTRY, null, 2)}

ENHANCED PARSING RULES:
- CRITICAL: If user says "don't", "do not", "cancel", "stop", "no" - DO NOT execute any investment action
- Map "this property" to Property #1 (Manhattan) by default
- "the office" = Property #3 (Austin Tech Hub)
- "beachfront" = Property #2 (Miami Beach)
- "warehouse" = Property #4 (Seattle)
- "resort" = Property #5 (Denver Mountain)
- "downtown lofts" = Property #6 (Chicago Downtown Lofts)
- "studio complex" = Property #7 (Los Angeles Studio Complex)

NEGATION DETECTION:
- If input contains "don't", "do not", "cancel", "stop", "halt", "abort", "no", "never" - return market_analysis with error message
- NEVER execute invest_real_estate if negation is detected

SCHEDULING INTELLIGENCE:
- "daily" = recurrence: "daily"
- "weekly" = recurrence: "weekly" 
- "monthly" = recurrence: "monthly"
- "$1000 worth" = fiatAmount: "$1000"

SUPPORTED ACTIONS:
- schedule_swap: For recurring token swaps
- invest_real_estate: For property investments
- claim_yield: For rental income
- portfolio_rebalance: For optimization
- market_analysis: For trends
- stream_money: For Superfluid money streaming (salaries/subscriptions)
- resolve_basename: For Basenames ENS resolution on Base
- borrow_against_assets: For Aave V3 lending/borrowing
- auto_rebalance: For automated portfolio rebalancing
- copy_trading: For copying whale trades automatically
- limit_order: For buy/sell orders at specific prices
- yield_farmer: For EIP-7715 auto-compounding yield (Best Use #1)
- smart_dca: For EIP-7715 weekly DCA with rate limits (Best Use #2)
- emergency_brake: For EIP-7715 dormant stop-loss protection (Best Use #3)

EIP-7715 ADVANCED PERMISSION STRATEGIES (Best Use Cases):
1. "Turn on Auto-Compound" = yield_farmer with action: "activate"
2. "Invest $50 every Monday" = smart_dca with weeklyAmount and action: "activate"  
3. "Emergency sell if ETH drops below $1500" = emergency_brake with triggerPrice and action: "activate"
4. "Execute yield farming for property 1" = yield_farmer with action: "execute"
5. "Check emergency brake trigger" = emergency_brake with action: "check"

ADVANCED TRADING FEATURES:
- "Keep my portfolio 60% Real Estate and 40% ETH" = auto_rebalance with target allocations
- "Copy every trade from 0xwhale.base.eth" = copy_trading with whale address
- "Buy ETH if price drops below $1500" = limit_order with target price
- "Sell 2 ETH when price hits $4000" = limit_order with sell condition
- "Follow nancy.base.eth trades with 10% size" = copy_trading with percentage

STREAM RATE FORMATS:
- Simple: "5 USDC/day", "1 ETH/week", "100 DAI/month"
- Complex: "10 USD/2 hours", "50 USDC/3 days", "2.5 ETH/4 weeks"
- Recipient formats: "alice.base.eth", "0x123...", or simple names like "ales"

Return ONLY valid JSON with this structure:
{
  "type": "schedule_swap|invest_real_estate|claim_yield|portfolio_rebalance|market_analysis|stream_money|resolve_basename|borrow_against_assets|auto_rebalance|copy_trading|limit_order|yield_farmer|smart_dca|emergency_brake",
  "description": "Human readable description",
  "params": {
    "propertyId": "1-10 or 'all'",
    "amount": "investment amount",
    "tokenIn": "ETH|USDC|WETH|DAI",
    "tokenOut": "ETH|USDC|WETH|DAI", 
    "fiatAmount": "$1000 format",
    "recurrence": "daily|weekly|monthly|once",
    "investmentStrategy": "conservative|balanced|aggressive",
    "recipient": "address or basename",
    "streamRate": "5 USDC/day format",
    "basename": "name.base.eth format",
    "collateralToken": "WETH|USDC|DAI",
    "borrowToken": "USDC|DAI|WETH",
    "collateralAmount": "1.0",
    "borrowAmount": "500",
    "targetAllocations": {"RealEstate": 60, "ETH": 40},
    "whaleAddress": "0x123... or name.base.eth",
    "copyPercentage": 10,
    "targetPrice": "1500",
    "orderType": "buy|sell",
    "weeklyAmount": "0.1",
    "triggerPrice": "1500",
    "permissionType": "yield_farmer|smart_dca|emergency_brake",
    "action": "create|stop|resolve|set|borrow|repay|activate|deactivate|execute|check"
  }
}

Do not include explanations or markdown.`
        },
        {
          role: "user",
          content: input
        }
      ],
      model: "llama-3.1-8b-instant",
      stream: false,
      temperature: 0.1
    })
  });

  console.log('📡 Groq enhanced response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Groq API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Groq API failed: ${response.status}`);
  }

  const data = await response.json();
  const result = (data as any).choices?.[0]?.message?.content;
  
  if (!result) {
    throw new Error('No response content from Groq');
  }

  // Clean up the response and parse JSON
  const cleanResult = result.trim().replace(/```json\n?|\n?```/g, '');
  const parsed = JSON.parse(cleanResult);
  console.log('✅ Groq enhanced successfully parsed RWA command:', parsed);
  
  // Convert to our action format if needed
  if (parsed.params && parsed.params.propertyId) {
    const property = PROPERTY_REGISTRY.properties.find(p => p.id === parsed.params.propertyId);
    if (property && parsed.type === 'invest_real_estate') {
      parsed.params.propertyAddress = property.address;
      parsed.params.propertyName = property.name;
      parsed.params.complianceLevel = parsed.params.complianceLevel || 'enhanced';
      parsed.params.investmentStrategy = parsed.params.investmentStrategy || 'balanced';
    }
  }
  
  return parsed;
}

// Enhanced fallback parser with scheduling and context awareness
function enhancedMockRWAParser(input: string): ParsedAction {
  console.log('🔧 Using enhanced RWA mock parser for:', input);
  const lowerInput = input.toLowerCase();
  
  // CRITICAL: Check for negation first - but be more precise about context
  const directNegation = ['dont', "don't", 'do not', 'never'];
  const hasDirectNegation = directNegation.some(word => lowerInput.includes(word));
  
  // Check for cancellation/stopping commands
  const cancellationWords = ['cancel', 'stop', 'halt', 'abort'];
  const hasCancellation = cancellationWords.some(word => lowerInput.includes(word));
  
  // Check for "no" when related to investment
  const hasNoInvestment = lowerInput.includes('no invest');
  
  // Only trigger negation if it's clearly a negative command about investing
  const isNegativeInvestmentCommand = (hasDirectNegation && lowerInput.includes('invest')) ||
                                     (hasCancellation && lowerInput.includes('invest')) ||
                                     hasNoInvestment;
  
  if (isNegativeInvestmentCommand) {
    // If user is saying NOT to do something, return an error action
    return {
      type: 'market_analysis', // Use a safe action type
      description: `Command rejected: Negative instruction detected - "${input}"`,
      params: {
        propertyId: 'none',
        amount: '0',
        error: 'NEGATION_DETECTED',
        originalCommand: input,
        message: 'User explicitly said NOT to perform this action'
      }
    };
  }
  
  // Scheduling Detection
  let recurrence: 'daily' | 'weekly' | 'monthly' | 'once' = 'once';
  if (lowerInput.includes('daily') || lowerInput.includes('every day')) recurrence = 'daily';
  if (lowerInput.includes('weekly') || lowerInput.includes('every week')) recurrence = 'weekly';
  if (lowerInput.includes('monthly') || lowerInput.includes('every month')) recurrence = 'monthly';
  
  // Fiat Amount Detection
  const fiatMatch = input.match(/\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:worth|dollars?)?/i);
  const fiatAmount = fiatMatch ? `$${fiatMatch[1]}` : null;
  
  // Token Detection
  const tokenMatch = input.match(/\b(ETH|USDC|WETH|DAI)\b/gi);
  const tokens = tokenMatch || [];
  
  // Property Context Mapping
  let propertyId = '1'; // Default to Manhattan
  if (lowerInput.includes('office') || lowerInput.includes('austin') || lowerInput.includes('tech')) propertyId = '3';
  if (lowerInput.includes('beach') || lowerInput.includes('miami') || lowerInput.includes('condo')) propertyId = '2';
  if (lowerInput.includes('warehouse') || lowerInput.includes('seattle') || lowerInput.includes('industrial')) propertyId = '4';
  if (lowerInput.includes('resort') || lowerInput.includes('denver') || lowerInput.includes('mountain')) propertyId = '5';
  if (lowerInput.includes('loft') || lowerInput.includes('chicago') || lowerInput.includes('downtown')) propertyId = '6';
  if (lowerInput.includes('studio') || lowerInput.includes('los angeles') || lowerInput.includes('la') || lowerInput.includes('hollywood')) propertyId = '7';
  if (lowerInput.includes('retail') || lowerInput.includes('phoenix') || lowerInput.includes('plaza')) propertyId = '8';
  if (lowerInput.includes('brownstone') || lowerInput.includes('boston') || lowerInput.includes('historic')) propertyId = '9';
  if (lowerInput.includes('music') || lowerInput.includes('nashville') || lowerInput.includes('district')) propertyId = '10';
  
  const propertyMatch = input.match(/property\s*#?(\d+)/i) || input.match(/#(\d+)/);
  if (propertyMatch) propertyId = propertyMatch[1];
  
  // Scheduling Swap Commands
  if ((lowerInput.includes('sell') || lowerInput.includes('swap')) && 
      (recurrence !== 'once' || fiatAmount) && 
      tokens.length >= 1) {
    
    const tokenIn = tokens[0] || 'ETH';
    const tokenOut = tokens[1] || (tokenIn === 'ETH' ? 'USDC' : 'ETH');
    
    return {
      type: 'schedule_swap',
      description: `Schedule ${recurrence} swap of ${fiatAmount || '$1000'} ${tokenIn} to ${tokenOut}`,
      params: {
        tokenIn,
        tokenOut,
        fiatAmount: fiatAmount || '$1000',
        recurrence,
        startDate: 'now',
        slippage: 0.5
      }
    };
  }
  
  // Investment Commands with Context Mapping
  if (lowerInput.includes('invest') || (lowerInput.includes('buy') && 
      (lowerInput.includes('property') || lowerInput.includes('real estate') || 
       lowerInput.includes('this') || lowerInput.includes('that')))) {
    
    const property = PROPERTY_REGISTRY.properties.find(p => p.id === propertyId);
    const amount = fiatAmount || (input.match(/\$?(\d+(?:,\d{3})*(?:\.\d+)?)/)?.[1]?.replace(/,/g, '') || '5000');
    
    return {
      type: 'invest_real_estate',
      description: `Invest $${amount} in ${property?.name || 'Property #' + propertyId}`,
      params: {
        propertyId,
        propertyAddress: property?.address,
        propertyName: property?.name,
        amount: amount,
        recurrence: recurrence, // Add recurrence support
        investmentStrategy: 'balanced',
        complianceLevel: 'enhanced'
      }
    };
  }
  
  // Yield Claiming Commands
  if (lowerInput.includes('claim') && (lowerInput.includes('yield') || lowerInput.includes('rental') || lowerInput.includes('income'))) {
    return {
      type: 'claim_yield',
      description: propertyId === 'all' ? 'Claim all rental income' : `Claim yield from ${PROPERTY_REGISTRY.properties.find(p => p.id === propertyId)?.name || 'Property #' + propertyId}`,
      params: {
        propertyId: lowerInput.includes('all') ? 'all' : propertyId,
        amount: '0'
      }
    };
  }

  // Superfluid Streaming Commands
  if (lowerInput.includes('stream') && (lowerInput.includes('money') || lowerInput.includes('salary') || lowerInput.includes('payment'))) {
    // Extract recipient (could be basename or address)
    let recipient = '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6'; // default recipient
    
    // Check for basename
    const basenameMatch = input.match(/(\w+\.base\.eth)/i);
    if (basenameMatch) {
      recipient = basenameMatch[1];
    }
    
    // Check for address
    const addressMatch = input.match(/(0x[a-fA-F0-9]{40})/);
    if (addressMatch) {
      recipient = addressMatch[1];
    }
    
    // Check for simple recipient name (like "ales")
    const nameMatch = input.match(/to\s+(\w+)(?:\s|$)/i);
    if (nameMatch && !basenameMatch && !addressMatch) {
      recipient = nameMatch[1];
    }
    
    // Extract stream rate with improved parsing
    let streamRate = '5 USDC/day'; // default
    
    // Try to match complex formats like "10 USD/2 hours"
    const complexRateMatch = input.match(/(\d+(?:\.\d+)?)\s*(\w+)\s*\/\s*(\d+)?\s*(\w+)/i);
    if (complexRateMatch) {
      const amount = complexRateMatch[1];
      const token = complexRateMatch[2];
      const periodNum = complexRateMatch[3] || '1';
      const periodUnit = complexRateMatch[4];
      streamRate = `${amount} ${token}/${periodNum} ${periodUnit}`;
    } else {
      // Try simpler format like "5 USDC/day"
      const simpleRateMatch = input.match(/(\d+(?:\.\d+)?)\s*(\w+)\/(\w+)/i);
      if (simpleRateMatch) {
        streamRate = `${simpleRateMatch[1]} ${simpleRateMatch[2]}/${simpleRateMatch[3]}`;
      }
    }
    
    // Check for stop command
    if (lowerInput.includes('stop') || lowerInput.includes('cancel') || lowerInput.includes('end')) {
      return {
        type: 'stream_money',
        description: `Stop money stream to ${recipient}`,
        params: {
          action: 'stop',
          recipient: recipient,
          streamRate: streamRate,
          superToken: 'fUSDCx'
        }
      };
    }
    
    return {
      type: 'stream_money',
      description: `Create money stream of ${streamRate} to ${recipient}`,
      params: {
        action: 'create',
        recipient: recipient,
        streamRate: streamRate,
        superToken: 'fUSDCx'
      }
    };
  }

  // Basename Resolution Commands
  if (lowerInput.includes('resolve') || lowerInput.includes('lookup') || (lowerInput.includes('name') && lowerInput.includes('address'))) {
    const basenameMatch = input.match(/(\w+\.base\.eth)/i);
    const basename = basenameMatch ? basenameMatch[1] : 'alice.base.eth';
    
    return {
      type: 'resolve_basename',
      description: `Resolve ${basename} to wallet address`,
      params: {
        action: 'resolve',
        basename: basename
      }
    };
  }

  // Set Basename Commands
  if (lowerInput.includes('set') && lowerInput.includes('name') && lowerInput.includes('base.eth')) {
    const basenameMatch = input.match(/(\w+\.base\.eth)/i);
    const basename = basenameMatch ? basenameMatch[1] : 'myname.base.eth';
    
    const addressMatch = input.match(/(0x[a-fA-F0-9]{40})/);
    const address = addressMatch ? addressMatch[1] : '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6';
    
    return {
      type: 'resolve_basename',
      description: `Set ${basename} to point to ${address}`,
      params: {
        action: 'set',
        basename: basename,
        address: address
      }
    };
  }

  // Aave Borrowing Commands
  if (lowerInput.includes('borrow') && (lowerInput.includes('against') || lowerInput.includes('collateral') || lowerInput.includes('aave'))) {
    // Extract tokens
    const tokenMatches = input.match(/\b(ETH|USDC|WETH|DAI)\b/gi) || [];
    const collateralToken = tokenMatches[0] || 'WETH';
    const borrowToken = tokenMatches[1] || 'USDC';
    
    // Extract amounts
    const amountMatches = input.match(/(\d+(?:\.\d+)?)/g) || [];
    const collateralAmount = amountMatches[0] || '1';
    const borrowAmount = amountMatches[1] || '500';
    
    return {
      type: 'borrow_against_assets',
      description: `Borrow ${borrowAmount} ${borrowToken} against ${collateralAmount} ${collateralToken}`,
      params: {
        action: 'borrow',
        collateralToken: collateralToken,
        borrowToken: borrowToken,
        collateralAmount: collateralAmount,
        borrowAmount: borrowAmount,
        ltv: 75,
        complianceLevel: 'enhanced'
      }
    };
  }

  // Loan Repayment Commands
  if (lowerInput.includes('repay') && (lowerInput.includes('loan') || lowerInput.includes('debt') || lowerInput.includes('aave'))) {
    const tokenMatches = input.match(/\b(ETH|USDC|WETH|DAI)\b/gi) || [];
    const borrowToken = tokenMatches[0] || 'USDC';
    
    const amountMatches = input.match(/(\d+(?:\.\d+)?)/g) || [];
    const borrowAmount = amountMatches[0] || '500';
    
    return {
      type: 'borrow_against_assets',
      description: `Repay ${borrowAmount} ${borrowToken} loan`,
      params: {
        action: 'repay',
        borrowToken: borrowToken,
        borrowAmount: borrowAmount,
        complianceLevel: 'enhanced'
      }
    };
  }

  // Auto-Rebalance Commands
  if (lowerInput.includes('rebalance') && (lowerInput.includes('auto') || lowerInput.includes('keep') || lowerInput.includes('maintain'))) {
    // Extract target allocations
    const percentMatches = input.match(/(\d+)%\s*(\w+)/gi) || [];
    const targetAllocations: { [key: string]: number } = {};
    
    percentMatches.forEach(match => {
      const parts = match.match(/(\d+)%\s*(\w+)/i);
      if (parts) {
        const percent = parseInt(parts[1]);
        const asset = parts[2].toLowerCase();
        
        if (asset.includes('real') || asset.includes('estate') || asset.includes('property')) {
          targetAllocations['RealEstate'] = percent;
        } else if (asset.includes('eth')) {
          targetAllocations['ETH'] = percent;
        } else if (asset.includes('usdc')) {
          targetAllocations['USDC'] = percent;
        }
      }
    });
    
    // Default allocation if not specified
    if (Object.keys(targetAllocations).length === 0) {
      targetAllocations['RealEstate'] = 60;
      targetAllocations['ETH'] = 40;
    }
    
    // Extract frequency
    let frequency: 'daily' | 'weekly' | 'monthly' = 'weekly';
    if (lowerInput.includes('daily')) frequency = 'daily';
    if (lowerInput.includes('monthly')) frequency = 'monthly';
    
    return {
      type: 'auto_rebalance',
      description: `Auto-rebalance portfolio: ${Object.entries(targetAllocations).map(([k,v]) => `${v}% ${k}`).join(', ')}`,
      params: {
        action: 'activate',
        targetAllocations: targetAllocations,
        rebalanceFrequency: frequency,
        rebalanceThreshold: 5 // 5% deviation threshold
      }
    };
  }

  // Copy Trading Commands
  if (lowerInput.includes('copy') && (lowerInput.includes('trade') || lowerInput.includes('follow') || lowerInput.includes('whale'))) {
    // Extract whale address or basename
    let whaleAddress = '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6'; // default
    
    const addressMatch = input.match(/(0x[a-fA-F0-9]{40})/);
    if (addressMatch) {
      whaleAddress = addressMatch[1];
    }
    
    const basenameMatch = input.match(/(\w+\.base\.eth)/i);
    if (basenameMatch) {
      whaleAddress = basenameMatch[1];
    }
    
    // Extract copy percentage
    const percentMatch = input.match(/(\d+)%/);
    const copyPercentage = percentMatch ? parseInt(percentMatch[1]) : 10; // Default 10%
    
    // Extract max trade size
    const amountMatch = input.match(/(\d+(?:\.\d+)?)\s*ETH/i);
    const maxTradeSize = amountMatch ? amountMatch[1] : '1'; // Default 1 ETH max
    
    return {
      type: 'copy_trading',
      description: `Copy ${copyPercentage}% of trades from ${whaleAddress}`,
      params: {
        action: 'activate',
        whaleAddress: whaleAddress,
        copyPercentage: copyPercentage,
        maxTradeSize: maxTradeSize,
        allowedTokens: ['WETH', 'USDC', 'DAI']
      }
    };
  }

  // EIP-7715 Advanced Permission Strategies
  
  // Yield Farmer (Auto-Compounding) Commands
  if ((lowerInput.includes('auto') && lowerInput.includes('compound')) || 
      (lowerInput.includes('turn on') && lowerInput.includes('compound')) ||
      (lowerInput.includes('yield') && lowerInput.includes('farm'))) {
    
    return {
      type: 'yield_farmer',
      description: `Activate Yield Farmer for Property #${propertyId} - Auto-compound rental income`,
      params: {
        action: 'activate',
        propertyId: propertyId,
        permissionType: 'yield_farmer',
        complianceLevel: 'enhanced'
      }
    };
  }

  // Smart DCA (Dollar Cost Averaging) Commands
  if ((lowerInput.includes('invest') && (lowerInput.includes('weekly') || lowerInput.includes('every week'))) ||
      (lowerInput.includes('dca') || lowerInput.includes('dollar cost')) ||
      (lowerInput.includes('every monday') || lowerInput.includes('weekly investment'))) {
    
    // Extract weekly amount
    const weeklyAmountMatch = input.match(/\$?(\d+(?:\.\d+)?)/);
    const weeklyAmount = weeklyAmountMatch ? (parseFloat(weeklyAmountMatch[1]) / 3000).toFixed(3) : '0.1'; // Convert USD to ETH estimate
    
    return {
      type: 'smart_dca',
      description: `Activate Smart DCA: ${weeklyAmount} ETH weekly into Property #${propertyId}`,
      params: {
        action: 'activate',
        weeklyAmount: weeklyAmount,
        propertyId: propertyId,
        permissionType: 'smart_dca',
        complianceLevel: 'enhanced'
      }
    };
  }

  // Emergency Brake (Stop-Loss) Commands
  if ((lowerInput.includes('emergency') && (lowerInput.includes('sell') || lowerInput.includes('swap'))) ||
      (lowerInput.includes('stop loss') || lowerInput.includes('stop-loss')) ||
      (lowerInput.includes('if eth drops') || lowerInput.includes('if price drops'))) {
    
    // Extract trigger price
    const priceMatch = input.match(/\$(\d+(?:,\d{3})*(?:\.\d+)?)/);
    const triggerPrice = priceMatch ? priceMatch[1].replace(/,/g, '') : '1500';
    
    return {
      type: 'emergency_brake',
      description: `Activate Emergency Brake: Swap ETH→USDC if ETH drops below $${triggerPrice}`,
      params: {
        action: 'activate',
        triggerPrice: triggerPrice,
        permissionType: 'emergency_brake',
        complianceLevel: 'enhanced'
      }
    };
  }

  // Execute/Check EIP-7715 Strategy Commands
  if (lowerInput.includes('execute') && lowerInput.includes('yield')) {
    return {
      type: 'yield_farmer',
      description: `Execute yield farming for Property #${propertyId}`,
      params: {
        action: 'execute',
        propertyId: propertyId,
        permissionType: 'yield_farmer'
      }
    };
  }

  if (lowerInput.includes('check') && lowerInput.includes('emergency')) {
    const priceMatch = input.match(/\$(\d+(?:,\d{3})*(?:\.\d+)?)/);
    const triggerPrice = priceMatch ? priceMatch[1].replace(/,/g, '') : '1500';
    
    return {
      type: 'emergency_brake',
      description: `Check emergency brake trigger at $${triggerPrice}`,
      params: {
        action: 'check',
        triggerPrice: triggerPrice,
        permissionType: 'emergency_brake'
      }
    };
  }

  // Limit Order Commands
  if ((lowerInput.includes('buy') || lowerInput.includes('sell')) && 
      (lowerInput.includes('if') || lowerInput.includes('when') || lowerInput.includes('below') || lowerInput.includes('above'))) {
    
    // Determine order type
    const orderType = lowerInput.includes('buy') ? 'buy' : 'sell';
    
    // Extract tokens
    const tokenMatches = input.match(/\b(ETH|USDC|WETH|DAI)\b/gi) || [];
    const tokenOut = tokenMatches[0] || 'ETH';
    const tokenIn = orderType === 'buy' ? 'USDC' : tokenOut;
    
    // Extract target price
    const priceMatch = input.match(/\$(\d+(?:,\d{3})*(?:\.\d+)?)/);
    const targetPrice = priceMatch ? priceMatch[1].replace(/,/g, '') : '1500';
    
    // Extract amount
    const amountMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:ETH|USDC)/i);
    const amount = amountMatch ? amountMatch[1] : '1';
    
    // Extract expiration
    let expiresIn = '24h'; // Default 24 hours
    if (lowerInput.includes('week')) expiresIn = '7d';
    if (lowerInput.includes('month')) expiresIn = '30d';
    
    return {
      type: 'limit_order',
      description: `${orderType.toUpperCase()} ${amount} ${tokenOut} at $${targetPrice}`,
      params: {
        action: 'create',
        orderType: orderType,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amount: amount,
        targetPrice: targetPrice,
        expiresIn: expiresIn
      }
    };
  }
  
  // Portfolio Management Commands
  if (lowerInput.includes('rebalance') || lowerInput.includes('optimize') || lowerInput.includes('portfolio')) {
    let strategy: 'conservative' | 'balanced' | 'aggressive' | 'analytical' = 'balanced';
    if (lowerInput.includes('conservative') || lowerInput.includes('safe')) strategy = 'conservative';
    if (lowerInput.includes('aggressive') || lowerInput.includes('growth')) strategy = 'aggressive';
    if (lowerInput.includes('analytical') || lowerInput.includes('analyze')) strategy = 'analytical';
    
    return {
      type: 'portfolio_rebalance',
      description: `Rebalance portfolio with ${strategy} strategy`,
      params: {
        investmentStrategy: strategy,
        amount: '0'
      }
    };
  }
  
  // Market Analysis Commands
  if (lowerInput.includes('analyze') || lowerInput.includes('market') || lowerInput.includes('trends')) {
    return {
      type: 'market_analysis',
      description: propertyId === 'market' ? 'Analyze overall market trends' : `Analyze ${PROPERTY_REGISTRY.properties.find(p => p.id === propertyId)?.name || 'Property #' + propertyId}`,
      params: {
        propertyId: lowerInput.includes('market') ? 'market' : propertyId,
        amount: '0'
      }
    };
  }
  
  // Default fallback - smart property investment
  const property = PROPERTY_REGISTRY.properties.find(p => p.id === propertyId);
  return {
    type: 'invest_real_estate',
    description: `Invest $5000 in ${property?.name || 'Property #' + propertyId}`,
    params: {
      propertyId,
      propertyAddress: property?.address,
      propertyName: property?.name,
      amount: '5000',
      investmentStrategy: 'balanced',
      complianceLevel: 'enhanced'
    }
  };
}