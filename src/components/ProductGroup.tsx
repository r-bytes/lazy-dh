import { ImageProps } from "next/image";
import React from "react";

type Props = {
    title: string
    productCount: number
    image: ImageProps
};

const ProductGroup = (props: Props) => {
  return <div>ProductGroup</div>;
};

export default ProductGroup;
