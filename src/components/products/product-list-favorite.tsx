"use client";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import Product from "@/lib/types/product";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Favorites({ favoriteProducts, loading }: { favoriteProducts: Product[]; loading: boolean }) {
  const [isLoading, setIsLoading] = useState<boolean>(loading);
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
    <Section variant="default" spacing="lg">
      <SectionHeader
        badge="Favorieten"
        badgeIcon={<Heart className="h-4 w-4" />}
        title="Favorieten"
        description={fetchedProducts.length > 0 && !isLoading ? "Je favoriete producten" : "Je hebt nog geen favorieten"}
      />
      <ProductGrid products={fetchedProducts} loading={isLoading} onRemoveFavorite={handleRemoveFavorite} />
    </Section>
  );
}
