'use client';

import { 
  ShieldAlert, 
  Zap, 
  TrendingDown, 
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Power,
  ChevronRight,
  History,
  Brain
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function EmergencyBrakePage() {
  const [isActive, setIsActive] = useState(true);

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Emergency Brake</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[
                  { name: 'Dashboard', href: '/' },
                  { name: 'Yield Farmer', href: '/yield-farmer' },
                  { name: 'Emergency', href: '/emergency' },
                  { name: 'Settings', href: '/settings' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: item.href === '/emergency' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/emergency' ? '#eff6ff' : 'transparent',
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
                Emergency Brake
              </h1>
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                EIP-7715 Strategy
              </span>
            </div>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Institutional-grade stop-loss protection for your digital assets
            </p>
          </div>
          
          <div style={{
            padding: '8px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'all 0.2s',
            background: isActive 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(255, 255, 255, 0.9)',
            color: isActive ? '#10b981' : '#6b7280',
            width: 'fit-content'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isActive ? '#10b981' : '#6b7280'
            }} />
            {isActive ? 'Protection Active' : 'Protection Disabled'}
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Panic Trigger */}
            <section style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444'
                }}>
                  <AlertTriangle style={{ width: '24px', height: '24px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Panic Trigger</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: 0 }}>Define the conditions that will trigger an automatic portfolio liquidation</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Trigger Asset
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    color: '#1f2937',
                    fontWeight: 'bold',
                    outline: 'none'
                  }}>
                    <option>ETH (Ethereum)</option>
                    <option>BTC (Wrapped Bitcoin)</option>
                    <option>Base Index</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Price Threshold (USDC)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>$</div>
                    <input 
                      type="number" 
                      defaultValue="2000"
                      style={{
                        width: '100%',
                        paddingLeft: '32px',
                        paddingRight: '16px',
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '16px',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.1)',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)'
                }}>
                  <ShieldCheck style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>EIP-7715 Conditional Permission</h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                    This agent holds a dormant permission that is only valid IF the Chainlink price feed for ETH 
                    drops below <span style={{ color: '#ef4444', fontWeight: 'bold' }}>$2,000</span>. The permission expires after execution.
                  </p>
                </div>
              </div>
            </section>

            {/* Protection History */}
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
                Protection History
              </h3>
              <div style={{
                padding: '2rem',
                borderRadius: '32px',
                border: '2px dashed rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.4)'
                }}>
                  <ShieldAlert style={{ width: '24px', height: '24px' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>No emergency events triggered</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>Your portfolio has remained within safety thresholds.</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* System Status */}
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>System Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>Oracle Latency</span>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#10b981' }}>12ms (Healthy)</span>
                </div>
                <div style={{
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>Permission Scope</span>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6366f1', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selective Liquidation</span>
                </div>
              </div>
            </div>

            {/* Manual Emergency Exit */}
            <button style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
            >
              <Power style={{ width: '16px', height: '16px' }} />
              Manual Emergency Exit
            </button>

            {/* Fail-Safe Protocol */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '32px',
              padding: '2rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <Lock style={{ width: '20px', height: '20px' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Fail-Safe Protocol</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                PropChain AI cannot access your keys. The liquidation permission is narrowly defined to swap 
                specific tokens to stables within your own wallet. No funds ever leave your custody.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}