"use client";

import { FilterBar } from "@/components/ui/filters/filter-bar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProductFilters } from "@/hooks/useProductFilters";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { useEffect } from "react";

interface CategoryPageClientProps {
  initialProducts: Product[];
  allProducts: Product[];
  categories: Category[];
}

export function CategoryPageClient({
  initialProducts,
  allProducts,
  categories,
}: CategoryPageClientProps) {
  const { filters, setFilters, filteredProducts, hasActiveFilters } =
    useProductFilters({
      products: initialProducts,
      categories,
      syncWithURL: true,
    });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        products={allProducts}
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
        filteredCount={filteredProducts.length}
        totalCount={initialProducts.length}
      />

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap="md"
      />
    </div>
  );
}

