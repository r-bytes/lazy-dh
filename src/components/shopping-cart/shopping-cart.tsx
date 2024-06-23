import { useCartContext } from "@/context/CartContext";
import { CircleX, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Title from "../ui/title";
import { useEffect } from "react";
import { urlFor } from "../../../sanity";

const ShoppingCart = () => {
  // Hooks
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove, incQty } = useCartContext();

  // Functions
  const handleCheckout = async () => {
    toast.loading("Redirecting...");
  };

  const HorizontalRule = () => <hr className="my-12" />;  

  return (
    <div className="mt-24">
      <Title name="Winkelwagen" />
      {cartItems.length < 1 && (
        <div className="empty-cart m-10 flex h-96 flex-col items-center justify-center space-y-4 text-center">
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
        {cartItems.length >= 1 &&
          cartItems.map((item) => (
            <>
              <div className="product mx-auto flex max-w-7xl gap-8" key={item._id}>
                {/* <img src={urlFor(item?.image[0])} alt="" className="cart-product-image" /> */}
                <Card className="bg-transparent p-3 px-0">
                  <Image src={urlFor(item.image).url()} alt="" width={200} height={200} />
                </Card>
                <div className="item-desc m-4 flex w-full flex-col justify-between text-muted-foreground">
                  <div className="flex justify-between">
                    <h5 className="text-lg font-semibold tracking-wide sm:text-2xl"> {item.name} </h5>
                    <h4 className="text-lg font-semibold tracking-wide"> € {item.price} </h4>
                  </div>
                  <div className="bottom mt-8 flex items-center justify-between">
                    <div className="quantity">
                      <p className="quantity-desc flex">
                        <span
                          className="minus flex w-12 items-center justify-center border border-muted-foreground/40 text-center text-red-700"
                          onClick={() => toggleCartItemQuantity(item._id, "dec")}
                        >
                          <Minus />
                        </span>
                        <span className="num flex h-8 w-16 items-center justify-center border border-muted-foreground/40 text-center ">
                          {item.quantity}
                        </span>
                        <span
                          className="plus flex w-12 items-center justify-center border border-muted-foreground/40 text-center text-green-700"
                          onClick={() => toggleCartItemQuantity(item._id, "inc")}
                        >
                          <Plus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item ml-4 cursor-pointer border-none bg-transparent text-xl text-red-500 hover:bg-transparent hover:text-xl"
                      onClick={() => onRemove(item)}
                    >
                      <CircleX />
                    </button>
                  </div>
                </div>
              </div>
              <HorizontalRule />
            </>
          ))}
      </div>

      {cartItems.length >= 1 && (
        <div className="mt-[-80px] mx-auto w-full max-w-7xl p-8">
          <div className="flex justify-between">
            <h3> Totaal: </h3>
            <h3> € {totalPrice} </h3>
          </div>
          <div className="mx-auto w-full mt-16 flex justify-center items-center">
            <Button type="button" className="btn" onClick={handleCheckout}>
              Bestelling Plaatsen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
