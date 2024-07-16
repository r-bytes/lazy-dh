"use client";

import { Product as ProductType } from "@/lib/types/product";
import { Heart, Minus, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCartContext } from "@/context/CartContext";
import { formatNumberWithCommaDecimalSeparator, navigateTo } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "../../../sanity";

const Product = ({ product }: { product: ProductType }) => {
  // Hooks
  const pathname = usePathname();
  const router = useRouter();
  const { decQty, incQty, setQty, qty, onAdd, setShowCart } = useCartContext();

  // States
  const [isHoveredOn, setIsHoveredOn] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [productImage, setProductImage] = useState<string>(urlFor(product.image).url());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  useEffect(() => {
    setProductImage(urlFor(product.image).url());
    setQty(0);
  }, [product]);
  // Variables
  const backgroundImageStyle = {
    backgroundImage: `url(${productImage})`,
    backgroundSize: "200px",
    backgroundPosition: "50% 30%",
  };

  // Functions
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(false);
    setQty(1);
    setIsDialogOpen(false);
  };

  function handleCheckout(): void {
    onAdd(product, qty);
    navigateTo(router, "/winkelwagen");
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
            {formatNumberWithCommaDecimalSeparator(product.price * product.quantityInBox)}
          </span>
        </div>
        <div className="flex justify-end pt-1">
          <span className="text-tertiary mr-1 text-xs font-light">€{formatNumberWithCommaDecimalSeparator(product.price)} per stuk</span>
        </div>
      </div>
    );
  };

  return (
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
            className="mt-1 h-60 w-full object-contain"
            src={productImage}
            alt={product.name}
            width={200}
            height={200}
            priority={true}
            quality={75}
          />
          <CardContent className="flex flex-1 flex-col rounded-2xl">
            <div className="flex w-full flex-1 flex-col items-center justify-between text-center">
              <CardTitle className="my-6 flex-1 text-2xl font-thin">{product.name}</CardTitle>
              <div className="self-end">
                <CardDescription className="flex-1 text-right text-2xl font-semibold">
                  € {formatNumberWithCommaDecimalSeparator(product.price * product.quantityInBox)}
                </CardDescription>
                <CardDescription className="text-tertiary flex-1 text-right text-sm font-thin">
                  € {formatNumberWithCommaDecimalSeparator(product.price)} per stuk
                </CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-h-4/5 flex w-4/5 flex-col justify-center rounded-2xl bg-zinc-100 p-0 dark:bg-zinc-900">
        <Heart
          className="m-4 h-4 w-4 hover:cursor-pointer"
          onClick={handleToggleFavorite}
          color={isFavorite ? "red" : ""}
          fill={isFavorite ? "red" : "bg-muted-foreground/30"}
        />
        {/* </button> */}
        {/* </Button> */}
        {/* Top */}
        <Image
          className="mb-6 h-96 w-full object-contain"
          src={productImage}
          alt={product.name}
          width={200}
          height={200}
          priority={true}
          quality={75}
        />
        {/* Middle */}
        <DialogHeader className="flex flex-col items-center justify-between rounded-t-3xl bg-zinc-200/50 p-4 dark:bg-zinc-800">
          <div className="">
            <DialogTitle className="dark:text-text-muted-foreground text-tertiary mb-4 mt-4 text-center text-lg font-thin sm:text-2xl lg:text-3xl">
              {product.name}
            </DialogTitle>
          </div>
          <div className="flex w-full items-center justify-between">
            <CounterDiv />
            <PriceDiv />
          </div>
        </DialogHeader>
        {/* Bottom */}
        <DialogFooter className="mt-2 flex h-16 flex-row justify-between gap-4 rounded-b-lg rounded-t-2xl bg-zinc-100 px-4 dark:bg-zinc-900">
          <Button type="button" className="addToCart flex-1" onClick={handleBuyNow}>
            Voeg Toe
          </Button>
          <Button type="button" className="goToCart flex-1" onClick={handleCheckout}>
            Check uit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Product;
