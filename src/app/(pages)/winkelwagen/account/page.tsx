import Header from "@/components/navigation/header";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { UserSignUpForm } from "@/components/ui/sign-up/user-sign-up-form";
import React from "react";

const Page = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-surface p-4 shadow-lg sm:p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Inloggen</TabsTrigger>
                <TabsTrigger value="signup">Registreren</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <UserSignInForm fromCheckout={true} />
              </TabsContent>
              <TabsContent value="signup" className="mt-6">
                <UserSignUpForm fromCheckout={true} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default Page;
