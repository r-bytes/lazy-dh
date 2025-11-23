"use client";

import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface ProductMetaProps {
  product: Product;
  className?: string;
  variant?: "default" | "compact";
}

export function ProductMeta({ product, className, variant = "default" }: ProductMetaProps) {
  const hasVolume = product.volume !== undefined && product.volume !== null;
  const hasPercentage = product.percentage !== undefined && product.percentage !== null;

  if (!hasVolume && !hasPercentage) {
    return null;
  }

  const textSize = variant === "compact" ? "text-xs" : "text-sm";
  const gap = variant === "compact" ? "gap-1" : "gap-2";

  return (
    <div className={cn("flex items-center text-muted-foreground", gap, className)}>
      {hasVolume && (
        <span className={cn("font-medium", textSize)}>
          {product.volume}
          {typeof product.volume === "number" && "ml"}
        </span>
      )}
      {hasVolume && hasPercentage && <span className={textSize}>•</span>}
      {hasPercentage && (
        <span className={cn("font-medium", textSize)}>
          {product.percentage}
          {typeof product.percentage === "number" && "%"}
        </span>
      )}
    </div>
  );
}

