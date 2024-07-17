"use server";

import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";

export default async function Promotions() {
  // Check if products array is empty
  const fetchedProducts = await fetchProducts("?type=aanbiedingen");
  const isEmpty = !fetchedProducts;

  return (
    <div className="flex flex-col items-center justify-center">
      <Title name={"Aanbiedingen"} cn="py-4" />
      <MaxWidthWrapper>
        {!isEmpty ? (
          <ProductList products={fetchedProducts} />
        ) : (
          // Fallback UI when products doesnt exist
          <div className="py-5 text-center">
            <p> Geen producten in de aanbieding. </p>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
