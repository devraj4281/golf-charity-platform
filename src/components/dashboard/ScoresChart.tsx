'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

export function ScoresAreaChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#AD9EFD" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#AD9EFD" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#7C7A8C', fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          domain={[0, 45]}
          tick={{ fill: '#7C7A8C', fontSize: 12, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          dx={-10}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#262630',
            border: '1px solid rgba(173,158,253,0.2)',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            color: '#EEEEEE',
            fontSize: '12px',
          }}
          itemStyle={{ color: '#AD9EFD', fontSize: '12px', fontWeight: 'bold' }}
          labelStyle={{ color: '#7C7A8C', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
          cursor={{ stroke: '#AD9EFD', strokeWidth: 1.5, strokeDasharray: '4 4' }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#AD9EFD"
          strokeWidth={2.5}
          fill="url(#scoreGrad)"
          dot={{ fill: '#262630', stroke: '#AD9EFD', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 7, strokeWidth: 0, fill: '#AD9EFD' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
