"use client";

import { Product as ProductType } from "@/lib/definitions";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCartContext } from "@/context/CartContext";
import Image from "next/image";
import { navigateTo } from "@/lib/utils";

const Product = ({ product }: { product: ProductType }) => {
  // Hooks
  const pathname = usePathname();
  const router = useRouter();
  const { decQty, incQty, qty, onAdd, setShowCart } = useCartContext();  

  // States
  const [isHoveredOn, setIsHoveredOn] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Variables
  const backgroundImageStyle = {
    backgroundImage: `url('/${product.image}')`,
    backgroundSize: "80%",
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

  return (
    <Dialog>
      {/* Conditionally add asChild based on isHoveredOn state */}
      <DialogTrigger {...(!isHoveredOn || !isFocused ? { asChild: true } : {})}>
        <Card
          onFocus={() => setIsFocused(true)} // Handle focus event
          onBlur={() => setIsFocused(false)} // Handle blur event
          onClick={(e) => e.stopPropagation()} // Prevent the dialog from opening immediately upon clicking the card
          className="z-5 relative flex h-[32rem] w-80 flex-col rounded-2xl bg-neutral-300/10 bg-no-repeat hover:cursor-pointer dark:bg-neutral-800/30 md:w-60"
          style={backgroundImageStyle}
        >
          <Button
            onClick={handleToggleFavorite}
            onMouseEnter={() => setIsHoveredOn(true)}
            onMouseLeave={() => setIsHoveredOn(false)}
            className="ml-[75%] mt-4 h-12 w-12 rounded-full bg-muted-foreground/10 hover:bg-primary/70"
          >
            <Heart color={isFavorite ? "red" : ""} fill={isFavorite ? "red" : "bg-muted-foreground/30"} />
          </Button>
          <CardContent className="flex flex-1 flex-col items-center justify-end rounded-2xl">
            <div className="mb-12 w-full text-center">
              <CardTitle className="mb-2 flex-1 text-lg">{product.name}</CardTitle>
              <CardDescription className="flex-1 text-2xl font-bold"> €{product.price},-</CardDescription>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="flex w-4/5 flex-col rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        {/* Top */}
        <Image className="mx-auto my-8" src={`/${product.image}`} alt={product.name} width={300} height={300} />
        {/* Middle */}
        <DialogHeader className="mx-[-24px] mb-8 rounded-t-3xl bg-zinc-200/50 p-12 dark:bg-zinc-800">
          <DialogTitle className="dark:text-text-muted-foreground mb-4 text-center text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="mb-4 text-center leading-relaxed tracking-wider dark:text-muted-foreground">
            {product.description}
          </DialogDescription>
        </DialogHeader>
        {/* Bottom */}
        <DialogFooter className="mx-[-24px] mb-[-25px] mt-[-60px] flex h-32 flex-row items-center justify-between rounded-b-lg rounded-t-2xl bg-zinc-100 px-8 dark:bg-zinc-900 md:px-0">
          <div id="priceTotal" className="flex-1 text-lg tracking-wide sm:ml-3 sm:text-4xl md:ml-12">
            <span className="mr-1 text-xs font-bold dark:text-white">€</span>
            <span className="font-bold tracking-wide dark:text-white">{PRICE_TOTAL}</span>
          </div>
          <div className="flex flex-col items-center space-y-4 p-4 pr-0">
            <div className="quantity flex h-8 w-full items-center justify-center">
              <p className="quantity-desc ml-12 flex flex-1 justify-center">
                <span
                  className="minus flex w-12 items-center justify-center border border-muted-foreground/40 text-center text-red-700"
                  onClick={decQty}
                >
                  <Minus />
                </span>
                <span className="num flex w-8 items-center justify-center border border-muted-foreground/40 text-center "> {qty} </span>
                <span
                  className="plus flex w-12 items-center justify-center border border-muted-foreground/40 text-center text-green-700"
                  onClick={incQty}
                >
                  <Plus />
                </span>
              </p>
            </div>
            <div className="buttons flex w-full items-center justify-end gap-3">
              <Button type="button" className="addToCart flex gap-2" onClick={() => onAdd(product, qty)}>
                Voeg Toe
              </Button>
              <Button type="button" className="goToCart" onClick={() => navigateTo(router, "/winkelwagen")}>
                <ShoppingCart />
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Product;
