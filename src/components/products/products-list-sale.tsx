"use client"
import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import { useEffect, useState } from "react";

export default function Promotions({ products }: { products?: Product[] }) {
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  
  // Check if products prop is empty
  const isEmpty = !products;

  useEffect(() => {
    // Check if products already exist, else we fetch them
    if (isEmpty) {
      (async () => {
        // Fetch new products if they don't exist
        const newProducts = await fetchProducts("?type=aanbiedingen").then()
        setFetchedProducts(newProducts);
      })()
    }
  }, [isEmpty]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Title name={"Aanbiedingen"} cn="py-4" />
      <MaxWidthWrapper>
        {!isEmpty ? (
          <ProductList products={products} />
        ) : fetchedProducts.length > 0 ? (
          <ProductList products={fetchedProducts} />
        ) : (
          // Fallback UI when there are no products in sale
          <div className="py-5 text-center">
            <p> Geen producten in de aanbieding. </p>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
