"use client";

import ProductList from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { Product as ProductType } from "@/lib/definitions";
import { useRouter } from "next/navigation";

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
  const navigate = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <section id="acties" className="py-4">
        <Title name={"Aanbiedingen"} />
        <MaxWidthWrapper>
          <ProductList products={AANBIEDINGEN.slice(0, 4)} />
        </MaxWidthWrapper>
        <div className="mx-auto flex justify-center my-8">
          <Button onClick={() => navigate.push("/assortiment/aanbiedingen")}>View More</Button>
        </div>
      </section>
    </main>
  );
}
