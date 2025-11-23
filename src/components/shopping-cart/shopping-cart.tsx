import { useCartContext } from "@/context/CartContext";
import { formatNumberWithCommaDecimalSeparator } from "@/lib/utils";
import { CircleX, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { urlFor } from "../../../sanity";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Title from "../ui/title";
import Checkout from "./check-out";

const ShoppingCart = () => {
  const { cartItems, setShowCart, toggleCartItemQuantity, onRemove } = useCartContext();

  const HorizontalRule = () => <hr className="my-6 border-border sm:my-8 lg:my-12" />;

  return (
    <div className="w-full">
      <Title name="Winkelwagen" cn="mb-6 text-center text-2xl font-semibold sm:text-3xl" />
      {cartItems?.length < 1 && (
        <div className="empty-cart flex min-h-[400px] flex-col items-center justify-center space-y-4 py-12 text-center text-muted-foreground sm:py-16">
          <ShoppingBag className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40" />
          <h3 className="text-lg font-semibold sm:text-xl">Uw winkelwagen is leeg</h3>
          <Link href={"/"}>
            <Button type="button" onClick={() => setShowCart(false)} className="mt-6 w-full sm:w-auto sm:mt-8">
              Ga door met winkelen
            </Button>
          </Link>
        </div>
      )}

      <div className="product-container mt-4 space-y-6 overflow-auto px-2 sm:px-4 lg:px-5">
        {cartItems?.length >= 1 &&
          cartItems?.map((item) => (
            <React.Fragment key={item._id}>
              <div className="product mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8" key={item._id}>
                <Card className="bg-transparent w-full py-8 px-0 sm:w-48 sm:py-12 lg:w-60 lg:py-16">
                  <div className="relative aspect-[3/4] w-full">
                    <Image src={urlFor(item.image).url()} alt={item.name} className="object-contain" fill width={400} height={200} />
                  </div>
                </Card>
                <div className="item-desc flex w-full flex-col justify-between gap-4 text-muted-foreground sm:m-4">
                  <div className="flex justify-between gap-2">
                    <h5 className="text-base font-semibold tracking-wide sm:text-lg lg:text-xl xl:text-2xl"> {`${item.name}  ${item.volume}`} </h5>
                    <button
                      type="button"
                      className="remove-item flex-shrink-0 cursor-pointer rounded-lg border-none bg-transparent p-2 text-red-500 transition-colors hover:bg-surface/10"
                      onClick={() => onRemove(item)}
                      aria-label="Remove item"
                    >
                      <CircleX className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>

                  <div className="bottom flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="quantity w-full sm:w-auto">
                      <p className="quantity-desc flex">
                        <span
                          className="minus flex h-10 w-10 items-center justify-center border border-muted-foreground/40 text-center text-red-700 transition-colors hover:cursor-pointer hover:bg-surface/10 sm:h-12 sm:w-12"
                          onClick={() => toggleCartItemQuantity(item._id, "dec")}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </span>
                        <span className="num flex h-10 w-16 items-center justify-center border-y border-muted-foreground/40 text-center sm:h-12">
                          {item.quantity}
                        </span>
                        <span
                          className="plus flex h-10 w-10 items-center justify-center border border-muted-foreground/40 text-center text-green-700 transition-colors hover:cursor-pointer hover:bg-surface/10 sm:h-12 sm:w-12"
                          onClick={() => toggleCartItemQuantity(item._id, "inc")}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </p>
                    </div>

                    <div className="flex w-full flex-col items-end justify-end space-y-2 sm:w-auto sm:px-2">
                      <h4 className="text-2xl font-semibold tracking-wide sm:text-3xl">€ {formatNumberWithCommaDecimalSeparator(item.price)}</h4>
                      <h4 className="text-right text-xs font-light text-text-secondary">
                        € {formatNumberWithCommaDecimalSeparator(item.price * item.quantityInBox)} per doos
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <HorizontalRule />
            </React.Fragment>
          ))}
      </div>

      {cartItems?.length >= 1 && <Checkout />}
    </div>
  );
};

export default ShoppingCart;