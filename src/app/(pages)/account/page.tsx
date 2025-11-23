"use client";

import BeatLoader from "react-spinners/BeatLoader";
import Header from "@/components/navigation/header";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Section } from "@/components/ui/section";
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
          // Prevent redirect loop: only redirect if not already on /auth
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith("/auth")) {
            navigateTo(router, "/auth");
          }
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
    return (
      <>
        <div className="bg-hero-light dark:bg-hero-dark">
          <Header />
        </div>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <MaxWidthWrapper className="mx-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <DynamicAccountCard session={session} />
          </Suspense>
        </MaxWidthWrapper>
      </Section>
    </>
  );
}
