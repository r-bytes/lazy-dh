import ProductList from "@/components/products/product-list";
import { Card, CardHeader } from "@/components/ui/card";
import { Product as ProductType } from "@/lib/definitions";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const PRODUCT_LIST: ProductType[] = [
  {
    id: 1,
    title: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    id: 2,
    title: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    id: 3,
    title: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    id: 4,
    title: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    id: 4,
    title: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
];

const page = ({ params: { slug }, searchParams }: Props) => {
  console.log(slug);

  return (
    <div className="flex h-screen w-screen flex-col">
      <CardHeader className="mb-10 text-2xl font-semibold text-center mt-24 sm:mt-0"> {capitalizeFirstLetter(slug)} </CardHeader>
      <ProductList products={PRODUCT_LIST} />
    </div>
  );
};
export default page;
