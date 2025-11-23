import Header from "@/components/navigation/header";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>

      {/* Sign In Form Section */}
      <Section variant="default" spacing="lg">
        <div className="mx-auto max-w-md">
          <Card className="bg-surface p-6 shadow-lg">
            <div className="flex flex-col space-y-2 text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Inloggen in je account</h1>
              <p className="text-sm text-text-secondary">Gebruik je emailadres en wachtwoord waarmee je geregistreerd hebt.</p>
            </div>
            <UserSignInForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
