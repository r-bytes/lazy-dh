"use client";

import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/hooks/useCart";
import { useFavorite } from "@/hooks/useFavorite";
import { Product } from "@/lib/types/product";
import { formatNumberWithCommaDecimalSeparator } from "@/lib/utils";
import { Heart, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { urlFor } from "../../../sanity";
import { ProductMeta } from "./ProductMeta";

interface ProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveFavorite?: (productId: string) => void;
}

export function ProductDialog({ product, open, onOpenChange, onRemoveFavorite }: ProductDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorite(product, onRemoveFavorite);
  const { addToCart, goToCheckout, quantity, incrementQuantity, decrementQuantity, setQuantity } = useCart(product);
  const [productImage, setProductImage] = useState<string>(urlFor(product.image).url());

  useEffect(() => {
    setProductImage(urlFor(product.image).url());
    setQuantity(1);
  }, [product, setQuantity]);

  const handleBuyNow = () => {
    addToCart(quantity);
    onOpenChange(false);
  };

  const handleCheckout = () => {
    goToCheckout(quantity);
  };

  const handleRegister = () => {
    router.push("/auth");
  };

  const handleLogin = () => {
    router.push("/auth");
  };

  const PriceDisplay = () => {
    if (!session?.user) {
      return (
        <div className="w-full text-center">
          <CardDescription className="text-2xl font-semibold">€ ---</CardDescription>
          <CardDescription className="text-sm font-light text-muted-foreground">€ --- doos</CardDescription>
          <div className="mt-4 text-xs text-muted-foreground">Log in om door te gaan of registreer een nieuw account</div>
        </div>
      );
    }

    return (
      <div className="flex flex-1 flex-col text-right tracking-wide">
        <div className="mb-0">
          <span className="mr-1 text-xs font-semibold">€</span>
          <span className="text-3xl font-semibold tracking-wide sm:text-4xl">
            {formatNumberWithCommaDecimalSeparator(product.price)}
          </span>
        </div>
        {product.quantityInBox > 1 && (
          <div className="flex justify-end pt-1">
            <span className="text-xs font-normal text-muted-foreground">
              (€ {formatNumberWithCommaDecimalSeparator(product.price * product.quantityInBox)} per doos – {product.quantityInBox} stuks × {product.volume})
            </span>
          </div>
        )}
      </div>
    );
  };

  const QuantityCounter = () => {
    return (
      <div className="flex h-8 items-center justify-center">
        <div className="flex items-center">
          <button
            type="button"
            className="flex h-8 w-12 items-center justify-center border border-muted-foreground/40 text-center text-red-700 transition-colors hover:bg-muted"
            onClick={decrementQuantity}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex w-8 items-center justify-center border-y border-muted-foreground/40 text-center text-sm">{quantity}</span>
          <button
            type="button"
            className="flex h-8 w-12 items-center justify-center border border-muted-foreground/40 text-center text-green-700 transition-colors hover:bg-muted"
            onClick={incrementQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] flex w-[90vw] max-w-2xl flex-col justify-center rounded-2xl bg-surface p-0">
        {/* Favorite Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          className="absolute right-4 top-4 z-10 rounded-full p-2 transition-colors hover:bg-background-alt/20"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
        </button>

        {/* Product Image */}
        <div className="relative flex items-center justify-center bg-background-alt/50 p-8">
          <Image
            className="h-72 w-full object-contain sm:h-96"
            src={productImage}
            alt={product.name}
            width={400}
            height={400}
            priority
            quality={85}
          />
        </div>

        {/* Product Info */}
        <DialogHeader className="flex flex-col space-y-4 rounded-t-3xl bg-background-alt/10 p-6 pb-8">
          <div className="space-y-2">
            <DialogTitle className="text-center text-2xl font-light text-text-primary sm:text-3xl lg:text-4xl">
              {product.name}
            </DialogTitle>
            <div className="flex justify-center">
              <ProductMeta product={product} variant="default" />
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="flex w-full items-center justify-between gap-4">
            {session?.user ? (
              <>
                <QuantityCounter />
                <PriceDisplay />
              </>
            ) : (
              <PriceDisplay />
            )}
          </div>
        </DialogHeader>

        {/* Actions */}
        <DialogFooter className="flex h-auto flex-row justify-between gap-4 rounded-b-lg bg-zinc-400/10 px-6 py-4 dark:bg-zinc-800">
          {session?.user ? (
            <>
              <Button type="button" className="flex-1" onClick={handleBuyNow}>
                Voeg Toe
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={handleCheckout}>
                Check uit
              </Button>
            </>
          ) : (
            <>
              <Button type="button" className="flex-1" onClick={handleRegister}>
                Registeren
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={handleLogin}>
                Inloggen
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

