'use client';

import { PROPERTIES } from '@/lib/data';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  Search,
  Filter,
  Activity,
  ShieldCheck,
  Zap,
  Sparkles,
  Command,
  Brain
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function PropertiesPage() {
  const [search, setSearch] = useState('');

  const filteredProperties = PROPERTIES.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Properties</p>
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
                      color: item.href === '/properties' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/properties' ? '#eff6ff' : 'transparent',
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
        {/* Search Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: 'white'
              }}>
                <Command style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Property Search</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Find properties by name or location</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
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
                  placeholder="Ask Avasa to find properties, yields, or locations..."
                  style={{
                    width: '100%',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button style={{
                padding: '12px 16px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                color: '#6b7280'
              }}>
                <Filter style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Alpha Opportunities
              </span>
            </div>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              lineHeight: '1.1'
            }}>
              Institutional Grade <br />
              <span style={{ background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RWA Properties</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Real-time filtered assets matching your investment profile.
            </p>
          </div>
        </div>

        {/* Properties Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem'
        }}>
          {filteredProperties.map((property, i) => (
            <div 
              key={property.id}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Stats Floating Panel */}
              <div style={{
                position: 'absolute',
                right: '-16px',
                top: '48px',
                bottom: '48px',
                width: '80px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <div style={{
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'transform 0.5s'
                }}>
                  <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white' }}>{property.yield}</span>
                </div>
                <div style={{
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'transform 0.5s 0.1s'
                }}>
                  <DollarSign style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white' }}>{property.value.split('.')[0]}M</span>
                </div>
                <div style={{
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'transform 0.5s 0.2s'
                }}>
                  <Activity style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white' }}>LIVE</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', marginRight: '32px' }}>
                <div style={{ position: 'relative', height: '256px', overflow: 'hidden' }}>
                  <Image 
                    src={property.image} 
                    alt={property.name}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 1s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)'
                  }} />
                  
                  {/* Location Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <MapPin style={{ width: '12px', height: '12px', color: '#3b82f6' }} />
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {property.location}
                    </span>
                  </div>
                </div>
                
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', lineHeight: '1.2', margin: 0 }}>
                      {property.name}
                    </h3>
                    <ArrowUpRight style={{ width: '20px', height: '20px', color: '#6b7280', transition: 'color 0.2s' }} />
                  </div>

                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                    {property.description}
                  </p>

                  <div style={{ paddingTop: '1.5rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '-8px' }}>
                      {[1, 2, 3].map((n) => (
                        <div key={n} style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: '2px solid white',
                          background: '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          marginLeft: n > 1 ? '-8px' : '0'
                        }}>
                          <Image src={`https://i.pravatar.cc/100?u=${property.id + n}`} alt="investor" width={32} height={32} />
                        </div>
                      ))}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        background: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginLeft: '-8px'
                      }}>
                        +12
                      </div>
                    </div>
                    
                    <button style={{
                      padding: '12px 24px',
                      borderRadius: '16px',
                      background: 'white',
                      color: '#1f2937',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#1f2937';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    >
                      Invest Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
