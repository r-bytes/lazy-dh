import ProductList from "@/components/products/product-list";
import { CardHeader } from "@/components/ui/card";
import { Product as ProductType } from "@/lib/definitions";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const PRODUCT_LIST: ProductType[] = [
  {
    _id: 1,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 2,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 3,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 4,
    name: "Ouzo Paralia",
    description:
      "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
    price: 15.0,
    image: "ouzo-paralia.png",
    slug: "ouzo-paralia",
    quantity: 1000,
  },
  {
    _id: 4,
    name: "Ouzo Paralia",
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

  return slug === "bestellingen" ? (
    <div className="flex justify-center items-center h-screen w-screen flex-col"> bestellingen </div>
  ) : slug === "wachtwoord-reset" ? (
    <div className="flex justify-center items-center h-screen w-screen flex-col"> ww reset</div>
  ) : (
    <div className="flex h-screen w-screen flex-col">
      <CardHeader className="mb-10 mt-24 text-center text-2xl font-semibold sm:mt-0">
        {capitalizeFirstLetter(slug)}
      </CardHeader>
      <ProductList products={PRODUCT_LIST} />
    </div>
  );
};
export default page;
