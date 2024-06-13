import { SanityDocument } from "@sanity/types";
import { Image } from "./product";

export interface Category extends SanityDocument {
  _type: "category";
  image: Image;
  order: number;
  name: string;
}
