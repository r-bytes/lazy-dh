import Product from "@/components/products/product";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = ({ params: { slug }, searchParams }: Props) => {
  console.log(slug);

  return <div className="h-screen w-screen flex justify-center items-center">
    {slug}
  </div>;
};
export default page;
