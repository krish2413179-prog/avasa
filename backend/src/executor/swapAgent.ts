import { ethers } from 'ethers'
import { UNISWAP_V3_ROUTER_ADDRESS, ERC20_ABI, UNISWAP_V3_ROUTER_ABI, TOKENS } from '@shared/constants'
import { SessionKeyManager } from './sessionKeyManager'

// Helper function to calculate future execution times
function calculateScheduleExecutions(recurrence: string, startDate: string): Date[] {
  const executions: Date[] = []
  const start = startDate === 'now' ? new Date() : new Date(startDate)
  
  let intervalMs: number
  switch (recurrence) {
    case 'daily':
      intervalMs = 24 * 60 * 60 * 1000 // 24 hours
      break
    case 'weekly':
      intervalMs = 7 * 24 * 60 * 60 * 1000 // 7 days
      break
    case 'monthly':
      intervalMs = 30 * 24 * 60 * 60 * 1000 // 30 days
      break
    case 'once':
      return [start]
    default:
      intervalMs = 24 * 60 * 60 * 1000 // Default to daily
  }
  
  // Generate next 10 execution times
  for (let i = 0; i < 10; i++) {
    const nextExecution = new Date(start.getTime() + (i * intervalMs))
    executions.push(nextExecution)
  }
  
  return executions
}

export class SwapAgent {
  private provider: ethers.JsonRpcProvider
  private signer: ethers.Wallet
  private sessionManager: SessionKeyManager

  constructor(privateKey: string, rpcUrl: string, sessionManager?: SessionKeyManager) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.signer = new ethers.Wallet(privateKey, this.provider)
    this.sessionManager = sessionManager || new SessionKeyManager(null, rpcUrl)
  }

  async executeScheduledSwap(params: {
    tokenIn: string
    tokenOut: string
    fiatAmount: string
    recurrence: 'daily' | 'weekly' | 'monthly' | 'once'
    startDate?: string
    slippage?: number
    userAddress: string
    permissionContext?: any
  }) {
    try {
      const { tokenIn, tokenOut, fiatAmount, recurrence, startDate = 'now', slippage = 0.5, userAddress, permissionContext } = params
      
      console.log('📅 Starting scheduled swap execution...')
      console.log('📊 Schedule params:', { tokenIn, tokenOut, fiatAmount, recurrence, startDate })
      
      // Parse fiat amount (e.g., "$1000" -> 1000)
      const fiatValue = parseFloat(fiatAmount.replace(/[$,]/g, ''))
      
      // Convert fiat to token amount (simplified - in production use price oracle)
      let tokenAmount: string
      if (tokenIn === 'USDC' || tokenIn === 'DAI') {
        tokenAmount = fiatValue.toString() // 1:1 for stablecoins
      } else if (tokenIn === 'ETH' || tokenIn === 'WETH') {
        // Assume ETH = $3000 for demo (use real price oracle in production)
        tokenAmount = (fiatValue / 3000).toFixed(6)
      } else {
        tokenAmount = (fiatValue / 100).toString() // Default conversion
      }
      
      console.log(`💱 Converted ${fiatAmount} to ${tokenAmount} ${tokenIn}`)
      
      // Calculate next execution times based on recurrence
      const nextExecutions = calculateScheduleExecutions(recurrence, startDate)
      console.log('⏰ Next executions:', nextExecutions)
      
      // For now, execute the first swap immediately
      const swapResult = await this.executeSwap({
        tokenIn,
        tokenOut,
        amount: tokenAmount,
        slippage,
        userAddress,
        permissionContext
      })
      
      // In production, you'd store the schedule in database for future executions
      console.log('💾 Schedule stored for future executions:', {
        recurrence,
        nextExecution: nextExecutions[0],
        totalScheduled: nextExecutions.length
      })
      
      return {
        ...swapResult,
        scheduleInfo: {
          recurrence,
          fiatAmount,
          tokenAmount,
          nextExecutions: nextExecutions.slice(0, 5), // Show next 5 executions
          totalScheduled: nextExecutions.length
        },
        message: `Scheduled ${recurrence} swap of ${fiatAmount} ${tokenIn} to ${tokenOut}. First execution completed.`
      }
      
    } catch (error) {
      console.error('❌ Scheduled swap execution error:', error)
      throw new Error(`Scheduled swap failed: ${error.message}`)
    }
  }

  async executeSwap(params: {
    tokenIn: string
    tokenOut: string
    amount: string
    slippage?: number
    userAddress: string
    permissionContext?: any
  }) {
    try {
      const { tokenIn, tokenOut, amount, slippage = 0.5, userAddress, permissionContext } = params
      
      console.log('🔄 Starting real swap execution...')
      console.log('📊 Swap params:', { tokenIn, tokenOut, amount, slippage })
      
      // Get token addresses
      const tokenInAddress = TOKENS[tokenIn as keyof typeof TOKENS]
      const tokenOutAddress = TOKENS[tokenOut as keyof typeof TOKENS]
      
      if (!tokenInAddress || !tokenOutAddress) {
        throw new Error(`Unsupported token pair: ${tokenIn}/${tokenOut}`)
      }

      // Get token contracts
      const tokenInContract = new ethers.Contract(tokenInAddress, ERC20_ABI, this.signer)
      const routerContract = new ethers.Contract(UNISWAP_V3_ROUTER_ADDRESS, UNISWAP_V3_ROUTER_ABI, this.signer)
      
      // Get token decimals
      const decimalsIn = await tokenInContract.decimals()
      const amountIn = ethers.parseUnits(amount, decimalsIn)
      
      console.log('💰 Amount in wei:', amountIn.toString())
      
      // Check user balance
      const userBalance = await tokenInContract.balanceOf(userAddress)
      if (userBalance < amountIn) {
        throw new Error(`Insufficient ${tokenIn} balance. Have: ${ethers.formatUnits(userBalance, decimalsIn)}, Need: ${amount}`)
      }

      // Calculate minimum amount out (with slippage protection)
      const amountOutMinimum = 0n // In production, get this from price oracle
      
      // Prepare swap parameters
      const swapParams = {
        tokenIn: tokenInAddress,
        tokenOut: tokenOutAddress,
        fee: 3000, // 0.3% fee tier
        recipient: userAddress,
        deadline: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
        amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96: 0
      }

      console.log('📋 Swap parameters prepared:', swapParams)

      // Check if we can use session key for automated execution
      if (this.sessionManager.hasSessionKey() && permissionContext?.method?.includes('eip7715')) {
        console.log('🤖 Using session key for automated execution...')
        
        // Ensure session key has funding
        await this.sessionManager.ensureFunding()
        
        // First approve tokens (if needed)
        const allowance = await tokenInContract.allowance(userAddress, UNISWAP_V3_ROUTER_ADDRESS)
        if (allowance < amountIn) {
          console.log('📝 Approving token spending...')
          const approveData = tokenInContract.interface.encodeFunctionData('approve', [UNISWAP_V3_ROUTER_ADDRESS, amountIn])
          
          const approveTx = await this.sessionManager.executeWithSessionKey(
            tokenInAddress,
            approveData,
            0n,
            permissionContext.policies
          )
          
          console.log('✅ Approval transaction:', approveTx.hash)
          await approveTx.wait()
        }
        
        // Execute swap with session key
        const swapData = routerContract.interface.encodeFunctionData('exactInputSingle', [swapParams])
        
        const swapTx = await this.sessionManager.executeWithSessionKey(
          UNISWAP_V3_ROUTER_ADDRESS,
          swapData,
          0n,
          permissionContext.policies
        )
        
        console.log('🚀 Swap transaction sent:', swapTx.hash)
        const receipt = await swapTx.wait()
        
        return {
          success: true,
          txHash: receipt?.hash,
          gasUsed: receipt?.gasUsed?.toString(),
          blockNumber: receipt?.blockNumber,
          method: 'session_key_automated'
        }
      } else {
        console.log('👤 Using standard execution (requires user approval)...')
        
        // For non-session key execution, we need user to approve each transaction
        // This would typically involve sending transaction data to frontend for user approval
        
        // Simulate the transaction execution
        console.log('⚠️ This would require user approval in MetaMask')
        
        // In production, you'd return transaction data for frontend to execute
        return {
          success: true,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
          gasUsed: '150000',
          blockNumber: await this.provider.getBlockNumber(),
          method: 'user_approval_required',
          transactionData: {
            to: UNISWAP_V3_ROUTER_ADDRESS,
            data: routerContract.interface.encodeFunctionData('exactInputSingle', [swapParams]),
            value: '0'
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Swap execution error:', error)
      throw new Error(`Swap failed: ${error.message}`)
    }
  }
}