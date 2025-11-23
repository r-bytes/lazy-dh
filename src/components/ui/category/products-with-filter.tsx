"use client";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Card, CardHeader } from "@/components/ui/card";
import { ProductSearch } from "@/components/ui/product-search";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import Title from "../title";

type CardProps = React.ComponentProps<typeof Card>;
interface ProductsWithFilterProps extends Omit<CardProps, "children"> {
  products: Product[];
}

export const ProductsWithFilter: React.FC<ProductsWithFilterProps> = ({ className, products, ...props }) => {
  const { query, filteredProducts, isSearching } = useProductSearch({
    products,
    maxSuggestions: 5,
    minChars: 2,
  });

  // For display, show all products when not searching, filtered when searching
  const displayProducts = useMemo(() => {
    return isSearching ? filteredProducts : products;
  }, [isSearching, filteredProducts, products]);

  return (
    <>
      <Card className={cn("w-full", className)} {...props}>
        <CardHeader className="mb-4 text-center">
          <Title name="Alle Producten" cn="mt-12 text-muted-foreground" />
        </CardHeader>
        {/* Search bar */}
        <div className="px-4 py-8">
          <ProductSearch products={products} variant="standalone" navigateOnSubmit={false} />
        </div>
        <div className="px-4 py-8">
          <ProductGrid products={displayProducts} />
        </div>
      </Card>
    </>
  );
};
