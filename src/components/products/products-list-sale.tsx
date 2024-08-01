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

  // Check if products prop is empty
  const isEmpty = !products;

  useEffect(() => {
    // Check if products already exist, else we fetch them
    if (isEmpty) {
      (async () => {
        setIsLoading(true);
        // Fetch new products if they don't exist
        const newProducts = await fetchProducts("?type=aanbiedingen").then();
        setFetchedProducts(newProducts);

        setIsLoading(false);
      })();
    }
  }, [isEmpty]);

  return (
    <MaxWidthWrapper className="mx-auto flex flex-col items-center justify-center">
      <Title name={"Aanbiedingen"} cn="text-4xl md:text-5xl mt-12" />
      <CardDescription className="md:text-base"> Producten in de aanbieding </CardDescription>
      {!isEmpty ? (
        <ProductList products={products} />
      ) : fetchedProducts.length > 0 ? (
        <ProductList products={fetchedProducts} />
      ) : isLoading ? (
        <div className="py-5 text-center">
          <p> Laden ... </p>
        </div>
      ) : !fetchProducts && !isLoading ? (
        // Fallback UI when there are no products in sale
        <div className="py-5 text-center">
          <p> Geen producten in de aanbieding </p>
        </div>
      ) : null}
    </MaxWidthWrapper>
  );
}
