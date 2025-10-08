/**
 * Combine class names utility (for use in card.tsx, spotlight.tsx, etc.)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
