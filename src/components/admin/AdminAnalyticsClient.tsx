'use client'

import { motion } from 'framer-motion'
import { Users, CreditCard, Heart, Trophy, BarChart2, TrendingUp, ArrowUpRight, DollarSign, Activity } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import { cn } from '@/lib/utils/cn'

interface Props {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  totalCharity: number
  totalPrizes: number
  draws: { draw_month: string; total_pool: number; status: string }[]
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6']

export function AdminAnalyticsClient({ totalUsers, activeUsers, totalRevenue, totalCharity, totalPrizes, draws }: Props) {
  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'indigo', trend: '+12%' },
    { label: 'Subscribers', value: activeUsers, icon: CreditCard, color: 'emerald', trend: '+5%' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'amber', trend: '+18%' },
    { label: 'Charity', value: `₹${totalCharity.toLocaleString()}`, icon: Heart, color: 'rose', trend: '+22%' },
    { label: 'Prizes', value: `₹${totalPrizes.toLocaleString()}`, icon: Trophy, color: 'purple', trend: '+10%' },
  ]

  const barData = draws.map(d => ({
    month: new Date(d.draw_month).toLocaleDateString('en-US', { month: 'short' }),
    pool: d.total_pool,
  }))

  const pieData = [
    { name: 'Prizes', value: totalPrizes },
    { name: 'Charity', value: totalCharity },
    { name: 'Platform Fees', value: Math.max(0, totalRevenue - totalPrizes - totalCharity) },
  ].filter(d => d.value > 0)

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 reveal-stagger">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <BarChart2 className="w-7 h-7 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Analytics</h1>
            <p className="text-slate-500 font-medium">Real-time platform performance and financial distribution.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-bold text-sm">
          <Activity className="w-4 h-4" />
          System Operational
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }}
            className="premium-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                s.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                s.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                s.color === 'amber' && "bg-amber-50 text-amber-600",
                s.color === 'rose' && "bg-rose-50 text-rose-600",
                s.color === 'purple' && "bg-purple-50 text-purple-600",
              )}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {s.trend}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 premium-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Prize Pool Growth</h2>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none">
              <option>Last 12 Months</option>
              <option>Year to Date</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} 
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="pool" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="premium-card p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Revenue Split</h2>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={80} 
                  paddingAngle={5}
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Total</p>
                <p className="text-xl font-black text-slate-900 mt-1">₹{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-bold text-slate-600">{d.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  {((d.value / totalRevenue) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
