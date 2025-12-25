'use client';

import { 
  Wallet, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Activity,
  History,
  Info,
  DollarSign,
  ChevronRight,
  Plus,
  Brain
} from 'lucide-react';
import Link from 'next/link';

export default function LendingPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto'
    }}>
      {/* Navigation */}
      <nav style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}>
                <Brain style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>PropChain AI</h1>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Lending</p>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white', 
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Lending
            </h1>
            <span style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(147, 51, 234, 0.1)',
              color: '#9333ea',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Powered by Aave V3
            </span>
          </div>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            Borrow against your RWA shares or earn interest on stables
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{
              padding: '0.5rem 1rem',
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#27272a'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#18181b'}>
              Supply Assets
            </button>
            <button style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.2)';
            }}>
              Borrow Now
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Supplied', value: '$45,200', color: 'white' },
            { label: 'Total Borrowed', value: '$12,400', color: '#9ca3af' },
            { label: 'Net APY', value: '+4.2%', color: '#10b981' },
            { label: 'Health Factor', value: '2.45', color: '#10b981' },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              style={{
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ 
                fontSize: '0.625rem', 
                fontWeight: 'bold', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '0.5rem' 
              }}>
                {stat.label}
              </div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: stat.color === 'white' ? '#1f2937' : stat.color 
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem'
        }}>
          {/* Assets to Supply */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: 'white', 
                margin: 0,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Assets to Supply
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { name: 'USDC Stables', balance: '5,000', apy: '4.2%', status: 'Active' },
                  { name: 'Wrapped ETH', balance: '2.45', apy: '1.8%', status: 'N/A' },
                  { name: 'RWA Shares (Index)', balance: '124', apy: '6.1%', status: 'Active' },
                ].map((asset, i) => (
                  <div key={i} style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#18181b',
                        border: '1px solid #27272a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af'
                      }}>
                        <DollarSign style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{asset.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Balance: {asset.balance}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>{asset.apy} APY</div>
                        <div style={{ 
                          fontSize: '0.625rem', 
                          color: '#6b7280', 
                          fontWeight: 'bold', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.1em' 
                        }}>
                          Supply Yield
                        </div>
                      </div>
                      <button style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        background: '#18181b',
                        border: '1px solid #27272a',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#27272a'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#18181b'}>
                        Supply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Borrowings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: 'white', 
                margin: 0,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Your Borrowings
              </h3>
              <div style={{
                padding: '2rem',
                borderRadius: '20px',
                border: '2px dashed #27272a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                background: 'rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '50%',
                  background: '#18181b',
                  color: '#3f3f46'
                }}>
                  <Wallet style={{ width: '24px', height: '24px' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', margin: 0 }}>No active loans</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Supply collateral to start borrowing against your assets.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Risk Management</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#18181b',
                  border: '1px solid #27272a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280' }}>Health Factor</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>2.45</span>
                  </div>
                  <div style={{
                    height: '6px',
                    width: '100%',
                    background: '#27272a',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: '#10b981',
                      width: '80%'
                    }} />
                  </div>
                  <p style={{ 
                    fontSize: '0.625rem', 
                    color: '#6b7280', 
                    lineHeight: '1.5', 
                    textAlign: 'center',
                    margin: 0 
                  }}>
                    Your liquidation threshold is far below current collateral levels.
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                <ShieldCheck style={{ width: '20px', height: '20px' }} />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>Aave Protocol V3</h3>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                lineHeight: '1.5', 
                margin: 0 
              }}>
                Avasa integrates with Aave V3 on Base Sepolia. Your RWA shares act as collateral 
                for capital-efficient borrowing without liquidating your real estate positions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
