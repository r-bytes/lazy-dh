"use client";

import { useCartContext } from "@/context/CartContext";
import { Product } from "@/lib/types/product";
import { navigateTo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface UseCartReturn {
  addToCart: (quantity?: number) => void;
  goToCheckout: (quantity?: number) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
}

export function useCart(product: Product): UseCartReturn {
  const router = useRouter();
  const { onAdd, setQty, qty, incQty, decQty, setShowCart } = useCartContext();

  const addToCart = useCallback(
    (quantity: number = 1) => {
      onAdd(product, quantity);
      setShowCart(false);
      setQty(1);
    },
    [product, onAdd, setShowCart, setQty]
  );

  const goToCheckout = useCallback(
    (quantity: number = 1) => {
      onAdd(product, quantity);
      navigateTo(router, "/winkelwagen");
    },
    [product, onAdd, router]
  );

  const setQuantity = useCallback(
    (value: number) => {
      setQty(Math.max(1, value));
    },
    [setQty]
  );

  const incrementQuantity = useCallback(() => {
    incQty();
  }, [incQty]);

  const decrementQuantity = useCallback(() => {
    decQty();
  }, [decQty]);

  return {
    addToCart,
    goToCheckout,
    quantity: qty,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
  };
}

