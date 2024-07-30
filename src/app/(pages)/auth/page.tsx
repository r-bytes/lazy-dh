"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { UserSignUpForm } from "@/components/ui/sign-up/user-sign-up-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (session && status === "authenticated") {
      router.replace("/");
    }
  }, [session, status, router]);

  // Do not render anything until the session check is complete to prevent flash of content
  if (status === "loading") {
    return <p className="min-h-screen flex justify-center items-center"> Loading .. </p>;
  }

  return (
    status !== "authenticated" &&  (
      <Tabs defaultValue="login" className="mx-auto max-w-md md:max-w-5xl min-h-[50vh] mt-24">
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
    )
  );
};

export default AuthPage;
