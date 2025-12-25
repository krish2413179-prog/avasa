'use client';

import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  HandCoins,
  Activity,
  Calendar,
  Clock,
  ChevronRight,
  Gift,
  Brain
} from 'lucide-react';
import Link from 'next/link';

// Mock properties data
const PROPERTIES = [
  { id: '1', name: 'Manhattan Luxury Apartments', yield: '4.2%' },
  { id: '2', name: 'Miami Beach Condos', yield: '5.1%' },
  { id: '3', name: 'Austin Tech Hub Office', yield: '6.8%' },
  { id: '4', name: 'Seattle Warehouse District', yield: '7.2%' },
  { id: '5', name: 'Denver Mountain Resort', yield: '8.1%' },
];

export default function YieldPage() {
  const pendingYield = 1250.75;
  const totalClaimed = 45280.20;

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Yield Claims</p>
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
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: 'white', 
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Yield Claims
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            Manage and claim your rental income distributions
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
            <HandCoins style={{ width: '16px', height: '16px' }} />
            Claim All Pending Yield
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                marginBottom: '1rem', 
                color: '#3b82f6' 
              }}>
                <Clock style={{ width: '20px', height: '20px' }} />
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Pending Yield
                </span>
              </div>
              <div style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '0.5rem' 
              }}>
                ${pendingYield.toLocaleString()}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                Next distribution in 4 days, 12 hours
              </p>
            </div>
            <div style={{
              position: 'absolute',
              right: '-2rem',
              bottom: '-2rem',
              opacity: 0.05
            }}>
              <HandCoins style={{ width: '128px', height: '128px', color: '#3b82f6' }} />
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              marginBottom: '1rem', 
              color: '#10b981' 
            }}>
              <Gift style={{ width: '20px', height: '20px' }} />
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Total Claimed
              </span>
            </div>
            <div style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '0.5rem' 
            }}>
              ${totalClaimed.toLocaleString()}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
              Life-time rental income
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              marginBottom: '1rem', 
              color: '#a855f7' 
            }}>
              <TrendingUp style={{ width: '20px', height: '20px' }} />
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Avg. Yield Rate
              </span>
            </div>
            <div style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '0.5rem' 
            }}>
              6.1%
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
              Portfolio-wide average APY
            </p>
          </div>
        </div>

        {/* Property Distributions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 'bold', 
            color: 'white', 
            margin: 0,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            Property Distributions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {PROPERTIES.slice(0, 5).map((property, i) => (
              <div 
                key={property.id}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: '#18181b',
                    border: '1px solid #27272a',
                    color: '#9ca3af',
                    transition: 'color 0.2s'
                  }}>
                    <DollarSign style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                      {property.name}
                    </h4>
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      marginTop: '0.125rem',
                      margin: 0
                    }}>
                      <Calendar style={{ width: '12px', height: '12px' }} />
                      Last claimed: 12 days ago
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>+$124.50</div>
                    <div style={{ 
                      fontSize: '0.625rem', 
                      color: '#6b7280', 
                      marginTop: '0.125rem' 
                    }}>
                      Yield: {property.yield}
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
                    Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
