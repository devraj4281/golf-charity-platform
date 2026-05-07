import Link from 'next/link'
import {
  ShieldCheck,
  Settings,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { QuickActionGrid } from '@/components/admin/QuickActionGrid'

const stats = [
  { label: 'Active Sessions', value: '1,284', cls: 'text-success' },
  { label: 'Server Load',     value: '12%',   cls: 'text-warning' },
  { label: 'Global Nodes',    value: '24',     cls: 'text-primary' },
]

const activityLog = [
  {
    text: 'New Winner Verified',
    sub:  'User #1284 just verified their claim for the April Grand Slam.',
    time: '12m ago',
  },
  {
    text: 'Draw Engine Executed',
    sub:  'Monthly Grand Slam draw completed with 312 valid entries.',
    time: '2h ago',
  },
  {
    text: 'New Subscriber Onboarded',
    sub:  'User priya.k@example.com upgraded to Sovereign Elite tier.',
    time: '5h ago',
  },
]

const systemChecks = [
  'Draw engine active',
  'Payments operational',
  'Audit logs enabled',
]

export default async function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10 min-h-screen reveal-stagger">

      {/* ── Hero Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15 border border-primary/30">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
              Command Center
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-foreground">
            Sovereign <span className="text-primary">Admin</span>
          </h1>
          <p className="text-lg mt-4 max-w-xl font-medium text-muted-foreground">
            Welcome back. All systems are operational and performing within optimal parameters.
          </p>
        </div>

        {/* Live Stats */}
        <div className="flex items-center gap-8 flex-wrap">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-end gap-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                {s.label}
              </span>
              <span className={cn('text-2xl font-black tracking-tight', s.cls)}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Bento: Quick Action Cards ── */}
      <QuickActionGrid />

      {/* ── Bottom Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity Log */}
        <div className="premium-card lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Recent System Activity
            </h2>
            <button className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              View All Logs
            </button>
          </div>

          <div className="space-y-3">
            {activityLog.map((log, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-muted/40 border border-border hover:border-primary/20 transition-colors"
              >
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-success glow-success" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{log.text}</p>
                  <p className="text-xs mt-0.5 font-medium leading-relaxed text-muted-foreground">
                    {log.sub}
                  </p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider flex-shrink-0 mt-0.5 text-muted-foreground">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Config Card */}
        <div className="premium-card p-8 flex flex-col justify-between border-primary/20">
          <div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-primary glow-accent shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight mb-2 text-foreground">
              Configuration
            </h2>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              Global platform settings, API keys, and integration parameters.
            </p>

            <div className="mt-6 space-y-3">
              {systemChecks.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-success" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary w-full mt-8">
            Platform Settings
          </button>
        </div>
      </div>
    </div>
  )
}
