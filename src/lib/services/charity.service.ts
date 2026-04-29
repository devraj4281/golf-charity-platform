import { createClient } from '@/lib/supabase/server'
import { Charity } from '@/types/charity'

export const charityService = {
  async getCharities() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
    
    if (error) throw error
    return data as Charity[]
  },

  async getCharityById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Charity
  },

  async getFeaturedCharities() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
    
    if (error) throw error
    return data as Charity[]
  }
}
