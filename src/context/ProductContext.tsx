"use client";

import { validateRequest } from "@/lib/db/auth";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import { User } from "lucia";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type ContextProps = {
  productState: Product[] | null;
  setProductState: (products: Product[]) => void;
};

export const ProductContext = createContext<ContextProps>({
  productState: null,
  setProductState: () => {},
});

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [productState, setProductState] = useState<Product[] | null>(null);

  useEffect(() => {
    (async () => {
      const fetchedProducts = await fetchProducts();

      if (fetchedProducts) {
        setProductState(fetchedProducts);
      }
    })();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        productState,
        setProductState,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
