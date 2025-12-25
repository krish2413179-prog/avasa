'use client';

import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Lock, 
  ChevronRight,
  Zap,
  Moon,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-zinc-900 font-display">Settings</h1>
        <p className="text-zinc-500">Manage your account, security, and platform preferences</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">Account & Security</h3>
            <div className="glass-card rounded-[2.5rem] overflow-hidden divide-y divide-zinc-100">
              {[
                { label: 'Profile Information', icon: User, value: 'nancy.base.eth' },
                { label: 'Privacy & Permissions', icon: Shield, value: 'Advanced' },
                { label: 'Security Passkeys', icon: Lock, value: 'Enabled' },
                { label: 'Connected Wallet', icon: Database, value: '0x6533...7eBA' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-blue-50/50 cursor-pointer transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white border border-zinc-100 text-zinc-400 group-hover:text-blue-600 transition-colors shadow-sm">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-zinc-800">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{item.value}</span>
                    <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider px-1">Platform Preferences</h3>
            <div className="glass-card rounded-[2.5rem] overflow-hidden divide-y divide-zinc-100">
              {[
                { label: 'Notifications', icon: Bell, type: 'toggle', enabled: true },
                { label: 'AI Strategy Execution', icon: Zap, type: 'toggle', enabled: true },
                { label: 'Market Language', icon: Globe, type: 'select', value: 'English (US)' },
                { label: 'Snow Theme', icon: Moon, type: 'toggle', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-blue-50/50 cursor-pointer transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white border border-zinc-100 text-zinc-400 group-hover:text-blue-600 transition-colors shadow-sm">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-zinc-800">{item.label}</span>
                  </div>
                  {item.type === 'toggle' ? (
                    <div className={`h-7 w-12 rounded-full p-1 transition-colors ${item.enabled ? 'bg-blue-600' : 'bg-zinc-200'}`}>
                      <div className={`h-5 w-5 rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{item.value}</span>
                      <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        <div className="pt-4">
          <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-all">
            Disconnect All Permissions & Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
