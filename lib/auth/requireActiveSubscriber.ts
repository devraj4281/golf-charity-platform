/**
 * lib/auth/requireActiveSubscriber.ts
 *
 * Guard that ensures the caller is both authenticated AND has an active subscription.
 * Use this on any route that requires subscription access (e.g. score submission).
 */

import { requireUser } from '@/lib/auth/requireUser'
import type { AuthUser } from '@/lib/auth/getUser'

export async function requireActiveSubscriber(): Promise<AuthUser> {
  const user = await requireUser()

  if (user.profile.subscription_status !== 'active') {
    throw Object.assign(
      new Error('Active subscription required'),
      { statusCode: 403 }
    )
  }

  return user
}
