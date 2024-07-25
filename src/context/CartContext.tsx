"use client";

import Product from "@/lib/types/product";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type ContextProps = {
  showCart: boolean;
  cartItems: Product[];
  totalPrice: number;
  totalQuantities: number;
  qty: number;
  setQty: (value: React.SetStateAction<number>) => void;
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: Product, quantity: number) => void;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCartItemQuantity: (id: number | string, value: "inc" | "dec") => void;
  onRemove: (product: Product) => void;
  setCartItems: (value: React.SetStateAction<Product[]>) => void;
  setTotalQuantities: (value: React.SetStateAction<number>) => void;
  setTotalPrice: (value: React.SetStateAction<number>) => void;
};

export const CartContext = createContext<ContextProps>({
  showCart: false,
  cartItems: [],
  totalPrice: 0,
  totalQuantities: 0,
  qty: 0,
  setQty: () => {},
  incQty: () => {},
  decQty: () => {},
  onAdd: () => {},
  setShowCart: () => {},
  toggleCartItemQuantity: () => {},
  onRemove: () => {},
  setCartItems: () => {},
  setTotalQuantities: () => {},
  setTotalPrice: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  let foundProduct: Product | undefined;

  const [showCart, setShowCart] = useState<boolean>(false);

  const [qty, setQty] = useState<number>(0);
  const [cartItems, setCartItems] = useState<Product[] | []>([]);
  const [totalQuantities, setTotalQuantities] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const storedCartData = window.localStorage.getItem("spacejelly_cart");
    if (storedCartData && JSON.parse(storedCartData).cartItems.length > 0) {
      const parsedData = JSON.parse(storedCartData);

      setCartItems(parsedData.cartItems);
      setTotalQuantities(parsedData.totalQuantities);
      setTotalPrice(parsedData.totalPrice);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("spacejelly_cart", JSON.stringify({ cartItems, totalQuantities, totalPrice }));
  }, [cartItems, totalQuantities, totalPrice]);

  const onAdd = (product: Product, quantity: number) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity * product.quantityInBox);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) =>
        cartProduct._id === product._id ? { ...cartProduct, quantity: cartProduct.quantity + quantity } : cartProduct
      );
      setCartItems(updatedCartItems);
    } else {
      const newProduct = { ...product, quantity };
      setCartItems((prevCartItems) => [...prevCartItems, newProduct]);
    }

    toast.success(`${quantity} box(es) of ${product.name} added to the cart.`);
  };

  const onRemove = (product: Product) => {
    const foundProduct = cartItems.find((item) => item._id === product._id);
    if (foundProduct) {
      const newCartItems = cartItems.filter((item) => item._id !== product._id);
      setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity * foundProduct.quantityInBox);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
      setCartItems(newCartItems);
    }
  };

  const toggleCartItemQuantity = (id: number | string, value: "inc" | "dec") => {
    const foundProduct = cartItems.find((item) => item._id === id);
    if (foundProduct) {
      const updatedQuantity = value === "inc" ? foundProduct.quantity + 1 : Math.max(foundProduct.quantity - 1, 0);
      const newCartItems = cartItems.map((item) => (item._id === id ? { ...item, quantity: updatedQuantity } : item));
      setCartItems(newCartItems);
      setTotalPrice(
        (prevTotalPrice) =>
          prevTotalPrice + (value === "inc" ? foundProduct.price * foundProduct.quantityInBox : -foundProduct.price * foundProduct.quantityInBox)
      );
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + (value === "inc" ? 1 : -1));
    }
  };

  const incQty = () => setQty((prevQty) => prevQty + 1);
  const decQty = () => setQty((prevQty) => Math.max(prevQty - 1, 1));

  return (
    <CartContext.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        setQty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalQuantities,
        setTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
