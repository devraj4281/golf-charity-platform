import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/server'
import { runDrawForMonth } from '@/lib/services/draw.service'
import type { DrawType } from '@/lib/draw-engine/index'

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { drawType, isSimulation } = await req.json()

    if (!drawType || !['random', 'algorithmic'].includes(drawType)) {
      return NextResponse.json({ error: 'Invalid or missing drawType (random | algorithmic)' }, { status: 400 })
    }

    const adminDb = createAdminClient()

    const result = await runDrawForMonth(adminDb, {
      drawType: drawType as DrawType,
      isSimulation: !!isSimulation,
    })

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('[draw/run]', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}