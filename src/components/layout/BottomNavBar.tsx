'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Activity, Trophy, Heart, Settings } from 'lucide-react'

const navItems = [
  { name: 'Home',     href: '/dashboard', icon: LayoutDashboard },
  { name: 'Scores',   href: '/scores',    icon: Activity },
  { name: 'Draws',    href: '/draws',     icon: Trophy },
  { name: 'Charity',  href: '/charity',   icon: Heart },
  { name: 'Settings', href: '/settings',  icon: Settings },
]

export function BottomNavBar() {
  const pathname = usePathname()
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  useEffect(() => {
    setPendingPath(null)
  }, [pathname])

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-2 glass-panel" style={{ boxShadow: '0 -8px 32px var(--shadow)' }}>
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = (pendingPath || pathname) === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setPendingPath(item.href)}
              className="flex flex-col items-center gap-1 p-2 transition-all relative"
              style={{ color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
              )}
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-wider">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

