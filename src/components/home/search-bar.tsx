"use client";

import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types/product";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

interface SearchBarProps {
  products: Product[];
}

const SearchBar: React.FC<SearchBarProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (searchTerm) {
        router.push(`/search-results?product=${encodeURIComponent(searchTerm)}`); // Navigate to search results page with product query
      } else {
        router.push('/'); // Navigate to home if search term is empty
      }
    }
  };

  const handleSearchButtonClick = () => {
    if (searchTerm) {
      router.push(`/search-results?product=${encodeURIComponent(searchTerm)}`); // Navigate to search results page with product query
    } else {
      router.push('/'); // Navigate to home if search term is empty
    }
  };

  return (
    <section id="search-input" className="w-full flex justify-end items-center lg:px-10 px-2 sm:px-20">
      <Input
        type="text"
        placeholder="Zoek producten..."
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        className="w-full lg:min-w-full mr-2"
      />
      <Button
       variant="outline"
        onClick={handleSearchButtonClick} 
      >
        Search
      </Button>
    </section>
  );
};

export default SearchBar;
