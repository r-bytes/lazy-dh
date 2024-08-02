"use client";

import ProductList from "@/components/products/product-list";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useProductContext } from "@/context/ProductContext";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { urlFor } from "../../../../sanity";
import { Button } from "../button";
import Title from "../title";
import { InputForm } from "./search-input";

type CardProps = React.ComponentProps<typeof Card>;
interface CategoryCardProps extends Omit<CardProps, "children"> {
  categories?: Category[];
  products?: Product[];
  slug?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ className, categories, products, slug, ...props }) => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>(pathname.replace("/", ""));
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});
  const { productState, categoryState, filteredProducts, setFilteredProducts, isSearching } = useProductContext();


  useEffect(() => {
    if (categories && products) {
      const counts: { [key: string]: number } = {};
      categories.forEach((category) => {
        if (category.slug === "aanbiedingen") {
          const count = products.filter((product) => product.inSale).length;
          counts[category.name] = count;
        } else if (category.slug === "nieuw") {
          // console.log(category);
          const count = products.filter((product) => product.isNew).length;
          counts[category.name] = count;
        } else if (category.slug === "alles") {
          // console.log(category);
          const count = products.filter((product) => product).length;
          counts[category.name] = count;
        } else {
          const count = products.filter((product) => product.category === category.name).length;
          counts[category.name] = count;
        }
      });
      setProductCounts(counts);
    } else if (!products && !categories && productState && categoryState) {
      const counts: { [key: string]: number } = {};
      categoryState.forEach((category) => {
        if (category.slug === "aanbiedingen") {
          const count = productState.filter((product) => product.inSale).length;
          counts[category.name] = count;
        } else if (category.slug === "nieuw") {
          // console.log(category);
          const count = productState.filter((product) => product.isNew).length;
          counts[category.name] = count;
        } else if (category.slug === "alles") {
          // console.log(category);
          const count = productState.filter((product) => product).length;
          counts[category.name] = count;
        } else {
          const count = productState.filter((product) => product.category === category.name).length;
          counts[category.name] = count;
        }
      });
      setProductCounts(counts);
    }
    
  }, [categories, products, productState, categoryState]);

  return products && categories ? (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="mb-4 text-center">
        <Title name={slug === "home" ? "Categorieën" : capitalizeFirstLetter(currentPath)} cn="mt-12" />
        <CardDescription className="md:text-base">Kies een categorie</CardDescription>
      </CardHeader>
      {/* Search bar */}
      <InputForm products={products} onSearchChange={setFilteredProducts} />
      {isSearching && <ProductList products={filteredProducts} />}
      {!isSearching && (
        <CardContent className="mt-12 flex flex-col justify-center sm:mx-16 lg:mx-2">
          {slug === "home"
            ? categories.slice(0, 4).map((item, index) => (
                <div key={index} className="mx-auto flex w-4/5 text-center sm:w-11/12 lg:w-10/12 lg:text-left">
                  <a
                    href={`/categorieen/${item.slug}`}
                    className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    // target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center justify-center px-4">
                      <Image
                        className="hidden h-24 w-24 object-contain md:block"
                        src={urlFor(item.image).url()}
                        alt=""
                        width={100}
                        height={100}
                        priority
                      />
                      <div className="flex flex-1 flex-col text-left md:mx-12 md:text-center">
                        <h2 className="text-md mb-3 font-semibold text-muted-foreground sm:text-lg md:text-2xl lg:text-3xl">{item.name}</h2>
                        <p className="m-0 text-sm opacity-50">{`(${productCounts[item.name] || 0}) producten`}</p>
                      </div>
                      <span className="inline-block text-lg text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:text-3xl">
                        &#x279C;
                      </span>
                    </div>
                  </a>
                </div>
              ))
            : categories.map((item, index) => (
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
                        <h2 className="text-md mb-3 font-semibold sm:text-lg md:text-2xl lg:text-3xl">{item.name}</h2>
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
      {slug === "home" && (
        <div className="m-16 flex flex-1 justify-center">
          <Button title="Meer">
            <Link href={"/categorieen"}>Bekijk meer</Link>
          </Button>
        </div>
      )}
    </Card>
  ) : !products && !categories && productState && categoryState ? (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="mb-4 text-center">
        <Title
          name={slug === "home" ? "Categorieën" : currentPath === "categorieen" ? "Categorieën" : capitalizeFirstLetter(currentPath)}
          cn="mt-12 text-4xl md:text-5xl"
        />
        <CardDescription className="md:text-base">Kies een categorie</CardDescription>
      </CardHeader>
      {/* Search bar */}
      <InputForm products={productState} onSearchChange={setFilteredProducts} />
      {isSearching && <ProductList products={filteredProducts} />}
      {!isSearching && (
        <CardContent className="mt-12 flex flex-col justify-center sm:mx-16 lg:mx-2">
          {slug === "home"
            ? categoryState.slice(0, 4).map((item, index) => (
                <div key={index} className="flex text-center lg:text-left">
                  <a
                    href={`/categorieen/${item.slug}`}
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
                        <h2 className="text-md mb-3 font-semibold text-muted-foreground sm:text-lg md:text-2xl lg:text-3xl">{item.name}</h2>
                        <p className="m-0 text-sm opacity-50">{`(${productCounts[item.name] || 0}) producten`}</p>
                      </div>
                      <span className="inline-block text-lg text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:text-3xl">
                        &#x279C;
                      </span>
                    </div>
                  </a>
                </div>
              ))
            : categoryState.map((item, index) => (
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
                        <h2 className="text-md mb-3 font-semibold text-muted-foreground sm:text-lg md:text-2xl lg:text-3xl">{item.name}</h2>
                        <p className="m-0 text-sm opacity-50">{`(${productCounts[item.name] || 0}) producten`}</p>
                      </div>
                      <span className="inline-block text-lg text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:text-3xl">
                        &#x279C;
                      </span>
                    </div>
                  </a>
                </div>
              ))}
        </CardContent>
      )}
      {slug === "home" && (
        <div className="m-16 flex flex-1 justify-center">
          <Button title="Meer">
            <Link href={"/categorieen"}>Bekijk meer</Link>
          </Button>
        </div>
      )}
    </Card>
  ) : (
    <div>
      <p> Geen producten/categorieen </p>
    </div>
  );
};
