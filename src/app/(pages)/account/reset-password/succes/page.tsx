import Header from "@/components/navigation/header";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { UserSignInForm } from "@/components/ui/sign-in/user-sign-in-form";
import { CheckCircle } from "lucide-react";

const page = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="mx-auto max-w-md">
          <Card className="bg-surface p-4 shadow-lg sm:p-6">
            <SectionHeader
              badge="Succes"
              badgeIcon={<CheckCircle className="h-4 w-4" />}
              title="Wachtwoord Gewijzigd"
              description="Log in met uw nieuwe wachtwoord"
            />
            <div className="mt-6">
              <UserSignInForm />
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default page;
