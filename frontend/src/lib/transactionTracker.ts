// Transaction tracking service for Veda
export enum TransactionType {
  INVESTMENT = 'investment',
  BILL_PAYMENT = 'bill_payment',
  SWAP = 'swap',
  RECURRING_PAYMENT = 'recurring_payment',
  YIELD_CLAIM = 'yield_claim',
  TRANSFER = 'transfer'
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

export interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  token: string;
  from: string;
  to: string;
  description: string;
  timestamp: number;
  gasUsed?: string;
  gasFee?: string;
  blockNumber?: number;
  category?: string;
  metadata?: {
    propertyName?: string;
    billName?: string;
    tokenIn?: string;
    tokenOut?: string;
    recipient?: string;
  };
}

class TransactionTracker {
  private storageKey = 'veda_transactions';

  // Get all transactions for a user
  getTransactions(userAddress: string): Transaction[] {
    if (typeof window === 'undefined') return [];
    
    const key = `${this.storageKey}_${userAddress}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  // Add a new transaction
  addTransaction(userAddress: string, transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
    if (typeof window === 'undefined') return transaction as Transaction;

    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId(),
      timestamp: Date.now()
    };

    const transactions = this.getTransactions(userAddress);
    transactions.unshift(newTransaction); // Add to beginning
    
    // Keep only last 100 transactions
    if (transactions.length > 100) {
      transactions.splice(100);
    }

    const key = `${this.storageKey}_${userAddress}`;
    localStorage.setItem(key, JSON.stringify(transactions));

    return newTransaction;
  }

  // Update transaction status
  updateTransactionStatus(userAddress: string, hash: string, status: TransactionStatus, blockNumber?: number): void {
    if (typeof window === 'undefined') return;

    const transactions = this.getTransactions(userAddress);
    const transaction = transactions.find(tx => tx.hash === hash);
    
    if (transaction) {
      transaction.status = status;
      if (blockNumber) {
        transaction.blockNumber = blockNumber;
      }

      const key = `${this.storageKey}_${userAddress}`;
      localStorage.setItem(key, JSON.stringify(transactions));
    }
  }

  // Get transactions by type
  getTransactionsByType(userAddress: string, type: TransactionType): Transaction[] {
    return this.getTransactions(userAddress).filter(tx => tx.type === type);
  }

  // Get transactions by status
  getTransactionsByStatus(userAddress: string, status: TransactionStatus): Transaction[] {
    return this.getTransactions(userAddress).filter(tx => tx.status === status);
  }

  // Get transaction statistics
  getTransactionStats(userAddress: string) {
    const transactions = this.getTransactions(userAddress);
    
    const totalVolume = transactions
      .filter(tx => tx.status === TransactionStatus.CONFIRMED)
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const counts = {
      total: transactions.length,
      confirmed: transactions.filter(tx => tx.status === TransactionStatus.CONFIRMED).length,
      pending: transactions.filter(tx => tx.status === TransactionStatus.PENDING).length,
      failed: transactions.filter(tx => tx.status === TransactionStatus.FAILED).length
    };

    const typeBreakdown = {
      investment: transactions.filter(tx => tx.type === TransactionType.INVESTMENT).length,
      billPayment: transactions.filter(tx => tx.type === TransactionType.BILL_PAYMENT).length,
      swap: transactions.filter(tx => tx.type === TransactionType.SWAP).length,
      recurringPayment: transactions.filter(tx => tx.type === TransactionType.RECURRING_PAYMENT).length,
      yieldClaim: transactions.filter(tx => tx.type === TransactionType.YIELD_CLAIM).length,
      transfer: transactions.filter(tx => tx.type === TransactionType.TRANSFER).length
    };

    return {
      totalVolume,
      counts,
      typeBreakdown
    };
  }

  // Clear all transactions for a user
  clearTransactions(userAddress: string): void {
    if (typeof window === 'undefined') return;
    
    const key = `${this.storageKey}_${userAddress}`;
    localStorage.removeItem(key);
  }

  // Generate unique transaction ID
  private generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export transactions to CSV
  exportToCSV(userAddress: string): string {
    const transactions = this.getTransactions(userAddress);
    
    const headers = [
      'Date',
      'Type',
      'Description',
      'Amount',
      'Token',
      'Status',
      'Hash',
      'Category',
      'Gas Fee'
    ];

    const rows = transactions.map(tx => [
      new Date(tx.timestamp).toISOString(),
      tx.type,
      tx.description,
      tx.amount,
      tx.token,
      tx.status,
      tx.hash,
      tx.category || '',
      tx.gasFee || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Download CSV file
  downloadCSV(userAddress: string): void {
    if (typeof window === 'undefined') return;

    const csvContent = this.exportToCSV(userAddress);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `veda_transactions_${userAddress.slice(0, 8)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// Export singleton instance
export const transactionTracker = new TransactionTracker();