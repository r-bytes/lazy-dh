"use client";

import { useState } from "react";

import { Product } from "@/lib/definitions";
import ShoppingCart from "@/components/shopping-cart/shopping-cart";

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

  return <ShoppingCart />;
}
