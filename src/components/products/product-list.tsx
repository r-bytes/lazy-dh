"use client";

import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
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
  const [fetchedProducts, setFetchedProducts] = useState<ProductType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!products || products.length === 0);

  useEffect(() => {
    const loadProducts = async () => {
      if ((!products || products.length === 0) && slug === "home") {
        setIsLoading(true);
        try {
          const productList: ProductType[] = await fetchProductsNoStore("");
          const productListNew: ProductType[] = productList.filter((p) => p.isNew);
          setFetchedProducts(productListNew.slice(0, 4));
        } catch (error) {
          console.error("Failed to load products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
  }, [products, slug]);

  const displayedProducts = products && products.length > 0 ? products : fetchedProducts;

  if (isLoading) {
    return (
      <div className={`${cn} mx-auto my-12 flex max-w-7xl flex-wrap place-items-center items-center justify-center gap-8`}>
        <ProductSkeleton />;
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
