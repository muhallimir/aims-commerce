export interface SubscriptionPlan {
  perDelivery: number
  annualTotal: number
  savingsVsOneOff: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function subscriptionPlan(
  unitPrice: number,
  qtyPerDelivery: number,
  intervalWeeks: number,
): SubscriptionPlan {
  const discount = intervalWeeks <= 2 ? 0.05 : 0.1
  const perDelivery = round2(unitPrice * qtyPerDelivery * (1 - discount))
  const deliveriesPerYear = 52 / intervalWeeks
  const annualTotal = round2(perDelivery * deliveriesPerYear)
  const oneOffAnnual = unitPrice * qtyPerDelivery * deliveriesPerYear
  const savingsVsOneOff = round2(oneOffAnnual - annualTotal)
  return { perDelivery, annualTotal, savingsVsOneOff }
}
