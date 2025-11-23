"use client";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import Product from "@/lib/types/product";
import { Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

type PromotionsProps = {
  isNew?: boolean;
  isPromo?: boolean;
};

export default function Promotions({ isNew, isPromo }: PromotionsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async (filterType: string) => {
      setIsLoading(true);
      try {
        const products: Product[] = await fetchProductsNoStore("");
        let filteredProducts: Product[] = [];

        if (filterType === "nieuw") {
          filteredProducts = products.filter((p) => p.isNew);
        } else if (filterType === "aanbiedingen") {
          filteredProducts = products.filter((p) => p.inSale);
        }

        setFetchedProducts(filteredProducts);
      } catch (error) {
        console.log(error);
        setFetchedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isPromo) {
      getProducts("aanbiedingen");
    } else if (isNew) {
      getProducts("nieuw");
    }
  }, [isNew, isPromo]);

  return (
    <Section variant="default" spacing="lg">
      <SectionHeader
        badge={isNew ? "Nieuw" : "Beperkte Tijd"}
        badgeIcon={isNew ? <Star className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        title={isNew ? "Nieuwe Producten" : "Aanbiedingen"}
        description={isNew ? "Onze nieuwste producten" : "Producten in de aanbieding"}
      />
      <ProductGrid products={fetchedProducts} loading={isLoading} />
    </Section>
  );
}
