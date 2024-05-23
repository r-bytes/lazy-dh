"use client";

import { Product as ProductType } from "@/lib/definitions";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const Product = ({ product }: { product: ProductType}) => {
  const pathname = usePathname();
  const router = useRouter();
  const backgroundImageStyle = {
    backgroundImage: `url('/${product.image}')`,
    backgroundSize: "95%",
    backgroundPosition: "-70px 200px",
  };

  return (
    <Card
      className="max-h-[32rem] w-72 bg-neutral-300/10 bg-no-repeat dark:bg-neutral-800/30"
      style={backgroundImageStyle}
    >
      <CardHeader className="mb-4 flex items-end justify-center text-right">
        <CardTitle className="mb-4 mt-12">{product.title}</CardTitle>
        <CardDescription className="h-54 w-36 text-right text-sm">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-12">
        <div className="flex justify-end text-center">
          <div className="flex space-x-2">
            <div className="flex h-24 items-end justify-end space-x-2">
              <Button className="text-muted-foreground hover:bg-primary/30 hover:text-muted-foreground dark:text-background dark:hover:text-primary">
                Koop
              </Button>
              <Button
                onClick={() => router.push(`${pathname}/${product.slug}`)}
                className="font-bold text-muted-foreground hover:bg-primary/30 hover:text-muted-foreground dark:text-background dark:hover:text-primary"
              >
                {">"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Product;
