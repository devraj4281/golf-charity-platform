import { redirect } from 'next/navigation'
import { getUser } from './getUser'
import { headers } from 'next/headers'

/**
 * Ensures the user is logged in. Redirects to /login if not.
 * Passes the current URL as a 'next' parameter for redirection after login.
 */
export async function requireUser() {
  const user = await getUser()
  if (!user) {
    const headersList = await headers()
    const url = headersList.get('x-url') || ''
    const next = url ? new URL(url).pathname : ''
    
    redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ''}`)
  }
  return user
}
