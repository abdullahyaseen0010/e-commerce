import { DEFAULT_CURRENCY } from "./constants";

/**
 * Formats a number as a localized currency string.
 * formatCurrency(89.99) -> "$89.99"
 * formatCurrency(89.99, "EUR", "de-DE") -> "89,99 €"
 */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a number as currency without trailing decimals when the amount is whole.
 * formatCurrencyCompact(90) -> "$90"
 * formatCurrencyCompact(89.99) -> "$89.99"
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = "en-US"
): string {
  const isWhole = Number.isInteger(amount);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats the difference between an original and discounted price as a percentage off.
 * formatDiscountPercent(100, 75) -> "25% off"
 */
export function formatDiscountPercent(compareAtPrice: number, price: number): string {
  if (compareAtPrice <= price) return "";
  const percent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return `${percent}% off`;
}
