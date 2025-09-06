/**
 * Utility to fetch current KSh to USD exchange rate from exchangerate.host
 * Returns the rate as a number (KSh per 1 USD)
 */
export async function fetchKshToUsdRate(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=KES&symbols=USD');
    const data = await res.json();
    // data.rates.USD is USD per 1 KES, so 1 KES = x USD
    // To get KES per 1 USD, use 1 / data.rates.USD
    return data.rates.USD;
  } catch (e) {
    console.error('Failed to fetch exchange rate:', e);
    // Fallback to a reasonable default (as of 2025, ~0.007 USD per KSh)
    return 0.007;
  }
}

/**
 * Convert KSh price to USD using the given rate
 */
export function convertKshToUsd(ksh: number, rate: number): number {
  return ksh * rate;
}

/**
 * Combine class names utility (for use in card.tsx, spotlight.tsx, etc.)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
