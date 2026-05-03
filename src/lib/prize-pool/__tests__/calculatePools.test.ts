/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculatePrizePool } from '../calculate'
import { createClient } from '@/lib/supabase/server'

// Mock the Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Helper to create a robust, chainable Supabase query mock
const createChainableMock = (resolvedValue: any) => {
  const mock: any = {}
  mock.select = vi.fn(() => mock)
  mock.eq = vi.fn(() => mock)
  mock.lt = vi.fn(() => mock)
  mock.order = vi.fn(() => mock)
  mock.limit = vi.fn(() => mock)
  mock.single = vi.fn(async () => resolvedValue)
  
  // Make the mock itself thenable so it acts like a Promise when awaited without .single()
  mock.then = (resolve: any) => resolve(resolvedValue)
  
  return mock
}

describe('calculatePrizePool', () => {
  let mockProfiles: any[] = []
  let mockDraw: any = null
  let mockWinners: any[] = []

  const mockSupabase = {
    from: vi.fn((table: string) => {
      if (table === 'profiles') return createChainableMock({ data: mockProfiles, error: null })
      if (table === 'draws') return createChainableMock({ data: mockDraw, error: null })
      if (table === 'winners') return createChainableMock({ data: mockWinners, error: null })
      return createChainableMock({ data: null, error: null })
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') return createChainableMock({ data: mockProfiles, error: null })
      if (table === 'draws') return createChainableMock({ data: mockDraw, error: null })
      if (table === 'winners') return createChainableMock({ data: mockWinners, error: null })
      return createChainableMock({ data: null, error: null })
    })

    ;(createClient as any).mockResolvedValue(mockSupabase)
    
    // Reset test data
    mockProfiles = []
    mockDraw = null
    mockWinners = []
  })

  it('calculates the prize pool correctly for active subscribers', async () => {
    const drawMonth = new Date('2024-05-01')

    mockProfiles = [
      { sub_plan: 'monthly', charity_pct: 10 }, // basePrice 9.99 * 0.9 * 0.6 = 5.3946
      { sub_plan: 'yearly', charity_pct: 20 },  // basePrice (99.99/12) * 0.8 * 0.6 = 3.9996
    ]
    
    const result = await calculatePrizePool(drawMonth)

    expect(result.subscriberCount).toBe(2)
    
    // Total pool should be exactly 9.3942 -> rounded to 9.39
    expect(result.totalPool).toBe(9.39)
    
    // Pool 5 = 9.3942 * 0.40 = 3.75768 -> 3.76
    expect(result.pool5).toBe(3.76)
    
    // Pool 4 = 9.3942 * 0.35 = 3.28797 -> 3.29
    expect(result.pool4).toBe(3.29)
    
    // Pool 3 = 9.3942 * 0.25 = 2.34855 -> 2.35
    expect(result.pool3).toBe(2.35)
    
    expect(result.jackpotCarried).toBe(0)
  })

  it('handles jackpot rollover correctly when no previous winners exist', async () => {
    const drawMonth = new Date('2024-05-01')

    mockProfiles = [
      { sub_plan: 'monthly', charity_pct: 10 }, // 5.3946
    ]
    
    mockDraw = {
      id: 'old_draw_1',
      prize_pool_5: 100.00,
      jackpot_carried: 50.00
    }
    
    // No winners for the 5-match tier
    mockWinners = []

    const result = await calculatePrizePool(drawMonth)

    // Base pool for 1 user = 5.39
    expect(result.totalPool).toBe(5.39)
    
    // Jackpot carried should be prev draw's pool5 (100) + prev draw's carried (50) = 150
    expect(result.jackpotCarried).toBe(150.00)
    
    // New pool5 = (5.3946 * 0.40) + 150 = 2.15784 + 150 = 152.16
    expect(result.pool5).toBe(152.16)
  })

  it('does not rollover jackpot if previous winners exist', async () => {
    const drawMonth = new Date('2024-05-01')

    mockProfiles = [
      { sub_plan: 'monthly', charity_pct: 10 },
    ]
    
    mockDraw = {
      id: 'old_draw_1',
      prize_pool_5: 100.00,
      jackpot_carried: 50.00
    }
    
    // Winners exist!
    mockWinners = [{ id: 'winner_1' }]

    const result = await calculatePrizePool(drawMonth)
    
    expect(result.jackpotCarried).toBe(0)
    // New pool5 = (5.3946 * 0.40) = 2.16
    expect(result.pool5).toBe(2.16)
  })

  it('handles zero subscribers', async () => {
    mockProfiles = []
    
    const result = await calculatePrizePool(new Date())
    
    expect(result.subscriberCount).toBe(0)
    expect(result.totalPool).toBe(0)
    expect(result.pool5).toBe(0)
    expect(result.pool4).toBe(0)
    expect(result.pool3).toBe(0)
  })

  it('handles database error by throwing (fail-safe)', async () => {
    const errorMock = createChainableMock({ data: null, error: new Error('DB failed') })

    mockSupabase.from.mockImplementation(() => errorMock)

    await expect(calculatePrizePool(new Date())).rejects.toThrow('DB failed')
  })

  it('rounds values to 2 decimal places', async () => {
    mockProfiles = [
      { sub_plan: 'monthly', charity_pct: 13 },
    ]

    const result = await calculatePrizePool(new Date())

    expect(Number(result.totalPool.toFixed(2))).toBe(result.totalPool)
    expect(Number(result.pool5.toFixed(2))).toBe(result.pool5)
  })

  it('handles large number of subscribers', async () => {
    mockProfiles = Array.from({ length: 1000 }, () => ({
      sub_plan: 'monthly',
      charity_pct: 10,
    }))

    const result = await calculatePrizePool(new Date())

    expect(result.subscriberCount).toBe(1000)
    expect(result.totalPool).toBeGreaterThan(0)
  })
})
