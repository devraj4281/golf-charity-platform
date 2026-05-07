'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Award, 
  Heart, 
  ArrowLeft,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

const navItems = [
  { name: 'Analytics',       href: '/admin/analytics', icon: LayoutDashboard },
  { name: 'Users',           href: '/admin/users',     icon: Users },
  { name: 'Draw Management', href: '/admin/draws',     icon: Trophy },
  { name: 'Winners',         href: '/admin/winners',   icon: Award },
  { name: 'Charities',       href: '/admin/charity',   icon: Heart },
]

export function AdminNavBar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  // Clear optimistic state + close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setPendingPath(null)
  }, [pathname])

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 z-50 glass-panel flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-accent">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black text-foreground">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-muted text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col w-64 h-screen fixed top-0 left-0 z-50 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      style={{
        backgroundColor: 'var(--card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Top bar */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg glow-accent flex-shrink-0"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black leading-tight" style={{ color: 'var(--foreground)' }}>Admin</span>
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Control Panel</span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = (pendingPath ?? pathname).startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setPendingPath(item.href)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-semibold"
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      fontWeight: 800,
                      boxShadow: '0 0 20px -4px rgba(173,158,253,0.4)',
                    }
                  : { color: 'var(--muted-foreground)' }
              }
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(173,158,253,0.08)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--foreground)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = ''
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)'
                }
              }}
            >
              <Icon className="w-[1.1rem] h-[1.1rem] flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer status */}
      <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--success)', boxShadow: '0 0 8px rgba(148,253,182,0.6)' }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
            All Systems Operational
          </span>
        </div>
      </div>
    </aside>
    </>
  )
}
