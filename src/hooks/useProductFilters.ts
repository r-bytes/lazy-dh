"use client";

import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { PriceRange } from "@/components/ui/filters/price-range-slider";
import { SortOption, sortProducts } from "@/components/ui/filters/product-sort";
import { ProductFiltersState } from "@/components/ui/filters/product-filters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const DEFAULT_FILTERS: ProductFiltersState = {
  categories: [],
  priceRange: { min: 0, max: 1000 },
  volumes: [],
  percentages: [],
  inSale: null,
  isNew: null,
  inStock: null,
  sort: "name-asc",
};

/**
 * Filters products based on filter state
 */
function filterProducts(products: Product[], filters: ProductFiltersState): Product[] {
  let filtered = [...products];

  // Category filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter((product) =>
      filters.categories.includes(product.category)
    );
  }

  // Price range filter
  filtered = filtered.filter(
    (product) =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
  );

  // Volume filter
  if (filters.volumes.length > 0) {
    filtered = filtered.filter((product) =>
      product.volume && filters.volumes.includes(String(product.volume))
    );
  }

  // Percentage filter
  if (filters.percentages.length > 0) {
    filtered = filtered.filter((product) =>
      product.percentage && filters.percentages.includes(String(product.percentage))
    );
  }

  // Sale filter
  if (filters.inSale !== null) {
    filtered = filtered.filter((product) => product.inSale === filters.inSale);
  }

  // New filter
  if (filters.isNew !== null) {
    filtered = filtered.filter((product) => product.isNew === filters.isNew);
  }

  // Stock filter
  if (filters.inStock !== null) {
    filtered = filtered.filter((product) => product.inStock === filters.inStock);
  }

  return filtered;
}

/**
 * Parses URL search params to filter state
 */
function parseFiltersFromURL(searchParams: URLSearchParams, defaultPriceRange: PriceRange): ProductFiltersState {
  const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const volumes = searchParams.get("volumes")?.split(",").filter(Boolean) || [];
  const percentages = searchParams.get("percentages")?.split(",").filter(Boolean) || [];
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : defaultPriceRange.min;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : defaultPriceRange.max;
  const inSale = searchParams.get("inSale") === "true" ? true : searchParams.get("inSale") === "false" ? false : null;
  const isNew = searchParams.get("isNew") === "true" ? true : searchParams.get("isNew") === "false" ? false : null;
  const inStock = searchParams.get("inStock") === "true" ? true : searchParams.get("inStock") === "false" ? false : null;
  const sort = (searchParams.get("sort") as SortOption) || "name-asc";

  return {
    categories,
    priceRange: { min: minPrice, max: maxPrice },
    volumes,
    percentages,
    inSale,
    isNew,
    inStock,
    sort,
  };
}

/**
 * Converts filter state to URL search params
 */
function filtersToURLParams(filters: ProductFiltersState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.categories.length > 0) {
    params.set("categories", filters.categories.join(","));
  }
  if (filters.volumes.length > 0) {
    params.set("volumes", filters.volumes.join(","));
  }
  if (filters.percentages.length > 0) {
    params.set("percentages", filters.percentages.join(","));
  }
  if (filters.priceRange.min !== DEFAULT_FILTERS.priceRange.min) {
    params.set("minPrice", String(filters.priceRange.min));
  }
  if (filters.priceRange.max !== DEFAULT_FILTERS.priceRange.max) {
    params.set("maxPrice", String(filters.priceRange.max));
  }
  if (filters.inSale !== null) {
    params.set("inSale", String(filters.inSale));
  }
  if (filters.isNew !== null) {
    params.set("isNew", String(filters.isNew));
  }
  if (filters.inStock !== null) {
    params.set("inStock", String(filters.inStock));
  }
  if (filters.sort !== DEFAULT_FILTERS.sort) {
    params.set("sort", filters.sort);
  }

  return params;
}

export interface UseProductFiltersOptions {
  /**
   * All available products
   */
  products: Product[];

  /**
   * Available categories
   */
  categories?: Category[];

  /**
   * Whether to sync filters with URL
   * @default true
   */
  syncWithURL?: boolean;
}

export interface UseProductFiltersReturn {
  /**
   * Current filter state
   */
  filters: ProductFiltersState;

  /**
   * Update filters
   */
  setFilters: (filters: ProductFiltersState) => void;

  /**
   * Filtered and sorted products
   */
  filteredProducts: Product[];

  /**
   * Reset all filters to default
   */
  resetFilters: () => void;

  /**
   * Check if any filters are active
   */
  hasActiveFilters: boolean;
}

/**
 * useProductFilters Hook
 *
 * Manages product filtering, sorting, and URL synchronization.
 *
 * @example
 * ```tsx
 * const { filters, setFilters, filteredProducts, resetFilters } = useProductFilters({
 *   products,
 *   categories,
 *   syncWithURL: true,
 * });
 * ```
 */
export function useProductFilters({
  products,
  categories = [],
  syncWithURL = true,
}: UseProductFiltersOptions): UseProductFiltersReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Calculate default price range from products
  const defaultPriceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Initialize filters from URL or defaults
  const [filters, setFiltersState] = useState<ProductFiltersState>(() => {
    if (syncWithURL && searchParams) {
      return parseFiltersFromURL(searchParams, defaultPriceRange);
    }
    return { ...DEFAULT_FILTERS, priceRange: defaultPriceRange };
  });

  // Update filters when URL changes (browser back/forward)
  useEffect(() => {
    if (syncWithURL && searchParams) {
      const urlFilters = parseFiltersFromURL(searchParams, defaultPriceRange);
      setFiltersState(urlFilters);
    }
  }, [searchParams, syncWithURL, defaultPriceRange]);

  // Sync filters to URL
  const setFilters = useCallback(
    (newFilters: ProductFiltersState) => {
      setFiltersState(newFilters);

      if (syncWithURL) {
        const params = filtersToURLParams(newFilters);
        const newURL = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;
        router.push(newURL, { scroll: false });
      }
    },
    [syncWithURL, pathname, router]
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, filters.sort);
  }, [products, filters]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters = { ...DEFAULT_FILTERS, priceRange: defaultPriceRange };
    setFilters(defaultFilters);
  }, [defaultPriceRange, setFilters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.volumes.length > 0 ||
      filters.percentages.length > 0 ||
      filters.inSale !== null ||
      filters.isNew !== null ||
      filters.inStock !== null ||
      filters.priceRange.min !== defaultPriceRange.min ||
      filters.priceRange.max !== defaultPriceRange.max ||
      filters.sort !== DEFAULT_FILTERS.sort
    );
  }, [filters, defaultPriceRange]);

  return {
    filters,
    setFilters,
    filteredProducts,
    resetFilters,
    hasActiveFilters,
  };
}

