'use client';

import { PROPERTIES } from '@/lib/data';
import { 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  ArrowUpRight,
  Info,
  Settings2,
  Lock,
  History,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function YieldFarmerPage() {
  const [isEnabled, setIsEnabled] = useState(false);

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Yield Farmer</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[
                  { name: 'Dashboard', href: '/' },
                  { name: 'Properties', href: '/properties' },
                  { name: 'Yield Farmer', href: '/yield-farmer' },
                  { name: 'Emergency', href: '/emergency' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: item.href === '/yield-farmer' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/yield-farmer' ? '#eff6ff' : 'transparent',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                color: 'white', 
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Yield Farmer
              </h1>
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                EIP-7715 Strategy
              </span>
            </div>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Auto-compound your rental income for exponential growth
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            width: 'fit-content'
          }}>
            <button 
              onClick={() => setIsEnabled(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                background: !isEnabled ? '#f3f4f6' : 'transparent',
                color: !isEnabled ? '#1f2937' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                boxShadow: !isEnabled ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Disabled
            </button>
            <button 
              onClick={() => setIsEnabled(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                background: isEnabled ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                color: isEnabled ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isEnabled ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              Active
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Strategy Configuration */}
            <section style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  margin: 0
                }}>
                  <Settings2 style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                  Strategy Configuration
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Reinvestment Threshold
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>$</div>
                    <input 
                      type="number" 
                      defaultValue="50"
                      style={{
                        width: '100%',
                        paddingLeft: '32px',
                        paddingRight: '16px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        color: '#1f2937',
                        fontWeight: 'bold',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Automatically reinvest when yield reaches this amount</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Target Asset
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    color: '#1f2937',
                    fontWeight: 'bold',
                    outline: 'none'
                  }}>
                    <option>Current Property (Auto-Compound)</option>
                    <option>Highest Yielding Property</option>
                    <option>ETH (Liquid Stack)</option>
                  </select>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.1)'
                }}>
                  <ShieldCheck style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    Advanced Permission Policy
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                    This agent is permitted to call <code style={{ color: '#6366f1' }}>claimYield()</code> and <code style={{ color: '#6366f1' }}>invest()</code> 
                    but ONLY using funds generated from yield. Principal assets remain locked and inaccessible.
                  </p>
                </div>
              </div>
            </section>

            {/* Recent Reinvestments */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                margin: 0
              }}>
                <History style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
                Recent Reinvestments
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { date: '2 hours ago', property: 'Miami Beach Condos', amount: '$54.20', status: 'Success' },
                  { date: '1 day ago', property: 'Manhattan Luxury Apartments', amount: '$120.50', status: 'Success' },
                  { date: '3 days ago', property: 'Austin Tech Hub Office', amount: '$89.00', status: 'Success' },
                ].map((tx, i) => (
                  <div key={i} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '1rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        padding: '10px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981'
                      }}>
                        <RefreshCw style={{ width: '16px', height: '16px' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{tx.property}</h4>
                        <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>{tx.date}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>{tx.amount}</div>
                        <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>{tx.status}</div>
                      </div>
                      <ArrowUpRight style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Performance */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Performance</h3>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>Estimated APY</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>7.4%</div>
                  </div>
                  <div style={{
                    padding: '8px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981'
                  }}>
                    <TrendingUp style={{ width: '20px', height: '20px' }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    <span>Compounding Progress</span>
                    <span style={{ color: '#1f2937' }}>84%</span>
                  </div>
                  <div style={{
                    height: '8px',
                    width: '100%',
                    background: '#f3f4f6',
                    borderRadius: '20px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: '84%',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Total Compounded</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>$4,250</div>
                  </div>
                  <div style={{
                    padding: '12px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>Yield Saved</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>$120</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1' }}>
                <Lock style={{ width: '20px', height: '20px' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Security Guarantee</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                PropChain AI uses MetaMask's new Advanced Permissions (EIP-7715). 
                The agent can only perform the specific actions you authorize.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Method-level restrictions',
                  'Zero access to principal',
                  'Revocable at any time',
                  'Base Sepolia secured'
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '10px', fontWeight: 'bold', color: '#374151' }}>
                    <CheckCircle2 style={{ width: '12px', height: '12px', color: '#6366f1' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}