'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '🏠 Home', description: 'Main Dashboard' },
    { href: '/yield-farmer', label: '🌾 Yield Farmer', description: 'Auto-Compounding' },
    { href: '/smart-dca', label: '📈 Smart DCA', description: 'Dollar Cost Averaging' },
    { href: '/emergency-brake', label: '🚨 Emergency Brake', description: 'Stop-Loss Protection' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">🏢 PropChain AI</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-500">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              EIP-7715 Enabled
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Base Sepolia
            </span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-gray-500">{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}