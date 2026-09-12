export interface GiftWrapQuote {
  subtotal: number
  perItem: number
  messageFee: number
  total: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function giftWrapQuote(items: number, premium: boolean, message?: string): GiftWrapQuote {
  const perItem = premium ? 4.99 : 2.99
  const subtotal = round2(items * perItem)
  const messageFee = !message || message.length <= 140 ? 0 : 1.99
  const total = round2(subtotal + messageFee)
  return { subtotal, perItem, messageFee, total }
}
