'use client'

import { motion } from 'framer-motion'
import { Users, CreditCard, Heart, Trophy, BarChart2, TrendingUp, ArrowUpRight, DollarSign, Activity } from 'lucide-react'
import dynamic from 'next/dynamic'

const AdminBarChart = dynamic(() => import('./AdminCharts').then(mod => mod.AdminBarChart), { 
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-muted/20 animate-pulse rounded-xl" />
})

const AdminPieChart = dynamic(() => import('./AdminCharts').then(mod => mod.AdminPieChart), { 
  ssr: false,
  loading: () => <div className="w-full h-[260px] bg-muted/20 animate-pulse rounded-full" />
})
import { cn } from '@/lib/utils/cn'

interface Props {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  totalCharity: number
  totalPrizes: number
  draws: { draw_month: string; total_pool: number; status: string }[]
}

const COLORS = ['#AD9EFD', '#94FDB6', '#7C7A8C']

export function AdminAnalyticsClient({ totalUsers, activeUsers, totalRevenue, totalCharity, totalPrizes, draws }: Props) {
  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'primary', trend: '+12%' },
    { label: 'Subscribers', value: activeUsers, icon: CreditCard, color: 'success', trend: '+5%' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'warning', trend: '+18%' },
    { label: 'Charity', value: `₹${totalCharity.toLocaleString()}`, icon: Heart, color: 'rose', trend: '+22%' },
    { label: 'Prizes', value: `₹${totalPrizes.toLocaleString()}`, icon: Trophy, color: 'secondary', trend: '+10%' },
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
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center glow-accent">
            <BarChart2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">System Analytics</h1>
            <p className="text-muted-foreground font-medium">Real-time platform performance and financial distribution.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/20 rounded-2xl font-bold text-sm glow-success">
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
                s.color === 'primary' && "bg-primary/10 text-primary",
                s.color === 'success' && "bg-success/10 text-success",
                s.color === 'warning' && "bg-warning/10 text-warning",
                s.color === 'rose' && "bg-red-500/10 text-red-600 dark:text-red-400",
                s.color === 'secondary' && "bg-secondary/10 text-secondary",
              )}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-success bg-success/10 px-2 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {s.trend}
              </span>
            </div>
            <p className="text-2xl font-black text-foreground tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 premium-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Prize Pool Growth</h2>
            </div>
            <select className="bg-card border border-border rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground focus:outline-none">
              <option>Last 12 Months</option>
              <option>Year to Date</option>
            </select>
          </div>

          <AdminBarChart data={barData} />
        </div>

        {/* Pie Chart */}
        <div className="premium-card p-8">
          <h2 className="text-xl font-bold text-foreground mb-8">Revenue Split</h2>
          <div className="relative" style={{ height: 260 }}>
            <AdminPieChart data={pieData} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Total</p>
                <p className="text-xl font-black text-foreground mt-1">₹{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-bold text-muted-foreground">{d.name}</span>
                </div>
                <span className="text-sm font-black text-foreground">
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
