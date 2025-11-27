"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useFavorite } from "@/hooks/useFavorite";
import { Product } from "@/lib/types/product";
import { cn, formatNumberWithCommaDecimalSeparator } from "@/lib/utils";
import { Heart, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { urlFor } from "../../../sanity";
import { ProductDialog } from "./ProductDialog";
import { ProductMeta } from "./ProductMeta";

export type ProductCardVariant = "default" | "compact";

export interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  className?: string;
  onRemoveFavorite?: (productId: string) => void;
  priority?: boolean;
}

export function ProductCard({
  product,
  variant = "default",
  className,
  onRemoveFavorite,
  priority = false,
}: ProductCardProps) {
  const { data: session } = useSession();
  const { isFavorite, toggleFavorite } = useFavorite(product, onRemoveFavorite);
  const { addToCart } = useCart(product);
  const [productImage, setProductImage] = useState<string>(urlFor(product.image).url());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    setProductImage(urlFor(product.image).url());
  }, [product]);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite();
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (session?.user) {
      addToCart(1);
    } else {
      setIsDialogOpen(true);
    }
  };

  // Variant-specific styles - responsive
  const titleSize = variant === "compact" ? "text-base sm:text-lg" : "text-lg sm:text-xl";
  const priceSize = variant === "compact" ? "text-lg sm:text-xl" : "text-xl sm:text-2xl";

  return (
    <>
      <Card
        className={cn(
          "group relative flex w-full max-w-full flex-col overflow-hidden rounded-xl bg-surface shadow-md transition-all duration-300 hover:shadow-lg",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Badges - Sale & New */}
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 sm:right-3 sm:top-3 sm:gap-1.5">
          {product.inSale && (
            <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-sm sm:px-2 sm:text-[10px]">SALE</span>
          )}
          {product.isNew && (
            <span className="rounded-md bg-green-500 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-sm sm:px-2 sm:text-[10px]">NIEUW</span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={cn(
            "absolute left-2 top-2 z-10 rounded-full bg-surface/90 p-1.5 shadow-md transition-all duration-200 hover:bg-surface hover:scale-110 sm:left-3 sm:top-3 sm:p-2",
            isFavorite && "bg-red-50 dark:bg-red-900/20"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-3.5 w-3.5 transition-colors sm:h-4 sm:w-4", isFavorite ? "fill-red-500 text-red-500" : "text-text-secondary")} />
        </button>

        {/* Product Image */}
        <div className="relative flex aspect-[3/4] min-h-[200px] items-center justify-center overflow-hidden bg-gradient-to-b from-background-alt to-surface p-3 sm:min-h-[240px] sm:p-4">
          <Image
            className={cn(
              "h-full w-full object-contain transition-transform duration-500",
              isHovered && "scale-110"
            )}
            src={productImage}
            alt={product.name}
            width={300}
            height={400}
            priority={priority}
            quality={80}
          />
        </div>

        {/* Product Info */}
        <CardContent className="flex flex-col space-y-2 p-3 sm:space-y-3 sm:p-4">
          {/* Name */}
          <h3 className={cn("line-clamp-2 min-h-[2.5em] font-semibold text-foreground transition-colors group-hover:text-primary", titleSize)}>
            {product.name}
          </h3>

          {/* Meta (Volume & Percentage) */}
          <ProductMeta product={product} variant={variant} />

          {/* Price */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            {session?.user ? (
              <>
                <div className="flex flex-col max-w-28">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">€</span>
                    <span className={cn("font-bold tracking-tight", priceSize)}>
                      {formatNumberWithCommaDecimalSeparator(product.price)}
                    </span>
                  </div>
                  {product.quantityInBox > 1 && (
                    <span className="text-[10px] font-normal text-muted-foreground sm:text-xs min-w-64 mt-3">
                      € {formatNumberWithCommaDecimalSeparator(product.price * product.quantityInBox)} per doos ({product.quantityInBox} stuks × {product.volume})
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={handleAddToCartClick}
                  className="h-8 w-full rounded-full bg-accent-yellow px-3 text-xs text-text-primary shadow-sm transition-all hover:scale-105 hover:bg-accent-yellow-dark dark:text-black sm:h-9 sm:w-auto sm:px-4"
                >
                  <ShoppingCart className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="text-xs">Toevoegen</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">€</span>
                  <span className={cn("font-bold tracking-tight", priceSize)}>---</span>
                </div>
                <span className="text-[10px] font-normal text-muted-foreground sm:text-xs">€ --- doos</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <ProductDialog product={product} open={isDialogOpen} onOpenChange={setIsDialogOpen} onRemoveFavorite={onRemoveFavorite} />
    </>
  );
}

