"use client";

import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { urlFor } from "../../../../sanity";
import { CategoryGridCard } from "./category-grid-card";

export type CategoryGridColumns = {
  mobile: number;
  tablet: number;
  desktop: number;
};

export interface CategoryGridProps {
  /**
   * Categories to display in the grid
   */
  categories: Category[];

  /**
   * Products array to calculate product counts per category
   */
  products?: Product[];

  /**
   * Responsive column configuration
   * @default { mobile: 1, tablet: 2, desktop: 3 }
   */
  columns?: CategoryGridColumns;

  /**
   * Gap spacing between grid items
   * @default "md"
   */
  gap?: "sm" | "md" | "lg";

  /**
   * Maximum number of categories to display
   * If undefined, shows all categories
   */
  limit?: number;

  /**
   * Base path for category links
   * @default "/categorieen"
   */
  basePath?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

const DEFAULT_COLUMNS: CategoryGridColumns = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
};

const GAP_MAP = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

/**
 * Calculates product count for a category
 */
function getProductCount(category: Category, products: Product[]): number {
  const slug = (category as any).slug;
  
  if (slug === "aanbiedingen") {
    return products.filter((product) => product.inSale).length;
  } else if (slug === "nieuw") {
    return products.filter((product) => product.isNew).length;
  } else if (slug === "alles") {
    return products.length;
  } else {
    return products.filter((product) => product.category === category.name).length;
  }
}

/**
 * Maps column configuration to Tailwind grid classes
 */
function getGridColumnsClasses(columns: CategoryGridColumns): string {
  const mobileClass = "grid-cols-1";
  
  const tabletClassMap: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
  };
  
  const desktopClassMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };
  
  const tabletClass = tabletClassMap[columns.tablet] || "sm:grid-cols-2";
  const desktopClass = desktopClassMap[columns.desktop] || "lg:grid-cols-3";
  
  return `${mobileClass} ${tabletClass} ${desktopClass}`;
}

/**
 * CategoryGrid Component
 *
 * A modern, responsive grid layout for displaying category cards.
 * Features large images, overlay gradients, hover effects, and product counts.
 *
 * @example
 * ```tsx
 * <CategoryGrid
 *   categories={categories}
 *   products={products}
 *   columns={{ mobile: 1, tablet: 2, desktop: 3 }}
 *   gap="md"
 * />
 * ```
 */
export function CategoryGrid({
  categories,
  products = [],
  columns = DEFAULT_COLUMNS,
  gap = "md",
  limit,
  basePath = "/categorieen",
  className,
}: CategoryGridProps) {
  const displayCategories = useMemo(() => {
    return limit ? categories.slice(0, limit) : categories;
  }, [categories, limit]);

  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    displayCategories.forEach((category) => {
      counts[category._id] = getProductCount(category, products);
    });
    return counts;
  }, [displayCategories, products]);

  const gapClass = GAP_MAP[gap];
  const gridColumnsClass = getGridColumnsClasses(columns);

  return (
    <div className={cn("grid w-full", gridColumnsClass, gapClass, className)}>
      {displayCategories.map((category, index) => {
        const slug = (category as any).slug || category.name.toLowerCase().replace(/\s+/g, "-");
        const count = productCounts[category._id] || 0;

        return (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <CategoryGridCard
              category={category}
              productCount={count}
              href={`${basePath}/${slug}`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

