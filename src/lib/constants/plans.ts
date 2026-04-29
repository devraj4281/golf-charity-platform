export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 4900,
    currency: 'INR',
  },
  YEARLY: {
    id: 'yearly',
    name: 'Yearly Legend',
    price: 49000,
    currency: 'INR',
  },
} as const;

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;
