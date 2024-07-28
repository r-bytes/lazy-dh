"use client"
import { AccountCard } from "@/components/ui/account/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  
  
  return session ?  (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <AccountCard />
      </MaxWidthWrapper>
    </div>
  ): notFound();
}
