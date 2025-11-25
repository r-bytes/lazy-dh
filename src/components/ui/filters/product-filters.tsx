"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PriceRange, PriceRangeSlider } from "./price-range-slider";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductSort, SortOption, sortProducts } from "./product-sort";

export interface ProductFiltersState {
  categories: string[];
  priceRange: PriceRange;
  volumes: string[];
  percentages: string[];
  landen: string[];
  inSale: boolean | null;
  isNew: boolean | null;
  inStock: boolean | null;
  sort: SortOption;
}

export interface ProductFiltersProps {
  /**
   * All available products
   */
  products: Product[];

  /**
   * Available categories
   */
  categories?: Category[];

  /**
   * Current filter state
   */
  filters: ProductFiltersState;

  /**
   * Callback when filters change
   */
  onFiltersChange: (filters: ProductFiltersState) => void;

  /**
   * Filtered and sorted products
   */
  filteredProducts: Product[];

  /**
   * Whether filters are in a drawer (mobile)
   * @default false
   */
  inDrawer?: boolean;

  /**
   * Callback to close drawer (mobile)
   */
  onClose?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ProductFilters Component
 *
 * Comprehensive filter sidebar with category, price, volume, percentage,
 * sale/new toggles, and sorting options.
 */
export function ProductFilters({
  products,
  categories = [],
  filters,
  onFiltersChange,
  filteredProducts,
  inDrawer = false,
  onClose,
  className,
}: ProductFiltersProps) {
  // Calculate available filter options from products
  const availableVolumes = useMemo(() => {
    const volumes = new Set<string>();
    products.forEach((product) => {
      if (product.volume) {
        volumes.add(String(product.volume));
      }
    });
    return Array.from(volumes).sort((a, b) => Number(a) - Number(b));
  }, [products]);

  const availablePercentages = useMemo(() => {
    const percentages = new Set<string>();
    products.forEach((product) => {
      if (product.percentage) {
        percentages.add(String(product.percentage));
      }
    });
    return Array.from(percentages).sort((a, b) => Number(a) - Number(b));
  }, [products]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const updateFilters = (updates: Partial<ProductFiltersState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryToggle = (categoryName: string) => {
    const newCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter((c) => c !== categoryName)
      : [...filters.categories, categoryName];
    updateFilters({ categories: newCategories });
  };

  const handleVolumeToggle = (volume: string) => {
    const newVolumes = filters.volumes.includes(volume)
      ? filters.volumes.filter((v) => v !== volume)
      : [...filters.volumes, volume];
    updateFilters({ volumes: newVolumes });
  };

  const handlePercentageToggle = (percentage: string) => {
    const newPercentages = filters.percentages.includes(percentage)
      ? filters.percentages.filter((p) => p !== percentage)
      : [...filters.percentages, percentage];
    updateFilters({ percentages: newPercentages });
  };

  const handleReset = () => {
    onFiltersChange({
      categories: [],
      priceRange: { min: priceRange.min, max: priceRange.max },
      volumes: [],
      percentages: [],
      landen: [],
      inSale: null,
      isNew: null,
      inStock: null,
      sort: "name-asc",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.volumes.length > 0 ||
    filters.percentages.length > 0 ||
    filters.landen.length > 0 ||
    filters.inSale !== null ||
    filters.isNew !== null ||
    filters.inStock !== null ||
    filters.priceRange.min !== priceRange.min ||
    filters.priceRange.max !== priceRange.max;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {inDrawer && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <ProductSort value={filters.sort} onSortChange={(sort) => updateFilters({ sort })} />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Categorie</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category._id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.name)}
                  onChange={() => handleCategoryToggle(category.name)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Prijs</Label>
        <PriceRangeSlider
          minPrice={priceRange.min}
          maxPrice={priceRange.max}
          value={filters.priceRange}
          onChange={(range) => updateFilters({ priceRange: range })}
        />
      </div>

      {/* Volume */}
      {availableVolumes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Volume</Label>
          <div className="space-y-2">
            {availableVolumes.map((volume) => (
              <label
                key={volume}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.volumes.includes(volume)}
                  onChange={() => handleVolumeToggle(volume)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{volume}ml</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Percentage */}
      {availablePercentages.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Alcohol %</Label>
          <div className="space-y-2">
            {availablePercentages.map((percentage) => (
              <label
                key={percentage}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.percentages.includes(percentage)}
                  onChange={() => handlePercentageToggle(percentage)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{percentage}%</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sale/New Toggles */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Status</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inSale === true}
              onChange={(e) =>
                updateFilters({ inSale: e.target.checked ? true : null })
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">In Aanbieding</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isNew === true}
              onChange={(e) =>
                updateFilters({ isNew: e.target.checked ? true : null })
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Nieuw</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "producten"} gevonden
        </p>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
      )}
    </div>
  );
}

