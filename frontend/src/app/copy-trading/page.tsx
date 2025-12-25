'use client';

import { 
  Users, 
  Search, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Filter,
  Star,
  Copy,
  Brain
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const traders = [
  { 
    name: 'nancy.base.eth', 
    roi: '+142.5%', 
    winRate: '84%', 
    followers: '1.2k',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    assets: ['RWA', 'ETH', 'USDC'],
    description: 'Specializing in high-yield RWA properties and momentum ETH trades.'
  },
  { 
    name: 'alpha_whale.base.eth', 
    roi: '+98.2%', 
    winRate: '72%', 
    followers: '850',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    assets: ['ETH', 'Lending', 'BTC'],
    description: 'Conservative growth strategy with focus on Aave lending yields.'
  },
  { 
    name: 'rwa_master.base.eth', 
    roi: '+64.1%', 
    winRate: '92%', 
    followers: '2.4k',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop',
    assets: ['RWA', 'USDC'],
    description: 'Maximum stability through diversified real estate share ownership.'
  },
];

export default function CopyTradingPage() {
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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Copy Trading</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[
                  { name: 'Dashboard', href: '/' },
                  { name: 'Auto-Rebalance', href: '/rebalance' },
                  { name: 'Copy Trading', href: '/copy-trading' },
                  { name: 'Limit Orders', href: '/limit-orders' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: item.href === '/copy-trading' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/copy-trading' ? '#eff6ff' : 'transparent',
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
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Copy Trading
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Mirror the strategies of top-performing on-chain investors
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '16px', 
                height: '16px', 
                color: '#6b7280' 
              }} />
              <input 
                type="text" 
                placeholder="Search traders..."
                style={{
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  width: '256px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <button style={{
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: '#6b7280'
            }}>
              <Filter style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Copied Value', value: '$45,200.00', icon: Users },
            { label: 'Avg. ROI', value: '+24.5%', icon: TrendingUp },
            { label: 'Active Copying', value: '3', icon: Activity },
            { label: 'PropChain Rank', value: '#124', icon: Star },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                padding: '8px',
                width: 'fit-content',
                borderRadius: '8px',
                background: '#f8fafc',
                color: '#6b7280',
                marginBottom: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <stat.icon style={{ width: '16px', height: '16px' }} />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Top Traders Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Top Traders</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500' }}>Sort by:</span>
              <select style={{
                background: 'transparent',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                outline: 'none',
                border: 'none'
              }}>
                <option>ROI (30d)</option>
                <option>Followers</option>
                <option>Win Rate</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {traders.map((trader, i) => (
              <div 
                key={trader.name}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '32px',
                  padding: '2rem',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.98)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      position: 'relative',
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '2px solid #e2e8f0'
                    }}>
                      <Image src={trader.avatar} alt={trader.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{trader.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#e2e8f0',
                          color: '#6b7280',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}>
                          PRO
                        </span>
                        <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>{trader.followers} followers</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#10b981' }}>{trader.roi}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>30D ROI</div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                  {trader.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Win Rate</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>{trader.winRate}</div>
                  </div>
                  <div style={{
                    padding: '12px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Primary Assets</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {trader.assets.map(a => (
                        <span key={a} style={{
                          fontSize: '8px',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#6366f1',
                          fontWeight: 'bold'
                        }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Copy style={{ width: '16px', height: '16px' }} />
                  Copy Trades
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Protection */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '12px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#6366f1'
            }}>
              <ShieldCheck style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Risk Protection Active</h3>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Mirroring is limited to 10% of your total balance per trader.</p>
            </div>
          </div>
          <button style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#6366f1',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6366f1'}
          >
            Configure Risk Limits
          </button>
        </div>
      </div>
    </div>
  );
}