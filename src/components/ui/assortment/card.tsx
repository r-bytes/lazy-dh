"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { InputForm } from "./search-input";

type Category = {
  productCount: number;
  title: string;
  image: string;
  slug: string;
};

const ASSORTMENT: Category[] = [
  {
    productCount: 1,
    title: "Aanbiedingen !!!",
    image: "sale-stamp.png",
    slug: "aanbiedingen",
  },
  {
    productCount: 2,
    title: "Nieuw",
    image: "new-stamp.png",
    slug: "nieuw",
  },
  {
    productCount: 3,
    title: "Vodka",
    image: "vodka.png",
    slug: "vodka",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function AssortmentCard({ className, ...props }: CardProps) {
  const pathname = usePathname();

  return (
    <>
      <Card className={cn("h-screen w-full", className)} {...props}>
        <CardHeader className="mb-4 text-center">
          {/* Todo: should be dynamic */}
          <CardTitle className="mt-12 text-3xl">{capitalizeFirstLetter(pathname.replace("/", ""))}</CardTitle>
          {/* Todo: should be dynamic */}
          <CardDescription>Kies een categorie</CardDescription>
        </CardHeader>
        {/* Search bar */}
        <InputForm />
        <CardContent className="mt-12 flex flex-col justify-center p-0">
          {ASSORTMENT.map((item, index) => (
            <div key={index} className="flex text-center lg:text-left">
              <a
                href={`${pathname}/${item.slug}`}
                className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                // target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center border-4 px-4">
                  <Image className="hidden h-24 w-24 object-contain sm:block" src={`/${item.image}`} alt="" width={100} height={100} />
                  <div className="sm:mx-12 flex flex-1 flex-col text-left sm:text-center">
                    <h2 className="text-md mb-3 font-semibold sm:text-lg md:text-2xl">{item.title}</h2>
                    <p className="m-0 text-sm opacity-50">{item.productCount} producten </p>
                  </div>
                  <span className="inline-block text-lg transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:text-3xl">
                    &#x279C;
                  </span>
                </div>
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
