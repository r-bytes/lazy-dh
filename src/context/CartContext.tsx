"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Product from "@/lib/types/product";

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
  toggleCartItemQuantity: (id: string, value: "inc" | "dec") => void;
  onRemove: (id: string) => void;
  setCartItems: (value: React.SetStateAction<Product[]>) => void;
  setTotalQuantities: (value: React.SetStateAction<number>) => void;
  setTotalPrice: (value: React.SetStateAction<number>) => void;
};

export const CartContext = createContext<ContextProps>(null!);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const storedCart = typeof window !== "undefined" ? localStorage.getItem("spacejelly_cart") : null;
    if (storedCart) {
      const cartData = JSON.parse(storedCart);
      setCartItems(cartData.cartItems);
      setTotalPrice(cartData.totalPrice);
      setTotalQuantities(cartData.totalQuantities);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spacejelly_cart", JSON.stringify({ cartItems, totalPrice, totalQuantities }));
    }
  }, [cartItems, totalPrice, totalQuantities]);

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => (prevQty > 1 ? prevQty - 1 : 1));
  };

  const onAdd = (product: Product, quantity: number) => {
    const existingProduct = cartItems.find((item) => item._id === product._id);
    if (existingProduct) {
      setCartItems(cartItems.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item)));
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    setTotalPrice((prev) => prev + product.price * quantity);
    setTotalQuantities((prev) => prev + quantity);
    toast.success(`${quantity} ${product.name} added to cart.`);
  };

  const onRemove = (id: string) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCartItems);
    const removedItem = cartItems.find((item) => item._id === id);
    if (removedItem) {
      setTotalPrice((prev) => prev - removedItem.price * removedItem.quantity);
      setTotalQuantities((prev) => prev - removedItem.quantity);
    }
  };

  const toggleCartItemQuantity = (id: string, value: "inc" | "dec") => {
    const product = cartItems.find((item) => item._id === id);
    if (product) {
      if (value === "inc") {
        setCartItems(cartItems.map((item) => (item._id === id ? { ...item, quantity: item.quantity + 1 } : item)));
        setTotalQuantities(totalQuantities + 1);
        setTotalPrice(totalPrice + product.price);
      } else if (value === "dec" && product.quantity > 1) {
        setCartItems(cartItems.map((item) => (item._id === id ? { ...item, quantity: item.quantity - 1 } : item)));
        setTotalQuantities(totalQuantities - 1);
        setTotalPrice(totalPrice - product.price);
      }
    }
  };

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
