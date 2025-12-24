'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useAccount } from 'wagmi'

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    tradeAlerts: boolean
    priceAlerts: boolean
    systemUpdates: boolean
  }
  trading: {
    slippageTolerance: number
    gasPrice: 'low' | 'medium' | 'high'
    autoApprove: boolean
    maxGasLimit: string
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    ipWhitelist: string[]
    requireConfirmation: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    currency: 'USD' | 'EUR' | 'GBP'
    language: 'en' | 'es' | 'fr' | 'de'
    timezone: string
  }
}

export default function SettingsPage() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState<'general' | 'trading' | 'security' | 'notifications'>('general')
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      tradeAlerts: true,
      priceAlerts: true,
      systemUpdates: false
    },
    trading: {
      slippageTolerance: 0.5,
      gasPrice: 'medium',
      autoApprove: false,
      maxGasLimit: '500000'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      ipWhitelist: [],
      requireConfirmation: true
    },
    display: {
      theme: 'light',
      currency: 'USD',
      language: 'en',
      timezone: 'UTC'
    }
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveSettings = async () => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        notifications: {
          email: true,
          push: true,
          sms: false,
          tradeAlerts: true,
          priceAlerts: true,
          systemUpdates: false
        },
        trading: {
          slippageTolerance: 0.5,
          gasPrice: 'medium',
          autoApprove: false,
          maxGasLimit: '500000'
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          ipWhitelist: [],
          requireConfirmation: true
        },
        display: {
          theme: 'light',
          currency: 'USD',
          language: 'en',
          timezone: 'UTC'
        }
      })
    }
  }

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  if (!isConnected) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Settings</h1>
            <p className="text-gray-600 mb-8">Connect your wallet to access platform settings</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800">Please connect your MetaMask wallet to continue</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Settings</h1>
          <p className="text-gray-600">Configure your PropChain AI platform preferences</p>
        </div>

        {/* Account Info */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Connected Account</h3>
              <p className="text-sm text-blue-700">{address}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700">Network</div>
              <div className="font-semibold text-blue-800">Base Sepolia</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎨 General
              </button>
              <button
                onClick={() => setActiveTab('trading')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trading'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💱 Trading
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔒 Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔔 Notifications
              </button>
            </nav>
          </div>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">General Preferences</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.display.theme}
                    onChange={(e) => updateSettings('display', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.display.currency}
                    onChange={(e) => updateSettings('display', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.display.language}
                    onChange={(e) => updateSettings('display', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.display.timezone}
                    onChange={(e) => updateSettings('display', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trading Settings */}
        {activeTab === 'trading' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Trading Preferences</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slippage Tolerance (%)
                  </label>
                  <input
                    type="number"
                    value={settings.trading.slippageTolerance}
                    onChange={(e) => updateSettings('trading', 'slippageTolerance', parseFloat(e.target.value))}
                    min="0.1"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum price movement tolerance for trades
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gas Price Strategy
                  </label>
                  <select
                    value={settings.trading.gasPrice}
                    onChange={(e) => updateSettings('trading', 'gasPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low (Slower, Cheaper)</option>
                    <option value="medium">Medium (Balanced)</option>
                    <option value="high">High (Faster, More Expensive)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Gas Limit
                  </label>
                  <input
                    type="number"
                    value={settings.trading.maxGasLimit}
                    onChange={(e) => updateSettings('trading', 'maxGasLimit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum gas limit for transactions
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Approve Small Transactions</h4>
                    <p className="text-sm text-gray-500">
                      Automatically approve transactions under $10 USD
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings('trading', 'autoApprove', !settings.trading.autoApprove)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.trading.autoApprove ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.trading.autoApprove ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button
                  onClick={() => updateSettings('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">Require Transaction Confirmation</h4>
                  <p className="text-sm text-gray-500">
                    Always confirm transactions before execution
                  </p>
                </div>
                <button
                  onClick={() => updateSettings('security', 'requireConfirmation', !settings.security.requireConfirmation)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.security.requireConfirmation ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.requireConfirmation ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={0}>Never</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'email', !settings.notifications.email)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Browser push notifications</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'push', !settings.notifications.push)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Text message alerts</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'sms', !settings.notifications.sms)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Trade Alerts</h4>
                      <p className="text-sm text-gray-500">Order executions and trade confirmations</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'tradeAlerts', !settings.notifications.tradeAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.tradeAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.tradeAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Price Alerts</h4>
                      <p className="text-sm text-gray-500">Price target notifications</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'priceAlerts', !settings.notifications.priceAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.priceAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.priceAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">System Updates</h4>
                      <p className="text-sm text-gray-500">Platform updates and maintenance</p>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', 'systemUpdates', !settings.notifications.systemUpdates)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.systemUpdates ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.systemUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleResetSettings}
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 font-medium"
          >
            Reset to Defaults
          </button>
          
          <div className="flex items-center space-x-4">
            {saved && (
              <span className="text-green-600 font-medium">✅ Settings saved!</span>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Platform Info */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Version & Build</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PropChain AI v2.0.0</li>
                <li>• Build: 2024.12.24</li>
                <li>• Network: Base Sepolia</li>
                <li>• EIP-7715 Support: Enabled</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Support & Resources</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <a href="#" className="text-blue-600 hover:text-blue-700">Documentation</a></li>
                <li>• <a href="#" className="text-blue-600 hover:text-blue-700">API Reference</a></li>
                <li>• <a href="#" className="text-blue-600 hover:text-blue-700">Support Center</a></li>
                <li>• <a href="#" className="text-blue-600 hover:text-blue-700">Community Discord</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}