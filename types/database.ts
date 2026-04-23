/**
 * TypeScript types generated from the Supabase schema.
 * In production, generate this with: npx supabase gen types typescript --local
 *
 * This hand-written version mirrors the schema exactly for development.
 */

export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due'
export type SubPlan             = 'monthly' | 'yearly'
export type UserRole            = 'subscriber' | 'admin'
export type DrawStatus          = 'pending' | 'simulated' | 'published'
export type DrawType            = 'random' | 'algorithmic'
export type MatchType           = '5_match' | '4_match' | '3_match'
export type WinnerStatus        = 'pending' | 'proof_submitted' | 'approved' | 'rejected' | 'paid'
export type LedgerEntryType     = 'subscription' | 'charity' | 'prize_in' | 'prize_out' | 'rollover'

export type Profile = {
  id:                       string
  full_name:                string
  email:                    string
  role:                     UserRole
  charity_id:               string | null
  charity_pct:              number
  subscription_status:      SubscriptionStatus
  razorpay_customer_id:     string | null
  razorpay_sub_id:          string | null
  sub_plan:                 SubPlan | null
  sub_current_period_end:   string | null
  created_at:               string
  updated_at:               string
}

export type Score = {
  id:         string
  user_id:    string
  score:      number
  entry_date: string   // 'YYYY-MM-DD'
  created_at: string
  updated_at: string
}

export type Charity = {
  id:          string
  name:        string
  description: string | null
  image_url:   string | null
  is_featured: boolean
  is_active:   boolean
  created_at:  string
}

export type Draw = {
  id:              string
  draw_month:      string   // 'YYYY-MM-DD' (first of the month)
  status:          DrawStatus
  draw_type:       DrawType
  drawn_numbers:   number[]
  prize_pool_5:    number
  prize_pool_4:    number
  prize_pool_3:    number
  jackpot_carried: number
  total_pool:      number
  created_at:      string
  published_at:    string | null
}

export type DrawEntry = {
  id:          string
  draw_id:     string
  user_id:     string
  scores_used: number[]
  match_count: number | null
}

export type Winner = {
  id:           string
  draw_id:      string
  user_id:      string
  match_type:   MatchType
  prize_amount: number
  status:       WinnerStatus
  proof_url:    string | null
  admin_notes:  string | null
  created_at:   string
  updated_at:   string
}

export type PrizePoolLedgerEntry = {
  id:          string
  user_id:     string | null
  draw_id:     string | null
  amount:      number
  entry_type:  LedgerEntryType
  description: string | null
  created_at:  string
}

// ─── Supabase Database type (for typed clients) ───────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row:    Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>> & { updated_at?: string }
      }
      scores: {
        Row:    Score
        Insert: Omit<Score, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Score, 'id' | 'user_id' | 'created_at'>>
      }
      charities: {
        Row:    Charity
        Insert: Omit<Charity, 'id' | 'created_at'>
        Update: Partial<Omit<Charity, 'id' | 'created_at'>>
      }
      draws: {
        Row:    Draw
        Insert: Omit<Draw, 'id' | 'created_at'>
        Update: Partial<Omit<Draw, 'id' | 'created_at'>>
      }
      draw_entries: {
        Row:    DrawEntry
        Insert: Omit<DrawEntry, 'id'>
        Update: Partial<Omit<DrawEntry, 'id'>>
      }
      winners: {
        Row:    Winner
        Insert: Omit<Winner, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Winner, 'id' | 'user_id' | 'draw_id' | 'created_at'>> & { updated_at?: string }
      }
      prize_pool_ledger: {
        Row:    PrizePoolLedgerEntry
        Insert: Omit<PrizePoolLedgerEntry, 'id' | 'created_at'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
