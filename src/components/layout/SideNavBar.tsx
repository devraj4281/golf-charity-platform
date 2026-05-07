'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Activity, 
  Trophy, 
  Heart, 
  Wallet, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  HelpCircle,
  Plus
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Scores',    href: '/scores',    icon: Activity },
  { name: 'Draws',     href: '/draws',     icon: Trophy },
  { name: 'Charity',   href: '/charity',   icon: Heart },
  { name: 'Winnings',  href: '/winnings',  icon: Wallet },
  { name: 'Settings',  href: '/settings',  icon: Settings },
]

export function SideNavBar({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  
  // Optimistic state for navigation feedback
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  // Clear pending path when the actual pathname changes
  useEffect(() => {
    setPendingPath(null)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Brand Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg glow-accent group-hover:scale-105 transition-transform"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            P
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black leading-tight" style={{ color: 'var(--foreground)' }}>ParImpact</span>
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Elite Golf</span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = (pendingPath || pathname) === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setPendingPath(item.href)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group',
                isActive
                  ? 'text-white font-black shadow-lg glow-accent'
                  : 'font-semibold'
              )}

              style={
                isActive
                  ? { backgroundColor: 'var(--primary)', color: '#fff' }
                  : {
                      color: 'var(--muted-foreground)',
                    }
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
              <item.icon
                className="w-4.5 h-4.5 flex-shrink-0 transition-colors"
                style={{ width: '1.125rem', height: '1.125rem' }}
              />
              <span className="text-sm">{item.name}</span>
            </Link>
          )
        })}

        {userRole === 'admin' && (
          <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p
              className="px-4 text-[9px] font-black uppercase tracking-widest mb-3"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Administration
            </p>
            <Link
              href="/admin"
              onClick={() => setPendingPath('/admin')}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold',
                (pendingPath || pathname).startsWith('/admin')
                  ? 'text-white font-black shadow-lg'
                  : ''
              )}
              style={
                (pendingPath || pathname).startsWith('/admin')
                  ? { backgroundColor: 'var(--secondary)', color: '#fff' }
                  : { color: 'var(--muted-foreground)' }
              }
            >

              <ShieldCheck className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
              <span className="text-sm">Admin Portal</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/scores"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
          style={{
            backgroundColor: 'rgba(173,158,253,0.1)',
            color: 'var(--primary)',
            border: '1px solid rgba(173,158,253,0.2)',
          }}
        >
          <Plus className="w-4 h-4" />
          New Score
        </Link>

        <div className="space-y-0.5 px-1">
          <Link
            href="/support"
            className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            Help Center
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
