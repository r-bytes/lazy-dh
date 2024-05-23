import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { InputForm } from "./search-input";

type Product = {
  productCount: number;
  title: string;
  image: string;
};

const ASSORTMENT: Product[] = [
  {
    productCount: 1,
    title: "Aanbiedingen !!!",
    image: "sale-stamp.png",
  },
  {
    productCount: 2,
    title: "Nieuw",
    image: "new-stamp.png",
  },
  {
    productCount: 3,
    title: "Vodka",
    image: "vodka.png",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function AssortmentCard({ className, ...props }: CardProps) {
  return (
    <>
      <Card className={cn("m-10 h-screen w-full", className)} {...props}>
        <CardHeader className="mb-4 text-center">
          {/* Todo: should be dynamic */}
          <CardTitle className="mt-12">Assortiment</CardTitle>
          {/* Todo: should be dynamic */}
          <CardDescription>Kies een categorie</CardDescription>
        </CardHeader>
        {/* Search bar */}
        <InputForm />
        <CardContent className="mt-12">
          {ASSORTMENT.map((item, index) => (
            <div key={index} className="flex text-center lg:text-left">
              <a
                href=""
                className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center">
                  <div className="h-24">
                    <Image
                      className="hidden h-24 w-24 object-contain sm:block"
                      src={`/${item.image}`}
                      alt=""
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="text-left sm:text-center mx-5 flex flex-1 flex-col sm:mx-12">
                    <h2 className="mb-3 text-lg font-semibold sm:text-2xl">{item.title}</h2>
                    <p className="m-0 text-sm opacity-50">{item.productCount} producten </p>
                  </div>
                  <span className="inline-block text-3xl transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
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
