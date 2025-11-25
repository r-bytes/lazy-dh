"use client";

import { Product } from "@/lib/types/product";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseProductSearchOptions {
  /**
   * Products array to search through
   */
  products: Product[];

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Maximum number of suggestions to show
   * @default 5
   */
  maxSuggestions?: number;

  /**
   * Minimum characters before showing suggestions
   * @default 2
   */
  minChars?: number;
}

export interface UseProductSearchReturn {
  /**
   * Current search query
   */
  query: string;

  /**
   * Set search query
   */
  setQuery: (query: string) => void;

  /**
   * Filtered products based on search query
   */
  filteredProducts: Product[];

  /**
   * Search suggestions (limited)
   */
  suggestions: Product[];

  /**
   * Whether user is currently searching
   */
  isSearching: boolean;

  /**
   * Clear search query
   */
  clearSearch: () => void;
}

/**
 * useProductSearch Hook
 *
 * Provides search functionality for products with debouncing,
 * filtering, and suggestions.
 *
 * @example
 * ```tsx
 * const { query, setQuery, filteredProducts, suggestions, isSearching } = useProductSearch({
 *   products,
 *   maxSuggestions: 5,
 * });
 * ```
 */
export function useProductSearch({
  products,
  debounceMs = 300,
  maxSuggestions = 5,
  minChars = 2,
}: UseProductSearchOptions): UseProductSearchReturn {
  const [query, setQueryState] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounce the query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minChars) {
      return [];
    }

    const lowerQuery = debouncedQuery.toLowerCase().trim();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery)
    );
  }, [products, debouncedQuery, minChars]);

  // Get suggestions (limited)
  const suggestions = useMemo(() => {
    return filteredProducts.slice(0, maxSuggestions);
  }, [filteredProducts, maxSuggestions]);

  // Check if user is searching
  const isSearching = useMemo(() => {
    return query.length >= minChars;
  }, [query, minChars]);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState("");
    setDebouncedQuery("");
  }, []);

  return {
    query,
    setQuery,
    filteredProducts,
    suggestions,
    isSearching,
    clearSearch,
  };
}

