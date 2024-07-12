// "use client"
import { Product as ProductType } from "@/lib/types/product";
import Product from "./product";
import { useEffect } from "react";

const ProductList = ({ products, cn }: { products: ProductType[] | null; cn?: string }) => { 
  return (
    <div className={`${cn} mx-auto flex max-w-7xl flex-wrap place-items-center items-center justify-center gap-8 my-24 `}>
      {products?.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
