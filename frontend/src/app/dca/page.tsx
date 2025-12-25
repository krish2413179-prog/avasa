'use client';

import { PROPERTIES } from '@/lib/data';
import { 
  Zap, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowRight,
  Plus,
  Trash2,
  Play,
  Pause,
  Info,
  ShieldCheck,
  Building2
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DCAPage() {
  const [amount, setAmount] = useState('50');
  const [selectedDay, setSelectedDay] = useState('Mon');

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white font-display">Smart DCA</h1>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 uppercase tracking-wider">
              EIP-7715 Strategy
            </span>
          </div>
          <p className="text-zinc-500">Automate your property investments with recurring schedules</p>
        </div>
        
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New DCA Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card p-6 rounded-3xl border-white/5 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Investment Amount (USDC)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</div>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Frequency</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Daily', 'Weekly', 'Bi-Weekly', 'Monthly'].map(f => (
                    <button 
                      key={f}
                      className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                        f === 'Weekly' 
                          ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Execution Day</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button 
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-12 w-12 rounded-xl text-xs font-bold transition-all border ${
                      selectedDay === day 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Select Target Property</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROPERTIES.slice(0, 4).map(p => (
                  <button 
                    key={p.id}
                    className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 transition-all flex items-center gap-3 group text-left"
                  >
                    <div className="h-10 w-10 rounded-lg overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-zinc-500">{p.yield} APY</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
              <div className="p-2 rounded-xl bg-amber-500/10 h-fit">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">EIP-7715 Rate Limit Policy</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  This permission allows spending exactly <span className="text-amber-500 font-bold">${amount} USDC</span> every period of 
                  <span className="text-amber-500 font-bold"> 1 week</span> on <span className="text-amber-500 font-bold">{selectedDay}s</span> only.
                  Even if compromised, your remaining balance is cryptographically secured.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white font-display">Active Plans</h3>
            <div className="space-y-4">
              {[
                { property: 'Miami Beach Condos', amount: '$50', frequency: 'Every Monday', status: 'Active' },
                { property: 'Denver Mountain Resort', amount: '$100', frequency: 'Every Friday', status: 'Paused' },
              ].map((plan, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${plan.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{plan.status}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 transition-colors">
                        {plan.status === 'Active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-red-500/50 hover:text-red-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-white truncate">{plan.property}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xl font-bold text-white">{plan.amount}</div>
                      <div className="text-xs text-zinc-500">{plan.frequency}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center gap-2">
                    <Clock className="h-3 w-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600 font-medium">Next execution: {plan.status === 'Active' ? 'In 2 days' : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/5 bg-zinc-900/30 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-400" />
              Strategy Insight
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              DCA (Dollar Cost Averaging) helps mitigate market volatility by spreading your entry points. 
              Combined with RWA yield, this creates a powerful wealth-building engine.
            </p>
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-center">
              <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Projected 1Y Value</div>
              <div className="text-lg font-bold text-white">$2,840.50</div>
              <div className="text-[10px] text-emerald-500 font-bold">+13.6% growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
