import { NextResponse } from 'next/server'
import { requireActiveSubscriber } from '@/lib/auth/requireActiveSubscriber'
import { createClient } from '@/lib/supabase/server'
import { upsertScore } from '@/lib/db/queries'

export async function POST(req: Request) {
  // Auth + subscription guard — returns 401/403 JSON instead of redirect
  let user
  try {
    user = await requireActiveSubscriber()
  } catch (error: any) {
    if (error?.statusCode === 403) {
      return NextResponse.json({ error: 'Active subscription required' }, { status: 403 })
    }
    // NEXT_REDIRECT or unauthenticated
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { score, entryDate } = await req.json()

    if (!score || !entryDate) {
      return NextResponse.json({ error: 'Missing score or entry date' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
      return NextResponse.json({ error: 'Invalid date format, expected YYYY-MM-DD' }, { status: 400 })
    }
    if (score < 1 || score > 45) {
      return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    const supabase = await createClient()
    const result = await upsertScore(supabase, user.id, score, entryDate)

    return NextResponse.json({ success: true, score: result })
  } catch (error: any) {
    console.error('[scores POST]', error.message)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}