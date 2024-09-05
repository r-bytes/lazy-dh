"use client";

import CategoryCardSkeleton from "@/components/products/category-skeleton";
import ProductList from "@/components/products/product-list";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useProductContext } from "@/context/ProductContext";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { productState, categoryState, filteredProducts, setFilteredProducts, isSearching, setProductState, setCategoryState } =
    useProductContext();
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchData = async () => {
      if (!products) {
        const fetchedProducts = await fetchProducts();
        setProductState(fetchedProducts);
      }
      if (!categories) {
        const fetchedCategories = await fetchCategories();
        setCategoryState(fetchedCategories);
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, [products, categories, setProductState, setCategoryState]);

  useEffect(() => {
    const counts: { [key: string]: number } = {};

    const calculateCounts = (productList: Product[], categoryList: Category[]) => {
      categoryList.forEach((category) => {
        if (category.slug === "aanbiedingen") {
          const count = productList.filter((product) => product.inSale).length;
          counts[category.name] = count;
        } else if (category.slug === "nieuw") {
          const count = productList.filter((product) => product.isNew).length;
          counts[category.name] = count;
        } else if (category.slug === "alles") {
          const count = productList.length;
          counts[category.name] = count;
        } else {
          const count = productList.filter((product) => product.category === category.name).length;
          counts[category.name] = count;
        }
      });
      setProductCounts(counts);
    };

    if (products && categories) {
      calculateCounts(products, categories);
    } else if (productState && categoryState) {
      calculateCounts(productState, categoryState);
    }
  }, [categories, products, productState, categoryState]);

  if (loading) {
    return <CategoryCardSkeleton className={className} {...props} />;
  }

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="mb-4 text-center">
        <Title name={slug === "home" ? "Categorieën" : capitalizeFirstLetter(currentPath)} cn="text-4xl mt-12" />
        <CardDescription className="md:text-base">Kies een categorie</CardDescription>
      </CardHeader>
      <InputForm products={products! || productState!} onSearchChange={setFilteredProducts} />
      {isSearching && <ProductList products={filteredProducts} />}
      {!isSearching && (
        <CardContent className="mt-12 flex flex-col justify-center sm:mx-16 lg:mx-2">
          {slug === "home"
            ? (categories || categoryState)?.slice(0, 4).map((item, index) => (
                <div key={index} className="mx-auto flex w-full text-center lg:w-10/12 lg:text-left">
                  <Link
                    href={`/categorieen/${item.slug}`}
                    className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center justify-center px-4">
                      <Image
                        className="hidden h-24 w-24 object-contain md:block"
                        src={urlFor(item.image).url()}
                        alt=""
                        width={400}
                        height={400}
                        priority
                      />
                      <div className="flex flex-1 flex-col text-left md:mx-12 md:text-center">
                        <h2 className="mb-3 text-xl font-semibold text-muted-foreground md:text-2xl lg:text-3xl">{item.name}</h2>
                        <p className="m-0 text-sm opacity-50">{`(${productCounts[item.name] || 0}) producten`}</p>
                      </div>
                      <span className="inline-block text-lg text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:text-3xl">
                        &#x279C;
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            : (categories || categoryState)?.map((item, index) => (
                <div key={index} className="flex text-center lg:text-left">
                  <Link
                    href={`${pathname}/${item.slug}`}
                    className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center justify-center px-4">
                      <Image
                        className="hidden h-24 w-24 object-contain sm:block"
                        src={urlFor(item.image).url()}
                        alt=""
                        width={400}
                        height={400}
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
                  </Link>
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
  );
};
