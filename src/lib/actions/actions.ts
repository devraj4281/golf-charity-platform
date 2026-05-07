'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'


export type AuthState = {
  error?: string
  success?: string
  confirmEmail?: boolean
} | null

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!fullName || !email || !password) {
    return { error: 'All fields are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    console.error('[signup]', error.message, error.code, error.status)
    return { error: error.message }
  }

  if (data.user) {
  
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email,
        full_name: fullName || 'User',
        role: 'subscriber',
        subscription_status: 'inactive',
        charity_pct: 10
      })
      
    if (profileError) {
      console.error('[signup] Profile creation failed:', profileError)
      // Since the account was already created, we just swallow it or log it, 
      // but let them log in anyway!
    }
  }

  // Supabase may return a user but with email confirmation pending
  if (data.user && !data.session) {
    // Email confirmation required — tell the user
    return { confirmEmail: true }
  }

  redirect('/dashboard')
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function login(formData: FormData, redirectTo?: string) {
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect(redirectTo || '/dashboard')
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}