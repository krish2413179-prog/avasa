'use client';

import { 
  RefreshCw, 
  ArrowRight, 
  PieChart, 
  Target,
  Zap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  History,
  Activity,
  Brain,
  Search,
  Bell
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const assets = [
  { name: 'Real Estate (RWA)', current: '65%', target: '60%', color: '#6366f1' },
  { name: 'Ethereum (ETH)', current: '20%', target: '30%', color: '#8b5cf6' },
  { name: 'USDC Stables', current: '15%', target: '10%', color: '#10b981' },
];

export default function RebalancePage() {
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);

  return (
    <div style={{ 
      minHeight: '100vh', 
      height: '100%',
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
            {/* Logo */}
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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Auto-Rebalance</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[
                  { name: 'Dashboard', href: '/' },
                  { name: 'Properties', href: '/properties' },
                  { name: 'Portfolio', href: '/portfolio' },
                  { name: 'Auto-Rebalance', href: '/rebalance' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: item.href === '/rebalance' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/rebalance' ? '#eff6ff' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        minHeight: 'calc(100vh - 80px)',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Auto-Rebalance Portfolio
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Intelligent robo-advisor maintaining your target asset allocation
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '4px',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            width: 'fit-content'
          }}>
            <button 
              onClick={() => setIsAutoEnabled(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                background: !isAutoEnabled ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: !isAutoEnabled ? 'white' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Manual
            </button>
            <button 
              onClick={() => setIsAutoEnabled(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                background: isAutoEnabled ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isAutoEnabled ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              Autonomous
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Target Allocation */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  margin: 0
                }}>
                  <Target style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                  Target Allocation
                </h3>
                <button style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#6366f1',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Edit Strategy
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {assets.map((asset) => (
                  <div key={asset.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: asset.color 
                        }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937' }}>{asset.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                          Current: <span style={{ color: '#1f2937' }}>{asset.current}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>→</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6366f1' }}>
                          Target: {asset.target}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: asset.current,
                        height: '100%',
                        background: asset.color,
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.1)'
                }}>
                  <Zap style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                    Execution Parameters
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                    Rebalancing triggers when any asset deviates by more than <span style={{ color: '#6366f1', fontWeight: 'bold' }}>5%</span> from target. 
                    Trades are routed through <span style={{ color: '#6366f1', fontWeight: 'bold' }}>Uniswap V3</span> for optimal slippage.
                  </p>
                </div>
              </div>
            </div>

            {/* Execution History */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  margin: 0
                }}>
                  <History style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                  Execution History
                </h3>
                <button style={{
                  fontSize: '0.625rem',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Clear logs
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { type: 'Buy ETH', amount: '0.45 ETH', status: 'Completed', time: '12h ago', color: '#10b981' },
                  { type: 'Sell USDC', amount: '1,200 USDC', status: 'Completed', time: '12h ago', color: '#ef4444' },
                  { type: 'Sell RWA Shares', amount: '$540.00', status: 'Completed', time: '3d ago', color: '#ef4444' },
                ].map((log, i) => (
                  <div key={i} style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid rgba(226, 232, 240, 0.5)',
                    borderRadius: '16px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        padding: '8px',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: log.color
                      }}>
                        <Activity style={{ width: '16px', height: '16px' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{log.type}</h4>
                        <p style={{ fontSize: '0.625rem', color: '#6b7280', margin: 0 }}>{log.time}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937' }}>{log.amount}</div>
                      <div style={{ fontSize: '0.625rem', color: '#10b981', fontWeight: 'bold' }}>{log.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Optimization Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                Optimization
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280' }}>Current Drift</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>8.2%</div>
                  </div>
                  <div style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b'
                  }}>
                    <TrendingUp style={{ width: '20px', height: '20px' }} />
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Rebalance Now
                </button>
                
                <div style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  background: 'rgba(248, 250, 252, 0.5)',
                  border: '1px solid rgba(226, 232, 240, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280'
                  }}>
                    <span>Gas Optimization</span>
                    <span style={{ color: '#10b981' }}>High</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#6b7280'
                  }}>
                    <span>MEV Protection</span>
                    <span style={{ color: '#6366f1' }}>Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Policy */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', marginBottom: '1rem' }}>
                <ShieldCheck style={{ width: '20px', height: '20px' }} />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>Execution Policy</h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                Robo-advisor permissions are restricted to asset swaps within your wallet. 
                The agent cannot withdraw funds to external addresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
