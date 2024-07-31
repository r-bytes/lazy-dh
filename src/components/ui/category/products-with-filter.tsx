"use client";

import ProductList from "@/components/products/product-list";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductContext } from "@/context/ProductContext";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import React from "react";
import { InputForm } from "./search-input";

type CardProps = React.ComponentProps<typeof Card>;
interface ProductsWithFilterProps extends Omit<CardProps, "children"> {
  products: Product[];
}

export const ProductsWithFilter: React.FC<ProductsWithFilterProps> = ({ className, products, ...props }) => {
  const { filteredProducts, setFilteredProducts, isSearching } = useProductContext();

  return (
    <>
      <Card className={cn("w-full", className)} {...props}>
        <CardHeader className="mb-4 text-center">
          <CardTitle className="mt-12 text-3xl text-muted-foreground"> Alle Producten </CardTitle>
        </CardHeader>
        {/* Search bar */}
        <InputForm products={products} onSearchChange={setFilteredProducts} />
        {isSearching ? <ProductList products={filteredProducts} /> : <ProductList products={products} />}
      </Card>
    </>
  );
};
