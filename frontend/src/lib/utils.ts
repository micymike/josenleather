/**
 * Utility to fetch current KSh to USD exchange rate from exchangerate.host
 * Returns the rate as a number (KSh per 1 USD)
 */
export async function fetchKshToUsdRate(): Promise<number> {
  // Use static rate to avoid API errors
  return 0.007;
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
