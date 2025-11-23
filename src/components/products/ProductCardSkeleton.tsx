"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  variant?: "default" | "compact";
  className?: string;
}

export function ProductCardSkeleton({ variant = "default", className }: ProductCardSkeletonProps) {
  const cardHeight = variant === "compact" ? "h-[380px]" : "h-[420px]";
  const imageHeight = variant === "compact" ? "h-48" : "h-56";

  return (
    <div className={cn("flex w-full flex-col overflow-hidden rounded-2xl bg-surface/80 shadow-sm", cardHeight, className)}>
      {/* Badge area */}
      <div className="absolute right-2 top-2 z-10">
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      {/* Favorite button */}
      <div className="absolute left-2 top-2 z-10">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Image */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-background-alt to-surface p-4">
        <Skeleton className={cn("w-full", imageHeight)} />
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-3 p-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        {/* Meta */}
        <Skeleton className="h-4 w-1/2" />
        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

