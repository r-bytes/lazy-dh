"use client";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { UserSignUpForm } from "@/components/ui/sign-up/user-sign-up-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const AuthPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // This check ensures code runs only in the browser
    const handleRedirect = async () => {
      if (typeof window !== "undefined" && session && status === "authenticated") {
        try {
          navigateTo(router, "/")
          // toast.success("U wordt doorverwezen naar de home pagina");
        } catch (error) {
          toast.error("Er is een fout opgetreden tijdens het doorverwijzen");
        }
      }
    };

    handleRedirect();
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="flex items-center justify-center">Laden...</p>;
  }

  if (status === "authenticated") {
    return <p className="flex items-center justify-center">U wordt doorverwezen...</p>;
  }

  return (
    <Tabs defaultValue="login" className="mx-auto sm:mt-12 max-w-md md:max-w-5xl">
      <TabsList className="flex w-full">
        <TabsTrigger value="login">Inloggen</TabsTrigger>
        <TabsTrigger value="signup">Registreren</TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="p-4">
        <UserSignInForm fromCheckout={true} />
      </TabsContent>
      <TabsContent value="signup" className="p-4">
        <UserSignUpForm fromCheckout={true} />
      </TabsContent>
    </Tabs>
  );
};

export default AuthPage;
