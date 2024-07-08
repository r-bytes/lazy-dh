"use client";

import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import React, { createContext, useContext, useEffect, useState } from "react";

type ContextProps = {
  productState: Product[] | null;
  setProductState: (products: Product[]) => void;
  filteredProducts: Product[] | null;
  setFilteredProducts: (products: Product[]) => void;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductContext = createContext<ContextProps>({
  productState: null,
  setProductState: () => {},
  filteredProducts: null,
  setFilteredProducts: () => {},
  isSearching: false,
  setIsSearching: () => false,
});

export const ProductProvider = ({ children, type }: { children: React.ReactNode; type: string }) => {
  const [productState, setProductState] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    (async () => {
      const fetchedProducts = await fetchProducts(type);

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
        filteredProducts,
        setFilteredProducts,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
