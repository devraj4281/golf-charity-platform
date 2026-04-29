import { createClient } from '@/lib/supabase/server'
import { Draw, Winner } from '@/types/draw'
import { Profile } from '@/types/profile'

export const adminService = {
  async getAllUsers() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
    
    if (error) throw error
    return data as Profile[]
  },

  async getPendingWinners() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('winners')
      .select('*, profiles(full_name, email)')
      .eq('status', 'pending')
    
    if (error) throw error
    return data as (Winner & { profiles: { full_name: string, email: string } })[]
  },

  async updateWinnerStatus(winnerId: string, status: Winner['status'], notes?: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('winners')
      .update({ status, admin_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', winnerId)
    
    if (error) throw error
  }
}
