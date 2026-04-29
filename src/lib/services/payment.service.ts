import { createOrder, verifyPaymentSignature, RazorpayPlan } from '@/lib/integrations/razorpay'
import { createClient } from '@/lib/supabase/server'
import { PrizePoolLedgerEntry } from '@/types/payment'

export const paymentService = {
  async initiateSubscription(userId: string, email: string, plan: RazorpayPlan) {
    return await createOrder(userId, email, plan)
  },

  async verifyAndProcessPayment(orderId: string, paymentId: string, signature: string) {
    const isValid = verifyPaymentSignature(orderId, paymentId, signature)
    if (!isValid) return false

    // Business logic to update user profile and ledger
    // Usually called from the webhook or verify route
    return true
  },

  async getLedgerEntries(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('prize_pool_ledger')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data as PrizePoolLedgerEntry[]
  }
}
