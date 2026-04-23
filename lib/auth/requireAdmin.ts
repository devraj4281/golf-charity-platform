import { redirect } from 'next/navigation'
import { requireUser } from './requireUser'
import { createClient } from '@/lib/supabase/server'

/**
 * Ensures the user is logged in AND has the admin role.
 * 
 * ⚠️ Does NOT query the profiles table for role — that causes RLS infinite
 *    recursion if the profiles_admin policy uses a subquery on profiles itself.
 * 
 * Instead, reads the `user_role` custom claim from the JWT, which is set by
 * a Supabase DB function/trigger whenever a user's role changes.
 * 
 * SQL to set this up (run once in Supabase SQL Editor):
 * 
 *   create or replace function public.custom_access_token_hook(event jsonb)
 *   returns jsonb language plpgsql stable as $$
 *   declare
 *     claims jsonb;
 *     user_role text;
 *   begin
 *     select role into user_role from public.profiles where id = (event->>'user_id')::uuid;
 *     claims := event->'claims';
 *     claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(user_role, 'subscriber')));
 *     return jsonb_set(event, '{claims}', claims);
 *   end;
 *   $$;
 * 
 *   grant execute on function public.custom_access_token_hook to supabase_auth_admin;
 * 
 *   -- Then in Supabase Dashboard → Auth → Hooks → set custom_access_token_hook
 */
export async function requireAdmin() {
  const user = await requireUser()

  const supabase = await createClient()

  // Read role from JWT claims — zero DB queries, no RLS recursion possible
  const { data: { session } } = await supabase.auth.getSession()
  const jwtRole = session?.access_token
    ? (JSON.parse(atob(session.access_token.split('.')[1])) as any)?.user_role
    : null

  if (jwtRole !== 'admin') {
    redirect('/dashboard')
  }

  return { user }
}
