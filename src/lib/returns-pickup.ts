export interface ReturnsPickupQuoteInput {
  distanceKm: number;
  bulky: boolean;
  isMember: boolean;
}

export interface ReturnsPickupQuote {
  fee: number;
  free: boolean;
  etaDays: number;
  courierNote: string;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Doorstep returns-pickup quote. Members and nearby non-bulky
 * pickups go free; everything else pays distance + bulky handling.
 */
export function quoteReturnsPickup(input: ReturnsPickupQuoteInput): ReturnsPickupQuote {
  const distanceKm = Math.max(0, input.distanceKm);
  const free = input.isMember || (distanceKm < 3 && !input.bulky);
  const fee = free ? 0 : round2(4.99 + distanceKm * 1.2 + (input.bulky ? 10 : 0));
  const etaDays = (distanceKm > 20 ? 5 : distanceKm > 10 ? 4 : 2) + (input.bulky ? 1 : 0);
  return {
    fee,
    free,
    etaDays,
    courierNote: free
      ? "Free doorstep pickup included with your order."
      : `Courier collects in ~${etaDays} days. Pay $${fee.toFixed(2)} on pickup.`,
  };
}
