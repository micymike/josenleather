/**
 * Utility to fetch current KSh to USD exchange rate from exchangerate.host
 * Returns the rate as a number (KSh per 1 USD)
 */
export async function fetchKshToUsdRate(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=KES&symbols=USD');
    const data = await res.json();
    // Defensive: check if data.rates and data.rates.USD exist
    if (data && data.rates && typeof data.rates.USD === 'number') {
      return data.rates.USD;
    } else {
      console.error('Exchange rate API response missing USD rate:', data);
      // Fallback to a reasonable default (as of 2025, ~0.007 USD per KSh)
      return 0.007;
    }
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
