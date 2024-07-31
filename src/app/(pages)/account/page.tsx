"use client"
import { AccountCard } from "@/components/ui/account/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { useAuthContext } from "@/context/AuthContext";
import { navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();
  const { isAdminApproved } = useAuthContext();
  const router = useRouter();
  
  return session && status === "authenticated" ? (
    <div className="mx-auto flex flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <AccountCard />
      </MaxWidthWrapper>
    </div>
  ) : (
    navigateTo(router, "/auth")
  );
}
