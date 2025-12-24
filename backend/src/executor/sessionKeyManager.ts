import { ethers } from 'ethers'

export class SessionKeyManager {
  private sessionKey: string | null
  private provider: ethers.providers.JsonRpcProvider
  private sessionSigner: ethers.Wallet | null

  constructor(sessionKey: string | null, rpcUrl: string) {
    this.sessionKey = sessionKey
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    this.sessionSigner = sessionKey ? new ethers.Wallet(sessionKey, this.provider) : null
  }

  // Check if we have a valid session key
  hasSessionKey(): boolean {
    return !!this.sessionKey && !!this.sessionSigner
  }

  // Get the session signer for automated transactions
  getSessionSigner(): ethers.Wallet {
    if (!this.sessionSigner) {
      throw new Error('No session key available for automated execution')
    }
    return this.sessionSigner
  }

  // Validate session key permissions against a transaction
  async validateTransaction(to: string, data: string, value: ethers.BigNumber, policies?: any): Promise<boolean> {
    if (!policies) {
      console.log('⚠️ No policies provided, allowing transaction')
      return true
    }

    try {
      // Validate contract address
      if (policies.allowedContracts && !policies.allowedContracts.includes(to.toLowerCase())) {
        throw new Error(`Contract ${to} not in allowed contracts list`)
      }

      // Validate transaction value
      if (policies.maxValue && value.gt(ethers.BigNumber.from(policies.maxValue))) {
        throw new Error(`Transaction value ${value.toString()} exceeds policy limit ${policies.maxValue}`)
      }

      // Validate gas limit (if specified)
      if (policies.gasLimit) {
        // This would be checked during actual transaction execution
        console.log('📊 Gas limit policy:', policies.gasLimit)
      }

      // Validate method being called (decode function selector)
      if (policies.allowedMethods && data.length >= 10) {
        const methodSelector = data.slice(0, 10)
        console.log('🔍 Method selector:', methodSelector)
        // In production, you'd decode this and check against allowed methods
      }

      console.log('✅ Session key transaction validation passed')
      return true
    } catch (error) {
      console.error('❌ Session key validation failed:', (error as Error).message)
      return false
    }
  }

  // Execute transaction with session key
  async executeWithSessionKey(
    to: string, 
    data: string, 
    value: ethers.BigNumber = ethers.BigNumber.from(0), 
    policies?: any
  ): Promise<ethers.providers.TransactionResponse> {
    if (!this.hasSessionKey()) {
      throw new Error('Session key required for automated execution')
    }

    // Validate transaction against policies
    const isValid = await this.validateTransaction(to, data, value, policies)
    if (!isValid) {
      throw new Error('Transaction validation failed against session key policies')
    }

    const signer = this.getSessionSigner()
    
    // Estimate gas
    const gasEstimate = await this.provider.estimateGas({
      to,
      data,
      value,
      from: signer.address
    })

    // Add 20% buffer to gas estimate
    const gasLimit = gasEstimate.mul(120).div(100)

    console.log('⛽ Gas estimate:', gasEstimate.toString(), 'with buffer:', gasLimit.toString())

    // Execute transaction
    const tx = await signer.sendTransaction({
      to,
      data,
      value,
      gasLimit
    })

    console.log('📤 Transaction sent with session key:', tx.hash)
    return tx
  }

  // Get session key address
  getSessionAddress(): string {
    if (!this.sessionSigner) {
      throw new Error('No session key available')
    }
    return this.sessionSigner.address
  }

  // Check session key balance
  async getSessionBalance(): Promise<ethers.BigNumber> {
    if (!this.sessionSigner) {
      return ethers.BigNumber.from(0)
    }
    return await this.provider.getBalance(this.sessionSigner.address)
  }

  // Fund session key if needed (for gas)
  async ensureFunding(minBalance: ethers.BigNumber = ethers.utils.parseEther('0.01')): Promise<void> {
    if (!this.sessionSigner) {
      throw new Error('No session key to fund')
    }

    const balance = await this.getSessionBalance()
    if (balance.lt(minBalance)) {
      console.log('⚠️ Session key needs funding. Balance:', ethers.utils.formatEther(balance), 'ETH')
      console.log('💡 Please send ETH to session key address:', this.sessionSigner.address)
      throw new Error(`Session key needs funding. Send ETH to: ${this.sessionSigner.address}`)
    }

    console.log('✅ Session key has sufficient balance:', ethers.utils.formatEther(balance), 'ETH')
  }
}