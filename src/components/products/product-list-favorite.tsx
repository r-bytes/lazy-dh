"use client";

import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import Product from "@/lib/types/product";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { CardDescription } from "../ui/card";

export default function Favorites({ favoriteProducts, loading }: { favoriteProducts: Product[]; loading: boolean }) {
  const [isLoading, setIsLoading] = useState<boolean>(loading);
  const [color, setColor] = useState("#facc15");
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>(favoriteProducts);
  const { data: session } = useSession();

  useEffect(() => {
    setFetchedProducts(favoriteProducts);
    setIsLoading(loading);
  }, [favoriteProducts, loading]);

  const handleRemoveFavorite = (productId: string) => {
    setFetchedProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
  };

  return (
    <MaxWidthWrapper className="mx-auto flex flex-col items-center justify-center">
      <Title name="Favorieten" cn="text-4xl md:text-5xl mt-12 mb-0" />
      {fetchedProducts.length > 0 && !isLoading && <CardDescription className="mt-[-1rem] md:text-base">Je favoriete producten</CardDescription>}
      {isLoading ? (
        <div className="my-32">
          <BeatLoader color={color} loading={isLoading} size={20} aria-label="Loading Spinner" />
        </div>
      ) : fetchedProducts.length > 0 ? (
        <ProductList products={fetchedProducts} onRemoveFavorite={handleRemoveFavorite} />
      ) : (
        <div className="py-5 text-center">
          <p className="mt-24">Geen favoriete producten</p>
        </div>
      )}
    </MaxWidthWrapper>
  );
}
