import { Product as ProductType } from "@/lib/types/product";
import Product from "./product";
import { FC } from "react";

interface ProductListProps {
  products: ProductType[];
  onRemoveFavorite: (productId: string) => void;
}

const ProductList: FC<ProductListProps> = ({ products, onRemoveFavorite }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Product key={product._id} product={product} onRemoveFavorite={onRemoveFavorite} />
      ))}
    </div>
  );
};

export default ProductList;