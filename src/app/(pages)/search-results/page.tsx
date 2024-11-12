"use client"

import ProductList from "@/components/products/product-list";
import ProductSkeleton from "@/components/products/product-skeleton";
import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Product } from "@/lib/types/product";
import { useEffect, useState } from "react";

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchResults = ({ searchParams }: SearchResultsProps) => {
  const product = searchParams.product; // Get the product query from searchParams
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (product) {
        const allProducts = await fetchProducts();
        const filteredProducts = allProducts.filter((productItem: Product) =>
          typeof productItem.name === 'string' && productItem.name.toLowerCase().includes((product as string).toLowerCase())
        );
        setProducts(filteredProducts);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [product]);

  return (
    <main className="flex flex-col items-center justify-between bg-background">
      <section id="search-results" className="w-full max-w-7xl my-20">
        <Card className="mx-2 px-4 sm:mx-20 md:px-16 xl:mx-12 min-h-full">
          <div className="mt-2 flex flex-col items-center justify-center md:mt-32">
            <Title name={`Zoekresultaten voor "${product}"`} cn="text-4xl sm:text-4xl mt-16 md:mt-[-2rem]" />
            {isLoading ? (
              <ProductSkeleton />
            ) : (
              products.length > 0 ? (
                <ProductList slug={"search"} products={products} />
              ) : (
                <p className="text-center text-lg text-muted-foreground mb-20">Er zijn geen resultaten gevonden.</p>
              )
            )}
          </div>
        </Card>
      </section>
    </main>
  );
};

export default SearchResults;

