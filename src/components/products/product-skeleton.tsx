import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap place-items-center items-center justify-center gap-6">
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-[32rem] w-80 md:w-60 rounded-2xl" />
      ))}
    </div>
  );
};

export default ProductSkeleton;
