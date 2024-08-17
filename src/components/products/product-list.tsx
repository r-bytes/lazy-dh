"use client"

import { useEffect, useState } from "react";
import { Product as ProductType } from "@/lib/types/product";
import Product from "./product";
import { FC } from "react";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";

interface ProductListProps {
  products?: ProductType[] | null;
  slug?: string;
  cn?: string;
  onRemoveFavorite?: (productId: string) => void;
}

const ProductList: FC<ProductListProps> = ({ products, slug, onRemoveFavorite, cn }) => {
  const [fetchedProducts, setFetchedProducts] = useState<ProductType[] | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      if ((!products || products.length === 0) && slug === "home") {
        const productList: ProductType[] = await fetchProductsNoStore("");
        const productListNew: ProductType[] = productList.filter((p) => p.isNew);
        setFetchedProducts(productListNew.slice(0, 4));
      }
    };

    loadProducts();
  }, [products, slug]);

  const displayedProducts = products && products.length > 0 ? products : fetchedProducts;

  return (
    <div className={`${cn} mx-auto my-24 flex max-w-7xl flex-wrap place-items-center items-center justify-center gap-8 `}>
      {displayedProducts?.map((product) => <Product key={product._id} product={product} onRemoveFavorite={onRemoveFavorite} />)}
    </div>
  );
};

export default ProductList;
