'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Brain, Send, Users, Building2, Clock, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';

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
  }
];

// Contract addresses
const AUTO_RECURRING_PAYMENTS_ADDRESS = "0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96";
const SIMPLE_SWAP_POOL_ADDRESS = "0xCe3bf5DEd091c822193F14502B724a1bf1040E5C";
const USDC_TOKEN_ADDRESS = "0x6B0dacea6a72E759243c99Eaed840DEe9564C194";

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

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsProcessing(true);
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Send message to backend AI parser
      const response = await fetch('http://localhost:3001/api/parse', {
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
        const response = await fetch('http://localhost:3001/api/friends', {
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
        const response = await fetch(`http://localhost:3001/api/friends/${address}`);
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
    return ['stream_money', 'invest_real_estate', 'schedule_swap', 'borrow_against_assets'].includes(actionType);
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
        case 'invest_real_estate':
          await executeInvestment(action.params);
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

    const { recipient, amount, interval, maxExecutions } = pendingScheduleCreation;

    try {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `📅 Step 2: Creating recurring payment schedule...\n💰 Amount: ${formatEther(amount)} USDC\n📍 To: ${recipient}\n⏰ Every: ${interval} seconds\n🔄 Times: ${maxExecutions}` 
      }]);

      const tx = await writeContract({
        address: AUTO_RECURRING_PAYMENTS_ADDRESS,
        abi: AUTO_RECURRING_PAYMENTS_ABI,
        functionName: 'createPaymentSchedule',
        args: [recipient, amount, interval, maxExecutions],
      });

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ Payment schedule creation initiated! Waiting for confirmation...` 
      }]);

      setPendingScheduleCreation(null);

    } catch (error: any) {
      console.error('Payment schedule creation error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Failed to create payment schedule: ${error.message || error}\n\nThis might be due to:\n• Insufficient USDC allowance\n• Insufficient ETH for gas\n• Contract interaction error` 
      }]);
      setPendingScheduleCreation(null);
    }
  };

  const executeStreamMoney = async (params: any) => {
    // Resolve friend name to address if needed
    let recipient = params.recipient || '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6';
    
    // Check if recipient is a friend name (not an address)
    if (recipient && !recipient.startsWith('0x') && !recipient.includes('.eth')) {
      try {
        const response = await fetch(`http://localhost:3001/api/friends/${address}/resolve/${recipient}`);
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
    // For property investment (using swap pool as example)
    const amount = parseEther(params.amount || '0.01');
    
    writeContract({
      address: SIMPLE_SWAP_POOL_ADDRESS,
      abi: SIMPLE_SWAP_POOL_ABI,
      functionName: 'swapUSDCToETH',
      args: [amount],
    });
  };

  const executeSwap = async (params: any) => {
    // For token swaps (buy/sell)
    const tokenIn = params.tokenIn || 'USDC';
    const tokenOut = params.tokenOut || 'ETH';
    const amount = parseFloat(params.amount || '1');
    
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
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ Step 1 Complete - Permissions Granted!\n\n🔗 Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}\n🌐 View on Explorer: ${explorerUrl}\n\n⏳ Now creating payment schedule...` 
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
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ ${isSwap ? 'Swap' : 'Payment Schedule'} Complete!\n\n🔗 Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}\n🌐 View on Explorer: ${explorerUrl}\n\n${isSwap ? '🎉 Your swap has been executed successfully!' : '🤖 PaymentExecutorAgent will now monitor and auto-execute this payment!\n\n🎉 Setup Complete! Your recurring payment is now active.'}` 
        }]);
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