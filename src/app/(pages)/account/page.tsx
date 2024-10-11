"use client";

import BeatLoader from "react-spinners/BeatLoader";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { navigateTo } from "@/lib/utils";
import toast from "react-hot-toast";

const DynamicAccountCard = dynamic<{ session: any }>(
  () => import('@/components/ui/account/card').then((mod) => mod.AccountCard),
  {
    loading: () => <BeatLoader color="#facc15" size={20} />,
    ssr: false,
  }
);

const LoadingSpinner = () => (
  <div className="my-32 flex justify-center items-center">
    <BeatLoader color="#facc15" loading={true} size={20} aria-label="Loading Spinner" />
  </div>
);

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      if (status === "unauthenticated") {
        try {
         navigateTo(router, "/auth");
        } catch (error) {
          toast.error("Er is een fout opgetreden tijdens het doorverwijzen");
        }
      } else if (status === "authenticated") {
        setIsLoading(false);
      }
    };

    handleRedirect();
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicAccountCard session={session} />
        </Suspense>
      </MaxWidthWrapper>
    </div>
  );
}
