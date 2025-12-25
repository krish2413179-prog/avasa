'use client';

import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Users,
  Building2,
  Calendar,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function AnalyticsPage() {
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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Analytics</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[
                  { name: 'Dashboard', href: '/' },
                  { name: 'Properties', href: '/properties' },
                  { name: 'Portfolio', href: '/portfolio' },
                  { name: 'Analytics', href: '/analytics' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: item.href === '/analytics' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/analytics' ? '#eff6ff' : 'transparent',
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
              Analytics
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Deep insights into your portfolio performance and market trends
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1f2937',
              outline: 'none'
            }}>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date</option>
            </select>
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
            { label: 'Net Profit', value: '+$14,250.00', change: '+8.4%', trend: 'up', icon: TrendingUp },
            { label: 'Yield Efficiency', value: '94.2%', change: '+2.1%', trend: 'up', icon: Target },
            { label: 'Market Cap Share', value: '0.04%', change: '-0.1%', trend: 'down', icon: PieChart },
            { label: 'System Uptime', value: '99.99%', change: 'Stable', trend: 'neutral', icon: Activity },
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
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#6b7280'
                }}>
                  <stat.icon style={{ width: '20px', height: '20px' }} />
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: stat.trend === 'up' ? '#059669' : stat.trend === 'down' ? '#dc2626' : '#6b7280'
                }}>
                  {stat.change}
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Yield Distribution</h3>
            <div style={{
              aspectRatio: '16/9',
              width: '100%',
              background: 'rgba(248, 250, 252, 0.5)',
              borderRadius: '16px',
              border: '2px dashed #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}>
              <BarChart3 style={{ width: '48px', height: '48px', opacity: 0.2 }} />
              <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '500' }}>Yield Chart Placeholder</span>
            </div>
          </section>

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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Portfolio Composition</h3>
            <div style={{
              aspectRatio: '16/9',
              width: '100%',
              background: 'rgba(248, 250, 252, 0.5)',
              borderRadius: '16px',
              border: '2px dashed #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}>
              <PieChart style={{ width: '48px', height: '48px', opacity: 0.2 }} />
              <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '500' }}>Composition Chart Placeholder</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}