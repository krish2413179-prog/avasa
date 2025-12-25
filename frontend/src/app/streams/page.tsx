'use client';

import { 
  Droplets, 
  ArrowRight, 
  Plus, 
  Play, 
  Pause, 
  Trash2,
  Clock,
  Zap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  History,
  DollarSign,
  Brain
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function MoneyStreamsPage() {
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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Money Streams</p>
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
              Money Streams
            </h1>
            <span style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Powered by Superfluid
            </span>
          </div>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            Continuous real-time value transfer on Base Sepolia
          </p>
          
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
            alignSelf: 'flex-start',
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
            <Plus style={{ width: '16px', height: '16px' }} />
            Create New Stream
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Outflow Rate', value: '12.5 USDC / day', color: '#ef4444', icon: TrendingUp },
            { label: 'Inflow Rate', value: '45.2 USDC / day', color: '#10b981', icon: TrendingUp },
            { label: 'Total Streamed', value: '$12,450.20', color: 'white', icon: Activity },
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
          {/* Active Streams */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              color: 'white', 
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Active Streams
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Salary Distribution', to: 'alice.base.eth', rate: '5 USDC / day', status: 'Streaming' },
                { name: 'Property Management', to: 'hq.propchain.eth', rate: '2.5 USDC / day', status: 'Streaming' },
                { name: 'Yield Reinvestment', to: 'Yield Farmer', rate: '5 USDC / day', status: 'Streaming' },
              ].map((stream, i) => (
                <div key={i} style={{
                  padding: '1.25rem',
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
                      position: 'relative',
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      overflow: 'hidden'
                    }}>
                      <Droplets style={{ width: '24px', height: '24px', position: 'relative', zIndex: 10 }} />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'rgba(16, 185, 129, 0.1)',
                        animation: 'pulse 2s infinite'
                      }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stream.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                        To: <span style={{ color: '#3b82f6', fontWeight: '500' }}>{stream.to}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937' }}>{stream.rate}</div>
                      <div style={{ 
                        fontSize: '0.625rem', 
                        color: '#10b981', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        marginTop: '0.125rem' 
                      }}>
                        Active
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button style={{
                        padding: '0.5rem',
                        borderRadius: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#27272a'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Pause style={{ width: '16px', height: '16px' }} />
                      </button>
                      <button style={{
                        padding: '0.5rem',
                        borderRadius: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(239, 68, 68, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#27272a';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(239, 68, 68, 0.5)';
                      }}>
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Protocol Token</h3>
              <div style={{
                padding: '1rem',
                borderRadius: '16px',
                background: '#18181b',
                border: '1px solid #27272a',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <DollarSign style={{ width: '16px', height: '16px', color: '#10b981' }} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>fUSDCx</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>4,250.00</div>
                    <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>Wrapped USDC</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem',
                    borderRadius: '12px',
                    background: '#27272a',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#3f3f46'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#27272a'}>
                    Wrap USDC
                  </button>
                  <button style={{
                    padding: '0.5rem',
                    borderRadius: '12px',
                    background: '#27272a',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#3f3f46'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#27272a'}>
                    Unwrap
                  </button>
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
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>Real-time Settlement</h3>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                lineHeight: '1.5', 
                margin: 0 
              }}>
                Superfluid allows your assets to be settled every second. This means yield starts compounding 
                the moment it is generated, not at the end of the month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
