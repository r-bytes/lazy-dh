"use client";

import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import Product from "@/lib/types/product";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { CardDescription } from "../ui/card";

type PromotionsProps = {
  isNew?: boolean;
  isPromo?: boolean;
};

export default function Promotions({ isNew, isPromo }: PromotionsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [color, setColor] = useState("#facc15");

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
    <MaxWidthWrapper className="mx-auto flex flex-col items-center justify-center">
      <Title name={isNew ? "Nieuwe Producten" : "Aanbiedingen"} cn="text-4xl md:text-5xl mt-12" />
      <CardDescription className="md:text-base">{isNew ? "Onze nieuwste producten" : "Producten in de aanbieding"}</CardDescription>
      {isLoading ? (
        <div className="my-32">
          <BeatLoader color={color} loading={isLoading} size={20} aria-label="Loading Spinner" />
        </div>
      ) : fetchedProducts.length > 0 ? (
        <ProductList products={fetchedProducts} />
      ) : (
        <div className="py-5 text-center">
          <p>{isNew ? "Geen nieuwe producten beschikbaar" : "Geen producten in de aanbieding"}</p>
        </div>
      )}
    </MaxWidthWrapper>
  );
}
