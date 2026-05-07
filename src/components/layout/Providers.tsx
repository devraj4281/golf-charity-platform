'use client'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import Script from 'next/script'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <ProgressBar
        height="3px"
        color="var(--primary)"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <Toaster position="top-right" closeButton richColors />
      <Script
        id="razorpay-checkout"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </ThemeProvider>
  )
}

