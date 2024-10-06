"use client";

import { Product as ProductType } from "@/lib/types/product";
import { Heart, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCartContext } from "@/context/CartContext";
import { formatNumberWithCommaDecimalSeparator, navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { urlFor } from "../../../sanity";
import React from "react";

interface ProductProps {
  product: ProductType;
  carousel?: boolean;
  onRemoveFavorite?: (productId: string) => void;
}

const Product: FC<ProductProps> = ({ product, carousel, onRemoveFavorite }) => {
  // Hooks
  const router = useRouter();
  const { decQty, incQty, setQty, qty, onAdd, setShowCart } = useCartContext();
  const { data: session, status } = useSession();

  // States
  const [isHoveredOn, setIsHoveredOn] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [productImage, setProductImage] = useState<string>(urlFor(product.image).url());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setProductImage(urlFor(product.image).url());
    setQty(1);
  }, [product, setQty]);
  

  useEffect(() => {
    const fetchUserId = async () => {
      if (session && session.user) {
        try {
          const res = await fetch("/api/getUserIdByEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const { userId } = await res.json();
          setUserId(userId);
          // Fetch favorite status
          const favoriteRes = await fetch(`/api/favorites/status?userId=${userId}&productId=${product._id}`);
          const { isFavorite } = await favoriteRes.json();
          setIsFavorite(isFavorite);
        } catch (error) {
          console.error("Error fetching user ID or checking favorite status:", error);
        }
      }
    };

    fetchUserId();
  }, []);

  // Functions
  const handleToggleFavorite = async () => {
    if (!session?.user?.email) {
      toast.error("Je moet eerst inloggen...");
      return;
    }

    if (!userId) {
      toast.error("Er is iets misgegaan bij het ophalen van de gebruiker-ID.");
      return;
    }

    const productId = product._id;
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    try {
      const url = `/api/favorites`;
      const method = isFavorite ? "DELETE" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isFavorite ? "remove" : "add"} favorite`);
      }

      toast.success(`${product.name} succesvol ${newIsFavorite ? "toegevoegd aan" : "verwijderd uit"} favorieten.`);

      // Call the onRemoveFavorite callback if the product is removed from favorites and the callback exists
      if (!newIsFavorite && onRemoveFavorite) {
        onRemoveFavorite(productId);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Er is iets misgegaan bij het wijzigen van favorieten.");
    }
  };

  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(false);
    setQty(1);
    setIsDialogOpen(false);
  };

  function handleCheckout(): void {
    console.log("qty", qty);

    onAdd(product, qty);
    navigateTo(router, "/winkelwagen");
  }

  const handleRegister = () => {
    navigateTo(router, "/auth");
  };

  function handleLogin(): void {
    navigateTo(router, "/auth");
  }

  // UI
  const CounterDiv = () => {
    return (
      <div className="quantity ml-2 flex h-8 items-center justify-center">
        <p className="quantity-desc ml-0 flex flex-1 justify-center">
          <span
            className="minus flex h-8 w-12 items-center justify-center border border-muted-foreground/40 text-center text-red-700 hover:cursor-pointer"
            onClick={decQty}
          >
            <Minus className="hover:cursor-pointer " />
          </span>
          <span className="num flex w-8 items-center justify-center border border-muted-foreground/40 text-center "> {qty} </span>
          <span
            className="plus flex w-12 items-center justify-center border border-muted-foreground/40 text-center text-green-700 hover:cursor-pointer"
            onClick={incQty}
          >
            <Plus className="hover:cursor-pointer " />
          </span>
        </p>
      </div>
    );
  };

  const PriceDiv = () => {
    return (
      <div id="priceTotal" className="mr-2 flex flex-1 flex-col text-right tracking-wide sm:ml-3">
        <div className="mb-0">
          <span className="mr-1 text-xs font-semibold dark:text-white">€</span>
          <span className="text-3xl font-semibold tracking-wide dark:text-white sm:text-4xl">
            {formatNumberWithCommaDecimalSeparator(product.price)}
          </span>
        </div>
        <div className="flex justify-end pt-1">
          <span className="text-tertiary mr-1 text-xs font-normal">
            € {formatNumberWithCommaDecimalSeparator(product.price * product.quantityInBox)} doos
          </span>
        </div>
      </div>
    );
  };

  return carousel ? (
    <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
      {/* Conditionally add asChild based on isHoveredOn state */}
      <DialogTrigger {...(!isHoveredOn || !isFocused ? { asChild: true } : {})}>
        <Card
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[32rem] w-80 flex-col rounded-2xl bg-neutral-300/10 bg-no-repeat hover:cursor-pointer dark:bg-neutral-800/30 md:w-60"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 text-xs text-muted-foreground"> {product.volume}</div>
            <div className="p-2 text-xs text-muted-foreground"> {product.percentage} </div>
          </div>
          <Image
            className="mt-10 h-60 w-full object-contain"
            src={productImage}
            alt={product.name}
            width={400}
            height={400}
            priority={true}
            quality={75}
          />
          <CardContent className="flex flex-1 flex-col rounded-2xl">
            <div className="flex w-full flex-1 flex-col items-center justify-between text-center">
              <CardTitle className="mt-12 text-xl font-light md:text-2xl">
                {product.name.length > 15 ? `${product.name.slice(0, 15)}...` : product.name}
              </CardTitle>
              {session?.user ? (
                <div className="self-end">
                  <CardDescription className="flex-1 text-right text-2xl font-semibold">
                    € {formatNumberWithCommaDecimalSeparator(product.price)}
                  </CardDescription>
                  <CardDescription className="text-tertiary flex-1 text-right text-sm font-light">
                    € {formatNumberWithCommaDecimalSeparator(product.price * product.quantityInBox)} doos
                  </CardDescription>
                </div>
              ) : (
                <div className="w-full self-end">
                  {/* Placeholder for price */}
                  <CardDescription className="flex-1 text-right text-2xl font-semibold">€ ---</CardDescription>
                  {/* Placeholder for price per box */}
                  <CardDescription className="text-tertiary flex-1 text-right text-sm font-light">€ --- doos</CardDescription>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-h-3/5 sm:max-h-4/5 flex w-4/5 flex-col justify-center rounded-2xl bg-zinc-100 p-0 dark:bg-zinc-900">
        <Heart
          className="m-4 h-4 w-4 hover:cursor-pointer"
          onClick={handleToggleFavorite}
          color={isFavorite ? "red" : ""}
          fill={isFavorite ? "red" : "bg-muted-foreground/30"}
        />

        {/* Top */}
        <Image
          className="mb-6 mt-12 h-72 w-full object-contain sm:h-96"
          src={productImage}
          alt={product.name}
          width={400}
          height={400}
          priority={true}
          quality={75}
        />
        {/* Middle */}
        <DialogHeader className="mb-[-1rem] flex flex-col items-center justify-between rounded-t-3xl bg-zinc-400/10 p-4 pb-8 dark:bg-zinc-800">
          <div className="">
            <DialogTitle className="text-tertiary mb-4 mt-4 text-center text-lg font-light dark:text-white sm:text-2xl lg:text-3xl">
              {product.name}
            </DialogTitle>
          </div>
          <div className="flex w-full items-center justify-between">
            {session?.user ? (
              <>
                <CounterDiv />
                <PriceDiv />
              </>
            ) : (
              <div className="w-full self-end">
                {/* Placeholder for price */}
                <CardDescription className="flex-1 text-right text-2xl font-semibold">€ ---</CardDescription>
                {/* Placeholder for price per box */}
                <CardDescription className="text-tertiary flex-1 text-right text-sm font-light">€ --- doos</CardDescription>
                <div className="mt-10 flex items-center justify-center text-xs"> Log in om door te gaan of registreer een nieuw account </div>
              </div>
            )}
          </div>
        </DialogHeader>
        {/* Bottom */}

        {session?.user ? (
          <DialogFooter className="flex h-16 flex-row justify-between gap-4 rounded-b-lg bg-zinc-400/10 px-4 dark:bg-zinc-800">
            <Button type="button" className="addToCart flex-1" onClick={handleBuyNow}>
              Voeg Toe
            </Button>
            <Button type="button" className="goToCart flex-1" onClick={handleCheckout}>
              Check uit
            </Button>
          </DialogFooter>
        ) : (
          <>
            <DialogFooter className="flex h-16 flex-row justify-between gap-4 rounded-b-lg bg-zinc-400/10 px-4 dark:bg-zinc-800">
              <Button type="button" className="addToCart flex-1" onClick={handleRegister}>
                Registeren
              </Button>
              <Button type="button" className="goToCart flex-1" onClick={handleLogin}>
                Inloggen
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
      {/* Conditionally add asChild based on isHoveredOn state */}
      <DialogTrigger {...(!isHoveredOn || !isFocused ? { asChild: true } : {})}>
        <Card
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[32rem] w-80 flex-col rounded-2xl bg-neutral-300/10 bg-no-repeat hover:cursor-pointer dark:bg-neutral-800/30 md:w-60"
        >
          <div className="flex items-center justify-between p-4">
            <div className="p-2 text-xs text-muted-foreground"> {product.volume}</div>
            <div className="p-2 text-xs text-muted-foreground"> {product.percentage} </div>
          </div>
          <Image
            className="mt-8 h-60 w-full object-contain"
            src={productImage}
            alt={product.name}
            width={400}
            height={400}
            priority={true}
            quality={75}
          />
          <CardContent className="flex flex-1 flex-col rounded-2xl">
            <div className="flex w-full flex-1 flex-col items-center justify-between text-center">
              <CardTitle className="mt-6 text-xl font-light md:text-2xl">{product.name}</CardTitle>

              {session?.user ? (
                <div className="self-end">
                  <CardDescription className="flex-1 text-right text-2xl font-semibold">
                    € {formatNumberWithCommaDecimalSeparator(product.price)}
                  </CardDescription>
                  <CardDescription className="text-tertiary flex-1 text-right text-sm font-light">
                    € {formatNumberWithCommaDecimalSeparator(product.price * product.quantityInBox)} doos
                  </CardDescription>
                </div>
              ) : (
                <div className="self-end">
                  {/* Placeholder for price */}
                  <CardDescription className="flex-1 text-right text-2xl font-semibold">€ ---</CardDescription>
                  {/* Placeholder for price per box */}
                  <CardDescription className="text-tertiary flex-1 text-right text-sm font-light">€ --- doos</CardDescription>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-h-3/5 sm:max-h-4/5 flex w-4/5 flex-col justify-center rounded-2xl bg-zinc-100 p-0 dark:bg-zinc-900">
        <Heart
          className="m-4 h-4 w-4 hover:cursor-pointer"
          onClick={handleToggleFavorite}
          color={isFavorite ? "red" : ""}
          fill={isFavorite ? "red" : "bg-muted-foreground/30"}
        />

        {/* Top */}
        <Image
          className="mb-6 mt-12 h-72 w-full object-contain sm:h-96"
          src={productImage}
          alt={product.name}
          width={400}
          height={400}
          priority={true}
          quality={75}
        />
        {/* Middle */}
        <DialogHeader className="mb-[-1rem] flex flex-col items-center justify-between rounded-t-3xl bg-zinc-400/10 p-4 pb-8 dark:bg-zinc-800">
          <div className="">
            <DialogTitle className="text-tertiary mb-4 mt-4 text-center text-lg font-light dark:text-white sm:text-2xl lg:text-3xl">
              {product.name}
            </DialogTitle>
          </div>
          <div className="flex w-full items-center justify-between">
            {session?.user ? (
              <>
                <CounterDiv />
                <PriceDiv />
              </>
            ) : (
              <div className="w-full self-end">
                {/* Placeholder for price */}
                <CardDescription className="flex-1 text-right text-2xl font-semibold">€ ---</CardDescription>
                {/* Placeholder for price per box */}
                <CardDescription className="text-tertiary flex-1 text-right text-sm font-light">€ --- doos</CardDescription>
                <div className="mt-10 flex items-center justify-center text-xs"> Log in om door te gaan of registreer een nieuw account </div>
              </div>
            )}
          </div>
        </DialogHeader>
        {/* Bottom */}
        {session?.user ? (
          <DialogFooter className="flex h-16 flex-row justify-between gap-4 rounded-b-lg bg-zinc-400/10 px-4 dark:bg-zinc-800">
            <Button type="button" className="addToCart flex-1" onClick={handleBuyNow}>
              Voeg Toe
            </Button>
            <Button type="button" className="goToCart flex-1" onClick={handleCheckout}>
              Check uit
            </Button>
          </DialogFooter>
        ) : (
          <>
            <DialogFooter className="flex h-16 flex-row justify-between gap-4 rounded-b-lg bg-zinc-400/10 px-4 dark:bg-zinc-800">
              <Button type="button" className="addToCart flex-1" onClick={handleRegister}>
                Registeren
              </Button>
              <Button type="button" className="goToCart flex-1" onClick={handleLogin}>
                Inloggen
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Product;
