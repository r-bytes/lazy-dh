"use client";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { UserSignUpForm } from "@/components/ui/sign-up/user-sign-up-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

const AuthPage = () => {
  const { data: session, status } = useSession();
  const [color, setColor] = useState("#facc15");
  const router = useRouter();

  useEffect(() => {
    // This check ensures code runs only in the browser
    const handleRedirect = async () => {
      if (session && status === "authenticated") {
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
    return (
      <div className="my-32 flex justify-center items-center">
        <BeatLoader color={color} loading={true} size={20} aria-label="Loading Spinner" />
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="my-32 flex items-center justify-center">
        <BeatLoader color={color} loading={true} size={20} aria-label="Loading Spinner" />
      </div>
    );
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
