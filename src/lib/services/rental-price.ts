export interface RentalQuoteResult {
  rentalFee: number
  deposit: number
  total: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function rentalQuote(retail: number, days: number, depositPct: number): RentalQuoteResult {
  const rentalFee = round2(retail * 0.05 * Math.ceil(days / 7) + retail * 0.01 * days)
  const deposit = round2(retail * depositPct)
  const total = round2(rentalFee + deposit)
  return { rentalFee, deposit, total }
}
