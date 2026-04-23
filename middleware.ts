import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Root middleware — session sync ONLY.
 *
 * ⚠️  This does NOT make auth decisions.
 * Its only job is to call supabase.auth.getUser() so the session cookie
 * is refreshed on every request, keeping the server-side client valid.
 *
 * Auth enforcement happens in:
 *   app/(dashboard)/layout.tsx  → requireUser()
 *   app/(admin)/layout.tsx      → requireAdmin()
 *   app/api/*                   → getUser() / requireAdmin() inline
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
