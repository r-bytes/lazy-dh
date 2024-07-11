"use client";

import ProductList from "@/components/products/product-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { urlFor } from "../../../../sanity";
import { InputForm } from "./search-input";
import { useProductContext } from "@/context/ProductContext";

type CardProps = React.ComponentProps<typeof Card>;
interface AssortmentCardProps extends Omit<CardProps, "children"> {
  categories: Category[];
  products: Product[];
}

export const AssortmentCard: React.FC<AssortmentCardProps> = ({ className, categories, products, ...props }) => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>(pathname.replace("/", ""));
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});
  const { filteredProducts, setFilteredProducts, isSearching } = useProductContext();

  useEffect(() => {
    console.log("==================>", isSearching, filteredProducts);
  }, [isSearching, filteredProducts]);

  useEffect(() => {
    const counts: { [key: string]: number } = {};
    categories.forEach((category) => {
      if (category.slug === "aanbiedingen") {
        const count = products.filter((product) => product.inSale).length;
        counts[category.name] = count;
      } else if (category.slug === "nieuw") {
        console.log(category);
        const count = products.filter((product) => product.isNew).length;
        counts[category.name] = count;
      } else if (category.slug === "alles") {
        console.log(category);
        const count = products.filter((product) => product).length;
        counts[category.name] = count;
      } else {
        const count = products.filter((product) => product.category === category.name).length;
        counts[category.name] = count;
      }
    });
    setProductCounts(counts);
  }, [categories, products]);

  return (
    <>
      <Card className={cn("min-h-screen w-full", className)} {...props}>
        <CardHeader className="mb-4 text-center">
          <CardTitle className="mt-12 text-3xl">{capitalizeFirstLetter(currentPath)}</CardTitle>
          {/* Todo: should be dynamic */}
          <CardDescription>Kies een categorie</CardDescription>
        </CardHeader>
        {/* Search bar */}
        <InputForm products={products} onSearchChange={setFilteredProducts} />
        {isSearching && <ProductList products={filteredProducts} />}
        {!isSearching && (
          <CardContent className="mt-12 flex flex-col justify-center p-0 mx-16">
            {categories.map((item, index) => (
              <div key={index} className="flex text-center lg:text-left">
                <a
                  href={`${pathname}/${item.slug}`}
                  className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  // target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-center px-4">
                    <Image
                      className="hidden h-24 w-24 object-contain sm:block"
                      src={urlFor(item.image).url()}
                      alt=""
                      width={100}
                      height={100}
                      priority
                    />
                    <div className="flex flex-1 flex-col text-left sm:mx-12 sm:text-center">
                      <h2 className="text-md mb-3 font-semibold sm:text-lg md:text-2xl">{item.name}</h2>
                      <p className="m-0 text-sm opacity-50">{`(${productCounts[item.name] || 0}) producten`}</p>
                    </div>
                    <span className="inline-block text-lg transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:text-3xl">
                      &#x279C;
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </>
  );
};
