'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  TrendingUp,
  DollarSign,
  Building2,
  Zap,
  ArrowUpRight,
  Activity,
  Wallet,
  Bell,
  Search,
  Brain,
  Menu,
  X,
} from 'lucide-react';

interface PortfolioMetrics {
  totalValue: number;
  totalValueUSD: string;
  change24h: number;
  avgYield: number;
  activeAssets: number;
  ethPrice: number;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const marketResponse = await fetch('http://localhost:3001/api/enhanced-properties/market-data');
      const marketData = await marketResponse.json();

      let ethPrice = 2940;
      if (marketData.success) {
        ethPrice = marketData.data.ethPrice;
      }

      setPortfolioMetrics({
        totalValue: 12.5,
        totalValueUSD: '$36.7M',
        change24h: 8.2,
        avgYield: 11.4,
        activeAssets: 8,
        ethPrice: ethPrice,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setPortfolioMetrics({
        totalValue: 12.5,
        totalValueUSD: '$36.7M',
        change24h: 8.2,
        avgYield: 11.4,
        activeAssets: 8,
        ethPrice: 2940,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsProcessing(true);
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Send message to backend AI parser
      const response = await fetch('http://localhost:3001/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userMessage }),
      });

      const data = await response.json();
      
      if (response.ok && data.type) {
        // Successfully parsed the command - show the parsed action
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `✅ ${data.description}\n\nAction: ${data.type}\nDetails: ${JSON.stringify(data.params, null, 2)}` 
        }]);
      } else {
        // Handle error response
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.error || 'Sorry, I encountered an error processing your request. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting to the AI service. Please check that the backend is running.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleSendMessage();
    }
  };

  if (!mounted) return null;

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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Next-Gen RWA Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
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
                      color: '#374151',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.color = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '16px', 
                  height: '16px', 
                  color: '#9ca3af' 
                }} />
                <input
                  type="text"
                  placeholder="Search..."
                  style={{
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    width: '200px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
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
        minHeight: 'calc(100vh - 80px)', // Account for navigation height
        width: '100%'
      }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Welcome back, <span style={{ background: 'linear-gradient(45deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Amanda</span> 👋
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            {loading ? 'Loading your portfolio...' : 
             portfolioMetrics ? `Your portfolio is up ${portfolioMetrics.change24h.toFixed(1)}% today • ETH: $${portfolioMetrics.ethPrice.toLocaleString()}` :
             'Your intelligent RWA portfolio dashboard'
            }
          </p>
        </div>

        {/* Portfolio Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ height: '16px', background: '#e5e7eb', borderRadius: '4px', width: '60%', marginBottom: '1rem' }}></div>
                <div style={{ height: '32px', background: '#e5e7eb', borderRadius: '4px', width: '40%', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '12px', background: '#e5e7eb', borderRadius: '4px', width: '50%' }}></div>
              </div>
            ))
          ) : portfolioMetrics ? (
            [
              {
                title: 'Total Portfolio Value',
                value: `${portfolioMetrics.totalValue.toFixed(2)} ETH`,
                subtitle: portfolioMetrics.totalValueUSD,
                change: portfolioMetrics.change24h,
                icon: Wallet,
                color: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              },
              {
                title: 'Average Yield',
                value: `${portfolioMetrics.avgYield.toFixed(1)}%`,
                subtitle: 'Annual APY',
                change: 2.3,
                icon: TrendingUp,
                color: 'linear-gradient(135deg, #10b981, #059669)',
              },
              {
                title: 'Active Assets',
                value: portfolioMetrics.activeAssets.toString(),
                subtitle: 'RWA Properties',
                change: 0,
                icon: Building2,
                color: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              },
              {
                title: 'AI Strategies',
                value: '3',
                subtitle: 'Active automations',
                change: 1,
                icon: Zap,
                color: 'linear-gradient(135deg, #f59e0b, #d97706)',
              },
            ].map((metric, index) => (
              <div
                key={metric.title}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: metric.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <metric.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                  </div>
                  {metric.change !== 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: metric.change > 0 ? '#059669' : '#dc2626'
                    }}>
                      <TrendingUp style={{ width: '16px', height: '16px' }} />
                      <span>{metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>{metric.title}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{metric.value}</p>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{metric.subtitle}</p>
                </div>
              </div>
            ))
          ) : null}
        </div>

        {/* AI Chat Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>PropChain AI Assistant</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Ready to help manage your RWA portfolio</p>
            </div>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem',
            border: '1px solid #e2e8f0',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {chatMessages.length === 0 ? (
              <p style={{ color: '#475569', lineHeight: '1.6', margin: 0 }}>
                Welcome to PropChain AI! I'm your intelligent DeFi assistant, ready to help you manage your Real World Asset portfolio. 
                I can execute trades, set up automated strategies, and monitor your investments. What would you like to do today?
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {chatMessages.map((message, index) => (
                  <div key={index} style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: message.role === 'user' ? '#3b82f6' : '#e2e8f0',
                    color: message.role === 'user' ? 'white' : '#374151',
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    fontSize: '0.875rem',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {message.content}
                  </div>
                ))}
                {isProcessing && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: '#e2e8f0',
                    color: '#374151',
                    alignSelf: 'flex-start',
                    maxWidth: '80%',
                    fontSize: '0.875rem',
                    lineHeight: '1.4',
                    fontStyle: 'italic'
                  }}>
                    🤖 Processing your request...
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {[
              'invest $1000 in property 1',
              'stream 5 USDC/day to alice.base.eth',
              'keep portfolio 60% real estate 40% ETH',
              'activate emergency brake if ETH drops below $2000'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setChatInput(suggestion)}
                disabled={isProcessing}
                style={{
                  padding: '6px 12px',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#374151',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isProcessing ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Try: 'invest $1000 in property 1' or 'stream 5 USDC/day to alice.base.eth'"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: isProcessing ? '#f9fafb' : 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.875rem',
                outline: 'none',
                cursor: isProcessing ? 'not-allowed' : 'text'
              }}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isProcessing}
              style={{
                padding: '12px 24px',
                background: (chatInput.trim() && !isProcessing)
                  ? 'linear-gradient(135deg, #3b82f6, #6366f1)' 
                  : '#e5e7eb',
                color: (chatInput.trim() && !isProcessing) ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: (chatInput.trim() && !isProcessing) ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {isProcessing ? 'Processing...' : 'Send'}
              {!isProcessing && <ArrowUpRight style={{ width: '16px', height: '16px' }} />}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { name: 'Auto-Rebalance', href: '/rebalance', color: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
            { name: 'Yield Farming', href: '/yield-farmer', color: 'linear-gradient(135deg, #10b981, #059669)' },
            { name: 'Emergency Brake', href: '/emergency', color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
            { name: 'Production RWA', href: '/production-rwa', color: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
          ].map((action) => (
            <Link
              key={action.name}
              href={action.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                background: action.color,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '16px',
                fontWeight: '600',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{action.name}</span>
              <ArrowUpRight style={{ width: '20px', height: '20px' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}