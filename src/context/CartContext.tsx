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
    // - If (land === "Anders" OR land is empty): always per bottle (fles/flessen)
    // - If land has specific value: per box (doos/dozen)
    const isAndersProduct = product.land === "Anders" || !product.land;
    const unit = isAndersProduct ? (quantity === 1 ? "fles" : "flessen") : (quantity === 1 ? "doos" : "dozen");
    
    const checkProductInCart = cartItems.find((item) => item._id === product._id);
    
    // Calculate price: 
    // - For "Anders" products with quantityInBox > 1: price in DB is per box, but we sell per piece
    //   So price per piece = product.price / product.quantityInBox, then multiply by quantity
    // - For "Anders" products with quantityInBox === 1: price is already per piece
    // - For other products: quantity is in boxes, so multiply by quantityInBox
    let priceToAdd: number;
    if (isAndersProduct && product.quantityInBox > 1) {
      // Price per piece = price per box / quantityInBox
      const pricePerPiece = product.price / product.quantityInBox;
      priceToAdd = pricePerPiece * quantity;
    } else if (isAndersProduct) {
      // quantityInBox === 1, price is already per piece
      priceToAdd = product.price * quantity;
    } else {
      // Other products: price is per box
      priceToAdd = product.price * quantity * product.quantityInBox;
    }
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

    toast.success(`${quantity} ${product.name} toegevoegd aan de winkelwagen`);
  };

  const onRemove = (product: Product) => {
    const foundProduct = cartItems.find((item) => item._id === product._id);
    if (foundProduct) {
      const newCartItems = cartItems.filter((item) => item._id !== product._id);
      const isAndersProduct = foundProduct.land === "Anders" || !foundProduct.land;
      
      let priceToRemove: number;
      if (isAndersProduct && foundProduct.quantityInBox > 1) {
        const pricePerPiece = foundProduct.price / foundProduct.quantityInBox;
        priceToRemove = pricePerPiece * foundProduct.quantity;
      } else if (isAndersProduct) {
        priceToRemove = foundProduct.price * foundProduct.quantity;
      } else {
        priceToRemove = foundProduct.price * foundProduct.quantity * foundProduct.quantityInBox;
      }
      
      setTotalPrice((prevTotalPrice) => prevTotalPrice - priceToRemove);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
      setCartItems(newCartItems);
      toast.success(`${foundProduct.name} verwijderd uit winkelwagen`);
    }
  };

  const toggleCartItemQuantity = (id: number | string, value: "inc" | "dec") => {
    const foundProduct = cartItems.find((item) => item._id === id);
    if (foundProduct) {
      const updatedQuantity = value === "inc" ? foundProduct.quantity + 1 : Math.max(foundProduct.quantity - 1, 0);
      const isAndersProduct = foundProduct.land === "Anders" || !foundProduct.land;

      // Calculate price per unit
      let pricePerUnit: number;
      if (isAndersProduct && foundProduct.quantityInBox > 1) {
        pricePerUnit = foundProduct.price / foundProduct.quantityInBox;
      } else if (isAndersProduct) {
        pricePerUnit = foundProduct.price;
      } else {
        pricePerUnit = foundProduct.price * foundProduct.quantityInBox;
      }

      // If quantity becomes 0, remove the item from cart
      if (updatedQuantity === 0) {
        const newCartItems = cartItems.filter((item) => item._id === id);
        setCartItems(newCartItems);
        const priceToRemove = pricePerUnit * foundProduct.quantity;
        setTotalPrice((prevTotalPrice) => prevTotalPrice - priceToRemove);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        toast.success(`${foundProduct.name} verwijderd uit winkelwagen`);
      } else {
        // Update quantity and prices
        const newCartItems = cartItems.map((item) => (item._id === id ? { ...item, quantity: updatedQuantity } : item));
        setCartItems(newCartItems);

        // Calculate price difference based on quantity change
        const quantityDifference = updatedQuantity - foundProduct.quantity;
        const priceDifference = pricePerUnit * quantityDifference;
        setTotalPrice((prevTotalPrice) => prevTotalPrice + priceDifference);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantityDifference);
      }
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
