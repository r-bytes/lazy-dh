"use client";
import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import { useEffect, useState } from "react";
import { CardDescription } from "../ui/card";

export default function Promotions({ products }: { products?: Product[] }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch new products if they don't exist
    if (!products || products.length === 0) {
      setIsLoading(true);
      fetchProducts("?type=aanbiedingen")
        .then(setFetchedProducts)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [products]);

  // Determine the list of products to render
  const productsToRender = products && products.length > 0 ? products : fetchedProducts;

  return (
    <MaxWidthWrapper className="mx-auto flex flex-col items-center justify-center">
      <Title name="Aanbiedingen" cn="text-4xl md:text-5xl mt-12" />
      <CardDescription className="md:text-base">Producten in de aanbieding</CardDescription>
      {isLoading ? (
        <div className="py-5 text-center">
          <p>Laden...</p>
        </div>
      ) : productsToRender.length > 0 ? (
        <ProductList products={productsToRender} />
      ) : (
        <div className="py-5 text-center">
          <p>Geen producten in de aanbieding</p>
        </div>
      )}
    </MaxWidthWrapper>
  );
}
