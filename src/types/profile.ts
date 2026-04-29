export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due'
export type SubPlan             = 'monthly' | 'yearly'
export type UserRole            = 'subscriber' | 'admin'

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
