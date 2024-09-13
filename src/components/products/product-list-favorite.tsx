"use client";

import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { getFavoriteProductIds } from "@/lib/db/data";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { CardDescription } from "../ui/card";

export default function Favorites() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [color, setColor] = useState("#facc15");
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (session && session.user) {
        setIsLoading(true);
        try {
          const res = await fetch("/api/getUserIdByEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const { userId } = await res.json();

          if (userId) {
            const productIds = await getFavoriteProductIds(userId);

            if (productIds && productIds.length > 0) {
              const allProducts = await fetchProducts("");
              const favoriteProducts = allProducts.filter((product) => productIds.includes(product._id));
              setFetchedProducts(favoriteProducts);
            } else {
              setFetchedProducts([]);
            }
          }
        } catch (error) {
          console.error("Error fetching favorite products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFavoriteProducts();
  }, [session?.user]);

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
