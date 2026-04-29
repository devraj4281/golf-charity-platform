import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/getUser'
import { updateWinnerStatus } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const path = `winner-proofs/${id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('winner-proofs')
      .upload(path, file, { upsert: false })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('winner-proofs')
      .getPublicUrl(path)

    // Run dependency-injected query
    await updateWinnerStatus(supabase as any, id, {
      status: 'proof_submitted',
      proof_url: publicUrl,
      admin_notes: null,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error uploading winner proof:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
