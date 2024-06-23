"use server";

import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";

export default async function Promotions({ products }: { products: Product[] }) {
  // Check if products array is empty
  const isEmpty = !products;
  const fetchedProducts = await fetchProducts("?type=aanbiedingen");

  return (
    <div className="flex flex-col items-center justify-center">
      <Title name={"Aanbiedingen"} cn="py-10" />
      <MaxWidthWrapper>
        {!isEmpty ? (
          <ProductList products={products} />
        ) : isEmpty && fetchedProducts ? (
          <ProductList products={fetchedProducts} />
        ) : (
          // Fallback UI when products doesnt exist
          <div className="py-5 text-center">
            <p>No promotions available.</p>
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
}
