export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface LoyaltyMember {
  userId: string
  points: number
  lifetimeSpend: number
  tier: LoyaltyTier
}

export const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze: 0,
  silver: 200,
  gold: 1000,
  platinum: 5000,
}

export const TIER_MULTIPLIER: Record<LoyaltyTier, number> = {
  bronze: 1,
  silver: 1.25,
  gold: 1.5,
  platinum: 2,
}

export function tierFor(lifetimeSpend: number): LoyaltyTier {
  const entries = (Object.entries(TIER_THRESHOLDS) as [LoyaltyTier, number][]).sort((a, b) => b[1] - a[1])
  for (const [t, tMin] of entries) {
    if (lifetimeSpend >= tMin) return t
  }
  return 'bronze'
}

export function earnPoints(member: LoyaltyMember, purchaseAmount: number): LoyaltyMember {
  if (purchaseAmount <= 0) return member
  const multiplier = TIER_MULTIPLIER[member.tier]
  const earned = Math.floor(purchaseAmount * multiplier)
  const lifetimeSpend = member.lifetimeSpend + purchaseAmount
  return {
    ...member,
    points: member.points + earned,
    lifetimeSpend,
    tier: tierFor(lifetimeSpend),
  }
}

export function redeemPoints(member: LoyaltyMember, cost: number): LoyaltyMember {
  if (cost <= 0) throw new Error('cost must be positive')
  if (cost > member.points) throw new Error('insufficient points')
  return { ...member, points: member.points - cost }
}
