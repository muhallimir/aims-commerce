export interface GiftCard {
  code: string
  initialBalance: number
  balance: number
  currency: string
  expiresAt?: string
  active: boolean
  transactions: { at: string; amount: number; type: 'credit' | 'debit'; note?: string }[]
}

export function redeem(card: GiftCard, amount: number, now: Date = new Date()): GiftCard {
  if (!card.active) throw new Error('gift card inactive')
  if (card.expiresAt && new Date(card.expiresAt) < now) throw new Error('gift card expired')
  if (amount <= 0) throw new Error('amount must be positive')
  if (amount > card.balance) throw new Error('insufficient balance')
  return {
    ...card,
    balance: Math.round((card.balance - amount) * 100) / 100,
    transactions: [...card.transactions, { at: now.toISOString(), amount: -amount, type: 'debit' }],
  }
}

export function topUp(card: GiftCard, amount: number, now: Date = new Date()): GiftCard {
  if (!card.active) throw new Error('gift card inactive')
  if (amount <= 0) throw new Error('amount must be positive')
  return {
    ...card,
    balance: Math.round((card.balance + amount) * 100) / 100,
    transactions: [...card.transactions, { at: now.toISOString(), amount, type: 'credit' }],
  }
}

export function isUsable(card: GiftCard, now: Date = new Date()): boolean {
  if (!card.active) return false
  if (card.balance <= 0) return false
  if (card.expiresAt && new Date(card.expiresAt) < now) return false
  return true
}
