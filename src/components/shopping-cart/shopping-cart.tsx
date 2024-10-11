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

  const HorizontalRule = () => <hr className="my-12" />;

  return (
    <div className="my-24">
      <Title name="Winkelwagen" />
      {cartItems?.length < 1 && (
        <div className="empty-cart m-10 flex h-96 flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
          <ShoppingBag size={150} />
          <h3> Uw winkelwagen is leeg </h3>
          <Link href={"/"}>
            <Button type="button" onClick={() => setShowCart(false)} className="mt-16">
              Ga door met winkelen
            </Button>
          </Link>
        </div>
      )}

      <div className="product-container mt-4 overflow-auto p-5">
        {cartItems?.length >= 1 &&
          cartItems?.map((item) => (
            <React.Fragment key={item._id}>
              <div className="product mx-auto flex max-w-7xl gap-8" key={item._id}>
                <Card className="bg-transparent py-16 px-0 w-60">
                  <Image src={urlFor(item.image).url()} alt={item.name} className="h-full w-full" width={400} height={200} />
                </Card>
                <div className="item-desc m-4 flex w-full flex-col justify-between text-muted-foreground">
                  <div className="flex justify-between">
                    <h5 className="text-lg font-semibold tracking-wide sm:text-2xl"> {`${item.name}  ${item.volume}`} </h5>
                    <button
                      type="button"
                      className="remove-item ml-4 cursor-pointer border-none bg-transparent text-xl text-red-500 hover:bg-transparent hover:text-xl"
                      onClick={() => onRemove(item)}
                    >
                      <CircleX />
                    </button>
                  </div>

                  <div className="bottom mt-8 flex flex-col items-center justify-between sm:flex-row">
                    <div className="quantity order-2 pt-8 sm:order-1 sm:pt-0">
                      <p className="quantity-desc flex">
                        <span
                          className="minus flex w-12 items-center justify-center border border-muted-foreground/40 text-center text-red-700 hover:cursor-pointer"
                          onClick={() => toggleCartItemQuantity(item._id, "dec")}
                        >
                          <Minus />
                        </span>
                        <span className="num flex h-8 w-16 items-center justify-center border border-muted-foreground/40 text-center ">
                          {item.quantity}
                        </span>
                        <span
                          className="plus flex w-12 items-center justify-center border border-muted-foreground/40 text-center text-green-700 hover:cursor-pointer"
                          onClick={() => toggleCartItemQuantity(item._id, "inc")}
                        >
                          <Plus />
                        </span>
                      </p>
                    </div>

                    <div className="order-1 flex w-44 flex-col items-end justify-end space-y-2 px-2 pt-6 sm:px-0 sm:pt-2 md:order-2">
                      <h4 className="text-3xl font-semibold tracking-wide">€ {formatNumberWithCommaDecimalSeparator(item.price)}</h4>
                      <h4 className="text-tertiary flex-1 text-right text-xs font-light">
                        € {formatNumberWithCommaDecimalSeparator(item.price * item.quantityInBox)}
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