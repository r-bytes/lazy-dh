"use client";

import { useCartStore } from "@/components/store/store";
import { useEffect, useState } from "react";

import axios from "axios";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}[];

export default function Page() {
  const [products, setProducts] = useState<Product>([]);
  const [cart, setCart] = useState([]);

  const addItem = useCartStore((state) => state.addItem);



  return (
    <div>
      <h1>Shop</h1>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <Image src={product.image} alt={product.title} width={200} height={200} />
            <h2>{product.title}</h2>
            <button onClick={() => addItem(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
