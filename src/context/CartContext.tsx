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
  emptyCartItems(): void;
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
  emptyCartItems: () => {},
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
    if (!product.inStock) {
      toast.error(`${product.name} is niet op voorraad`);
      return;
    }
    
    // Determine if product is sold per box or per bottle
    // Logic: 
    // - If quantityInBox > 1: always per box (doos/dozen)
    // - If quantityInBox === 1 or not set:
    //   - If (land === "Anders" OR land is empty): per bottle (fles/flessen)
    //   - Otherwise: per box (doos/dozen)
    const isSoldPerBox = product.quantityInBox > 1 || (product.land !== "Anders" && product.land);
    const unit = isSoldPerBox ? (quantity === 1 ? "doos" : "dozen") : (quantity === 1 ? "fles" : "flessen");
    
    const checkProductInCart = cartItems.find((item) => item._id === product._id);
    
    // Calculate price: 
    // - If quantityInBox > 1: always per box, so multiply by quantityInBox
    // - If quantityInBox === 1 or not set:
    //   - If "Anders" or empty land: per bottle, so price is just product.price * quantity
    //   - Otherwise: per box (but quantityInBox is 1, so price is just product.price * quantity)
    const priceMultiplier = product.quantityInBox > 1 ? product.quantityInBox : 1;
    const priceToAdd = product.price * quantity * priceMultiplier;
    setTotalPrice((prevTotalPrice) => prevTotalPrice + priceToAdd);
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

    toast.success(`${quantity} ${unit} van ${product.name} toegevoegd aan de winkelwagen`);
  };

  const onRemove = (product: Product) => {
    const foundProduct = cartItems.find((item) => item._id === product._id);
    if (foundProduct) {
      const newCartItems = cartItems.filter((item) => item._id !== product._id);
      
      // If quantityInBox > 1: always per box, so multiply by quantityInBox
      // Otherwise: per piece (quantityInBox is 1 or not set)
      const priceMultiplier = foundProduct.quantityInBox > 1 ? foundProduct.quantityInBox : 1;
      const priceToRemove = foundProduct.price * foundProduct.quantity * priceMultiplier;
      
      setTotalPrice((prevTotalPrice) => Math.max(0, prevTotalPrice - priceToRemove));
      setTotalQuantities((prevTotalQuantities) => Math.max(0, prevTotalQuantities - foundProduct.quantity));
      setCartItems(newCartItems);
      toast.success(`${foundProduct.name} verwijderd uit winkelwagen`);
    }
  };

  const toggleCartItemQuantity = (id: number | string, value: "inc" | "dec") => {
    const foundProduct = cartItems.find((item) => item._id === id);
    if (foundProduct) {
      // If quantityInBox > 1: always per box, so multiply by quantityInBox
      // Otherwise: per piece (quantityInBox is 1 or not set)
      const priceMultiplier = foundProduct.quantityInBox > 1 ? foundProduct.quantityInBox : 1;

      // If decreasing and quantity is 1 or less, remove the item
      if (value === "dec" && foundProduct.quantity <= 1) {
        const newCartItems = cartItems.filter((item) => item._id !== id);
        setCartItems(newCartItems);
        const priceToRemove = foundProduct.price * foundProduct.quantity * priceMultiplier;
        setTotalPrice((prevTotalPrice) => Math.max(0, prevTotalPrice - priceToRemove));
        setTotalQuantities((prevTotalQuantities) => Math.max(0, prevTotalQuantities - foundProduct.quantity));
        toast.success(`${foundProduct.name} verwijderd uit winkelwagen`);
        return;
      }

      // Update quantity
      const updatedQuantity = value === "inc" ? foundProduct.quantity + 1 : foundProduct.quantity - 1;
      
      // Safety check: if quantity becomes 0 or negative, remove item
      if (updatedQuantity < 1) {
        const newCartItems = cartItems.filter((item) => item._id !== id);
        setCartItems(newCartItems);
        const priceToRemove = foundProduct.price * foundProduct.quantity * priceMultiplier;
        setTotalPrice((prevTotalPrice) => Math.max(0, prevTotalPrice - priceToRemove));
        setTotalQuantities((prevTotalQuantities) => Math.max(0, prevTotalQuantities - foundProduct.quantity));
        return;
      }

      // Update quantity and prices
      const newCartItems = cartItems.map((item) => (item._id === id ? { ...item, quantity: updatedQuantity } : item));
      setCartItems(newCartItems);

      // Calculate price difference based on quantity change
      const quantityDifference = updatedQuantity - foundProduct.quantity;
      const priceDifference = foundProduct.price * quantityDifference * priceMultiplier;
      setTotalPrice((prevTotalPrice) => Math.max(0, prevTotalPrice + priceDifference));
      setTotalQuantities((prevTotalQuantities) => Math.max(0, prevTotalQuantities + quantityDifference));
    }
  };

  const incQty = () => setQty((prevQty) => prevQty + 1);
  const decQty = () => setQty((prevQty) => Math.max(prevQty - 1, 1));

  const emptyCartItems = () => {
    setCartItems([]);
    setTotalQuantities(0);
    setTotalPrice(0);

    const localStorageExists = window.localStorage.getItem("spacejelly_cart");

    if (localStorageExists) {
      window.localStorage.removeItem("spacejelly_cart");
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
        emptyCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
