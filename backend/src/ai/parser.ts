export interface ParsedAction {
  type: 'schedule_swap' | 'invest_real_estate' | 'claim_yield' | 'transfer_shares' | 'kyc_update' | 'portfolio_rebalance' | 'market_analysis' | 'stream_money' | 'resolve_basename' | 'borrow_against_assets' | 'auto_rebalance' | 'copy_trading' | 'limit_order' | 'yield_farmer' | 'smart_dca' | 'emergency_brake' | 'add_friend' | 'cancel_schedules' | 'rent_to_own'
  description: string
  params: {
    // Scheduling parameters
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'once' | 'custom'
    customInterval?: number
    maxExecutions?: number
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
    investmentType?: string
    
    // Rent-to-own parameters
    targetOwnershipPercentage?: number // 5 = 5%
    targetMonths?: number // How many months to reach ownership goal
    monthlyRent?: string // Monthly rent amount
    
    // Intelligent safety parameters
    gasLimit?: number // Max gas price in gwei
    emergencyBrake?: number // Emergency stop balance in USDC
    emergencyBrakeBalance?: string // Emergency stop balance in USDC
    retryInterval?: number // Retry interval in minutes
    gasOptimization?: boolean // Enable gas optimization
    minWalletBalance?: string // Minimum wallet balance to maintain
    
    // Event-driven trigger parameters (IFTTT for Web3)
    eventTrigger?: 'usdc_received' | 'eth_received' | 'nft_received' | 'contract_call' | 'price_threshold'
    triggerFrom?: string // Specific sender address (e.g., Diya's address)
    triggerTo?: string // Specific recipient address
    triggerAmount?: string // Minimum amount to trigger
    triggerDescription?: string // Human-readable trigger description
    
    // Friend management parameters
    friendName?: string
    friendAddress?: string
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

export async function parseUserIntent(input: string, userAddress?: string): Promise<ParsedAction> {
  try {
    const groqApiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    
    // Try Groq Function Calling first (cost-effective and powerful)
    if (groqApiKey && groqApiKey.startsWith('gsk_')) {
      console.log('🚀 Using Groq Function Calling for advanced RWA parsing:', input);
      return await callGroqWithTools(input, groqApiKey, userAddress);
    }
    
    console.log('ℹ️  No Groq API key found, using enhanced RWA mock parser');
    return enhancedMockRWAParser(input, userAddress);
    
  } catch (error) {
    console.error('❌ AI parsing error:', (error as Error).message);
    console.log('🔄 Falling back to enhanced RWA mock parser');
    return enhancedMockRWAParser(input, userAddress);
  }
}

// Advanced Groq Function Calling Implementation (fallback to enhanced prompting)
async function callGroqWithTools(input: string, apiKey: string, userAddress?: string): Promise<ParsedAction> {
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
          content: `You are Veda AI, an advanced Real World Asset (RWA) investment parser with context awareness.

PROPERTY REGISTRY CONTEXT:
${JSON.stringify(PROPERTY_REGISTRY, null, 2)}

ENHANCED PARSING RULES:
- CRITICAL: If user says "stop all payments", "cancel all payments", "stop payments to [name]" - return cancel_schedules action
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
- "every 30 seconds" = recurrence: "custom", customInterval: 30, maxExecutions calculated from duration
- "every 5 minutes" = recurrence: "custom", customInterval: 300, maxExecutions calculated from duration
- "every minute" = recurrence: "custom", customInterval: 60, maxExecutions calculated from duration
- "every hour" = recurrence: "custom", customInterval: 3600, maxExecutions calculated from duration
- "for 2 minutes" = duration limit to calculate maxExecutions
- "$1000 worth" = fiatAmount: "$1000"

CRITICAL RECURRING SEND RULES:
- "send 10 USDC to alice every day" = stream_money (NOT schedule_swap)
- "send 5 ETH to bob every hour" = stream_money (NOT schedule_swap)  
- "send 100 DAI to charlie every 30 seconds" = stream_money (NOT schedule_swap)
- "send 10 usdc to krish every 30 sec for 2 minutes" = stream_money (NOT schedule_swap)
- NEVER use schedule_swap for "send X token to Y every Z" - ALWAYS use stream_money
- schedule_swap is ONLY for "swap X for Y" or "buy/sell" commands
- If you see "send [amount] [token] to [person] every [time]" → MUST return type: "stream_money"
RECURRING PROPERTY INVESTMENTS:
- "invest $10 in manhattan every 30 seconds for 2 minutes" = schedule_swap with investmentType: "recurring_property_investment"
  - customInterval: 30 (seconds)
  - maxExecutions: 4 (120 seconds / 30 seconds = 4)
- "invest $50 in property 2 every minute for 5 minutes" = schedule_swap with investmentType: "recurring_property_investment"
  - customInterval: 60 (seconds)  
  - maxExecutions: 5 (300 seconds / 60 seconds = 5)
- "invest $20 in manhattan every hour for 3 hours" = schedule_swap with investmentType: "recurring_property_investment"
  - customInterval: 3600 (seconds)
  - maxExecutions: 3 (10800 seconds / 3600 seconds = 3)
- Custom intervals should use schedule_swap NOT invest_real_estate
- Calculate maxExecutions = total_duration_in_seconds / interval_in_seconds
- "every minute" = 60 seconds, "every hour" = 3600 seconds

SUPPORTED ACTIONS:
- cancel_schedules: For stopping/canceling existing payment schedules
- schedule_swap: For recurring token swaps AND recurring property investments with custom intervals
- invest_real_estate: For ONE-TIME property investments only
- rent_to_own: For Real-Time Home Ownership where rent payments unlock property shares
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
- add_friend: For saving contact addresses with names

RENT-TO-OWN COMMANDS (Real-Time Home Ownership):
- "I want to own 5% of this apartment by December" = rent_to_own with targetOwnershipPercentage: 5
- "Set up rent-to-own for Manhattan property, 3% ownership in 12 months" = rent_to_own
- "Stream $2000/month to own 10% of property 2" = rent_to_own with monthlyRent and targetOwnershipPercentage
- "Pay rent and get equity in return" = rent_to_own with default parameters
- Calculate targetMonths from "by December" (current date to target date)
- Extract ownership percentage from "5%", "3%", "10%" etc.
- Extract monthly rent from "$2000/month", "$1500 monthly" etc.

INTELLIGENT SAFETY COMMANDS:
- "Pay my rent of 2000 USDC on the 1st, but ONLY if gas is below 20 gwei" = schedule_swap with gasLimit: 20
- "Stream 50 USDC every hour to Chicago property, but PAUSE if my balance drops below 500 USDC" = schedule_swap with emergencyBrake: 500
- "If gas is high, try again every hour" = schedule_swap with retryInterval: 60
- "Set emergency brake at 100 USDC" = schedule_swap with emergencyBrakeBalance: 100
- "Only execute when gas is cheap" = schedule_swap with gasOptimization: true

EVENT-DRIVEN COMMANDS (IFTTT for Web3):
- "Pay my rent when Diya sends me money" = stream_money with eventTrigger: usdc_received, triggerFrom: Diya's address
- "If I receive 1000 USDC from anyone, pay my bills" = stream_money with eventTrigger: usdc_received, triggerAmount: 1000
- "When my salary arrives, automatically invest 20% in Manhattan property" = schedule_swap with eventTrigger: usdc_received, triggerFrom: employer
- "If someone sends me ETH, convert it to USDC and pay rent" = schedule_swap with eventTrigger: eth_received
- "If diya paid me money send it to krish" = stream_money with eventTrigger: usdc_received, triggerFrom: diya
- CRITICAL: Use stream_money for event-driven PAYMENTS to people
- CRITICAL: Use schedule_swap for event-driven INVESTMENTS or SWAPS

CRITICAL RECURRING INVESTMENT RULES:
- ANY investment with "every X seconds/minutes/hours" = schedule_swap with investmentType: "recurring_property_investment"
- ANY investment with custom intervals = schedule_swap NOT invest_real_estate
- Only use invest_real_estate for one-time investments without recurrence

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

CRITICAL TOKEN CONVERSION RULES:
- "dollar", "dollars", "USD", "usd", "$" should ALWAYS become tokenIn: "USDC"
- "send 10 dollar to krish" = transfer_shares with tokenIn: "USDC"
- "send 10 USD to alice" = transfer_shares with tokenIn: "USDC"  
- "send $50 to bob" = transfer_shares with tokenIn: "USDC"
- NEVER use "USD" as tokenIn - always convert to "USDC"

SIMPLE TRANSFER COMMANDS (CRITICAL - Handle these FIRST):
- "send 10 usdc to krish" = transfer_shares with action: "transfer", recurrence: "once"
- "send 10 dollar to krish" = transfer_shares with tokenIn: "USDC" (convert dollar/USD to USDC)
- "send 10 usd to krish" = transfer_shares with tokenIn: "USDC" (convert dollar/USD to USDC)
- "send $10 to krish" = transfer_shares with tokenIn: "USDC" (convert dollar/USD to USDC)
- "transfer 5 eth to alice" = transfer_shares with action: "transfer", recurrence: "once"  
- "send 100 dai to bob" = transfer_shares with action: "transfer", recurrence: "once"
- CRITICAL: ANY command with "send [amount] [token] to [person]" = transfer_shares
- CRITICAL: Simple "send X token to Y" should ALWAYS be transfer_shares, NOT stream_money or schedule_swap
- CRITICAL: Convert "dollar", "dollars", "USD", "$" to "USDC" token
- CRITICAL: Only use stream_money for explicit streaming like "stream 5 USDC/day to alice" AND recurring sends like "send 10 USDC to alice every day"
- CRITICAL: Only use invest_real_estate for explicit property investment like "invest in manhattan property"

STREAM RATE FORMATS:
- Simple: "5 USDC/day", "1 ETH/week", "100 DAI/month"
- Complex: "10 USD/2 hours", "50 USDC/3 days", "2.5 ETH/4 weeks"
- Recipient formats: "alice.base.eth", "0x123...", or simple names like "ales"

SIMPLE BUY/SELL vs LIMIT ORDERS:
- Simple "buy 0.1 ETH" = schedule_swap with tokenIn: "USDC", tokenOut: "ETH", amount: "0.1", recurrence: "once"
- Simple "sell 0.5 ETH" = schedule_swap with tokenIn: "ETH", tokenOut: "USDC", amount: "0.5", recurrence: "once"
- Conditional "buy ETH if price drops below $2000" = limit_order with conditions
- Conditional "sell ETH when price hits $4000" = limit_order with conditions

CRITICAL: Simple buy/sell without conditions should be schedule_swap, NOT limit_order!
- "Save 0x123... as alice" = add_friend with friendName: "alice", friendAddress: "0x123...", action: "add"
- "Add friend bob 0x456..." = add_friend with friendName: "bob", friendAddress: "0x456...", action: "add"
- "List friends" = add_friend with action: "list"
- "Show contacts" = add_friend with action: "list"

SIMPLE BUY/SELL vs LIMIT ORDERS:
- Simple "buy 0.1 ETH" = schedule_swap with tokenIn: "USDC", tokenOut: "ETH", amount: "0.1", recurrence: "once"
- Simple "sell 0.5 ETH" = schedule_swap with tokenIn: "ETH", tokenOut: "USDC", amount: "0.5", recurrence: "once"
- Conditional "buy ETH if price drops below $2000" = limit_order with conditions
- Conditional "sell ETH when price hits $4000" = limit_order with conditions

CRITICAL: Simple buy/sell without conditions should be schedule_swap, NOT limit_order!

Return ONLY valid JSON with this structure (only include relevant parameters):
{
  "type": "cancel_schedules|schedule_swap|invest_real_estate|claim_yield|portfolio_rebalance|market_analysis|stream_money|resolve_basename|borrow_against_assets|auto_rebalance|copy_trading|limit_order|yield_farmer|smart_dca|emergency_brake|add_friend|transfer_shares",
  "description": "Human readable description",
  "params": {
    // For recurring sends (stream_money)
    "recipient": "address or friend name",
    "streamRate": "10 USDC/30sec format",
    "customInterval": "interval in seconds",
    "maxExecutions": "number of executions",
    "amount": "amount per payment",
    "tokenIn": "USDC|ETH|DAI",
    
    // For recurring property investments (schedule_swap with investmentType)
    "propertyId": "1-10 for property investments",
    "propertyAddress": "property contract address",
    "propertyName": "property name",
    "amount": "investment amount",
    "recurrence": "custom for custom intervals",
    "customInterval": "interval in seconds",
    "maxExecutions": "number of executions",
    "investmentType": "recurring_property_investment",
    
    // For regular swaps
    "tokenIn": "ETH|USDC|WETH|DAI",
    "tokenOut": "ETH|USDC|WETH|DAI", 
    
    // For other actions (only include if relevant)
    "action": "create|stop|resolve|set|borrow|repay|activate|deactivate|execute|check|add|list"
  }
}

IMPORTANT: Only include parameters that are relevant to the specific action type. Do not include all parameters for every request.

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
  
  // Validate the response format
  if (!parsed.type || !parsed.description) {
    console.log('⚠️ Invalid Groq response format, falling back to mock parser');
    throw new Error('Invalid response format from Groq');
  }
  
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
async function enhancedMockRWAParser(input: string, userAddress?: string): Promise<ParsedAction> {
  console.log('🔧 Using enhanced RWA mock parser for:', input);
  const lowerInput = input.toLowerCase();
  
  // Helper function to resolve friend names to addresses
  const resolveFriendName = async (friendName: string): Promise<string | null> => {
    if (!userAddress) return null;
    
    try {
      const response = await fetch(`http://localhost:3001/api/friends/${userAddress}/resolve/${friendName}`);
      if (response.ok) {
        const data = await response.json();
        return data.friendAddress;
      }
    } catch (error) {
      console.log('Could not resolve friend name:', friendName);
    }
    return null;
  };
  
  // CRITICAL: Check for cancellation/stopping commands FIRST
  const cancellationWords = ['cancel', 'stop', 'halt', 'abort'];
  const hasCancellation = cancellationWords.some(word => lowerInput.includes(word));
  
  // Check for stop all payments commands
  if (hasCancellation && (lowerInput.includes('all payments') || lowerInput.includes('payments to') || lowerInput.includes('all schedules'))) {
    // Extract recipient if specified
    let recipient = null;
    const toMatch = lowerInput.match(/(?:payments to|stop.*to)\s+([a-zA-Z0-9.]+)/);
    if (toMatch) {
      recipient = toMatch[1];
      // Try to resolve friend name to address
      const friendAddress = await resolveFriendName(recipient);
      if (friendAddress) {
        recipient = friendAddress;
      }
    }
    
    return {
      type: 'cancel_schedules',
      description: recipient ? `Stop all payments to ${recipient}` : 'Stop all payment schedules',
      params: {
        action: 'stop',
        recipient: recipient || 'all'
      }
    };
  }
  
  // CRITICAL: Check for negation first - but be more precise about context
  const directNegation = ['dont', "don't", 'do not', 'never'];
  const hasDirectNegation = directNegation.some(word => lowerInput.includes(word));
  
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
  let recurrence: 'daily' | 'weekly' | 'monthly' | 'once' | 'custom' = 'once';
  let customInterval: number | undefined;
  let maxExecutions: number | undefined;
  
  if (lowerInput.includes('daily') || lowerInput.includes('every day')) recurrence = 'daily';
  if (lowerInput.includes('weekly') || lowerInput.includes('every week')) recurrence = 'weekly';
  if (lowerInput.includes('monthly') || lowerInput.includes('every month')) recurrence = 'monthly';
  
  // Handle custom intervals like "every 30 seconds", "every 5 minutes"
  const customIntervalMatch = input.match(/every\s+(\d+)\s+(second|minute|hour)s?/i);
  if (customIntervalMatch) {
    recurrence = 'custom';
    const value = parseInt(customIntervalMatch[1]);
    const unit = customIntervalMatch[2].toLowerCase();
    
    switch (unit) {
      case 'second':
        customInterval = value;
        break;
      case 'minute':
        customInterval = value * 60;
        break;
      case 'hour':
        customInterval = value * 3600;
        break;
    }
    console.log('🔍 Custom interval detected:', { recurrence, customInterval, value, unit });
  }
  
  // Handle duration limits like "for 2 minutes", "for 1 hour"
  const durationMatch = input.match(/for\s+(\d+)\s+(second|minute|hour)s?/i);
  if (durationMatch && customInterval) {
    const durationValue = parseInt(durationMatch[1]);
    const durationUnit = durationMatch[2].toLowerCase();
    
    let totalDuration = 0;
    switch (durationUnit) {
      case 'second':
        totalDuration = durationValue;
        break;
      case 'minute':
        totalDuration = durationValue * 60;
        break;
      case 'hour':
        totalDuration = durationValue * 3600;
        break;
    }
    
    maxExecutions = Math.floor(totalDuration / customInterval);
  }
  
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
  
  // Rent-to-Own Commands (Real-Time Home Ownership)
  if ((lowerInput.includes('own') && (lowerInput.includes('apartment') || lowerInput.includes('property') || lowerInput.includes('house'))) ||
      (lowerInput.includes('rent') && lowerInput.includes('equity')) ||
      (lowerInput.includes('rent') && lowerInput.includes('own')) ||
      (lowerInput.includes('stream') && lowerInput.includes('own')) ||
      lowerInput.includes('rent-to-own') ||
      lowerInput.includes('rent to own')) {
    
    const property = PROPERTY_REGISTRY.properties.find(p => p.id === propertyId);
    
    // Extract target ownership percentage
    let targetOwnershipPercentage = 5; // Default 5%
    const ownershipMatch = input.match(/(\d+(?:\.\d+)?)%/);
    if (ownershipMatch) {
      targetOwnershipPercentage = parseFloat(ownershipMatch[1]);
    }
    
    // Extract monthly rent amount
    let monthlyRent = '2000'; // Default $2000/month
    const rentMatch = input.match(/\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:\/month|monthly|per month|month)?/i);
    if (rentMatch) {
      monthlyRent = rentMatch[1].replace(/,/g, '');
    }
    
    // Extract target months from date or explicit months
    let targetMonths = 12; // Default 12 months
    
    // Check for "by December", "by March", etc.
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
    const monthMatch = input.match(/by\s+(\w+)/i);
    if (monthMatch) {
      const targetMonth = monthMatch[1].toLowerCase();
      const monthIndex = monthNames.indexOf(targetMonth);
      if (monthIndex !== -1) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        let targetYear = currentYear;
        if (monthIndex <= currentMonth) {
          targetYear++; // Next year if the month has passed
        }
        
        const targetDate = new Date(targetYear, monthIndex, 1);
        const monthsDiff = (targetDate.getFullYear() - currentYear) * 12 + (monthIndex - currentMonth);
        targetMonths = Math.max(1, monthsDiff);
      }
    }
    
    // Check for explicit months like "in 6 months", "12 months"
    const explicitMonthsMatch = input.match(/(?:in\s+)?(\d+)\s+months?/i);
    if (explicitMonthsMatch) {
      targetMonths = parseInt(explicitMonthsMatch[1]);
    }
    
    return {
      type: 'rent_to_own',
      description: `Set up rent-to-own: ${targetOwnershipPercentage}% ownership of ${property?.name || 'Property #' + propertyId} in ${targetMonths} months with $${monthlyRent}/month rent`,
      params: {
        propertyId,
        propertyAddress: property?.address,
        propertyName: property?.name,
        targetOwnershipPercentage: targetOwnershipPercentage,
        targetMonths: targetMonths,
        monthlyRent: monthlyRent,
        action: 'create'
      }
    };
  }
  
  // Intelligent Safety Commands Detection
  let gasLimit: number | undefined;
  let emergencyBrakeBalance: string | undefined;
  let retryInterval: number | undefined;
  let minWalletBalance: string | undefined;
  let gasOptimization: boolean = false;
  
  // Gas limit detection: "only if gas is below 20 gwei", "when gas is under 15 gwei"
  const gasLimitMatch = input.match(/(?:gas.*?below|gas.*?under|gas.*?less than)\s*(\d+)\s*gwei/i);
  if (gasLimitMatch) {
    gasLimit = parseInt(gasLimitMatch[1]);
    console.log('🛡️ Gas limit detected:', gasLimit, 'gwei');
  }
  
  // Emergency brake detection: "pause if balance drops below 500 USDC", "emergency brake at 100 USDC"
  const emergencyBrakeMatch = input.match(/(?:pause.*?below|brake.*?at|balance.*?below)\s*(\d+(?:\.\d+)?)\s*(?:USDC|usdc|\$)?/i);
  if (emergencyBrakeMatch) {
    emergencyBrakeBalance = emergencyBrakeMatch[1];
    console.log('🛡️ Emergency brake detected:', emergencyBrakeBalance, 'USDC');
  }
  
  // Retry interval detection: "try again every hour", "retry every 30 minutes"
  const retryMatch = input.match(/(?:try again|retry).*?every\s*(\d+)\s*(minute|hour)s?/i);
  if (retryMatch) {
    const value = parseInt(retryMatch[1]);
    const unit = retryMatch[2].toLowerCase();
    retryInterval = unit === 'hour' ? value * 60 : value;
    console.log('🛡️ Retry interval detected:', retryInterval, 'minutes');
  }
  
  // Gas optimization detection: "only when gas is cheap", "wait for low gas"
  if (lowerInput.includes('gas is cheap') || lowerInput.includes('low gas') || lowerInput.includes('cheap gas')) {
    gasOptimization = true;
    gasLimit = gasLimit || 20; // Default to 20 gwei if not specified
    console.log('🛡️ Gas optimization enabled');
  }
  
  // Minimum balance detection: "maintain 1000 USDC balance"
  const minBalanceMatch = input.match(/maintain.*?(\d+(?:\.\d+)?)\s*(?:USDC|usdc|\$)/i);
  if (minBalanceMatch) {
    minWalletBalance = minBalanceMatch[1];
    console.log('🛡️ Minimum balance detected:', minWalletBalance, 'USDC');
  }
  
  // Event-Driven Trigger Detection (IFTTT for Web3)
  let eventTrigger: 'usdc_received' | 'eth_received' | 'nft_received' | 'contract_call' | 'price_threshold' | undefined;
  let triggerFrom: string | undefined;
  let triggerTo: string | undefined;
  let triggerAmount: string | undefined;
  let triggerDescription: string | undefined;
  
  // "If [someone] paid me money" detection
  if ((lowerInput.includes('if') || lowerInput.includes('when')) && 
      (lowerInput.includes('paid me') || lowerInput.includes('pays me') || lowerInput.includes('send me money'))) {
    eventTrigger = 'usdc_received';
    
    // Extract sender name: "if diya paid me money", "when boss pays me"
    const senderMatch = input.match(/(?:if|when)\s+(\w+)\s+(?:paid|pays|sends?)\s+me/i);
    if (senderMatch) {
      const senderName = senderMatch[1].toLowerCase();
      // Try to resolve friend name to address
      if (userAddress) {
        try {
          const response = await fetch(`http://localhost:3001/api/friends/${userAddress}/resolve/${senderName}`);
          if (response.ok) {
            const data = await response.json();
            triggerFrom = data.friendAddress;
            triggerDescription = `When ${senderName} sends USDC`;
            console.log('🎯 Event trigger detected:', triggerDescription, 'from', triggerFrom);
          }
        } catch (error) {
          console.log('Could not resolve sender name:', senderName);
        }
      }
      
      if (!triggerFrom) {
        triggerDescription = `When ${senderName} sends USDC (address needed)`;
        console.log('🎯 Event trigger detected:', triggerDescription);
      }
    }
  }
  
  // "When [someone] sends me money" detection
  if (lowerInput.includes('when') && (lowerInput.includes('sends me') || lowerInput.includes('send me') || lowerInput.includes('receive'))) {
    eventTrigger = 'usdc_received';
    
    // Extract sender name: "when diya sends me money", "when my boss pays me"
    const senderMatch = input.match(/when\s+(\w+)\s+(?:sends?|pays?)\s+me/i);
    if (senderMatch) {
      const senderName = senderMatch[1].toLowerCase();
      // Try to resolve friend name to address
      if (userAddress) {
        try {
          const response = await fetch(`http://localhost:3001/api/friends/${userAddress}/resolve/${senderName}`);
          if (response.ok) {
            const data = await response.json();
            triggerFrom = data.friendAddress;
            triggerDescription = `When ${senderName} sends USDC`;
            console.log('🎯 Event trigger detected:', triggerDescription, 'from', triggerFrom);
          }
        } catch (error) {
          console.log('Could not resolve sender name:', senderName);
        }
      }
      
      if (!triggerFrom) {
        triggerDescription = `When ${senderName} sends USDC (address needed)`;
        console.log('🎯 Event trigger detected:', triggerDescription);
      }
    }
    
    // Extract trigger amount: "when I receive 1000 USDC"
    const amountMatch = input.match(/receive.*?(\d+(?:\.\d+)?)\s*(?:USDC|usdc|\$)/i);
    if (amountMatch) {
      triggerAmount = amountMatch[1];
      triggerDescription = triggerDescription ? 
        `${triggerDescription} (min ${triggerAmount} USDC)` : 
        `When receiving ${triggerAmount}+ USDC`;
      console.log('🎯 Trigger amount detected:', triggerAmount, 'USDC');
    }
    
    if (!triggerDescription) {
      triggerDescription = 'When receiving USDC payment';
    }
  }
  
  // "If I get paid" detection
  if ((lowerInput.includes('if') || lowerInput.includes('when')) && 
      (lowerInput.includes('get paid') || lowerInput.includes('salary') || lowerInput.includes('paycheck'))) {
    eventTrigger = 'usdc_received';
    triggerDescription = 'When salary/paycheck arrives';
    console.log('🎯 Salary trigger detected');
  }
  
  // "When someone sends me ETH" detection
  if (lowerInput.includes('when') && lowerInput.includes('eth') && 
      (lowerInput.includes('sends me') || lowerInput.includes('receive'))) {
    eventTrigger = 'eth_received';
    triggerDescription = 'When receiving ETH';
    console.log('🎯 ETH trigger detected');
  }
  
  // Investment Commands with Context Mapping
  if (lowerInput.includes('invest') || (lowerInput.includes('buy') && 
      (lowerInput.includes('property') || lowerInput.includes('real estate') || 
       lowerInput.includes('this') || lowerInput.includes('that')))) {
    
    const property = PROPERTY_REGISTRY.properties.find(p => p.id === propertyId);
    const amount = fiatAmount || (input.match(/\$?(\d+(?:,\d{3})*(?:\.\d+)?)/)?.[1]?.replace(/,/g, '') || '5000');
    
    // Check if this is a recurring investment with custom intervals
    if (recurrence === 'custom' && customInterval && maxExecutions) {
      console.log('🎯 Creating recurring investment:', { recurrence, customInterval, maxExecutions });
      // This is a recurring property investment - use schedule_swap with special investment type
      return {
        type: 'schedule_swap',
        description: `Recurring investment: $${amount} USDC in ${property?.name || 'Property #' + propertyId} every ${customInterval} seconds for ${maxExecutions} times`,
        params: {
          tokenIn: 'USDC',
          tokenOut: 'PROPERTY_SHARES',
          amount: amount,
          recurrence: 'custom',
          customInterval: customInterval,
          maxExecutions: maxExecutions,
          investmentType: 'recurring_property_investment',
          propertyId,
          propertyAddress: property?.address,
          propertyName: property?.name,
          investmentStrategy: 'balanced',
          complianceLevel: 'enhanced'
        }
      };
    } else if (recurrence !== 'once') {
      // Regular recurring investment (daily/weekly/monthly)
      return {
        type: 'schedule_swap',
        description: `${recurrence.charAt(0).toUpperCase() + recurrence.slice(1)} investment: $${amount} USDC in ${property?.name || 'Property #' + propertyId}`,
        params: {
          tokenIn: 'USDC',
          tokenOut: 'PROPERTY_SHARES',
          amount: amount,
          recurrence: recurrence,
          investmentType: 'recurring_property_investment',
          propertyId,
          propertyAddress: property?.address,
          propertyName: property?.name,
          investmentStrategy: 'balanced',
          complianceLevel: 'enhanced'
        }
      };
    } else {
      // One-time investment
      return {
        type: 'invest_real_estate',
        description: `Invest $${amount} in ${property?.name || 'Property #' + propertyId}`,
        params: {
          propertyId,
          propertyAddress: property?.address,
          propertyName: property?.name,
          amount: amount,
          recurrence: recurrence,
          investmentStrategy: 'balanced',
          complianceLevel: 'enhanced'
        }
      };
    }
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

  // Event-Driven Payment Commands (IFTTT for Web3) - Check this FIRST
  if (eventTrigger && (lowerInput.includes('send') || lowerInput.includes('pay'))) {
    // Extract recipient from the action part: "send it to krish", "pay krish"
    let recipient = '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6'; // default recipient
    
    // Look for "send it to [name]" or "pay [name]"
    const actionRecipientMatch = input.match(/(?:send.*?to|pay)\s+(\w+)(?:\s|$)/i);
    if (actionRecipientMatch) {
      const recipientName = actionRecipientMatch[1];
      // Try to resolve friend name to address
      const resolvedAddress = await resolveFriendName(recipientName);
      if (resolvedAddress) {
        recipient = resolvedAddress;
      } else {
        recipient = recipientName; // Keep the name if not found, frontend can handle
      }
    }
    
    // Default amount - will be the same amount received from the trigger
    const amount = triggerAmount || '100'; // Default 100 USDC if no specific amount
    
    console.log('🎯 DETECTED EVENT-DRIVEN PAYMENT:', { eventTrigger, triggerFrom, recipient, amount });
    
    return {
      type: 'stream_money',
      description: `Send money to ${actionRecipientMatch ? actionRecipientMatch[1] : recipient} when ${triggerDescription || 'trigger event occurs'}`,
      params: {
        action: 'create',
        recipient: recipient,
        amount: amount,
        tokenIn: 'USDC',
        eventTrigger: eventTrigger,
        triggerFrom: triggerFrom,
        triggerTo: triggerTo,
        triggerAmount: triggerAmount,
        triggerDescription: triggerDescription,
        streamRate: `${amount} USDC/trigger`, // Special format for event-driven
        superToken: 'fUSDCx'
      }
    };
  }

  // Recurring Send Commands (must come before simple transfer logic)
  if ((lowerInput.includes('send') || lowerInput.includes('transfer')) && 
      (lowerInput.includes('usdc') || lowerInput.includes('eth') || lowerInput.includes('dai') || 
       lowerInput.includes('dollar') || lowerInput.includes('usd')) &&
      lowerInput.includes('to') &&
      (lowerInput.includes('every') || lowerInput.includes('recurring'))) {
    
    console.log('🎯 DETECTED RECURRING SEND:', input);
    
    // Extract recipient (could be basename, address, or friend name)
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
    
    // Check for simple recipient name (like "krish" - could be a friend)
    const nameMatch = input.match(/to\s+(\w+)(?:\s|$)/i);
    if (nameMatch && !basenameMatch && !addressMatch) {
      const friendName = nameMatch[1];
      // Try to resolve friend name to address
      const resolvedAddress = await resolveFriendName(friendName);
      if (resolvedAddress) {
        recipient = resolvedAddress;
      } else {
        recipient = friendName; // Keep the name if not found, frontend can handle
      }
    }
    
    // Extract amount and token
    const amountMatch = input.match(/(\d+(?:\.\d+)?)\s*(usdc|eth|dai|weth|usd|dollar|dollars)/i);
    const amount = amountMatch ? amountMatch[1] : '10';
    let token = amountMatch ? amountMatch[2].toUpperCase() : 'USDC';
    
    // Convert USD/dollar aliases to USDC
    if (token === 'USD' || token === 'DOLLAR' || token === 'DOLLARS') {
      token = 'USDC';
    }
    
    // Build stream rate from interval
    let streamRate = `${amount} ${token}/30sec`; // default
    if (customInterval && customInterval > 0) {
      if (customInterval < 60) {
        streamRate = `${amount} ${token}/${customInterval}sec`;
      } else if (customInterval < 3600) {
        streamRate = `${amount} ${token}/${Math.floor(customInterval/60)}min`;
      } else if (customInterval < 86400) {
        streamRate = `${amount} ${token}/${Math.floor(customInterval/3600)}hour`;
      } else {
        streamRate = `${amount} ${token}/${Math.floor(customInterval/86400)}day`;
      }
    }
    
    console.log('🎯 RETURNING STREAM_MONEY:', { amount, token, recipient, streamRate, customInterval, maxExecutions });
    
    return {
      type: 'stream_money',
      description: `Send ${amount} ${token} to ${nameMatch ? nameMatch[1] : recipient} every ${customInterval || 30} seconds${maxExecutions ? ` for ${maxExecutions} times` : ''}`,
      params: {
        action: 'create',
        recipient: recipient,
        streamRate: streamRate,
        superToken: token === 'USDC' ? 'fUSDCx' : 'fETHx',
        customInterval: customInterval,
        maxExecutions: maxExecutions,
        amount: amount,
        tokenIn: token
      }
    };
  }

  // Simple Transfer Commands (must come before streaming logic)
  if ((lowerInput.includes('send') || lowerInput.includes('transfer')) && 
      (lowerInput.includes('usdc') || lowerInput.includes('eth') || lowerInput.includes('dai') || 
       lowerInput.includes('dollar') || lowerInput.includes('usd') || lowerInput.includes('$')) &&
      lowerInput.includes('to') &&
      !lowerInput.includes('stream') && !lowerInput.includes('salary') && 
      !lowerInput.includes('every') && !lowerInput.includes('recurring')) {
    
    console.log('🎯 DETECTED SIMPLE TRANSFER:', input);
    
    // Extract recipient (could be basename, address, or friend name)
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
    
    // Check for simple recipient name (like "krish" - could be a friend)
    const nameMatch = input.match(/to\s+(\w+)(?:\s|$)/i);
    if (nameMatch && !basenameMatch && !addressMatch) {
      const friendName = nameMatch[1];
      // Try to resolve friend name to address
      const resolvedAddress = await resolveFriendName(friendName);
      if (resolvedAddress) {
        recipient = resolvedAddress;
      } else {
        recipient = friendName; // Keep the name if not found, frontend can handle
      }
    }
    
    // Extract amount and token
    const amountMatch = input.match(/(\d+(?:\.\d+)?)\s*(usdc|eth|dai|weth|usd|dollar|dollars)/i);
    const amount = amountMatch ? amountMatch[1] : '10';
    let token = amountMatch ? amountMatch[2].toUpperCase() : 'USDC';
    
    // Convert USD/dollar aliases to USDC
    if (token === 'USD' || token === 'DOLLAR' || token === 'DOLLARS') {
      token = 'USDC';
    }
    
    console.log('🎯 RETURNING TRANSFER_SHARES:', { amount, token, recipient });
    
    return {
      type: 'transfer_shares',
      description: `Send ${amount} ${token} to ${nameMatch ? nameMatch[1] : recipient}`,
      params: {
        action: 'transfer',
        tokenIn: token,
        tokenOut: token, // Same token for simple transfer
        amount: amount,
        recipient: recipient,
        recurrence: 'once' // One-time transfer
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
    
    // Check for simple recipient name (like "alice" - could be a friend)
    const nameMatch = input.match(/to\s+(\w+)(?:\s|$)/i);
    if (nameMatch && !basenameMatch && !addressMatch) {
      const friendName = nameMatch[1];
      // Try to resolve friend name to address
      const resolvedAddress = await resolveFriendName(friendName);
      if (resolvedAddress) {
        recipient = resolvedAddress;
      } else {
        recipient = friendName; // Keep the name if not found, frontend can handle
      }
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

  // Simple Buy/Sell Commands (not limit orders)
  if ((lowerInput.includes('buy') || lowerInput.includes('sell')) && 
      !lowerInput.includes('if') && !lowerInput.includes('when') && 
      !lowerInput.includes('below') && !lowerInput.includes('above')) {
    
    // This is a simple buy/sell, not a limit order
    const isBuy = lowerInput.includes('buy');
    
    // Extract amount and token
    const amountMatch = input.match(/(\d+(?:\.\d+)?)/);
    const tokenMatch = input.match(/\b(ETH|USDC|WETH|DAI)\b/gi);
    
    const amount = amountMatch ? amountMatch[1] : '1';
    const targetToken = tokenMatch ? tokenMatch[0].toUpperCase() : 'ETH';
    
    if (isBuy) {
      // Buying ETH with USDC (most common case)
      return {
        type: 'schedule_swap',
        description: `Buy ${amount} ${targetToken} with USDC`,
        params: {
          action: 'create',
          tokenIn: 'USDC',
          tokenOut: targetToken,
          amount: amount,
          recurrence: 'once'
        }
      };
    } else {
      // Selling ETH for USDC
      return {
        type: 'schedule_swap',
        description: `Sell ${amount} ${targetToken} for USDC`,
        params: {
          action: 'create',
          tokenIn: targetToken,
          tokenOut: 'USDC',
          amount: amount,
          recurrence: 'once'
        }
      };
    }
  }

  // Limit Order Commands (with conditions)
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
  
  // Friend Management Commands
  if ((lowerInput.includes('save') || lowerInput.includes('add')) && 
      (lowerInput.includes('friend') || lowerInput.includes('contact') || 
       (lowerInput.includes('as') && input.match(/0x[a-fA-F0-9]{40}/)))) {
    
    // Extract address and name
    const addressMatch = input.match(/(0x[a-fA-F0-9]{40})/);
    let friendName = '';
    let friendAddress = '';
    
    if (addressMatch) {
      friendAddress = addressMatch[1];
      
      // Try to extract name after "as" or "save ... as"
      const nameAfterAs = input.match(/as\s+(\w+)/i);
      if (nameAfterAs) {
        friendName = nameAfterAs[1];
      } else {
        // Try to extract name before address
        const nameBeforeAddress = input.match(/(\w+)\s+0x/i);
        if (nameBeforeAddress) {
          friendName = nameBeforeAddress[1];
        }
      }
    }
    
    if (friendAddress && friendName) {
      return {
        type: 'add_friend',
        description: `Save ${friendAddress} as "${friendName}"`,
        params: {
          action: 'add',
          friendName: friendName,
          friendAddress: friendAddress
        }
      };
    } else {
      return {
        type: 'add_friend',
        description: 'Please provide both a name and address. Example: "save 0x123... as alice"',
        params: {
          action: 'error',
          error: 'Missing name or address',
          message: 'Format: "save 0x123... as alice" or "add friend alice 0x123..."'
        }
      };
    }
  }

  // List Friends Command
  if ((lowerInput.includes('list') || lowerInput.includes('show')) && 
      (lowerInput.includes('friends') || lowerInput.includes('contacts'))) {
    return {
      type: 'add_friend',
      description: 'Show all saved friends',
      params: {
        action: 'list'
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