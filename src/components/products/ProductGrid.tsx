"use client";

import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { PackageX } from "lucide-react";
import { ProductCard, ProductCardVariant } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

/**
 * ProductGrid Component
 *
 * A modern, responsive grid layout for displaying product cards.
 * Uses CSS Grid for consistent spacing and alignment.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ProductGrid products={products} />
 *
 * // With custom columns and gap
 * <ProductGrid
 *   products={products}
 *   columns={{ mobile: 1, tablet: 2, desktop: 3 }}
 *   gap="lg"
 *   variant="compact"
 * />
 *
 * // With loading state
 * <ProductGrid products={products} loading={true} />
 * ```
 */

export type ProductGridGap = "sm" | "md" | "lg";

export interface ProductGridColumns {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface ProductGridProps {
  /**
   * Array of products to display in the grid
   */
  products: Product[];

  /**
   * Variant of the product cards to render
   * @default "default"
   */
  variant?: ProductCardVariant;

  /**
   * Responsive column configuration
   * @default { mobile: 1, tablet: 2, desktop: 4 }
   */
  columns?: ProductGridColumns;

  /**
   * Gap spacing between grid items
   * @default "md"
   */
  gap?: ProductGridGap;

  /**
   * Loading state - shows skeleton cards when true
   * @default false
   */
  loading?: boolean;

  /**
   * Optional callback when a favorite is removed
   */
  onRemoveFavorite?: (productId: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Number of skeleton cards to show when loading
   * @default 8
   */
  skeletonCount?: number;
}

const DEFAULT_COLUMNS: ProductGridColumns = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
};

const GAP_MAP: Record<ProductGridGap, string> = {
  sm: "gap-4", // 16px
  md: "gap-6", // 24px
  lg: "gap-8", // 32px
};

/**
 * Maps column configuration to Tailwind grid classes
 * Uses explicit class names to ensure Tailwind includes them in the build
 */
function getGridColumnsClasses(columns: ProductGridColumns): string {
  // Mobile: always grid-cols-1 (base)
  const mobileClass = "grid-cols-1";

  // Tablet breakpoint (sm:)
  const tabletClassMap: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
  };

  // Desktop breakpoint (lg:)
  const desktopClassMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  };

  const tabletClass = tabletClassMap[columns.tablet] || "sm:grid-cols-2";
  const desktopClass = desktopClassMap[columns.desktop] || "lg:grid-cols-4";

  return `${mobileClass} ${tabletClass} ${desktopClass}`;
}

/**
 * Empty state component when no products are available
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <PackageX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">Geen producten gevonden</h3>
      <p className="text-sm text-muted-foreground">Er zijn momenteel geen producten beschikbaar.</p>
    </div>
  );
}

/**
 * ProductGrid Component
 *
 * Renders a responsive grid of product cards using CSS Grid.
 * Supports loading states with skeletons and empty states.
 */
export function ProductGrid({
  products,
  variant = "default",
  columns = DEFAULT_COLUMNS,
  gap = "md",
  loading = false,
  onRemoveFavorite,
  className,
  skeletonCount = 8,
}: ProductGridProps) {
  // Loading state: render skeleton grid
  if (loading) {
    const gapClass = GAP_MAP[gap];
    const gridColumnsClass = getGridColumnsClasses(columns);

    return (
      <div className={cn("grid w-full", gridColumnsClass, gapClass, className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} variant={variant} />
        ))}
      </div>
    );
  }

  // Empty state: no products available
  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  // Render product grid
  const gapClass = GAP_MAP[gap];
  const gridColumnsClass = getGridColumnsClasses(columns);

  return (
    <div className={cn("grid w-full", gridColumnsClass, gapClass, className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          variant={variant}
          onRemoveFavorite={onRemoveFavorite}
          priority={index < 4} // Prioritize first 4 images for LCP
        />
      ))}
    </div>
  );
}

