'use client'

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'

const COLORS = ['#AD9EFD', '#94FDB6', '#EEB71A', '#813FE2']

export function AdminBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} 
          axisLine={false} 
          tickLine={false} 
          dy={10}
        />
        <YAxis 
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} 
          dx={-10}
        />
        <Tooltip
          cursor={{ fill: 'rgba(173,158,253,0.05)' }}
          contentStyle={{ 
            background: 'var(--card)', 
            border: '1px solid rgba(173,158,253,0.2)', 
            borderRadius: '12px', 
            color: 'var(--foreground)', 
            fontSize: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}
          itemStyle={{ fontWeight: 'bold', color: 'var(--primary)' }}
        />
        <Bar dataKey="pool" fill="#AD9EFD" radius={[8, 8, 0, 0]} barSize={36} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AdminPieChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie 
          data={data} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          innerRadius={60}
          outerRadius={90} 
          paddingAngle={4}
        >
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid rgba(173,158,253,0.2)',
            borderRadius: '12px',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
          itemStyle={{ fontWeight: 'bold' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
