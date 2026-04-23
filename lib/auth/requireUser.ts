import { redirect } from 'next/navigation'
import { getUser } from './getUser'

/**
 * Ensures the user is logged in. Redirects to /login if not.
 * Optionally checks for active subscription status if needed.
 */
export async function requireUser() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
