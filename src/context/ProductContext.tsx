"use client";

import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import Product from "@/lib/types/product";
import React, { createContext, useContext, useEffect, useState } from "react";

type ContextProps = {
  productState: Product[] | null;
  setProductState: (products: Product[]) => void;
  categoryState: Category[] | null;
  setCategoryState: (categories: Category[]) => void;
  filteredProducts: Product[] | null;
  setFilteredProducts: (products: Product[]) => void;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductContext = createContext<ContextProps>({
  productState: null,
  setProductState: () => {},
  categoryState: null,
  setCategoryState: () => {},
  filteredProducts: null,
  setFilteredProducts: () => {},
  isSearching: false,
  setIsSearching: () => false,
});

export const ProductProvider = ({ children, type }: { children: React.ReactNode; type: string }) => {
  const [productState, setProductState] = useState<Product[]>([]);
  const [categoryState, setCategoryState] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    (async () => {
      const fetchedProducts = await fetchProducts(type);
      const fetchedCategories = await fetchCategories();

      if (fetchedProducts) {
        // Log to verify fields are present
        if (fetchedProducts.length > 0) {
          console.log('ProductContext - Sample product:', {
            _id: fetchedProducts[0]._id,
            name: fetchedProducts[0].name,
            tray: fetchedProducts[0].tray,
            statiegeld: fetchedProducts[0].statiegeld,
            fullProduct: fetchedProducts[0]
          });
        }
        setProductState(fetchedProducts);
      }

      if (fetchedCategories) {
        setCategoryState(fetchedCategories);
      }
    })();
  }, [type]);

  return (
    <ProductContext.Provider
      value={{
        productState,
        setProductState,
        categoryState,
        setCategoryState,
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
