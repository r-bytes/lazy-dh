"use client"

import Header from "@/components/navigation/header";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Product } from "@/lib/types/product";
import { debounce } from "@/lib/utils";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Note: This is a client component, metadata should be handled via parent or dynamic metadata

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchResults = ({ searchParams }: SearchResultsProps) => {
  const product = searchParams.product; // Get the product query from searchParams
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (product) {
      setIsLoading(true); // Start loading
      const allProducts = await fetchProducts();
      const filteredProducts = allProducts.filter((productItem: Product) =>
        typeof productItem.name === 'string' && productItem.name.toLowerCase().includes((product as string).toLowerCase())
      );
      setProducts(filteredProducts);
      setIsLoading(false); // End loading
    } else {
      setProducts([]); // Clear products if no product is specified
      setIsLoading(false); // End loading
    }
  }, [product]);

  const debouncedFetchData = useCallback(debounce(fetchData, 300), [fetchData]);

  useEffect(() => {
    debouncedFetchData();
  }, [product, debouncedFetchData]);

  const searchTerm = typeof product === 'string' ? product : '';

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <SectionHeader
          badge="Zoekresultaten"
          badgeIcon={<Search className="h-4 w-4" />}
          title={searchTerm ? `Zoekresultaten voor "${searchTerm}"` : "Zoekresultaten"}
          description={searchTerm ? `Gevonden ${products.length} resultaat${products.length !== 1 ? 'en' : ''} voor "${searchTerm}"` : "Voer een zoekterm in om te beginnen"}
        />
        <ProductGrid products={products} loading={isLoading} />
      </Section>
    </>
  );
};

export default SearchResults;

