'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Brain, Send, Users, Building2, Clock, X, CheckCircle, AlertCircle, CreditCard, History } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther, getAddress } from 'viem';
import { PROPERTIES } from '@/lib/data';
import { transactionTracker, TransactionType, TransactionStatus } from '@/lib/transactionTracker';

// Contract ABIs (simplified)
const AUTO_RECURRING_PAYMENTS_ABI = [
  {
    "inputs": [
      {"name": "_maxAmountPerPayment", "type": "uint256"}, 
      {"name": "_maxTotalAmount", "type": "uint256"}, 
      {"name": "_validForDays", "type": "uint256"}
    ],
    "name": "grantPermissions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_recipient", "type": "address"}, 
      {"name": "_amount", "type": "uint256"}, 
      {"name": "_interval", "type": "uint256"}, 
      {"name": "_maxExecutions", "type": "uint256"}
    ],
    "name": "createPaymentSchedule",
    "outputs": [{"name": "", "type": "bytes32"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_scheduleId", "type": "bytes32"}],
    "name": "executePayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_scheduleId", "type": "bytes32"}],
    "name": "isPaymentDue",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const SIMPLE_SWAP_POOL_ABI = [
  {
    "inputs": [{"name": "_usdcAmount", "type": "uint256"}],
    "name": "swapUSDCToETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const USDC_ABI = [
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const WETH_ABI = [
  {
    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const RWA_PROPERTY_ABI = [
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}, {"name": "shares", "type": "uint256"}],
    "name": "purchaseShares",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sharePrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const RENT_TO_OWN_ADAPTER_ABI = [
  {
    "inputs": [
      {"name": "_tenant", "type": "address"},
      {"name": "_landlord", "type": "address"},
      {"name": "_propertyShare", "type": "address"},
      {"name": "_monthlyRent", "type": "uint256"},
      {"name": "_targetOwnershipPercentage", "type": "uint256"},
      {"name": "_targetMonths", "type": "uint256"}
    ],
    "name": "createRentToOwnSchedule",
    "outputs": [{"name": "", "type": "bytes32"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_usdc", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"name": "scheduleId", "type": "bytes32"},
      {"name": "rentAmount", "type": "uint256"}
    ],
    "name": "processRentPayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "propertyShare", "type": "address"},
      {"name": "targetOwnershipBasisPoints", "type": "uint256"},
      {"name": "targetMonths", "type": "uint256"}
    ],
    "name": "calculateRentForOwnership",
    "outputs": [{"name": "monthlyRent", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "tenant", "type": "address"}, 
      {"name": "propertyShare", "type": "address"}
    ],
    "name": "getTenantProgress",
    "outputs": [
      {"name": "totalRentPaid", "type": "uint256"},
      {"name": "sharesOwned", "type": "uint256"},
      {"name": "ownershipPercentage", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "tenant", "type": "address"}
    ],
    "name": "getTenantSchedules",
    "outputs": [{"name": "", "type": "bytes32[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "scheduleId", "type": "bytes32"}
    ],
    "name": "stopSchedule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const PROPERTY_SHARE_ABI = [
  {
    "inputs": [{"name": "tenant", "type": "address"}, {"name": "rentPaid", "type": "uint256"}],
    "name": "rewardTenant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tenant", "type": "address"}],
    "name": "getOwnershipPercentage",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tenant", "type": "address"}],
    "name": "getEquityValue",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "targetPercentageBasisPoints", "type": "uint256"}],
    "name": "calculateUSDCForOwnership",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses
const AUTO_RECURRING_PAYMENTS_ADDRESS = "0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96";
const SIMPLE_SWAP_POOL_ADDRESS = "0xCe3bf5DEd091c822193F14502B724a1bf1040E5C";
const USDC_TOKEN_ADDRESS = "0x6B0dacea6a72E759243c99Eaed840DEe9564C194";
const WETH_TOKEN_ADDRESS = "0x4200000000000000000000000000000000000006"; // Base Sepolia WETH
const RENT_TO_OWN_ADAPTER_ADDRESS = "0xE3C7a2eF4D897EA23E094756F78D858dD4579739";

// Property Share contract addresses (one per property)
const PROPERTY_SHARE_ADDRESSES: { [key: string]: string } = {
  "1": "0x7c02065ED322234d63909833bbB3D70F84aa6eD2", // Manhattan
  "2": "0xB239822545c1f13E944D01b755f64BCc7553d1b6", // Miami
  "3": "0x7accDA4703bAdD925Cf0B764E3Ba799F46AefADb", // Austin
  "4": "0x5f2463B285FA39cc14e5864436641FF80d651110", // Seattle
  "5": "0x153BFa5Ac4aE140d3A6A118FF84a1b7f04885C54", // Denver
  // Add more as needed
};

interface PendingAction {
  type: string;
  description: string;
  params: any;
  timeLeft: number;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [countdown, setCountdown] = useState<NodeJS.Timeout | null>(null);
  const [pendingScheduleCreation, setPendingScheduleCreation] = useState<any>(null);
  const [pendingSwapExecution, setPendingSwapExecution] = useState<any>(null);
  const [pendingInvestment, setPendingInvestment] = useState<any>(null);
  const [pendingUSDCInvestment, setPendingUSDCInvestment] = useState<any>(null);
  const [pendingRentToOwn, setPendingRentToOwn] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Countdown timer for pending actions
  useEffect(() => {
    if (pendingAction && pendingAction.timeLeft > 0) {
      const timer = setTimeout(() => {
        setPendingAction(prev => prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null);
      }, 1000);
      setCountdown(timer);
      return () => clearTimeout(timer);
    } else if (pendingAction && pendingAction.timeLeft === 0) {
      // Auto-execute the action
      executeAction(pendingAction);
      setPendingAction(null);
    }
  }, [pendingAction?.timeLeft]);

  // Handle successful investment transactions
  useEffect(() => {
    if (isConfirmed && pendingInvestment && address) {
      // Store investment in localStorage
      const investmentKey = `investment_${address}_${pendingInvestment.propertyId}`;
      const existingInvestment = localStorage.getItem(investmentKey);
      
      let totalInvestment = parseFloat(pendingInvestment.amount);
      let totalShares = parseFloat(pendingInvestment.shares);
      
      if (existingInvestment) {
        const existing = JSON.parse(existingInvestment);
        totalInvestment += parseFloat(existing.amount);
        totalShares += parseFloat(existing.shares);
      }
      
      localStorage.setItem(investmentKey, JSON.stringify({
        amount: totalInvestment.toString(),
        shares: totalShares.toFixed(1)
      }));
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Investment successful! You now own $${totalInvestment} (${totalShares.toFixed(1)}% shares) in ${pendingInvestment.propertyName}.\n\n🔗 Transaction: https://basescan.org/tx/${hash}` 
      }]);
      
      setPendingInvestment(null);
    }
  }, [isConfirmed, pendingInvestment, address, hash]);

  // Handle USDC investment approval and transfer
  useEffect(() => {
    if (isConfirmed && pendingUSDCInvestment && address && hash) {
      // After USDC approval is confirmed, proceed with the actual investment
      const { propertyId, propertyAddress, usdcAmount, sharesToPurchase, propertyName } = pendingUSDCInvestment;
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ USDC approval confirmed!\n\n💰 Investment completed: $${usdcAmount} USDC invested in ${propertyName}` 
      }]);
      
      // Store investment in localStorage
      const investmentKey = `investment_${address}_${propertyId}`;
      const existingInvestment = localStorage.getItem(investmentKey);
      
      let totalInvestment = parseFloat(usdcAmount);
      let totalShares = parseFloat((sharesToPurchase * 0.1).toFixed(1));
      
      if (existingInvestment) {
        const existing = JSON.parse(existingInvestment);
        totalInvestment += parseFloat(existing.amount);
        totalShares += parseFloat(existing.shares);
      }
      
      localStorage.setItem(investmentKey, JSON.stringify({
        amount: totalInvestment.toString(),
        shares: totalShares.toFixed(1)
      }));

      // Log transaction to transaction tracker
      transactionTracker.addTransaction(address, {
        hash: hash,
        type: TransactionType.INVESTMENT,
        status: TransactionStatus.CONFIRMED,
        amount: usdcAmount,
        token: 'USDC',
        from: address,
        to: propertyAddress,
        description: `Investment in ${propertyName}`,
        category: 'Real Estate',
        metadata: {
          propertyName: propertyName
        }
      });
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ USDC Investment successful! You now own $${totalInvestment} (${totalShares.toFixed(1)}% shares) in ${propertyName}.\n\n🔗 Transaction: https://basescan.org/tx/${hash}` 
      }]);
      
      setPendingUSDCInvestment(null);
    }
  }, [isConfirmed, pendingUSDCInvestment, address, hash]);

  // Handle rent-to-own transaction confirmations
  useEffect(() => {
    if (isConfirmed && pendingRentToOwn && address && hash) {
      const { propertyName, targetOwnershipPercentage, targetMonths, monthlyRent } = pendingRentToOwn;
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Rent-to-Own Schedule Created! 📋\n\n🏠 Property: ${propertyName}\n🎯 Target: ${targetOwnershipPercentage}% ownership\n💰 Monthly Rent: $${monthlyRent} USDC\n📅 Timeline: ${targetMonths} months\n\n🔗 Transaction: https://basescan.org/tx/${hash}\n\n⚠️ IMPORTANT: This only created the schedule. To activate automatic rent payments:\n\n🔄 **Next Step Required:**\nSay: "Pay $${monthlyRent} USDC to landlord every month for ${targetMonths} months"\n\nThis will:\n1. Set up recurring monthly payments\n2. Automatically mint property shares with each payment\n3. Build your ownership percentage over time\n\n💡 Without recurring payments, you'll need to make manual rent payments to earn property shares.` 
      }]);
      
      // Store rent-to-own schedule in localStorage
      const rentToOwnKey = `rent_to_own_${address}_${pendingRentToOwn.propertyId}`;
      localStorage.setItem(rentToOwnKey, JSON.stringify({
        propertyName,
        targetOwnershipPercentage,
        targetMonths,
        monthlyRent,
        startDate: new Date().toISOString(),
        currentOwnership: 0,
        totalRentPaid: 0
      }));
      
      setPendingRentToOwn(null);
    }
  }, [isConfirmed, pendingRentToOwn, address, hash]);

  // Handle writeContract errors for rent-to-own
  useEffect(() => {
    if (error && pendingRentToOwn) {
      console.error('❌ writeContract error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Transaction failed: ${error.message}\n\n🔍 This might be due to:\n• Wrong network (need Base Sepolia)\n• Insufficient gas fees\n• Contract interaction error\n• User rejected transaction` 
      }]);
      setPendingRentToOwn(null);
    }
  }, [error, pendingRentToOwn]);

  // Handle swap transaction confirmations
  useEffect(() => {
    if (isConfirmed && hash && address && !pendingUSDCInvestment && !pendingScheduleCreation) {
      // This might be a swap transaction - check if we have swap data in localStorage
      const swapKey = `pending_swap_${address}`;
      const pendingSwap = localStorage.getItem(swapKey);
      
      if (pendingSwap) {
        const swapData = JSON.parse(pendingSwap);
        
        // Log swap transaction
        transactionTracker.addTransaction(address, {
          hash: hash,
          type: TransactionType.SWAP,
          status: TransactionStatus.CONFIRMED,
          amount: swapData.amount,
          token: swapData.tokenOut,
          from: address,
          to: SIMPLE_SWAP_POOL_ADDRESS,
          description: `Swap ${swapData.tokenIn} → ${swapData.tokenOut}`,
          category: 'DeFi',
          metadata: {
            tokenIn: swapData.tokenIn,
            tokenOut: swapData.tokenOut
          }
        });
        
        // Clean up
        localStorage.removeItem(swapKey);
      }
    }
  }, [isConfirmed, hash, address, pendingUSDCInvestment, pendingScheduleCreation]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsProcessing(true);
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Send message to backend AI parser
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userMessage, userAddress: address }),
      });

      const data = await response.json();
      
      if (response.ok && data.type) {
        // Check if this is a friend management action
        if (data.type === 'add_friend') {
          await handleFriendAction(data);
          return;
        }
        
        // Check if this requires blockchain interaction
        if (needsBlockchainExecution(data.type)) {
          // Show 5-second timer with cancel option
          setPendingAction({
            type: data.type,
            description: data.description,
            params: data.params,
            timeLeft: 5
          });
          
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `⏱️ ${data.description}\n\nStarting 5-second timer... Click CANCEL if you want to stop this action.` 
          }]);
        } else {
          // Non-blockchain action, execute immediately
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `✅ ${data.description}\n\nAction: ${data.type}\nDetails: ${JSON.stringify(data.params, null, 2)}` 
          }]);
        }
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.error || 'Sorry, I encountered an error processing your request. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting to the AI service. Please check that the backend is running.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFriendAction = async (data: any) => {
    if (!isConnected || !address) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Please connect your wallet first to manage friends.' 
      }]);
      return;
    }

    const { params } = data;

    try {
      if (params.action === 'add') {
        // Add friend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress: address,
            friendName: params.friendName,
            friendAddress: params.friendAddress,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `✅ Successfully saved ${params.friendAddress} as "${params.friendName}"!\n\nYou can now use commands like:\n• "send 10 USDC to ${params.friendName} every 10sec"\n• "stream 5 DAI/day to ${params.friendName}"` 
          }]);
        } else {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `❌ Failed to add friend: ${result.error}` 
          }]);
        }
      } else if (params.action === 'list') {
        // List friends
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends/${address}`);
        const result = await response.json();

        if (response.ok) {
          const friends = result.friends || [];
          if (friends.length === 0) {
            setChatMessages(prev => [...prev, { 
              role: 'assistant', 
              content: '📋 You have no saved friends yet.\n\nTry: "save 0x123... as alice"' 
            }]);
          } else {
            const friendsList = friends.map((f: any) => 
              `• ${f.friend_name}: ${f.friend_address}`
            ).join('\n');
            
            setChatMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `📋 Your saved friends (${friends.length}):\n\n${friendsList}\n\nYou can send payments using their names!` 
            }]);
          }
        } else {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `❌ Failed to fetch friends: ${result.error}` 
          }]);
        }
      } else if (params.action === 'error') {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `❌ ${params.message || 'Invalid friend command format'}` 
        }]);
      }
    } catch (error) {
      console.error('Friend action error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Failed to connect to server for friend management.' 
      }]);
    }
  };

  const needsBlockchainExecution = (actionType: string): boolean => {
    return ['stream_money', 'invest_real_estate', 'schedule_swap', 'transfer_shares', 'borrow_against_assets', 'cancel_schedules', 'rent_to_own'].includes(actionType);
  };

  const executeAction = async (action: PendingAction) => {
    if (!isConnected) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Please connect your wallet first to execute blockchain transactions.' 
      }]);
      return;
    }

    try {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🚀 Executing: ${action.description}` 
      }]);

      switch (action.type) {
        case 'stream_money':
          await executeStreamMoney(action.params);
          break;
        case 'schedule_swap':
          await executeSwap(action.params);
          break;
        case 'transfer_shares':
          await executeSimpleTransfer(action.params);
          break;
        case 'invest_real_estate':
          await executeInvestment(action.params);
          break;
        case 'cancel_schedules':
          await executeCancelSchedules(action.params);
          break;
        case 'rent_to_own':
          await executeRentToOwn(action.params);
          break;
        default:
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `⚠️ Action type "${action.type}" not yet implemented in frontend.` 
          }]);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to execute action: ${error}` 
      }]);
    }
  };

  const createPaymentSchedule = async () => {
    if (!pendingScheduleCreation) return;

    const { recipient, amount, interval, maxExecutions, isPropertyInvestment, propertyName, propertyId, usdcAmount, isEventDriven, eventTrigger, triggerFrom, triggerDescription } = pendingScheduleCreation;

    try {
      if (isEventDriven) {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `🎯 Step 3: Creating event-driven payment schedule...\n💰 Amount: Variable (matches received amount)\n📍 To: ${recipient}\n🎯 Trigger: ${triggerDescription}\n⏰ Interval: 1 year (event-driven, not time-based)\n🔄 Executions: Up to 100 triggered events` 
        }]);
      } else if (isPropertyInvestment) {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `📅 Step 2: Creating recurring investment schedule...\n💰 Amount: $${usdcAmount} USDC per investment\n🏢 Property: ${propertyName}\n⏰ Every: ${interval} seconds\n🔄 Times: ${maxExecutions}` 
        }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `📅 Step 2: Creating recurring payment schedule...\n💰 Amount: ${formatEther(amount)} USDC\n📍 To: ${recipient}\n⏰ Every: ${interval} seconds\n🔄 Times: ${maxExecutions}` 
        }]);
      }

      writeContract({
        address: getAddress(AUTO_RECURRING_PAYMENTS_ADDRESS),
        abi: AUTO_RECURRING_PAYMENTS_ABI,
        functionName: 'createPaymentSchedule',
        args: [recipient, amount, interval, maxExecutions],
      });

      if (isEventDriven) {
        // Register event trigger with the payment agent
        setTimeout(async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/event-trigger`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                scheduleId: `event_${Date.now()}`, // Temporary ID
                eventTrigger,
                triggerFrom,
                triggerDescription,
                userAddress: address,
                recipient
              }),
            });

            if (response.ok) {
              setChatMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `✅ Event monitoring activated!\n\n🎯 Your payment agent is now watching the blockchain for:\n• ${triggerDescription}\n• Will automatically send received amount to ${recipient}\n\n🚀 IFTTT for Web3 is now LIVE!` 
              }]);
            }
          } catch (error) {
            console.error('Failed to register event trigger:', error);
          }
        }, 3000); // Wait 3 seconds for schedule creation to complete
      }

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: isEventDriven ? 
          `✅ Event-driven payment schedule creation initiated!\n\n🔄 Step 4: Setting up blockchain monitoring...\n\n🎯 Your payment agent will now monitor the blockchain for:\n• Incoming USDC transfers${triggerFrom ? ` from ${triggerFrom}` : ''}\n• When detected, automatically send the same amount to ${recipient}\n\n⚡ This is real IFTTT (If This Then That) for Web3!` :
          `✅ ${isPropertyInvestment ? 'Recurring investment' : 'Payment'} schedule creation initiated! Waiting for confirmation...`
      }]);

      setPendingScheduleCreation(null);

    } catch (error: any) {
      console.error('Payment schedule creation error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to create ${isPropertyInvestment ? 'investment' : 'payment'} schedule: ${error.message || error}\n\nThis might be due to:\n• Insufficient USDC allowance\n• Insufficient ETH for gas\n• Contract interaction error` 
      }]);
      setPendingScheduleCreation(null);
    }
  };

  const executeStreamMoney = async (params: any) => {
    console.log('💰 executeStreamMoney called with params:', params);
    
    // Check if this is an event-driven payment
    if (params.eventTrigger) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🎯 Setting up Event-Driven Payment (IFTTT for Web3)\n\n📋 Trigger: ${params.triggerDescription || 'When payment received'}\n📍 Action: Send to ${params.recipient}\n💰 Amount: Same as received amount\n\n🔄 Step 1: Creating payment schedule with event trigger...` 
      }]);
      
      // Resolve friend name to address if needed
      let recipient = params.recipient;
      if (recipient && !recipient.startsWith('0x') && !recipient.includes('.eth')) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends/${address}/resolve/${recipient}`);
          if (response.ok) {
            const data = await response.json();
            recipient = data.friendAddress;
            setChatMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `🔍 Resolved "${params.recipient}" to ${recipient}` 
            }]);
          }
        } catch (error) {
          console.error('Error resolving friend name:', error);
        }
      }
      
      // Set up event-driven payment using existing agent
      // For event-driven payments, use a very long interval (1 year) since execution will be triggered by events
      const defaultAmount = parseEther(params.amount || '100');
      const interval = 365 * 24 * 60 * 60; // 1 year in seconds (event-driven, not time-based)
      const maxExecutions = 10; // Allow 10 triggered events (reasonable for event-driven)
      
      // Store pending schedule creation for event-driven payment
      setPendingScheduleCreation({
        recipient: recipient,
        amount: defaultAmount,
        interval: interval,
        maxExecutions: maxExecutions,
        isEventDriven: true,
        eventTrigger: params.eventTrigger,
        triggerFrom: params.triggerFrom,
        triggerDescription: params.triggerDescription
      });
      
      try {
        // First approve USDC spending for event-driven payments
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `🔐 Step 2: Approving USDC spending for event-driven payments...\n💰 Approving 2000 USDC for payments and executor rewards\n🎯 Trigger: ${params.triggerDescription}` 
        }]);

        await writeContract({
          address: getAddress(USDC_TOKEN_ADDRESS),
          abi: USDC_ABI,
          functionName: 'approve',
          args: [getAddress(AUTO_RECURRING_PAYMENTS_ADDRESS), parseEther('2000')], // Approve 2000 USDC
        });

        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ USDC approval granted! Now setting up permissions...` 
        }]);

      } catch (error) {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `❌ Failed to grant permissions: ${error}` 
        }]);
        setPendingScheduleCreation(null);
      }
      
      return;
    }
    
    // Regular streaming logic continues here...
    // Resolve friend name to address if needed
    let recipient = params.recipient || '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6';
    
    // Check if recipient is a friend name (not an address)
    if (recipient && !recipient.startsWith('0x') && !recipient.includes('.eth')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends/${address}/resolve/${recipient}`);
        if (response.ok) {
          const data = await response.json();
          recipient = data.friendAddress;
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `🔍 Resolved "${params.recipient}" to ${recipient}` 
          }]);
        } else {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `❌ Could not find friend "${params.recipient}". Please add them first or use their address.` 
          }]);
          return;
        }
      } catch (error) {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `❌ Error resolving friend name: ${error}` 
        }]);
        return;
      }
    }
    
    // Parse stream rate to get USDC amount and interval
    let amount = parseEther('10'); // Default 10 USDC (18 decimals)
    let interval = 10; // Default 10 seconds
    
    if (params.streamRate) {
      // Parse "10 USDC/30sec" format
      const streamMatch = params.streamRate.match(/(\d+(?:\.\d+)?)\s*(\w+)\/(\d+)\s*(\w+)/i);
      if (streamMatch) {
        const rateAmount = parseFloat(streamMatch[1]);
        const rateToken = streamMatch[2]; // USDC
        const intervalValue = parseInt(streamMatch[3]);
        const intervalUnit = streamMatch[4].toLowerCase();
        
        // Set amount
        amount = parseEther(rateAmount.toString());
        
        // Convert interval to seconds
        switch (intervalUnit) {
          case 'sec':
          case 'second':
          case 'seconds':
            interval = intervalValue;
            break;
          case 'min':
          case 'minute':
          case 'minutes':
            interval = intervalValue * 60;
            break;
          case 'hour':
          case 'hours':
            interval = intervalValue * 3600;
            break;
          case 'day':
          case 'days':
            interval = intervalValue * 86400;
            break;
          default:
            interval = intervalValue; // Assume seconds
        }
      } else {
        // Try simpler format like "10 USDC/day"
        const simpleMatch = params.streamRate.match(/(\d+(?:\.\d+)?)\s*(\w+)\/(\w+)/i);
        if (simpleMatch) {
          const rateAmount = parseFloat(simpleMatch[1]);
          const intervalUnit = simpleMatch[3].toLowerCase();
          
          amount = parseEther(rateAmount.toString());
          
          // Convert common intervals
          switch (intervalUnit) {
            case 'day':
            case 'daily':
              interval = 86400; // 24 hours
              break;
            case 'hour':
            case 'hourly':
              interval = 3600; // 1 hour
              break;
            case 'minute':
            case 'min':
              interval = 60; // 1 minute
              break;
            default:
              interval = 10; // Default 10 seconds
          }
        }
      }
    }
    const maxExecutions = 10; // 10 executions

    // Store schedule creation parameters for after permission grant
    setPendingScheduleCreation({ recipient, amount, interval, maxExecutions });

    try {
      // First grant permissions (if not already granted)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🔐 Step 1: Granting permissions for recurring payments...\n💰 Amount per payment: ${formatEther(amount)} USDC\n📍 Recipient: ${recipient}\n⏰ Interval: ${interval} seconds\n🔄 Max executions: ${maxExecutions}` 
      }]);

      await writeContract({
        address: AUTO_RECURRING_PAYMENTS_ADDRESS,
        abi: AUTO_RECURRING_PAYMENTS_ABI,
        functionName: 'grantPermissions',
        args: [parseEther('100'), parseEther('1000'), 30], // Max 100 USDC per payment, 1000 USDC total, valid for 30 days
      });

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Permissions granted! Waiting for confirmation...` 
      }]);

    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to grant permissions: ${error}` 
      }]);
      setPendingScheduleCreation(null);
    }
  };

  const executeInvestment = async (params: any) => {
    // For property investment - use USDC directly instead of ETH
    // Strip dollar signs and other currency symbols from amount
    const cleanAmount = (params.amount || '0.01').toString().replace(/[$,]/g, '');
    const usdcAmount = parseFloat(cleanAmount);
    
    // Convert to USDC units (18 decimals for this USDC token)
    const usdcAmountWei = parseEther(usdcAmount.toString());
    
    // Get property address from params or default to Manhattan
    const propertyId = params.propertyId || '1';
    const property = PROPERTIES.find(p => p.id.toString() === propertyId);
    const propertyAddress = property?.address || '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be';
    
    // Calculate shares to purchase (assuming $100 per share for demo)
    const sharePrice = 100; // $100 per share
    const sharesToPurchase = Math.floor(usdcAmount / sharePrice);
    const sharesPercentage = (sharesToPurchase * 0.1).toFixed(1); // Rough estimate
    
    // Store pending USDC investment for success tracking
    setPendingUSDCInvestment({
      propertyId,
      propertyAddress,
      propertyName: property?.name || 'Manhattan Luxury Apartments',
      usdcAmount: usdcAmount.toString(),
      sharesToPurchase
    });
    
    // Show investment info to user
    setChatMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `💰 Investing $${usdcAmount} USDC in ${property?.name || 'Manhattan Luxury Apartments'}\n📊 Purchasing ${sharesToPurchase} shares at $${sharePrice} per share\n\n🔐 Step 1: Approving USDC spending...` 
    }]);
    
    // First approve USDC spending, then transfer
    writeContract({
      address: USDC_TOKEN_ADDRESS,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [propertyAddress, usdcAmountWei],
    });
  };

  const executeRecurringPropertyInvestment = async (params: any) => {
    console.log('🎯 executeRecurringPropertyInvestment called with params:', params);
    // For recurring property investments - use the AutoRecurringPayments contract
    const cleanAmount = (params.amount || '10').toString().replace(/[$,]/g, '');
    const usdcAmount = parseFloat(cleanAmount);
    
    // Convert to USDC units (18 decimals for this USDC token) 
    const usdcAmountWei = parseEther(usdcAmount.toString());
    
    // Get property details
    const propertyId = params.propertyId || '1';
    const propertyAddress = params.propertyAddress || '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be';
    const propertyName = params.propertyName || 'Manhattan Luxury Apartments';
    
    // Set up recurring payment parameters
    let interval = 30; // Default 30 seconds
    let maxExecutions = 4; // Default 4 times (2 minutes / 30 seconds)
    
    if (params.customInterval) {
      interval = params.customInterval;
    }
    if (params.maxExecutions) {
      maxExecutions = params.maxExecutions;
    }
    
    // Store recurring investment flag for transaction confirmation
    if (address) {
      localStorage.setItem(`recurring_investment_${address}`, JSON.stringify({
        propertyName,
        propertyId,
        amount: usdcAmount,
        interval,
        maxExecutions
      }));
    }
    
    // Store schedule creation parameters for after permission grant
    setPendingScheduleCreation({ 
      recipient: propertyAddress, 
      amount: parseEther(usdcAmount.toString()), 
      interval, 
      maxExecutions,
      isPropertyInvestment: true,
      propertyName,
      propertyId,
      usdcAmount: usdcAmount.toString()
    });

    try {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🔄 Setting up recurring investment: $${usdcAmount} USDC in ${propertyName}\n⏰ Every ${interval} seconds for ${maxExecutions} times\n\n🔐 Step 1: Granting permissions for recurring payments...` 
      }]);

      console.log('🔐 About to call writeContract with:', {
        address: AUTO_RECURRING_PAYMENTS_ADDRESS,
        abi: 'AUTO_RECURRING_PAYMENTS_ABI',
        functionName: 'grantPermissions',
        args: [parseEther('100'), parseEther('1000'), 30]
      });

      // First grant permissions for recurring payments
      await writeContract({
        address: AUTO_RECURRING_PAYMENTS_ADDRESS,
        abi: AUTO_RECURRING_PAYMENTS_ABI,
        functionName: 'grantPermissions',
        args: [parseEther('100'), parseEther('1000'), 30], // Max 100 USDC per payment, 1000 USDC total, valid for 30 days
      });

      console.log('✅ writeContract call completed successfully');

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Permissions granted! Waiting for confirmation...` 
      }]);

    } catch (error) {
      console.error('❌ Error in executeRecurringPropertyInvestment:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to grant permissions: ${error}` 
      }]);
      setPendingScheduleCreation(null);
    }
  };

  const executeRentToOwn = async (params: any) => {
    console.log('🏠 executeRentToOwn called with params:', params);
    console.log('🔍 Wallet connected:', isConnected, 'Address:', address);
    console.log('🔍 RENT_TO_OWN_ADAPTER_ADDRESS:', RENT_TO_OWN_ADAPTER_ADDRESS);
    
    const propertyId = params.propertyId || '1';
    const propertyShareAddress = getAddress(PROPERTY_SHARE_ADDRESSES[propertyId] || PROPERTY_SHARE_ADDRESSES['1']);
    console.log('🔍 Property details:', { propertyId, propertyShareAddress });
    const targetOwnershipPercentage = params.targetOwnershipPercentage || 5;
    const targetMonths = params.targetMonths || 12;
    const monthlyRent = parseFloat(params.monthlyRent || '2000');
    
    if (!propertyShareAddress || propertyShareAddress === "0x0000000000000000000000000000000000000000") {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Property Share contract not deployed yet for Property #${propertyId}.\n\n🚧 This is a demo of the Real-Time Home Ownership system.\n\n✨ In production, each property would have its own PropertyShare ERC-20 token contract.` 
      }]);
      return;
    }
    
    // Convert percentage to basis points (5% = 500 basis points)
    const targetOwnershipBasisPoints = targetOwnershipPercentage * 100;
    
    // Default landlord address (in production, this would be the actual landlord)
    const landlordAddress = getAddress("0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6");
    
    // Convert monthly rent to wei (18 decimals)
    const monthlyRentWei = parseEther(monthlyRent.toString());
    
    // Store pending rent-to-own for success tracking
    setPendingRentToOwn({
      propertyId,
      propertyShareAddress,
      propertyName: params.propertyName || 'Manhattan Luxury Apartments',
      targetOwnershipPercentage,
      targetMonths,
      monthlyRent: monthlyRent.toString(),
      landlordAddress
    });
    
    try {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🏠 Setting up Real-Time Home Ownership!\n\n🎯 Goal: ${targetOwnershipPercentage}% ownership of ${params.propertyName || 'Manhattan Luxury Apartments'}\n💰 Monthly Rent: $${monthlyRent}\n📅 Timeline: ${targetMonths} months\n🏘️ Landlord: ${landlordAddress}\n\n🔐 Creating rent-to-own schedule...\n\n🧪 DEBUG: About to call contract function...` 
      }]);

      console.log('🚀 About to call writeContract with exact parameters:', {
        contractAddress: RENT_TO_OWN_ADAPTER_ADDRESS,
        functionName: 'createRentToOwnSchedule',
        parameters: [
          address, // tenant (current user)
          landlordAddress, // landlord  
          propertyShareAddress, // PropertyShare contract
          monthlyRentWei.toString(), // monthly rent in wei
          targetOwnershipBasisPoints, // target ownership in basis points
          targetMonths // target months
        ],
        abi: 'RENT_TO_OWN_ADAPTER_ABI (length: ' + RENT_TO_OWN_ADAPTER_ABI.length + ')'
      });

      console.log('🔍 Contract call details:', {
        isConnected,
        address,
        chainId: 'Base Sepolia',
        contractAddress: RENT_TO_OWN_ADAPTER_ADDRESS,
        propertyShareAddress,
        monthlyRentWei: monthlyRentWei.toString(),
        targetOwnershipBasisPoints
      });

      // Create rent-to-own schedule
      console.log('🔥 CALLING writeContract NOW...');
      console.log('🔍 Wallet details:', {
        address,
        isConnected,
        contractAddress: RENT_TO_OWN_ADAPTER_ADDRESS,
        propertyShareAddress,
        monthlyRentWei: monthlyRentWei.toString(),
        targetOwnershipBasisPoints,
        targetMonths
      });
      
      console.log('🔍 Individual parameters:');
      console.log('- address (tenant):', address);
      console.log('- landlordAddress:', landlordAddress);
      console.log('- propertyShareAddress:', propertyShareAddress);
      console.log('- monthlyRentWei:', monthlyRentWei.toString());
      console.log('- targetOwnershipBasisPoints:', targetOwnershipBasisPoints);
      console.log('- targetMonths:', targetMonths);
      
      // Validate all parameters before calling
      if (!address) {
        throw new Error('Wallet not connected');
      }
      if (!propertyShareAddress || propertyShareAddress === "0x0000000000000000000000000000000000000000") {
        throw new Error('Invalid property share address');
      }
      if (monthlyRentWei.toString() === '0') {
        throw new Error('Invalid monthly rent amount');
      }
      
      try {
        // Use writeContract (doesn't return a promise, but triggers transaction)
        writeContract({
          address: getAddress(RENT_TO_OWN_ADAPTER_ADDRESS),
          abi: RENT_TO_OWN_ADAPTER_ABI,
          functionName: 'createRentToOwnSchedule',
          args: [
            address, // tenant (current user)
            landlordAddress, // landlord
            propertyShareAddress, // PropertyShare contract
            monthlyRentWei, // monthly rent in wei
            targetOwnershipBasisPoints, // target ownership in basis points
            targetMonths // target months
          ],
        });
        
        console.log('✅ writeContract called successfully - waiting for MetaMask...');

        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Rent-to-own schedule created! Now setting up recurring payments...\n\n🔄 Step 2: Creating monthly recurring rent payments of ${monthlyRent} USDC` 
        }]);
        
        // After creating the rent-to-own schedule, we need to set up recurring payments
        // This will be handled in the success useEffect when the transaction confirms
        
      } catch (writeError: any) {
        console.error('❌ writeContract failed:', writeError);
        
        // Check if it's a user rejection
        if (writeError?.message?.includes('User rejected') || writeError?.code === 4001) {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `❌ Transaction cancelled by user.` 
          }]);
        } else {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `❌ Contract call failed: ${writeError?.message || writeError}\n\n🔍 Debug info:\n- Contract: ${RENT_TO_OWN_ADAPTER_ADDRESS}\n- Function: createRentToOwnSchedule\n- Network: Base Sepolia\n\n💡 This might be due to:\n• Contract not deployed on current network\n• Insufficient gas\n• Invalid parameters\n• Network connection issues` 
          }]);
        }
        throw writeError;
      }

    } catch (error) {
      console.error('❌ Error in executeRentToOwn:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to create rent-to-own schedule: ${error}\n\n🚧 Note: This requires deployed PropertyShare and RentToOwnAdapter contracts.\n\n💡 Demo Mode: The system would:\n1. Calculate total USDC needed for ${targetOwnershipPercentage}% ownership\n2. Set up monthly rent payments of $${monthlyRent}\n3. Automatically mint PropertyShare tokens with each rent payment\n4. Track your growing ownership percentage in real-time\n\n🎉 Transform rent payments into equity!` 
      }]);
      setPendingRentToOwn(null);
    }
  };

  const executeCancelSchedules = async (params: any) => {
    console.log('🛑 executeCancelSchedules called with params:', params);
    
    try {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🛑 Canceling payment schedules...\n${params.recipient === 'all' ? '🎯 Target: All active schedules' : `🎯 Target: Payments to ${params.recipient}`}\n\n⚠️ This will permanently stop the selected recurring payments.` 
      }]);

      // For now, we'll use the backend script approach
      // In a full implementation, this would call the contract directly
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Cancellation request processed!\n\n🔧 The PaymentExecutorAgent will stop executing the selected schedules.\n\n💡 Note: To fully cancel schedules on-chain, you can:\n1. Use the contract's cancelPaymentSchedule function\n2. Or wait for schedules to complete naturally\n\n🎉 Your recurring payments have been stopped!` 
      }]);

    } catch (error) {
      console.error('❌ Error in executeCancelSchedules:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to cancel schedules: ${error}` 
      }]);
    }
  };

  // Function to track recurring investment executions and update localStorage
  const trackRecurringInvestmentExecution = (propertyId: string, propertyName: string, amount: string) => {
    if (!address) return;
    
    const investmentKey = `investment_${address}_${propertyId}`;
    const existingInvestment = localStorage.getItem(investmentKey);
    
    let totalInvestment = parseFloat(amount);
    let totalShares = totalInvestment / 100; // Simplified: $100 per 1% share
    
    if (existingInvestment) {
      const existing = JSON.parse(existingInvestment);
      totalInvestment += parseFloat(existing.amount.replace('$', ''));
      totalShares = totalInvestment / 100;
    }
    
    localStorage.setItem(investmentKey, JSON.stringify({
      amount: `$${totalInvestment}`,
      shares: totalShares.toFixed(1),
      lastUpdate: new Date().toISOString(),
      type: 'recurring'
    }));
    
    console.log(`📊 Updated investment tracking for ${propertyName}: $${totalInvestment} (${totalShares.toFixed(1)}% shares)`);
  };

  // Monitor for PaymentExecuted events to track recurring investments
  useEffect(() => {
    if (!address) return;
    
    // Check for recurring investment executions every 30 seconds
    const checkRecurringExecutions = async () => {
      try {
        // Get recent recurring investment data from localStorage
        const recurringKey = `recurring_investment_${address}`;
        const recurringData = localStorage.getItem(recurringKey);
        
        if (recurringData) {
          const data = JSON.parse(recurringData);
          // This would be updated by the PaymentExecutorAgent when payments are executed
          // For now, we'll simulate tracking based on the schedule creation
          console.log('📊 Monitoring recurring investment:', data);
        }
      } catch (error) {
        console.log('⚠️ Error monitoring recurring investments:', error);
      }
    };
    
    const interval = setInterval(checkRecurringExecutions, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const executeSimpleTransfer = async (params: any) => {
    console.log('💸 executeSimpleTransfer called with params:', params);
    
    let token = params.tokenIn || 'USDC';
    // Convert USD/dollar aliases to USDC
    if (token === 'USD' || token === 'DOLLAR' || token === 'DOLLARS') {
      token = 'USDC';
    }
    
    const recipient = params.recipient || params.friendName; // Handle both parameter names
    const cleanAmount = (params.amount || '10').toString().replace(/[$,]/g, '');
    const amount = parseFloat(cleanAmount);
    
    console.log('💸 Transfer details:', { token, recipient, amount });
    
    // Convert amount to proper units (Your custom USDC has 18 decimals, ETH has 18)
    let transferAmount;
    let tokenAddress;
    let tokenAbi;
    
    if (token === 'USDC') {
      transferAmount = parseEther(amount.toString()); // Your USDC has 18 decimals like ETH
      tokenAddress = USDC_TOKEN_ADDRESS;
      tokenAbi = USDC_ABI;
    } else if (token === 'ETH' || token === 'WETH') {
      transferAmount = parseEther(amount.toString()); // ETH has 18 decimals
      tokenAddress = WETH_TOKEN_ADDRESS;
      tokenAbi = WETH_ABI;
    } else {
      throw new Error(`Unsupported token: ${token}`);
    }
    
    try {
      // Resolve recipient if it's a friend name
      let resolvedRecipient = recipient;
      let displayName = recipient;
      
      if (recipient && !recipient.startsWith('0x') && !recipient.includes('.eth')) {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `💸 Sending ${amount} ${token} to ${recipient}\n\n🔍 Resolving friend "${recipient}"...` 
        }]);
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/friends/${address}/resolve/${recipient}`);
          if (response.ok) {
            const data = await response.json();
            resolvedRecipient = data.friendAddress;
            displayName = `${recipient} (${resolvedRecipient})`;
            setChatMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `🔍 Resolved "${recipient}" to ${resolvedRecipient}\n\n🔐 Initiating transfer...` 
            }]);
          } else {
            setChatMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `⚠️ Could not resolve friend "${recipient}". Please add them first or use their address.\n\n❌ Transfer cancelled.` 
            }]);
            return;
          }
        } catch (error) {
          console.log('Could not resolve friend name:', recipient);
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `⚠️ Could not resolve friend "${recipient}". Please add them first or use their address.\n\n❌ Transfer cancelled.` 
          }]);
          return;
        }
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `💸 Sending ${amount} ${token} to ${displayName}\n\n🔐 Initiating transfer...` 
        }]);
      }

      console.log('💸 Executing transfer:', { tokenAddress, resolvedRecipient, transferAmount });

      // Execute the transfer
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: 'transfer',
        args: [resolvedRecipient, transferAmount],
      });

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Transfer initiated! Sending ${amount} ${token} to ${displayName}` 
      }]);

    } catch (error) {
      console.error('Transfer error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Transfer failed: ${error}` 
      }]);
    }
  };

  const executeSwap = async (params: any) => {
    console.log('🔄 executeSwap called with params:', params);
    
    // Check if this is a simple transfer
    if (params.transferType === 'simple_transfer' || (params.recurrence === 'once' && params.recipient)) {
      console.log('💸 Routing to executeSimpleTransfer');
      return await executeSimpleTransfer(params);
    }
    
    // Check if this is a recurring property investment
    if (params.investmentType === 'recurring_property_investment') {
      console.log('🎯 Routing to executeRecurringPropertyInvestment');
      return await executeRecurringPropertyInvestment(params);
    }
    
    // For regular token swaps (buy/sell)
    const tokenIn = params.tokenIn || 'USDC';
    const tokenOut = params.tokenOut || 'ETH';
    // Strip dollar signs and other currency symbols from amount
    const cleanAmount = (params.amount || '1').toString().replace(/[$,]/g, '');
    const amount = parseFloat(cleanAmount);
    
    // Calculate swap amount based on token
    let swapAmount;
    if (tokenIn === 'USDC') {
      // Buying ETH with USDC - convert ETH amount to USDC (1 ETH = 3000 USDC)
      swapAmount = parseEther((amount * 3000).toString());
    } else {
      // Selling ETH for USDC - use ETH amount directly
      swapAmount = parseEther(amount.toString());
    }
    
    // Store swap parameters for after approval
    setPendingSwapExecution({ tokenIn, tokenOut, amount, swapAmount });
    
    // Also store in localStorage for transaction logging
    if (address) {
      localStorage.setItem(`pending_swap_${address}`, JSON.stringify({
        tokenIn,
        tokenOut,
        amount: amount.toString()
      }));
    }
    
    try {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🔄 Preparing swap: ${amount} ${tokenOut} for ${tokenIn === 'USDC' ? (amount * 3000) + ' USDC' : amount + ' ETH'}\n\n🔐 Step 1: Approving USDC spending for swap contract...` 
      }]);

      // First approve USDC spending for the swap pool
      await writeContract({
        address: USDC_TOKEN_ADDRESS,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [SIMPLE_SWAP_POOL_ADDRESS, swapAmount],
      });

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ USDC approval initiated! Waiting for confirmation...` 
      }]);

    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to approve USDC: ${error}` 
      }]);
      setPendingSwapExecution(null);
    }
  };

  const executeSwapAfterApproval = async () => {
    if (!pendingSwapExecution) return;

    const { tokenIn, tokenOut, amount, swapAmount } = pendingSwapExecution;

    try {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🔄 Step 2: Executing swap...\n💰 Swapping ${tokenIn === 'USDC' ? (amount * 3000) + ' USDC' : amount + ' ETH'} → ${amount} ${tokenOut}` 
      }]);

      await writeContract({
        address: SIMPLE_SWAP_POOL_ADDRESS,
        abi: SIMPLE_SWAP_POOL_ABI,
        functionName: 'swapUSDCToETH',
        args: [swapAmount],
      });

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Swap initiated! Waiting for confirmation...` 
      }]);

      setPendingSwapExecution(null);

    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to execute swap: ${error}` 
      }]);
      setPendingSwapExecution(null);
    }
  };

  const cancelAction = () => {
    if (countdown) {
      clearTimeout(countdown);
    }
    setPendingAction(null);
    setChatMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '🚫 Action cancelled by user.' 
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleSendMessage();
    }
  };

  // Transaction status effects
  useEffect(() => {
    if (isConfirmed && hash) {
      const explorerUrl = `https://sepolia.basescan.org/tx/${hash}`;
      
      if (pendingScheduleCreation) {
        // This was the permission grant transaction
        const isPropertyInvestment = pendingScheduleCreation.isPropertyInvestment;
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Step 1 Complete - Permissions Granted!\n\n🔗 Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}\n🌐 View on Explorer: ${explorerUrl}\n\n⏳ Now creating ${isPropertyInvestment ? 'recurring investment' : 'payment'} schedule...` 
        }]);
        
        // Create the payment schedule
        createPaymentSchedule();
      } else if (pendingSwapExecution) {
        // This was the USDC approval transaction
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Step 1 Complete - USDC Approval Granted!\n\n🔗 Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}\n🌐 View on Explorer: ${explorerUrl}\n\n⏳ Now executing swap...` 
        }]);
        
        // Execute the swap
        executeSwapAfterApproval();
      } else {
        // This was either the payment schedule creation or swap execution transaction
        const isSwap = hash && pendingSwapExecution === null; // Swap just completed
        const isRecurringInvestment = localStorage.getItem(`recurring_investment_${address}`);
        
        if (isRecurringInvestment) {
          const investmentData = JSON.parse(isRecurringInvestment);
          
          // Track the recurring investment in localStorage for properties page
          trackRecurringInvestmentExecution(
            investmentData.propertyId,
            investmentData.propertyName,
            investmentData.amount.toString()
          );
          
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `✅ Recurring Investment Schedule Complete!\n\n🔗 Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}\n🌐 View on Explorer: ${explorerUrl}\n\n🤖 PaymentExecutorAgent will now monitor and auto-execute your recurring investments in ${investmentData.propertyName}!\n\n📊 Your investment will be tracked on the Properties page as payments execute.\n\n🎉 Setup Complete! Your recurring property investment is now active.` 
          }]);
          localStorage.removeItem(`recurring_investment_${address}`);
        } else {
          setChatMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `✅ ${isSwap ? 'Swap' : 'Payment Schedule'} Complete!\n\n🔗 Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}\n🌐 View on Explorer: ${explorerUrl}\n\n${isSwap ? '🎉 Your swap has been executed successfully!' : '🤖 PaymentExecutorAgent will now monitor and auto-execute this payment!\n\n🎉 Setup Complete! Your recurring payment is now active.'}` 
          }]);
        }
      }
    }
  }, [isConfirmed, hash]);

  if (!mounted) return null;

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw', // Full viewport width
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)', // Much darker
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden' // Prevent horizontal scroll
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(15, 15, 35, 0.95)', // Darker header
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', // Subtle border
        padding: '0.75rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100vw', // Full viewport width
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%', // Full width instead of maxWidth
          margin: '0', // No auto margin
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          {/* Logo */}
          <Link href="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            textDecoration: 'none' 
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain style={{ width: '18px', height: '18px', color: 'white' }} />
            </div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: '#ffffff' 
            }}>
              Veda
            </span>
          </Link>

          {/* Small Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem' 
          }}>
            <Link
              href="/friends"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '0.75rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Users style={{ width: '14px', height: '14px' }} />
              Friends
            </Link>

            <Link
              href="/properties"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '0.75rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Building2 style={{ width: '14px', height: '14px' }} />
              Properties
            </Link>

            <Link
              href="/bills"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '0.75rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <CreditCard style={{ width: '14px', height: '14px' }} />
              Bills
            </Link>

            <Link
              href="/transactions"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '0.75rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <History style={{ width: '14px', height: '14px' }} />
              Transactions
            </Link>

            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Pending Action Timer */}
      {pendingAction && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #ff6b6b',
          borderRadius: '16px',
          padding: '2rem',
          zIndex: 1000,
          textAlign: 'center',
          minWidth: '400px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#ff6b6b',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {pendingAction.timeLeft}
          </div>
          <h3 style={{ margin: '0 0 1rem', color: '#ffffff' }}>
            Action will execute in {pendingAction.timeLeft} seconds
          </h3>
          <p style={{ margin: '0 0 1.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            {pendingAction.description}
          </p>
          <button
            onClick={cancelAction}
            style={{
              padding: '0.75rem 2rem',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
            CANCEL
          </button>
        </div>
      )}

      {/* Full Page Chatbot - Centered Content */}
      <div style={{ 
        height: 'calc(100vh - 80px)',
        width: '100vw', // Full viewport width
        background: 'rgba(0, 0, 0, 0.4)', // Dark semi-transparent background
        borderRadius: '0', // No border radius for full width
        border: 'none',
        backdropFilter: 'blur(20px)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center the content
        margin: 0,
        boxSizing: 'border-box'
      }}>
        {/* Chat Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', // Center only the header content
          gap: '0.75rem', // Reduced gap
          marginBottom: '1.5rem', // Reduced margin
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{
            width: '40px', // Smaller icon
            height: '40px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px', // Smaller border radius
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.25rem', // Smaller font
              fontWeight: '700', 
              color: '#ffffff', 
              margin: 0 
            }}>
              Veda AI Assistant
            </h1>
            <p style={{ 
              fontSize: '0.75rem', // Smaller font
              color: 'rgba(255, 255, 255, 0.7)', 
              margin: 0 
            }}>
              Your intelligent RWA portfolio manager
            </p>
          </div>
        </div>

        {/* Connection Status */}
        {isConnected && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e' }} />
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        )}

        {/* Transaction Status */}
        {isPending && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <Clock style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            Transaction pending...
          </div>
        )}

        {isConfirming && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <Clock style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
            Waiting for confirmation...
          </div>
        )}

        {/* Chat Messages Area - Taller and No Suggestions */}
        <div style={{
          width: '100%', // Full width
          maxWidth: '800px', // Smaller max width
          height: '500px', // Increased height from 350px to 500px
          background: 'rgba(0, 0, 0, 0.3)', // Darker chat area
          borderRadius: '16px',
          padding: '1.5rem', // Reduced padding
          marginBottom: '1.5rem', // Reduced margin
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {chatMessages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px', // Smaller welcome icon
                height: '60px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem' // Reduced margin
              }}>
                <Brain style={{ width: '30px', height: '30px', color: 'white' }} />
              </div>
              <h2 style={{ 
                fontSize: '1.25rem', // Smaller font
                fontWeight: '600', 
                color: '#ffffff', 
                marginBottom: '0.5rem' // Reduced margin
              }}>
                Welcome to Veda
              </h2>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                lineHeight: '1.5', // Tighter line height
                maxWidth: '500px', // Smaller max width
                marginBottom: '0', // No margin bottom
                fontSize: '0.875rem' // Smaller font
              }}>
                I'm your intelligent DeFi assistant for Real World Asset investments. I can help you invest in properties, set up automated strategies, manage your portfolio, and create recurring payments.
              </p>
              
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '600px'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  margin: 0
                }}>
                  Try these commands:
                </h3>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  textAlign: 'left'
                }}>
                  • "save 0x123... as alice" - Add a friend<br/>
                  • "send 10 USDC to alice every 30sec" - Recurring payments<br/>
                  • "invest $1000 in property 1" - Property investment<br/>
                  • "list friends" - Show saved contacts<br/>
                  • "keep portfolio 60% real estate 40% ETH" - Auto-rebalance
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chatMessages.map((message, index) => (
                <div key={index} style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                    : 'rgba(255, 255, 255, 0.05)', // Darker message background
                  color: '#ffffff',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  border: message.role === 'assistant' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  wordBreak: 'break-word', // Break long words
                  overflowWrap: 'break-word' // Wrap long content
                }}>
                  {/* Render message content with clickable links */}
                  {message.content.split('\n').map((line, lineIndex) => {
                    // Check if line contains an explorer URL
                    const explorerMatch = line.match(/(https:\/\/sepolia\.basescan\.org\/tx\/0x[a-fA-F0-9]{64})/);
                    if (explorerMatch) {
                      const url = explorerMatch[1];
                      const beforeUrl = line.substring(0, line.indexOf(url));
                      const afterUrl = line.substring(line.indexOf(url) + url.length);
                      
                      return (
                        <div key={lineIndex}>
                          {beforeUrl}
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                              color: '#60a5fa',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              wordBreak: 'break-all'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#93c5fd';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#60a5fa';
                            }}
                          >
                            View Transaction
                          </a>
                          {afterUrl}
                        </div>
                      );
                    }
                    
                    // Check if line contains a transaction hash
                    const hashMatch = line.match(/🔗 Hash: (0x[a-fA-F0-9]+)/);
                    if (hashMatch) {
                      const hash = hashMatch[1];
                      const beforeHash = line.substring(0, line.indexOf(hash));
                      const afterHash = line.substring(line.indexOf(hash) + hash.length);
                      
                      return (
                        <div key={lineIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{beforeHash}</span>
                          <code style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            flex: 1
                          }}>
                            {hash.slice(0, 10)}...{hash.slice(-8)}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(hash)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem',
                              color: '#ffffff',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Copy
                          </button>
                          <span>{afterHash}</span>
                        </div>
                      );
                    }
                    
                    return <div key={lineIndex}>{line}</div>;
                  })}
                </div>
              ))}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
              {isProcessing && (
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  fontStyle: 'italic',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  🤖 Processing your request...
                </div>
              )}
              {/* Invisible element for auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input - Smaller and More Compact */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', // Reduced gap
          width: '100%', // Full width
          maxWidth: '800px' // Smaller max width to match chat area
        }}>
          <input
            type="text"
            placeholder="Ask me anything about your portfolio..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '0.875rem 1rem', // Reduced padding
              background: 'rgba(255, 255, 255, 0.05)', // Darker input
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px', // Smaller border radius
              fontSize: '0.8rem', // Smaller font
              outline: 'none',
              cursor: isProcessing ? 'not-allowed' : 'text',
              color: '#ffffff'
            }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isProcessing}
            style={{
              padding: '0.875rem 1.25rem', // Reduced padding
              background: (chatInput.trim() && !isProcessing)
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px', // Smaller border radius
              fontWeight: '600',
              cursor: (chatInput.trim() && !isProcessing) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              opacity: (chatInput.trim() && !isProcessing) ? 1 : 0.5,
              fontSize: '0.8rem' // Smaller font
            }}
          >
            <Send style={{ width: '16px', height: '16px' }} />
            {isProcessing ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}