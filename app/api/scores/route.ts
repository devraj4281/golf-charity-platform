import { NextResponse } from 'next/server'
import { requireActiveSubscriber } from '@/lib/auth/requireActiveSubscriber'
import { createClient } from '@/lib/supabase/server'
import { upsertScore } from '@/lib/db/queries'

export async function POST(req: Request) {
  try {
    const user = await requireActiveSubscriber() // auth + subscription in one guard
    const { score, entryDate } = await req.json()

    if (!score || !entryDate) {
      return NextResponse.json({ error: 'Missing score or entry date' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
      return NextResponse.json({ error: 'Invalid date format, expected YYYY-MM-DD' }, { status: 400 })
    }

    const supabase = await createClient()
    const result = await upsertScore(supabase, user.id, score, entryDate)

    return NextResponse.json({ success: true, score: result })
  } catch (error: any) {
    const status = error.statusCode === 403 ? 403 : 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status })
  }
}