'use client';

import { 
  Building2, 
  Wallet, 
  Zap, 
  ShieldAlert, 
  RefreshCw, 
  Users, 
  TrendingUp, 
  Settings,
  PieChart,
  Droplets,
  Link2,
  HandCoins,
  ArrowLeft,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const options = [
  { name: 'RWA Portfolio', href: '/portfolio', icon: PieChart, description: 'Manage your Real World Asset holdings' },
  { name: 'Properties', href: '/properties', icon: Building2, description: 'Browse and invest in premium real estate' },
  { name: 'Yield Claims', href: '/yield', icon: HandCoins, description: 'Claim your earned yields from RWAs' },
  { name: 'Yield Farmer', href: '/yield-farmer', icon: RefreshCw, description: 'Optimize your yield harvesting strategy' },
  { name: 'Smart DCA', href: '/dca', icon: Zap, description: 'Automate your investments with dollar-cost averaging' },
  { name: 'Emergency Brake', href: '/emergency', icon: ShieldAlert, description: 'Instantly secure your assets in volatile times' },
  { name: 'Auto-Rebalance', href: '/rebalance', icon: Building2, description: 'Maintain your target asset allocation automatically' },
  { name: 'Copy Trading', href: '/copy-trading', icon: Users, description: 'Follow successful RWA investment strategies' },
  { name: 'Limit Orders', href: '/limit-orders', icon: TrendingUp, description: 'Set price targets for asset purchases' },
  { name: 'Money Streams', href: '/streams', icon: Droplets, description: 'Manage continuous payment and yield streams' },
  { name: 'Basenames', href: '/basenames', icon: Link2, description: 'Manage your identity on the Base network' },
  { name: 'Lending', href: '/lending', icon: Wallet, description: 'Supply or borrow assets against your RWAs' },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, description: 'Deep dive into your portfolio performance' },
  { name: 'Settings', href: '/settings', icon: Settings, description: 'Configure your account and platform preferences' },
];

export default function ManualTrade() {
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase()) || 
    opt.description.toLowerCase().includes(search.toLowerCase())
  );

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
                <Building2 style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>PropChain AI</h1>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Manual Operations</p>
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
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              marginBottom: '1rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Dashboard
          </Link>
          
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Manual <span style={{ background: 'linear-gradient(45deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Operations</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem' }}>
            Select a tool to manage your RWA portfolio manually
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '20px', 
              height: '20px', 
              color: '#9ca3af' 
            }} />
            <input 
              type="text" 
              placeholder="Search operations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                backdropFilter: 'blur(10px)'
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredOptions.map((option, i) => (
            <Link 
              key={option.name}
              href={option.href}
              style={{
                display: 'block',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <option.icon style={{ width: '28px', height: '28px' }} />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    margin: 0
                  }}>
                    {option.name}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280', 
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {option.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredOptions.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <Search style={{ width: '40px', height: '40px' }} />
            </div>
            <p style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              No matching operations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
