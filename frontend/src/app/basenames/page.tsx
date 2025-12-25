'use client';

import { 
  Link2, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Globe,
  Plus,
  Info,
  History,
  Activity,
  Brain
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function BasenamesPage() {
  const [search, setSearch] = useState('');

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Basenames</p>
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
              Basenames
            </h1>
            <span style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              L2 Identity
            </span>
          </div>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            Human-readable identity for the Base ecosystem
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
            Register New Name
          </button>
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '2rem'
        }}>
          {/* Search Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: '#6b7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Search or Resolve
                </label>
                <div style={{ position: 'relative' }}>
                  <Search style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    width: '20px', 
                    height: '20px', 
                    color: '#6b7280' 
                  }} />
                  <input 
                    type="text" 
                    placeholder="Enter a basename (e.g. alice.base.eth)"
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '16px',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      color: 'white',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#27272a';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {search && (
                <div style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: '#18181b',
                  border: '1px solid #27272a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Globe style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{search}</h4>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontFamily: 'monospace', 
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px'
                      }}>
                        0x6533...7eBA
                      </p>
                    </div>
                  </div>
                  <button style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    background: 'white',
                    color: 'black',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    View Profile
                  </button>
                </div>
              )}

              <div style={{
                padding: '1rem',
                borderRadius: '16px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  height: 'fit-content'
                }}>
                  <Info style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white', margin: 0 }}>L2 Resolver Technology</h4>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#9ca3af', 
                    lineHeight: '1.5', 
                    margin: 0 
                  }}>
                    Basenames are resolved directly on Base L2, ensuring sub-second resolution times for 
                    your AI commands and money streams.
                  </p>
                </div>
              </div>
            </div>

            {/* My Names Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: 'white', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                <History style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                My Names
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem' 
              }}>
                {[
                  { name: 'user.base.eth', primary: true },
                  { name: 'vault.base.eth', primary: false },
                ].map((item, i) => (
                  <div key={i} style={{
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
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: '#18181b',
                        border: '1px solid #27272a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Link2 style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{item.name}</h4>
                        {item.primary && (
                          <span style={{ 
                            fontSize: '0.5rem', 
                            fontWeight: 'bold', 
                            color: '#3b82f6', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em' 
                          }}>
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                    <button style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#27272a';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.opacity = '0';
                    }}>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                ))}
              </div>
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
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Identity Health</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#18181b',
                  border: '1px solid #27272a'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280' }}>Reverse Resolution</span>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '16px',
                  background: '#18181b',
                  border: '1px solid #27272a'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280' }}>Linked Streams</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white' }}>4 Active</span>
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
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', margin: 0 }}>Security Note</h3>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                lineHeight: '1.5', 
                margin: 0 
              }}>
                Avasa uses Basenames to verify recipient identities before executing any money 
                streams or asset transfers. This prevents errors when typing hex addresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
