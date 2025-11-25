"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { Filter, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { PriceRange, PriceRangeSlider } from "./price-range-slider";
import { ProductFiltersState } from "./product-filters";
import { SortOption } from "./product-sort";

export interface FilterBarProps {
  /**
   * All available products
   */
  products: Product[];

  /**
   * Available categories (from Category documents)
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
   * Filtered products count
   */
  filteredCount: number;

  /**
   * Total products count
   */
  totalCount: number;
}

/**
 * Get unique category names from products
 */
function getUniqueCategoriesFromProducts(products: Product[]): string[] {
  const categorySet = new Set<string>();
  products.forEach((product) => {
    if (product.category) {
      categorySet.add(product.category);
    }
  });
  return Array.from(categorySet).sort();
}

/**
 * Get unique land names from products
 */
function getUniqueLandsFromProducts(products: Product[]): string[] {
  const landSet = new Set<string>();
  products.forEach((product) => {
    if (product.land) {
      landSet.add(product.land);
    }
  });
  return Array.from(landSet).sort();
}

/**
 * FilterBar Component
 *
 * Horizontal filter bar for category pages with all filter options.
 * Responsive: collapses to drawer on mobile.
 */
export function FilterBar({
  products,
  categories = [],
  filters,
  onFiltersChange,
  filteredCount,
  totalCount,
}: FilterBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // Get unique categories from products (these are the actual category names used in products)
  const productCategories = useMemo(() => {
    return getUniqueCategoriesFromProducts(products);
  }, [products]);

  // Get unique lands from products
  const productLands = useMemo(() => {
    return getUniqueLandsFromProducts(products);
  }, [products]);

  // Calculate available ranges
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const volumeRange = useMemo(() => {
    const volumes = products
      .map((p) => p.volume)
      .filter((v): v is number => v !== undefined);
    if (volumes.length === 0) return { min: 0, max: 1000 };
    return {
      min: Math.min(...volumes),
      max: Math.max(...volumes),
    };
  }, [products]);

  const percentageRange = useMemo(() => {
    const percentages = products
      .map((p) => p.percentage)
      .filter((p): p is number => p !== undefined);
    if (percentages.length === 0) return { min: 0, max: 100 };
    return {
      min: Math.min(...percentages),
      max: Math.max(...percentages),
    };
  }, [products]);

  const updateFilters = (updates: Partial<ProductFiltersState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryChange = (categoryName: string) => {
    updateFilters({ categories: categoryName ? [categoryName] : [] });
  };

  const handleLandChange = (landName: string) => {
    updateFilters({ landen: landName ? [landName] : [] });
  };

  const handlePriceMinChange = (value: string) => {
    const min = Math.max(priceRange.min, Number(value) || priceRange.min);
    updateFilters({
      priceRange: { ...filters.priceRange, min: Math.min(min, filters.priceRange.max) },
    });
  };

  const handlePriceMaxChange = (value: string) => {
    const max = Math.min(priceRange.max, Number(value) || priceRange.max);
    updateFilters({
      priceRange: { ...filters.priceRange, max: Math.max(max, filters.priceRange.min) },
    });
  };

  const handleVolumeRangeChange = (range: PriceRange) => {
    // Convert volume range to volume array filter
    const volumes = products
      .filter((p) => p.volume && p.volume >= range.min && p.volume <= range.max)
      .map((p) => String(p.volume!))
      .filter((v, i, arr) => arr.indexOf(v) === i);
    updateFilters({ volumes });
  };

  const handlePercentageRangeChange = (range: PriceRange) => {
    // Convert percentage range to percentage array filter
    const percentages = products
      .filter((p) => p.percentage && p.percentage >= range.min && p.percentage <= range.max)
      .map((p) => String(p.percentage!))
      .filter((p, i, arr) => arr.indexOf(p) === i);
    updateFilters({ percentages });
  };

  const handleSortChange = (sort: SortOption) => {
    updateFilters({ sort });
  };

  const handleInStockToggle = (checked: boolean) => {
    updateFilters({ inStock: checked ? true : null });
  };

  const handleInSaleToggle = (checked: boolean) => {
    updateFilters({ inSale: checked ? true : null });
  };

  const handleIsNewToggle = (checked: boolean) => {
    updateFilters({ isNew: checked ? true : null });
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

  const resetFilters = () => {
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

  // Current volume range from filters
  const currentVolumeRange: PriceRange = useMemo(() => {
    if (filters.volumes.length === 0) {
      return volumeRange;
    }
    const volumes = filters.volumes.map(Number);
    return {
      min: Math.min(...volumes),
      max: Math.max(...volumes),
    };
  }, [filters.volumes, volumeRange]);

  // Current percentage range from filters
  const currentPercentageRange: PriceRange = useMemo(() => {
    if (filters.percentages.length === 0) {
      return percentageRange;
    }
    const percentages = filters.percentages.map(Number);
    return {
      min: Math.min(...percentages),
      max: Math.max(...percentages),
    };
  }, [filters.percentages, percentageRange]);

  const filterContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      {productCategories.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Categorie</Label>
          <Select
            value={filters.categories[0] || "all"}
            onValueChange={(value) => handleCategoryChange(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Alle categorieën" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle categorieën</SelectItem>
              {productCategories.map((categoryName) => (
                <SelectItem key={categoryName} value={categoryName}>
                  {categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Land Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Land</Label>
        <Select
          value={filters.landen[0] || "all"}
          onValueChange={(value) => handleLandChange(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Alle landen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle landen</SelectItem>
            {productLands.length > 0 ? (
              productLands.map((landName) => (
                <SelectItem key={landName} value={landName}>
                  {landName}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="Bulgarije">Bulgarije</SelectItem>
                <SelectItem value="Griekenland">Griekenland</SelectItem>
                <SelectItem value="Polen">Polen</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range - Only show when logged in */}
      {isLoggedIn && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Prijs</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Van"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceMinChange(e.target.value)}
              className="w-full"
              min={priceRange.min}
              max={priceRange.max}
            />
            <span className="text-muted-foreground">—</span>
            <Input
              type="number"
              placeholder="Tot"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceMaxChange(e.target.value)}
              className="w-full"
              min={priceRange.min}
              max={priceRange.max}
            />
          </div>
          <PriceRangeSlider
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            value={filters.priceRange}
            onChange={(range) => updateFilters({ priceRange: range })}
          />
        </div>
      )}

      {/* Volume Range */}
      {volumeRange.max > volumeRange.min && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Volume (ml)</Label>
          <PriceRangeSlider
            minPrice={volumeRange.min}
            maxPrice={volumeRange.max}
            value={currentVolumeRange}
            onChange={handleVolumeRangeChange}
          />
        </div>
      )}

      {/* Percentage Range */}
      {percentageRange.max > percentageRange.min && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Alcohol %</Label>
          <PriceRangeSlider
            minPrice={percentageRange.min}
            maxPrice={percentageRange.max}
            value={currentPercentageRange}
            onChange={handlePercentageRangeChange}
          />
        </div>
      )}

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Sorteren</Label>
        <Select value={filters.sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Prijs ↑</SelectItem>
            <SelectItem value="price-desc">Prijs ↓</SelectItem>
            <SelectItem value="newest">Nieuw</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="name-asc">Naam (A-Z)</SelectItem>
            <SelectItem value="name-desc">Naam (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Status</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock === true}
              onChange={(e) => handleInStockToggle(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">Op voorraad</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inSale === true}
              onChange={(e) => handleInSaleToggle(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">Sale</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isNew === true}
              onChange={(e) => handleIsNewToggle(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">Nieuw</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {filteredCount} van {totalCount} producten
        </p>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Desktop: Horizontal Filter Bar */}
      <div className="hidden lg:block">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7">
            {/* Category */}
            {productCategories.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Categorie</Label>
                <Select
                  value={filters.categories[0] || "all"}
                  onValueChange={(value) => handleCategoryChange(value === "all" ? "" : value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Alle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    {productCategories.map((categoryName) => (
                      <SelectItem key={categoryName} value={categoryName}>
                        {categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Land */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Land</Label>
              <Select
                value={filters.landen[0] || "all"}
                onValueChange={(value) => handleLandChange(value === "all" ? "" : value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Alle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  {productLands.length > 0 ? (
                    productLands.map((landName) => (
                      <SelectItem key={landName} value={landName}>
                        {landName}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="Bulgarije">Bulgarije</SelectItem>
                      <SelectItem value="Griekenland">Griekenland</SelectItem>
                      <SelectItem value="Polen">Polen</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Price - Only show when logged in */}
            {isLoggedIn && (
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Prijs</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="Van"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceMinChange(e.target.value)}
                    className="h-9 text-xs"
                    min={priceRange.min}
                    max={priceRange.max}
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Tot"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceMaxChange(e.target.value)}
                    className="h-9 text-xs"
                    min={priceRange.min}
                    max={priceRange.max}
                  />
                </div>
              </div>
            )}

            {/* Sort */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Sorteren</Label>
              <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Prijs ↑</SelectItem>
                  <SelectItem value="price-desc">Prijs ↓</SelectItem>
                  <SelectItem value="newest">Nieuw</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="name-asc">Naam (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Naam (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Toggles */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock === true}
                    onChange={(e) => handleInStockToggle(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs">Voorraad</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inSale === true}
                    onChange={(e) => handleInSaleToggle(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs">Sale</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isNew === true}
                    onChange={(e) => handleIsNewToggle(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs">Nieuw</span>
                </label>
              </div>
            </div>

            {/* Results & Reset */}
            <div className="flex items-end justify-between md:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="text-xs text-muted-foreground">
                {filteredCount} van {totalCount}
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Drawer */}
      <div className="lg:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters {hasActiveFilters && `(${filteredCount})`}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
            </DrawerHeader>
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {filterContent}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

