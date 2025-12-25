'use client';

import { 
  TrendingUp, 
  ArrowRight, 
  History, 
  Zap,
  Plus,
  Trash2,
  Clock,
  ChevronDown,
  Info,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LimitOrdersPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white font-display">Limit Orders</h1>
          <p className="text-zinc-500">Automated execution for specific price targets</p>
        </div>
        
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Limit Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card p-6 rounded-3xl border-white/5 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Buy Asset</label>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="text-sm font-bold text-white">RWA Shares</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-600" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">With Funds</label>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold text-white">USDC Stables</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Target Price</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</div>
                  <input 
                    type="number" 
                    defaultValue="0.95"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Market: $1.04</span>
                  <span className="text-[10px] text-red-500 font-bold">-8.6% from market</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amount to Spend</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</div>
                  <input 
                    type="number" 
                    defaultValue="1000"
                    className="w-full pl-8 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 h-fit">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Conditional Execution Policy</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Funds remain in your wallet until the target price is reached. Execution happens 24/7 
                  via PropChain AI's surveillance engine without requiring your presence online.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <History className="h-5 w-5 text-zinc-500" />
              Filled Orders
            </h3>
            <div className="space-y-3">
              {[
                { pair: 'ETH / USDC', price: '$2,140.00', amount: '$5,000', status: 'Filled', time: '12h ago' },
                { pair: 'RWA_NY / USDC', price: '$0.92', amount: '$1,200', status: 'Filled', time: '3d ago' },
              ].map((order, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{order.pair}</h4>
                      <p className="text-[10px] text-zinc-500">{order.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{order.price}</div>
                    <div className="text-[10px] text-emerald-500 font-bold">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-6 rounded-3xl border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white font-display">Active Orders</h3>
            <div className="space-y-4">
              {[
                { pair: 'ETH / USDC', target: '$2,000.00', amount: '$1,500', progress: 82 },
                { pair: 'RWA_MIA / USDC', target: '$0.85', amount: '$2,400', progress: 45 },
              ].map((order, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pending Trigger</span>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-white">{order.pair}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-lg font-bold text-white">{order.target}</div>
                      <div className="text-xs text-zinc-500">{order.amount}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[8px] font-bold uppercase text-zinc-600">
                      <span>Proximity</span>
                      <span>{order.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${order.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/5 bg-zinc-900/30 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-400" />
              Slippage Protection
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Limit orders include <span className="text-indigo-400 font-bold">0.5% slippage protection</span>. 
              Orders are automatically canceled if execution would result in excessive value loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
