import type { Metadata } from 'next'
import { Manrope, Inter, Geist } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils/cn'
import { Providers } from '@/components/layout/Providers'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'ParImpact — Golf Charity Platform',
  description: 'Elite golf draws that fund life-changing charities. Join the Sovereign Tier.',
  keywords: ['golf', 'charity', 'draw', 'premium', 'sports'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn('dark h-full antialiased', manrope.variable, inter.variable, geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
