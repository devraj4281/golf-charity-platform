export type DrawStatus          = 'pending' | 'simulated' | 'published'
export type DrawType            = 'random' | 'algorithmic'
export type MatchType           = '5_match' | '4_match' | '3_match'
export type WinnerStatus        = 'pending' | 'proof_submitted' | 'approved' | 'rejected' | 'paid'

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

export type Score = {
  id:         string
  user_id:    string
  score:      number
  entry_date: string   // 'YYYY-MM-DD'
  created_at: string
  updated_at: string
}
