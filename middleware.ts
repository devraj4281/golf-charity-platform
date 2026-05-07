import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'


export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  // Set the current URL in a header so it can be read in Server Components
  response.headers.set('x-url', request.url)
  
  return response
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
