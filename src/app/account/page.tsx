import Header from "@/components/navigation/header";
import { AccountCard } from "@/components/ui/account/card";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <AccountCard />
    </div>
  );
}
