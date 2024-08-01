"use client";
import { AccountCard } from "@/components/ui/account/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

    useEffect(() => {
      if (!session || status !== "authenticated") {
        navigateTo(router, "/auth");
      }
    }, [session, status, router]);

  return session && status === "authenticated" ? (
    <div className="mx-auto flex flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <AccountCard session={session} />
      </MaxWidthWrapper>
    </div>
  ) : null;
}