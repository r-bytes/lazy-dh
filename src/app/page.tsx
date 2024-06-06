"use client";

import ProductList from "@/components/products/product-list";
import ProductSkeleton from "@/components/products/product-skeleton";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import Title from "@/components/ui/title";
import { validateRequest } from "@/lib/db/auth";
import { Product as ProductType } from "@/lib/definitions";
import { navigateTo } from "@/lib/utils";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AANBIEDINGEN: ProductType[] = [
  {
    _id: 1,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 2,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 3,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 4,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 4,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const fetchUserAndValidate = async () => {
  //     const { user } = await validateRequest();
  //     setUser(user);

  //     if (!user) {
  //       return navigateTo(router, "/sign-in");
  //     }
  //   };

  //   fetchUserAndValidate();
  // }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <section id="acties" className="py-4">
        <Title name={"Aanbiedingen"} />
        <MaxWidthWrapper>
          <ProductList products={AANBIEDINGEN.slice(0, 4)} />
        </MaxWidthWrapper>
        <div className="mx-auto my-8 flex justify-center">
          <Button onClick={() => navigateTo(router, "/assortiment/aanbiedingen")}>View More</Button>
        </div>
      </section>
      {/* <section id="acties" className="py-4">
          <Title name={"Aanbiedingen"} />
        <MaxWidthWrapper>
          {user ? (
            <div>
              <ProductList products={AANBIEDINGEN.slice(0, 4)} />
              <div className="mx-auto my-8 flex justify-center">
                <Button onClick={() => navigateTo(router, "/assortiment/aanbiedingen")}>View More</Button>
              </div>
            </div>
          ) : (
            <ProductSkeleton />
          )}
        </MaxWidthWrapper>
      </section> */}
    </main>
  );
}
