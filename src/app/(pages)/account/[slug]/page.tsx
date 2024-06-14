import ProductList from "@/components/products/product-list";
import Title from "@/components/ui/title";
import Product from "@/lib/types/product";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// const PRODUCT_LIST: ProductType[] = [];
// [
//   {
//     _id: 1,
//     name: "Ouzo Paralia",
//     description:
//       "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
//     price: 15.0,
//     image: "ouzo-paralia.png",
//     slug: "ouzo-paralia",
//     quantity: 1000,
//   },
//   {
//     _id: 2,
//     name: "Ouzo Paralia",
//     description:
//       "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
//     price: 15.0,
//     image: "ouzo-paralia.png",
//     slug: "ouzo-paralia",
//     quantity: 1000,
//   },
//   {
//     _id: 3,
//     name: "Ouzo Paralia",
//     description:
//       "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
//     price: 15.0,
//     image: "ouzo-paralia.png",
//     slug: "ouzo-paralia",
//     quantity: 1000,
//   },
//   {
//     _id: 4,
//     name: "Ouzo Paralia",
//     description:
//       "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
//     price: 15.0,
//     image: "ouzo-paralia.png",
//     slug: "ouzo-paralia",
//     quantity: 1000,
//   },
//   {
//     _id: 4,
//     name: "Ouzo Paralia",
//     description:
//       "Ouzo Paralia is a premium anise-flavored Greek spirit, perfect for leisurely moments by the sea. Embrace the essence of Greek summer with every sip of Ouzo Paralia.",
//     price: 15.0,
//     image: "ouzo-paralia.png",
//     slug: "ouzo-paralia",
//     quantity: 1000,
//   },
// ];

const page = ({ params: { slug } }: Props) => {
  // const products = 

  return slug === "bestellingen" ? (
    <div className="flex h-screen w-screen flex-col items-center justify-center"> bestellingen </div>
  ) : slug === "wachtwoord-reset" ? (
    <div className="flex h-screen w-screen flex-col items-center justify-center"> ww reset</div>
  ) : (
    <div className="flex h-screen w-screen flex-col">
      <Title name={capitalizeFirstLetter(slug)} cn="mb-10 mt-24 text-center text-2xl font-semibold sm:mt-0" />
      {/* <ProductList products={products} /> */}
    </div>
  );
};
export default page;
