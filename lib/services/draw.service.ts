/**
 * lib/services/draw.service.ts
 *
 * Orchestrates the draw execution.
 * Validates state, resolves drawMonth, and delegates to the pure draw-engine.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { runDraw } from '@/lib/draw-engine/index'
import type { DrawType } from '@/lib/draw-engine/index'

type DB = SupabaseClient<Database>

export interface RunDrawOptions {
  drawType: DrawType
  isSimulation?: boolean
  /** Defaults to the first day of the current month */
  drawMonth?: Date
}

export async function runDrawForMonth(adminDb: DB, options: RunDrawOptions) {
  const { drawType, isSimulation = false } = options

  // Default to first day of current month
  const now = new Date()
  const drawMonth = options.drawMonth ?? new Date(now.getFullYear(), now.getMonth(), 1)

  // Validate: prevent running draw twice for the same month
  const { data: existing } = await adminDb
    .from('draws')
    .select('id, status')
    .eq('draw_month', drawMonth.toISOString().split('T')[0])
    .eq('status', 'published')
    .limit(1)
    .single()

  if (existing && !isSimulation) {
    throw new Error(`A published draw already exists for ${drawMonth.toISOString().split('T')[0]}`)
  }

  return runDraw(adminDb, drawMonth, drawType, isSimulation)
}
