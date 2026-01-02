'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Brain, 
  Search, 
  Building2, 
  MapPin, 
  TrendingUp, 
  DollarSign,
  Shield,
  FileText,
  ExternalLink,
  X
} from 'lucide-react';

interface PropertyData {
  id: string;
  name: string;
  location: string;
  price: number;
  yield: number;
  totalSupply: number;
  availableShares: number;
  image: string;
  description: string;
  marketCap: number;
  liquidity: number;
  compliance: {
    kycRequired: boolean;
    accreditedOnly: boolean;
    jurisdiction: string;
  };
  documents: {
    prospectus: string;
    legalOpinion: string;
    auditReport: string;
  };
}

export default function ProductionRWAPage() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/enhanced-properties`);
      const data = await response.json();
      if (data.success) {
        setProperties(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: 'white', fontSize: '1.125rem' }}>Loading production-grade RWA properties...</p>
        </div>
      </div>
    );
  }

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Production RWA</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[
                  { name: 'Dashboard', href: '/' },
                  { name: 'Properties', href: '/properties' },
                  { name: 'Portfolio', href: '/portfolio' },
                  { name: 'Production RWA', href: '/production-rwa' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: item.href === '/production-rwa' ? '#3b82f6' : '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      background: item.href === '/production-rwa' ? '#eff6ff' : 'transparent',
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
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Production-Grade Real World Assets
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Tokenized real estate with IPFS metadata, Chainlink oracles, EAS compliance, and Uniswap liquidity
          </p>
        </div>

        {properties.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#6b7280', marginBottom: '1rem' }}>
              <Building2 style={{ width: '48px', height: '48px', margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No Properties Available</h3>
            <p style={{ color: '#6b7280' }}>
              Production-grade RWA properties will appear here once the enhanced property service is initialized.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem'
          }}>
            {properties.map((property) => (
              <div 
                key={property.id} 
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ height: '200px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {property.image ? (
                    <img 
                      src={property.image} 
                      alt={property.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Building2 style={{ width: '48px', height: '48px', color: '#9ca3af' }} />
                  )}
                </div>
                
                <div style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>{property.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <p style={{ color: '#6b7280', margin: 0 }}>{property.location}</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Price:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>${property.price?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Yield:</span>
                      <span style={{ fontWeight: '600', color: '#059669' }}>{property.yield || 0}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Market Cap:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>${property.marketCap?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedProperty(property)}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Property Details Modal */}
        {selectedProperty && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{selectedProperty.name}</h2>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    style={{
                      padding: '8px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >
                    <X style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{selectedProperty.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                        Property Details
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div>Location: {selectedProperty.location}</div>
                        <div>Total Supply: {selectedProperty.totalSupply?.toLocaleString() || 'N/A'}</div>
                        <div>Available: {selectedProperty.availableShares?.toLocaleString() || 'N/A'}</div>
                        <div>Liquidity: ${selectedProperty.liquidity?.toLocaleString() || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield style={{ width: '20px', height: '20px', color: '#059669' }} />
                        Compliance
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <div>KYC Required: {selectedProperty.compliance?.kycRequired ? 'Yes' : 'No'}</div>
                        <div>Accredited Only: {selectedProperty.compliance?.accreditedOnly ? 'Yes' : 'No'}</div>
                        <div>Jurisdiction: {selectedProperty.compliance?.jurisdiction || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                      Legal Documents
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {selectedProperty.documents?.prospectus && (
                        <a 
                          href={selectedProperty.documents.prospectus} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            color: '#3b82f6', 
                            textDecoration: 'none', 
                            fontSize: '0.875rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: '#eff6ff'
                          }}
                        >
                          📄 Investment Prospectus
                          <ExternalLink style={{ width: '14px', height: '14px' }} />
                        </a>
                      )}
                      {selectedProperty.documents?.legalOpinion && (
                        <a 
                          href={selectedProperty.documents.legalOpinion} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            color: '#3b82f6', 
                            textDecoration: 'none', 
                            fontSize: '0.875rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: '#eff6ff'
                          }}
                        >
                          ⚖️ Legal Opinion
                          <ExternalLink style={{ width: '14px', height: '14px' }} />
                        </a>
                      )}
                      {selectedProperty.documents?.auditReport && (
                        <a 
                          href={selectedProperty.documents.auditReport} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            color: '#3b82f6', 
                            textDecoration: 'none', 
                            fontSize: '0.875rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: '#eff6ff'
                          }}
                        >
                          🔍 Audit Report
                          <ExternalLink style={{ width: '14px', height: '14px' }} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                    <button style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Invest Now
                    </button>
                    <button style={{
                      flex: 1,
                      padding: '12px 24px',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Download Documents
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}