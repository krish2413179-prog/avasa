'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: string
  description: string
  category: string
}

const navItems: NavItem[] = [
  // Main Dashboard
  { href: '/', label: 'Dashboard', icon: '🏠', description: 'AI Chat & Overview', category: 'main' },
  
  // EIP-7715 Advanced Permissions
  { href: '/yield-farmer', label: 'Yield Farmer', icon: '🌾', description: 'Auto-Compounding', category: 'permissions' },
  { href: '/smart-dca', label: 'Smart DCA', icon: '📈', description: 'Dollar Cost Averaging', category: 'permissions' },
  { href: '/emergency-brake', label: 'Emergency Brake', icon: '🚨', description: 'Stop-Loss Protection', category: 'permissions' },
  
  // RWA Management
  { href: '/rwa-properties', label: 'Properties', icon: '🏢', description: 'Manage Real Estate', category: 'rwa' },
  { href: '/rwa-portfolio', label: 'Portfolio', icon: '📊', description: 'Track Performance', category: 'rwa' },
  { href: '/rwa-yield', label: 'Yield Claims', icon: '💰', description: 'Claim Rental Income', category: 'rwa' },
  
  // DeFi Features
  { href: '/streams', label: 'Money Streams', icon: '💧', description: 'Superfluid Streaming', category: 'defi' },
  { href: '/basenames', label: 'Basenames', icon: '🏷️', description: 'ENS Resolution', category: 'defi' },
  { href: '/lending', label: 'Lending', icon: '🏦', description: 'Aave Borrowing', category: 'defi' },
  
  // Advanced Trading
  { href: '/auto-rebalance', label: 'Auto-Rebalance', icon: '⚖️', description: 'Portfolio Balancing', category: 'trading' },
  { href: '/copy-trading', label: 'Copy Trading', icon: '👥', description: 'Follow Whales', category: 'trading' },
  { href: '/limit-orders', label: 'Limit Orders', icon: '📋', description: 'Price Triggers', category: 'trading' },
  
  // Analytics & Settings
  { href: '/analytics', label: 'Analytics', icon: '📈', description: 'Performance Metrics', category: 'analytics' },
  { href: '/settings', label: 'Settings', icon: '⚙️', description: 'Configuration', category: 'analytics' },
]

const categories = {
  main: { label: 'Dashboard', color: 'text-gray-700' },
  permissions: { label: 'EIP-7715 Permissions', color: 'text-emerald-700' },
  rwa: { label: 'Real World Assets', color: 'text-blue-700' },
  defi: { label: 'DeFi Features', color: 'text-purple-700' },
  trading: { label: 'Advanced Trading', color: 'text-orange-700' },
  analytics: { label: 'Analytics & Settings', color: 'text-gray-700' },
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

  return (
    <>
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">🏢 PropChain AI</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Status Badges */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                EIP-7715 Enabled
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Base Sepolia
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Envio Active
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {Object.entries(categories).map(([categoryKey, category]) => {
              const items = groupedItems[categoryKey] || []
              if (items.length === 0) return null

              return (
                <div key={categoryKey}>
                  {!isCollapsed && (
                    <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${category.color}`}>
                      {category.label}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                          pathname === item.href
                            ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg mr-3">{item.icon}</span>
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500 truncate">{item.description}</div>
                          </div>
                        )}
                        {isCollapsed && (
                          <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div className="font-medium mb-1">PropChain AI v2.0</div>
              <div>EIP-7715 Advanced Permissions</div>
              <div>Real World Asset Platform</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}