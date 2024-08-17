"use client";

import ProductList from "@/components/products/product-list";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { CardDescription } from "../ui/card";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";

type PromotionsProps = {
  products?: Product[];
  isNew?: boolean;
  isPromo?: boolean;
};

export default function Promotions({ products, isNew, isPromo }: PromotionsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [color, setColor] = useState("#facc15");

  useEffect(() => {
    const getProducts = async (param: string) => {
      setIsLoading(true);
      try {
        const products: Product[] = await fetchProductsNoStore(param);
        if (products && products.length > 0) {
          setFetchedProducts(products);
        } else {
          setFetchedProducts([]); // Ensure state is updated if no products are found
        }
        console.log(products);
      } catch (error) {
        console.log(error);
        setFetchedProducts([]); // Ensure state is updated in case of error
      } finally {
        setIsLoading(false);
      }
    };

    if (isPromo) {
      getProducts("?type=aanbiedingen");
    } else if (isNew) {
      getProducts("?type=nieuw");
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
