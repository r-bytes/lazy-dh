import { AccountCard } from "@/components/ui/account/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <AccountCard />
      </MaxWidthWrapper>
    </div>
  );
}
