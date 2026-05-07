import type { Profile } from './profile'
import type { Score, Draw, DrawEntry, Winner, DrawStatus } from './draw'
import type { Charity } from './charity'
import type { PrizePoolLedgerEntry } from './payment'

export type { Profile, Score, Draw, DrawEntry, Winner, Charity, PrizePoolLedgerEntry, DrawStatus }

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
