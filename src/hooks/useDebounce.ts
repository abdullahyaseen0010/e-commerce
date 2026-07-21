"use client";

import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delayMs`
 * has passed without further changes. Useful for search boxes or filters
 * that trigger an API call on every keystroke.
 *
 * const debouncedQuery = useDebounce(query, 300);
 * useEffect(() => { searchProducts(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}