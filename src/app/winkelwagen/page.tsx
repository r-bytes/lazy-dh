"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import Image from "next/image";
import { Product } from "@/lib/definitions";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([{
    _id: 2,
    description: "Product",
    image: "next/image",
    name: "Product",
    price: 11,
    quantity: 1,
    slug: "next",
  }]);

  return (
    <div>
      <h1>Shop</h1>
      <div>
        {products.map((product) => (
          <div key={product._id}>
            <Image src={product.image} alt={product.name} width={200} height={200} />
            <h2>{product.name}</h2>
            {/* <button onClick={() => addItem(product)}>Add to Cart</button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
