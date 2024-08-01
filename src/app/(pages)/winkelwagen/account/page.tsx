import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { UserSignUpForm } from "@/components/ui/sign-up/user-sign-up-form";

const Page = () => {
  return (
      <Tabs defaultValue="login" className="mx-auto max-w-md md:max-w-5xl">
        <TabsList className="flex w-full">
          <TabsTrigger value="login"> Inloggen </TabsTrigger>
          <TabsTrigger value="signup"> Registreren </TabsTrigger>
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

export default Page;
