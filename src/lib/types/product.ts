import { SanityDocument } from "@sanity/types";

export interface Product extends SanityDocument {
  _type: "product";
  image: Image;
  name: string;
  category: string;
  description: string;
  price: number;
  volume?: string; // e.g., "75cl", "70cl"
  percentage?: string; // e.g., "40%", "12.5%"
  land?: string;
  inStock: boolean;
  inSale: boolean;
  isNew: boolean;
  quantityInBox: number;
  quantity: number;
  productId: number;
  statiegeld?: number;
  tray?: boolean;
}

export interface Image {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export default Product;

