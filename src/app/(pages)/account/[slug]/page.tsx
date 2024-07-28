import ProductList from "@/components/products/product-list";
import Title from "@/components/ui/title";
import Product from "@/lib/types/product";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = ({ params: { slug } }: Props) => {
  return slug === "bestellingen" ? (
    <div className="flex h-screen w-screen flex-col items-center justify-center"> bestellingen </div>
  ) : slug === "wachtwoord-reset" ? (
    <div className="flex h-screen w-screen flex-col items-center justify-center"> ww reset</div>
  ) : (
    <div className="flex h-screen w-screen flex-col">
      <Title name={capitalizeFirstLetter(slug)} cn="mb-10 mt-24 text-center text-2xl font-semibold sm:mt-0" />

    </div>
  );
};
export default page;
