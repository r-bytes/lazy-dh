"use client";

import { useState } from "react";
import { Product } from "@/lib/types/product";
import { Input } from "@/components/ui/input";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";
import ProductList from "@/components/products/product-list";

interface SearchBarProps {
  products: Product[];
}

const SearchBar: React.FC<SearchBarProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <MaxWidthWrapper className="w-screen items-end flex justify-end">
        <Input
          type="text"
          placeholder="Zoek producten..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-xs"
        />
      </MaxWidthWrapper>

      {searchResults.length > 0 ? (
        <section id="search-results" className="w-full max-w-7xl my-20">
          <Card className="mx-2 px-4 sm:mx-20 md:px-16 xl:mx-12">
            <div className="mt-2 flex flex-col items-center justify-center md:mt-32">
              <Title name="Zoekresultaten" cn="text-4xl sm:text-4xl mt-16 md:mt-[-2rem]" />
              <ProductList slug={"search"} products={searchResults} />
            </div>
          </Card>
        </section>
      ) : (
        searchTerm.length > 0 && (
          <section id="no-results" className="w-full max-w-7xl my-20">
            <Card className="mx-2 px-4 sm:mx-20 md:px-16 xl:mx-12">
              <div className="mt-2 flex flex-col items-center justify-center md:mt-32">
                <Title name="Zoekresultaten" cn="text-4xl sm:text-4xl mt-16 md:mt-[-2rem]" />
                <p className="text-center text-lg mt-8 mb-16">Geen resultaten gevonden</p>
              </div>
            </Card>
          </section>
        )
      )}
    </>
  );
};

export default SearchBar;
