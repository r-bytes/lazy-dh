"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface CategoryGridSkeletonProps {
  /**
   * Number of skeleton cards to display
   * @default 6
   */
  count?: number;

  /**
   * Responsive column configuration
   * @default { mobile: 1, tablet: 2, desktop: 3 }
   */
  columns?: { mobile: number; tablet: number; desktop: number };

  /**
   * Gap spacing
   * @default "md"
   */
  gap?: "sm" | "md" | "lg";

  /**
   * Additional CSS classes
   */
  className?: string;
}

const GAP_MAP = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

function getGridColumnsClasses(columns: { mobile: number; tablet: number; desktop: number }): string {
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
 * CategoryGridSkeleton Component
 *
 * Loading skeleton for CategoryGrid component.
 */
export function CategoryGridSkeleton({
  count = 6,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  className,
}: CategoryGridSkeletonProps) {
  const gapClass = GAP_MAP[gap];
  const gridColumnsClass = getGridColumnsClasses(columns);

  return (
    <div className={cn("grid w-full", gridColumnsClass, gapClass, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="group relative block h-full overflow-hidden rounded-card-lg bg-muted"
        >
          {/* Image Skeleton */}
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content Skeleton */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <Skeleton className="mb-2 h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

