"use client";

import { Product as ProductType } from "@/lib/definitions";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Product = ({ product: { title, price, image, description, slug } }: { product: ProductType }) => {
  const pathname = usePathname();
  const router = useRouter();
  const backgroundImageStyle = {
    backgroundImage: `url('/${image}')`,
    backgroundSize: "80%",
    backgroundPosition: "50% 30%",
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTrigger asChild>
          <Card
            onClick={handleOpenDialog}
            className="z-10 relative flex h-[32rem] w-72 flex-col rounded-2xl bg-neutral-300/10 bg-no-repeat dark:bg-neutral-800/30"
            style={backgroundImageStyle}
          >
            <Button
              onClick={handleToggleFavorite}
              className="z-50 absolute right-4 top-4 h-12 w-12 rounded-full bg-muted-foreground/10 hover:bg-primary/70"
            >
              <Heart color={isFavorite ? "red" : ""} fill={isFavorite ? "red" : "bg-muted-foreground/30"} />
            </Button>
            <CardContent className="flex flex-1 flex-col items-center justify-end rounded-2xl">
              <div className="mb-12 w-full text-center">
                <CardTitle className="mb-2 flex-1 text-lg">{title}</CardTitle>
                <CardDescription className="flex-1 text-2xl font-bold"> €{price},-</CardDescription>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Product;
