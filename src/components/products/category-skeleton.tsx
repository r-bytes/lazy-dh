import React from "react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Title from "../ui/title";

type CardProps = React.ComponentProps<typeof Card>;

const CategoryCardSkeleton: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="mb-4 text-center">
        <Title name="Categorieën" cn="text-4xl mt-12" />
        <CardDescription className="md:text-base">Kies een categorie</CardDescription>
      </CardHeader>
      <CardContent className="mt-12 flex flex-col justify-center sm:mx-16 lg:mx-2">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="mx-auto flex w-full text-center lg:w-10/12 lg:text-left">
            <div className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
              <div className="flex items-center justify-center px-4">
                <Skeleton className="hidden h-24 w-24 object-contain md:block" />
                <div className="flex flex-1 flex-col text-left md:mx-12 md:text-center">
                  <Skeleton className="mb-3 h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="inline-block h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryCardSkeleton;
