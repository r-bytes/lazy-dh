"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "sale";

export interface ProductSortProps {
  /**
   * Current sort option
   */
  value: SortOption;

  /**
   * Callback when sort changes
   */
  onSortChange: (sort: SortOption) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "name-asc", label: "Naam (A-Z)" },
  { value: "name-desc", label: "Naam (Z-A)" },
  { value: "price-asc", label: "Prijs (Laag-Hoog)" },
  { value: "price-desc", label: "Prijs (Hoog-Laag)" },
  { value: "newest", label: "Nieuwste eerst" },
];

/**
 * Sorts products based on sort option
 */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
    case "sale":
      return sorted.sort((a, b) => {
        if (a.inSale && !b.inSale) return -1;
        if (!a.inSale && b.inSale) return 1;
        return 0;
      });
    default:
      return sorted;
  }
}

/**
 * ProductSort Component
 *
 * Dropdown for sorting products by name, price, or newest.
 */
export function ProductSort({
  value,
  onSortChange,
  className,
}: ProductSortProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor="sort-select" className="text-sm font-medium">
        Sorteren:
      </label>
      <Select value={value} onValueChange={onSortChange}>
        <SelectTrigger id="sort-select" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

