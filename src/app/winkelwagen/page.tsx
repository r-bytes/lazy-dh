"use client";

import { useState } from "react";

import Cart from "@/components/cart/cart";
import { Product } from "@/lib/definitions";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([
    {
      _id: 2,
      description: "Product",
      image: "next/image",
      name: "Product",
      price: 11,
      quantity: 1,
      slug: "next",
    },
  ]);

  return <Cart />;
}
