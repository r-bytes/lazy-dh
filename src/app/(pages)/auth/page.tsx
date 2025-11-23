"use client";
import Header from "@/components/navigation/header";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { UserSignUpForm } from "@/components/ui/sign-up/user-sign-up-form";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

const AuthPage = () => {
  const { data: session, status } = useSession();
  const [color, setColor] = useState("#facc15");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Prevent redirect loop: only redirect if not already on /auth
    const handleRedirect = async () => {
      if (session && status === "authenticated" && !pathname?.startsWith("/auth")) {
        try {
          navigateTo(router, "/");
        } catch (error) {
          toast.error("Er is een fout opgetreden tijdens het doorverwijzen");
        }
      }
    };

    handleRedirect();
  }, [session, status, router, pathname]);

  if (status === "loading") {
    return (
      <>
        <div className="bg-hero-light dark:bg-hero-dark">
          <Header />
        </div>
        <div className="my-32 flex justify-center items-center">
          <BeatLoader color={color} loading={true} size={20} aria-label="Loading Spinner" />
        </div>
      </>
    );
  }

  if (status === "authenticated" && !pathname?.startsWith("/auth")) {
    return (
      <>
        <div className="bg-hero-light dark:bg-hero-dark">
          <Header />
        </div>
        <div className="my-32 flex items-center justify-center">
          <BeatLoader color={color} loading={true} size={20} aria-label="Loading Spinner" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>

      {/* Auth Form Section */}
      <Section variant="default" spacing="lg">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-surface p-6 shadow-lg">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Inloggen</TabsTrigger>
                <TabsTrigger value="signup">Registreren</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <UserSignInForm fromCheckout={false} />
              </TabsContent>
              <TabsContent value="signup" className="mt-6">
                <UserSignUpForm fromCheckout={false} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default AuthPage;
