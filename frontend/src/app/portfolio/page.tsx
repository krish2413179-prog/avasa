'use client';

import { PROPERTIES } from '@/lib/data';
import Image from 'next/image';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Activity,
  Wallet,
  ArrowRight,
  Brain,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const portfolioDistribution = [
  { name: 'Real Estate', value: 65, color: '#6366f1' },
  { name: 'ETH', value: 20, color: '#8b5cf6' },
  { name: 'USDC', value: 15, color: '#10b981' },
];

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ padding: '2rem', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />;

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Portfolio</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[
                  { name: 'Dashboard', href: '/' },
                  { name: 'Properties', href: '/properties' },
                  { name: 'Portfolio', href: '/portfolio' },
                  { name: 'Trading', href: '/manual-trade' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: item.href === '/portfolio' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/portfolio' ? '#eff6ff' : 'transparent',
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
              My <span style={{ background: 'linear-gradient(45deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portfolio</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Real-time performance and asset allocation
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              REBALANCE PORTFOLIO
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Value', value: '$124,500.00', change: '+12.5%', trend: 'up', icon: DollarSign },
            { label: 'Total Yield', value: '$7,594.50', change: '+8.2%', trend: 'up', icon: TrendingUp },
            { label: 'Active Streams', value: '4', change: 'Stable', trend: 'neutral', icon: Activity },
            { label: 'Health Factor', value: '2.45', change: '+0.1', trend: 'up', icon: Wallet },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: 'white'
                }}>
                  <stat.icon style={{ width: '20px', height: '20px' }} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '20px',
                  background: stat.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                  color: stat.trend === 'up' ? '#059669' : '#6b7280'
                }}>
                  {stat.trend === 'up' && <ArrowUpRight style={{ width: '12px', height: '12px' }} />}
                  {stat.change}
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Growth Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '32px',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minHeight: '450px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Growth Overview</h3>
              <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '12px' }}>
                {['1W', '1M', '3M'].map((t) => (
                  <button key={t} style={{
                    padding: '6px 16px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    background: t === '1M' ? 'white' : 'transparent',
                    color: t === '1M' ? '#3b82f6' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: t === '1M' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'rgba(248, 250, 252, 0.5)',
                borderRadius: '16px',
                border: '2px dashed #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280'
              }}>
                <BarChart3 style={{ width: '48px', height: '48px', opacity: 0.2 }} />
                <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '500' }}>Growth Chart Placeholder</span>
              </div>
            </div>
          </div>

          {/* Allocation Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '32px',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '450px'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Allocation</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'rgba(248, 250, 252, 0.5)',
                  borderRadius: '16px',
                  border: '2px dashed #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280'
                }}>
                  <PieChart style={{ width: '48px', height: '48px', opacity: 0.2 }} />
                  <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '500' }}>Allocation Chart Placeholder</span>
                </div>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '9px', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Assets</span>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>10</span>
                </div>
              </div>
              
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
                {portfolioDistribution.map((item) => (
                  <div key={item.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'white',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: item.color 
                      }} />
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Holdings */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Top Holdings</h3>
            <button style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: 'rgba(255, 255, 255, 0.8)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Manage all
              <ArrowRight style={{ width: '12px', height: '12px' }} />
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
            {PROPERTIES.slice(0, 4).map((property, i) => (
              <div 
                key={property.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <Image src={property.image} alt={property.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>{property.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold' }}>Yielding 8.2% APY</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>$15,400.00</div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: 'bold',
                    color: '#059669',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    marginTop: '4px'
                  }}>
                    ROI +14%
                  </div>
                </div>
                <button style={{
                  padding: '8px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.color = '#3b82f6';
                }}
                >
                  <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}