"use client";

import ProductList from "@/components/products/product-list";
import { Card, CardHeader } from "@/components/ui/card";
import { useProductContext } from "@/context/ProductContext";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import React from "react";
import Title from "../title";
import { InputForm } from "./search-input";

type CardProps = React.ComponentProps<typeof Card>;
interface ProductsWithFilterProps extends Omit<CardProps, "children"> {
  products: Product[];
}

export const ProductsWithFilter: React.FC<ProductsWithFilterProps> = ({ className, products, ...props }) => {
  const { filteredProducts, setFilteredProducts, isSearching } = useProductContext();

  const handleRemoveFavorite = (productId: string) => {
    console.log(`Remove favorite: ${productId}`);
  };

  return (
    <>
      <Card className={cn("w-full", className)} {...props}>
        <CardHeader className="mb-4 text-center">
          <Title name="Alle Producten" cn="mt-12 text-muted-foreground" />
        </CardHeader>
        {/* Search bar */}
        <InputForm products={products} onSearchChange={setFilteredProducts} />
        {isSearching ? (
          <ProductList products={filteredProducts} onRemoveFavorite={handleRemoveFavorite} />
        ) : (
          <ProductList products={products} onRemoveFavorite={handleRemoveFavorite} />
        )}
      </Card>
    </>
  );
};
