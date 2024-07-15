import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="lg:p-8 min-h-screen flex">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Inloggen in je account</h1>
          <p className="text-sm text-muted-foreground">Gebruik je emailadres en wachtwoord waarmee je geregistreerd hebt.</p>
        </div>
        <UserSignInForm />
      </div>
    </div>
  );
}
