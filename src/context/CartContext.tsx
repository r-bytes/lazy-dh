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
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    removeZeroQuantityItems();
  }, []);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalQuantities, setTotalQuantities] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);

  let foundProduct: Product | undefined;
  let index: number;

  const removeZeroQuantityItems = () => {
    const filteredItems = cartItems.filter((item) => item.quantity !== 0);
    setCartItems(filteredItems); // Update the state with the filtered items
  };

  const onAdd = (product: Product, quantity: number) => {
    const checkProductInCard = cartItems.find((item) => item._id === product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity * product.quantityInBox);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCard) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantityInBox + quantity, // Ensure updated quantity is included
          };
        }
        return cartProduct; // Explicitly return the original cartProduct if no update is needed
      });

      setCartItems(updatedCartItems);
    } else {
      const newProduct = { ...product, quantity }; // Create a copy of the product with updated quantity
      setCartItems((prevCartItems) => [...prevCartItems, newProduct]); // Add the new product to the cart while preserving existing ones
    }

    toast.success(`${quantity} ${product.name} toegevoegd aan de winkelwagen.`);
  };

  const onRemove = (product: Product) => {
    foundProduct = cartItems.find((item: Product) => item._id === product._id);
    const newCartItems = cartItems.filter((item: Product) => item._id !== product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct!.price * foundProduct!.quantityInBox);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct!.quantityInBox);
    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id: number | string, value: "inc" | "dec") => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);

    const newCartItems = cartItems.filter((item) => item._id !== id);

    if (value === "inc" && foundProduct) {
      setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct!.price * foundProduct!.quantityInBox);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec" && foundProduct) {
      if (foundProduct.quantityInBox > 1) {
        setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct!.price * foundProduct!.quantityInBox);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <CartContext.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
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
