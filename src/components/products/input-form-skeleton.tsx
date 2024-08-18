import { Skeleton } from "@/components/ui/skeleton";

export function InputFormSkeleton() {
  return (
    <div className="mx-auto w-2/3">
      <div className="mb-4">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
