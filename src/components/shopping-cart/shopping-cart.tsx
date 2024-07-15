import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { CircleX, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { urlFor } from "../../../sanity";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Title from "../ui/title";
import React from "react";

const ShoppingCart = () => {
  // Hooks
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove, incQty } = useCartContext();
  const { user } = useAuthContext();

  // Functions
  const handleCheckout = async () => {
    toast.loading("Redirecting...");
    // Fetch user ID by email
    const userIdResponse = await fetch("/api/getUserIdByEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user?.email }), // Assuming user.email contains the user's email
    });

    if (!userIdResponse.ok) {
      toast.dismiss();
      toast.error("Failed to fetch user ID");
      return;
    }

    const { success, userId } = await userIdResponse.json();

    if (!success) {
      toast.dismiss();
      toast.error("User not found");
      return;
    }
    

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cartItems,
          totalPrice,
        }),
      });

      const data = await response.json();
      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
        // Optioneel: redirect naar een bevestigingspagina
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Er is iets misgegaan");
    }
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
            <React.Fragment key={item._id}>
              <div className="product mx-auto flex max-w-7xl gap-8" key={item._id}>
                {/* <img src={urlFor(item?.image[0])} alt="" className="cart-product-image" /> */}
                <Card className="bg-transparent p-3 px-0">
                  <Image src={urlFor(item.image).url()} alt="" width={200} height={200} />
                </Card>
                <div className="item-desc m-4 flex w-full flex-col justify-between text-muted-foreground">
                  <div className="flex justify-between">
                    <h5 className="text-lg font-semibold tracking-wide sm:text-2xl"> {`${item.name}  ${item.volume}`} </h5>
                    <h4 className="text-lg font-semibold tracking-wide"> € {item.price * item.quantityInBox} </h4>
                  </div>
                  <div className="bottom mt-8 flex items-center justify-between">
                    <div className="quantity">
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
            </React.Fragment>
          ))}
      </div>

      {cartItems.length >= 1 && (
        <div className="mx-auto mt-[-80px] w-full max-w-7xl p-8">
          <div className="flex justify-between">
            <h3> Totaal: </h3>
            <h3> € {totalPrice} </h3>
          </div>
          <div className="mx-auto mt-16 flex w-full items-center justify-center">
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
