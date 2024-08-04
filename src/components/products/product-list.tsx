import { Product as ProductType } from "@/lib/types/product";
import Product from "./product";
import { FC } from "react";

interface ProductListProps {
  products: ProductType[] | null;
  cn?: string;
  onRemoveFavorite: (productId: string) => void;
}

const ProductList: FC<ProductListProps> = ({ products, onRemoveFavorite, cn }) => {
  return (
    <div className={`${cn} mx-auto my-24 flex max-w-7xl flex-wrap place-items-center items-center justify-center gap-8 `}>
      {products?.map((product) => (
        <Product key={product._id} product={product} onRemoveFavorite={onRemoveFavorite} />
      ))}
    </div>
  );
};

export default ProductList;