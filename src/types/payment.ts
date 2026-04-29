export type LedgerEntryType     = 'subscription' | 'charity' | 'prize_in' | 'prize_out' | 'rollover'

export type PrizePoolLedgerEntry = {
  id:          string
  user_id:     string | null
  draw_id:     string | null
  amount:      number
  entry_type:  LedgerEntryType
  description: string | null
  created_at:  string
}
