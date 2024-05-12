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
    <Card className={cn("h-screen w-full", className)} {...props}>
      <CardHeader className="text-center mb-4">
        {/* Todo: should be dynamic */}
        <CardTitle className="mt-12">Assortiment</CardTitle>
        {/* Todo: should be dynamic */}
        <CardDescription>Kies een categorie</CardDescription>
      </CardHeader>
      <InputForm />
      <CardContent className="mt-12 grid place-content-center gap-4">
        {ASSORTMENT.map((item, index) => (
          <div key={index} className="grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
            <a
              href=""
              className="group w-screen max-w-5xl rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center">
                <div className="h-24">
                  <Image className="h-24 w-24 object-contain" src={`/${item.image}`} alt="" width={100} height={100} />
                </div>
                <div className="mx-12 flex flex-1 flex-col">
                  <h2 className="mb-3 text-2xl font-semibold">{item.title}</h2>
                  <p className="m-0 max-w-[30ch] text-sm opacity-50">{item.productCount} producten </p>
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
  );
}
