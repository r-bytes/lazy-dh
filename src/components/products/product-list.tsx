"use client";

import { Product as ProductType } from "@/lib/types/product";
import { FC, useEffect, useState } from "react";
import Product from "./product";
import ProductSkeleton from "./product-skeleton";

interface ProductListProps {
  products?: ProductType[] | null;
  slug?: string;
  cn?: string;
  onRemoveFavorite?: (productId: string) => void;
}

const ProductList: FC<ProductListProps> = ({ products, slug, onRemoveFavorite, cn }) => {
  const [filteredProducts, setFilteredProducts] = useState<ProductType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (slug === "home" && products) {
      try {
        const productListNew: ProductType[] = products.filter((p) => p.isNew);
        setFilteredProducts(productListNew.slice(0, 4));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [products, slug]);

  const displayedProducts = products && slug !== "home" && products.length > 0 ? products : filteredProducts;

  if (isLoading && slug === "home") {
    return (
      <div className={`${cn} mx-auto my-12 flex max-w-7xl flex-wrap place-items-center items-center justify-center gap-8`}>
        <ProductSkeleton />
      </div>
    );
  }

  return (
    <div className={`${cn} mx-auto my-12 flex max-w-7xl flex-wrap place-items-center items-center justify-center gap-8`}>
      {displayedProducts?.map((product) => <Product key={product._id} product={product} onRemoveFavorite={onRemoveFavorite} />)}
    </div>
  );
};

export default ProductList;
