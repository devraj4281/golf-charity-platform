'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { ArrowRight, BarChart2, Users, Trophy, Heart } from 'lucide-react'

// Defined INSIDE the Client Component — icons are React objects with methods
// and can NEVER be passed as props from Server → Client Components.
const QUICK_ACTIONS = [
  {
    title:     'System Analytics',
    desc:      'Monitor revenue, user growth and distribution.',
    href:      '/admin/analytics',
    icon:      BarChart2,
    iconBg:    'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    title:     'User Management',
    desc:      'Audit subscriptions, roles and account status.',
    href:      '/admin/users',
    icon:      Users,
    iconBg:    'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    title:     'Draw Engine',
    desc:      'Manage upcoming draws and prize distributions.',
    href:      '/admin/draws',
    icon:      Trophy,
    iconBg:    'bg-warning/10',
    iconColor: 'text-warning',
  },
  {
    title:     'Charity Partners',
    desc:      'Manage beneficiary organizations and payouts.',
    href:      '/admin/charity',
    icon:      Heart,
    iconBg:    'bg-success/10',
    iconColor: 'text-success',
  },
]

export function QuickActionGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {QUICK_ACTIONS.map((action, i) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <Link href={action.href} className="block h-full">
            <div className="premium-card h-full p-7 flex flex-col justify-between group-hover:border-primary/40 transition-colors">
              <div>
                <div
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110',
                    action.iconBg,
                    action.iconColor,
                  )}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black mb-2 leading-tight text-foreground">
                  {action.title}
                </h2>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                  {action.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open Module <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
