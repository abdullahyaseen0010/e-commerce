"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import type { Product } from "@/types/product";
import { searchProducts } from "@/lib/api/products";
import { cn, formatPrice } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  /** Override the data source, e.g. for a Cmd+K variant with scoped results. */
  searchFn?: (query: string) => Promise<Product[]>;
  /** Debounce delay in ms before firing a search. */
  debounceMs?: number;
  onClose?: () => void;
}

export function SearchBar({
  placeholder = "Search products",
  className,
  searchFn = searchProducts,
  debounceMs = 300,
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchFn(trimmed);
        setResults(data);
        setActiveIndex(-1);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, searchFn, debounceMs]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToResults = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    onClose?.();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const goToProduct = (product: Product) => {
    setIsOpen(false);
    onClose?.();
    router.push(`/product/${product.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      onClose?.();
      return;
    }
    if (!results.length) {
      if (e.key === "Enter") goToResults();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) goToProduct(results[activeIndex]);
      else goToResults();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="flex items-center gap-2 border-b border-stone-light focus-within:border-ink">
        <Search className="h-4 w-4 shrink-0 stroke-stone" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results-listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-stone focus-visible:outline-none"
        />
        {isLoading && <Loader2 className="h-4 w-4 shrink-0 animate-spin stroke-stone" />}
        {!isLoading && query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-4 w-4 stroke-stone" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div
          id="search-results-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto border border-stone-light bg-bone shadow-lg"
        >
          {results.length === 0 && !isLoading && (
            <p className="px-4 py-6 text-center text-sm text-stone">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.map((product, index) => (
            <Link
              key={product.id}
              id={`search-result-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              href={`/product/${product.slug}`}
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 transition-colors",
                index === activeIndex ? "bg-paper" : "hover:bg-paper"
              )}
            >
              <span className="relative h-14 w-11 shrink-0 overflow-hidden bg-paper">
                <Image
                  src={product.images[0].url}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="flex flex-col">
                <span className="text-sm text-ink">{product.name}</span>
                <span className="text-xs text-stone">
                  {formatPrice(product.price, product.currency)}
                </span>
              </span>
            </Link>
          ))}

          {results.length > 0 && (
            <button
              type="button"
              onClick={goToResults}
              className="block w-full border-t border-stone-light px-4 py-3 text-left text-xs uppercase tracking-[0.1em] text-ink hover:bg-paper"
            >
              View all results for &ldquo;{query}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;