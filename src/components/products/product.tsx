"use client";

import { Product as ProductType } from "@/lib/types/product";
import { Heart, Minus, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCartContext } from "@/context/CartContext";
import { formatNumberWithCommaDecimalSeparator, navigateTo } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "../../../sanity";

const Product = ({ product }: { product: ProductType }) => {
  // Hooks
  const pathname = usePathname();
  const router = useRouter();
  const { decQty, incQty, qty, onAdd, setShowCart } = useCartContext();

  // States
  const [isHoveredOn, setIsHoveredOn] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [productImage, setProductImage] = useState<string>(urlFor(product.image).url());

  useEffect(() => {
    setProductImage(urlFor(product.image).url());
  }, [product]);
  
  // Variables
  const backgroundImageStyle = {
    backgroundImage: `url(${productImage})`,
    backgroundSize: "200px",
    backgroundPosition: "50% 30%",
  };

  const PRICE_TOTAL = 200;

  // Functions
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(true);
  };

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
      <div id="priceTotal" className="mr-2 flex-1 text-right text-3xl tracking-wide sm:ml-3 sm:text-4xl">
        <span className="mr-1 text-xs font-bold dark:text-white">€</span>
        <span className="font-bold tracking-wide dark:text-white">{formatNumberWithCommaDecimalSeparator(product.price)}</span>
      </div>
    );
  };

  function handleCheckout(): void {
    onAdd(product, qty);
    navigateTo(router, "/winkelwagen");
  }

  return (
    <Dialog>
      {/* Conditionally add asChild based on isHoveredOn state */}
      <DialogTrigger {...(!isHoveredOn || !isFocused ? { asChild: true } : {})}>
        <Card
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[32rem] w-80 flex-col rounded-2xl bg-neutral-300/10 bg-no-repeat hover:cursor-pointer dark:bg-neutral-800/30 md:w-60"
        >
          <Image
            className="mt-16 h-60 w-full object-contain"
            src={productImage}
            alt={product.name}
            width={200}
            height={200}
            priority={true}
            quality={75}
          />
          <CardContent className="flex flex-1 flex-col items-center justify-end rounded-2xl">
            <div className="mb-12 w-full text-center">
              <CardTitle className="mb-2 flex-1 text-lg">{product.name}</CardTitle>
              <CardDescription className="flex-1 text-2xl font-bold"> € {formatNumberWithCommaDecimalSeparator(product.price)}</CardDescription>
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
            <DialogTitle className="dark:text-text-muted-foreground tx-lg mb-4 mt-4 text-center sm:text-2xl">{product.name}</DialogTitle>
            <DialogDescription className="pb-8 text-center text-xs leading-relaxed tracking-wider dark:text-muted-foreground sm:text-sm">
              {product.description}
            </DialogDescription>
          </div>
          <div className="flex w-full items-center justify-between">
            <CounterDiv />
            <PriceDiv />
          </div>
        </DialogHeader>
        {/* Bottom */}
        <DialogFooter className="mt-2 flex h-16 flex-row justify-between gap-4 rounded-b-lg rounded-t-2xl bg-zinc-100 px-4 dark:bg-zinc-900">
          <Button type="button" className="addToCart flex-1" onClick={() => onAdd(product, qty)}>
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
