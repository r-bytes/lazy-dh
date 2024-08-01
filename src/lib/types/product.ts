import { SanityDocument } from "@sanity/types";

export interface Product extends SanityDocument {
  _type: "product";
  image: Image;
  name: string;
  category: string;
  description: string;
  price: number;
  volume?: number;
  percentage?: number;
  inStock: boolean;
  inSale: boolean;
  isNew: boolean;
  quantityInBox: number;
  quantity: number;
  productId: number;
}

export interface Image {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export default Product;

