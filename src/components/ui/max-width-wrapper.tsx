import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({ className, children }: { className?: string; children: ReactNode }) => {
  return <div className={cn("h-full w-screen max-w-7xl px-2.5 md:px-20 flex justify-center", className)}>{children}</div>;
};

export default MaxWidthWrapper;
