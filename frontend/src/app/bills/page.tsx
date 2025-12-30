'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { 
  Brain, 
  Building2, 
  Plus, 
  Calendar, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Trash2,
  Home,
  Zap,
  Wifi,
  Shield,
  Tv,
  MoreHorizontal,
  TrendingUp,
  CreditCard
} from 'lucide-react';

// Bills Manager Contract ABI
const BILLS_MANAGER_ABI = [
  {
    "inputs": [
      {"name": "_name", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_category", "type": "uint8"},
      {"name": "_amount", "type": "uint256"},
      {"name": "_dueDate", "type": "uint256"},
      {"name": "_frequency", "type": "uint256"},
      {"name": "_payee", "type": "address"}
    ],
    "name": "createBill",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_billId", "type": "uint256"}],
    "name": "payBill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getUserBills",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_billId", "type": "uint256"}],
    "name": "getBill",
    "outputs": [{
      "components": [
        {"name": "id", "type": "uint256"},
        {"name": "name", "type": "string"},
        {"name": "description", "type": "string"},
        {"name": "category", "type": "uint8"},
        {"name": "amount", "type": "uint256"},
        {"name": "dueDate", "type": "uint256"},
        {"name": "frequency", "type": "uint256"},
        {"name": "payee", "type": "address"},
        {"name": "status", "type": "uint8"},
        {"name": "totalPaid", "type": "uint256"},
        {"name": "paymentCount", "type": "uint256"},
        {"name": "createdAt", "type": "uint256"},
        {"name": "lastPaidAt", "type": "uint256"}
      ],
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getUserSpendingSummary",
    "outputs": [
      {"name": "totalSpent", "type": "uint256"},
      {"name": "activeBillsCount", "type": "uint256"},
      {"name": "overdueBillsCount", "type": "uint256"},
      {"name": "monthlyBudget", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Mock contract address - replace with actual deployed address
const BILLS_MANAGER_ADDRESS = "0xE98fA21B6218A3B755Ade3508576C819FbD785be";

// Bill categories
const BILL_CATEGORIES = {
  0: { name: 'Rent', icon: Home, color: '#ef4444' },
  1: { name: 'Utilities', icon: Zap, color: '#f59e0b' },
  2: { name: 'Internet', icon: Wifi, color: '#3b82f6' },
  3: { name: 'Insurance', icon: Shield, color: '#10b981' },
  4: { name: 'Subscription', icon: Tv, color: '#8b5cf6' },
  5: { name: 'Other', icon: MoreHorizontal, color: '#6b7280' }
};

interface Bill {
  id: number;
  name: string;
  description: string;
  category: number;
  amount: number;
  dueDate: number;
  frequency: number;
  payee: string;
  status: number;
  totalPaid: number;
  paymentCount: number;
  createdAt: number;
  lastPaidAt: number;
}

export default function BillsPage() {
  const [showAddBill, setShowAddBill] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // Mock data for demonstration (replace with real contract calls)
  const mockBills: Bill[] = [
    {
      id: 1,
      name: "Apartment Rent",
      description: "Monthly rent payment",
      category: 0, // RENT
      amount: 1200000000, // $1200 in USDC (6 decimals)
      dueDate: Date.now() / 1000 + 86400 * 5, // Due in 5 days
      frequency: 86400 * 30, // Monthly
      payee: "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
      status: 0, // ACTIVE
      totalPaid: 12000000000, // $12000
      paymentCount: 10,
      createdAt: Date.now() / 1000 - 86400 * 300,
      lastPaidAt: Date.now() / 1000 - 86400 * 25
    },
    {
      id: 2,
      name: "Electricity Bill",
      description: "Monthly electricity usage",
      category: 1, // UTILITIES
      amount: 150000000, // $150
      dueDate: Date.now() / 1000 - 86400 * 2, // Overdue by 2 days
      frequency: 86400 * 30,
      payee: "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
      status: 0,
      totalPaid: 1500000000,
      paymentCount: 10,
      createdAt: Date.now() / 1000 - 86400 * 300,
      lastPaidAt: Date.now() / 1000 - 86400 * 32
    },
    {
      id: 3,
      name: "Internet Service",
      description: "High-speed internet",
      category: 2, // INTERNET
      amount: 80000000, // $80
      dueDate: Date.now() / 1000 + 86400 * 15, // Due in 15 days
      frequency: 86400 * 30,
      payee: "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
      status: 0,
      totalPaid: 800000000,
      paymentCount: 10,
      createdAt: Date.now() / 1000 - 86400 * 300,
      lastPaidAt: Date.now() / 1000 - 86400 * 15
    },
    {
      id: 4,
      name: "Netflix Subscription",
      description: "Streaming service",
      category: 4, // SUBSCRIPTION
      amount: 15990000, // $15.99
      dueDate: Date.now() / 1000 + 86400 * 10,
      frequency: 86400 * 30,
      payee: "0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b6",
      status: 0,
      totalPaid: 159900000,
      paymentCount: 10,
      createdAt: Date.now() / 1000 - 86400 * 300,
      lastPaidAt: Date.now() / 1000 - 86400 * 20
    }
  ];

  useEffect(() => {
    // Load bills (mock data for now)
    setBills(mockBills);
    setLoading(false);
  }, [address]);

  const formatAmount = (amount: number) => {
    return `$${(amount / 1000000000000000000).toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getDaysUntilDue = (dueDate: number) => {
    const days = Math.ceil((dueDate - Date.now() / 1000) / 86400);
    return days;
  };

  const getBillStatus = (bill: Bill) => {
    const daysUntilDue = getDaysUntilDue(bill.dueDate);
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'due-soon';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return '#ef4444';
      case 'due-soon': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const payBill = async (billId: number) => {
    if (!isConnected) return;
    
    try {
      writeContract({
        address: BILLS_MANAGER_ADDRESS as `0x${string}`,
        abi: BILLS_MANAGER_ABI,
        functionName: 'payBill',
        args: [BigInt(billId)],
      });
    } catch (error) {
      console.error('Error paying bill:', error);
    }
  };

  const totalMonthlyBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const overdueBills = bills.filter(bill => getBillStatus(bill) === 'overdue');
  const upcomingBills = bills.filter(bill => getBillStatus(bill) === 'due-soon');

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
              <CreditCard style={{ width: '14px', height: '14px' }} />
              Bills
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
                Bills Management
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0
              }}>
                Track and pay your recurring bills with crypto
              </p>
            </div>
            
            <button
              onClick={() => setShowAddBill(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Bill
            </button>
          </div>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                  <DollarSign style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Monthly Budget
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    {formatAmount(totalMonthlyBills)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: overdueBills.length > 0 ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: overdueBills.length > 0 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6b7280, #4b5563)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Overdue Bills
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: overdueBills.length > 0 ? '#ef4444' : 'white' }}>
                    {overdueBills.length}
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
                    Due Soon
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                    {upcomingBills.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bills List */}
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
              Your Bills
            </h2>

            {bills.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <CreditCard style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }} />
                <p>No bills found. Add your first bill to get started!</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {bills.map((bill) => {
                  const CategoryIcon = BILL_CATEGORIES[bill.category as keyof typeof BILL_CATEGORIES]?.icon || MoreHorizontal;
                  const categoryColor = BILL_CATEGORIES[bill.category as keyof typeof BILL_CATEGORIES]?.color || '#6b7280';
                  const status = getBillStatus(bill);
                  const daysUntilDue = getDaysUntilDue(bill.dueDate);

                  return (
                    <div
                      key={bill.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${status === 'overdue' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
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
                          background: categoryColor,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CategoryIcon style={{ width: '20px', height: '20px', color: 'white' }} />
                        </div>
                        
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                            {bill.name}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                            {bill.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                            {formatAmount(bill.amount)}
                          </p>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            color: getStatusColor(status),
                            margin: 0,
                            fontWeight: '500'
                          }}>
                            {status === 'overdue' 
                              ? `Overdue by ${Math.abs(daysUntilDue)} days`
                              : status === 'due-soon'
                              ? `Due in ${daysUntilDue} days`
                              : `Due ${formatDate(bill.dueDate)}`
                            }
                          </p>
                        </div>

                        <button
                          onClick={() => payBill(bill.id)}
                          disabled={!isConnected}
                          style={{
                            padding: '0.5rem 1rem',
                            background: status === 'overdue' 
                              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                              : 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: isConnected ? 'pointer' : 'not-allowed',
                            opacity: isConnected ? 1 : 0.5
                          }}
                        >
                          Pay Now
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