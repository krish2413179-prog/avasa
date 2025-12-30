'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { 
  Brain, 
  Building2, 
  CreditCard,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Home,
  Zap,
  Wifi,
  Shield,
  Tv,
  MoreHorizontal,
  Calendar,
  Filter,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { transactionTracker, TransactionType, TransactionStatus, Transaction } from '@/lib/transactionTracker';

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: TransactionType.INVESTMENT,
    status: TransactionStatus.CONFIRMED,
    amount: '200',
    token: 'USDC',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
    to: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be',
    description: 'Investment in Manhattan Luxury Apartments',
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
    gasUsed: '0.002',
    gasFee: '0.001',
    blockNumber: 12345678,
    category: 'Real Estate',
    metadata: {
      propertyName: 'Manhattan Luxury Apartments'
    }
  },
  {
    id: '2',
    hash: '0x2345678901bcdef12345678901bcdef12345678901bcdef12345678901bcdef1',
    type: TransactionType.BILL_PAYMENT,
    status: TransactionStatus.CONFIRMED,
    amount: '1200',
    token: 'USDC',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
    to: '0xE98fA21B6218A3B755Ade3508576C819FbD785be',
    description: 'Apartment Rent Payment',
    timestamp: Date.now() - 86400000 * 5, // 5 days ago
    gasUsed: '0.0015',
    gasFee: '0.0008',
    blockNumber: 12345650,
    category: 'Rent',
    metadata: {
      billName: 'Apartment Rent'
    }
  },
  {
    id: '3',
    hash: '0x3456789012cdef123456789012cdef123456789012cdef123456789012cdef12',
    type: TransactionType.SWAP,
    status: TransactionStatus.CONFIRMED,
    amount: '0.1',
    token: 'ETH',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
    to: '0xCe3bf5DEd091c822193F14502B724a1bf1040E5C',
    description: 'Swap 300 USDC → 0.1 ETH',
    timestamp: Date.now() - 86400000 * 7, // 1 week ago
    gasUsed: '0.003',
    gasFee: '0.0015',
    blockNumber: 12345600,
    category: 'DeFi',
    metadata: {
      tokenIn: 'USDC',
      tokenOut: 'ETH'
    }
  },
  {
    id: '4',
    hash: '0x4567890123def1234567890123def1234567890123def1234567890123def123',
    type: TransactionType.RECURRING_PAYMENT,
    status: TransactionStatus.CONFIRMED,
    amount: '50',
    token: 'USDC',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
    to: '0x6cB93c4538E7166F3E8c64bA654Ec13b9fB74C96',
    description: 'Weekly payment to Alice',
    timestamp: Date.now() - 86400000 * 10, // 10 days ago
    gasUsed: '0.0012',
    gasFee: '0.0006',
    blockNumber: 12345550,
    category: 'Recurring',
    metadata: {
      recipient: 'Alice'
    }
  },
  {
    id: '5',
    hash: '0x5678901234ef12345678901234ef12345678901234ef12345678901234ef1234',
    type: TransactionType.BILL_PAYMENT,
    status: TransactionStatus.CONFIRMED,
    amount: '150',
    token: 'USDC',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
    to: '0xE98fA21B6218A3B755Ade3508576C819FbD785be',
    description: 'Electricity Bill Payment',
    timestamp: Date.now() - 86400000 * 15, // 15 days ago
    gasUsed: '0.0015',
    gasFee: '0.0008',
    blockNumber: 12345500,
    category: 'Utilities',
    metadata: {
      billName: 'Electricity Bill'
    }
  },
  {
    id: '6',
    hash: '0x6789012345f123456789012345f123456789012345f123456789012345f12345',
    type: TransactionType.INVESTMENT,
    status: TransactionStatus.PENDING,
    amount: '500',
    token: 'USDC',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6',
    to: '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968',
    description: 'Investment in Miami Beach Condos',
    timestamp: Date.now() - 3600000, // 1 hour ago
    category: 'Real Estate',
    metadata: {
      propertyName: 'Miami Beach Condos'
    }
  }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address) {
      // Load real transactions from localStorage
      const userTransactions = transactionTracker.getTransactions(address);
      
      // If no real transactions, add some mock data for demo
      if (userTransactions.length === 0) {
        // Add mock transactions for demo purposes
        mockTransactions.forEach(mockTx => {
          transactionTracker.addTransaction(address, {
            hash: mockTx.hash,
            type: mockTx.type,
            status: mockTx.status,
            amount: mockTx.amount,
            token: mockTx.token,
            from: mockTx.from,
            to: mockTx.to,
            description: mockTx.description,
            gasUsed: mockTx.gasUsed,
            gasFee: mockTx.gasFee,
            blockNumber: mockTx.blockNumber,
            category: mockTx.category,
            metadata: mockTx.metadata
          });
        });
        
        // Reload after adding mock data
        const updatedTransactions = transactionTracker.getTransactions(address);
        setTransactions(updatedTransactions);
        setFilteredTransactions(updatedTransactions);
      } else {
        setTransactions(userTransactions);
        setFilteredTransactions(userTransactions);
      }
    }
    setLoading(false);
  }, [address]);

  useEffect(() => {
    // Filter transactions based on selected filters
    let filtered = transactions;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedFilter);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === selectedStatus);
    }

    setFilteredTransactions(filtered);
  }, [selectedFilter, selectedStatus, transactions]);

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INVESTMENT:
        return Building2;
      case TransactionType.BILL_PAYMENT:
        return CreditCard;
      case TransactionType.SWAP:
        return RefreshCw;
      case TransactionType.RECURRING_PAYMENT:
        return Repeat;
      case TransactionType.YIELD_CLAIM:
        return TrendingUp;
      case TransactionType.TRANSFER:
        return ArrowUpRight;
      default:
        return History;
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return CheckCircle;
      case TransactionStatus.PENDING:
        return Clock;
      case TransactionStatus.FAILED:
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return '#10b981';
      case TransactionStatus.PENDING:
        return '#f59e0b';
      case TransactionStatus.FAILED:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INVESTMENT:
        return '#6366f1';
      case TransactionType.BILL_PAYMENT:
        return '#ef4444';
      case TransactionType.SWAP:
        return '#8b5cf6';
      case TransactionType.RECURRING_PAYMENT:
        return '#10b981';
      case TransactionType.YIELD_CLAIM:
        return '#f59e0b';
      case TransactionType.TRANSFER:
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const getTotalVolume = () => {
    return filteredTransactions
      .filter(tx => tx.status === TransactionStatus.CONFIRMED)
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  };

  const getTransactionCounts = () => {
    const confirmed = filteredTransactions.filter(tx => tx.status === TransactionStatus.CONFIRMED).length;
    const pending = filteredTransactions.filter(tx => tx.status === TransactionStatus.PENDING).length;
    const failed = filteredTransactions.filter(tx => tx.status === TransactionStatus.FAILED).length;
    return { confirmed, pending, failed };
  };

  const counts = getTransactionCounts();

  return (
    <div>
      {/* Header */}
      <header style={{
        background: 'rgba(15, 15, 35, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0.75rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
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

          {/* Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Link href="/" style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '0.75rem'
            }}>
              Dashboard
            </Link>

            <Link href="/properties" style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Building2 style={{ width: '14px', height: '14px' }} />
              Properties
            </Link>

            <Link href="/bills" style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <CreditCard style={{ width: '14px', height: '14px' }} />
              Bills
            </Link>

            <Link href="/transactions" style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: '500',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <History style={{ width: '14px', height: '14px' }} />
              Transactions
            </Link>

            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        minHeight: 'calc(100vh - 80px)',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#ffffff',
        padding: '1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Page Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0'
              }}>
                Transaction History
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                Track all your DeFi transactions and activities
              </p>
            </div>
            
            <button 
              onClick={() => address && transactionTracker.downloadCSV(address)}
              disabled={!address}
              style={{
                padding: '0.75rem 1.5rem',
                background: address ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: address ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: address ? 1 : 0.5
              }}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              Export CSV
            </button>
          </div>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Total Volume
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    ${getTotalVolume().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Confirmed
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    {counts.confirmed}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Pending
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    {counts.pending}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertCircle style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Failed
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    {counts.failed}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.7)' }} />
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Filter by:</span>
              </div>

              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="all">All Types</option>
                <option value="investment">Investments</option>
                <option value="bill_payment">Bill Payments</option>
                <option value="swap">Swaps</option>
                <option value="recurring_payment">Recurring Payments</option>
                <option value="yield_claim">Yield Claims</option>
                <option value="transfer">Transfers</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Transactions List */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              margin: '0 0 1.5rem 0'
            }}>
              Recent Transactions
            </h2>

            {filteredTransactions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <History style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }} />
                <p>No transactions found for the selected filters.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {filteredTransactions.map((transaction) => {
                  const TransactionIcon = getTransactionIcon(transaction.type);
                  const StatusIcon = getStatusIcon(transaction.status);
                  const transactionColor = getTransactionColor(transaction.type);
                  const statusColor = getStatusColor(transaction.status);

                  return (
                    <div
                      key={transaction.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: transactionColor,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <TransactionIcon style={{ width: '20px', height: '20px', color: 'white' }} />
                        </div>
                        
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                            {transaction.description}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                              {formatDate(transaction.timestamp)}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                              {formatHash(transaction.hash)}
                            </p>
                            {transaction.category && (
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.8)'
                              }}>
                                {transaction.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                            {transaction.amount} {transaction.token}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <StatusIcon style={{ width: '14px', height: '14px', color: statusColor }} />
                            <p style={{ 
                              fontSize: '0.75rem', 
                              color: statusColor,
                              margin: 0,
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {transaction.status}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => window.open(`https://basescan.org/tx/${transaction.hash}`, '_blank')}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <ExternalLink style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}