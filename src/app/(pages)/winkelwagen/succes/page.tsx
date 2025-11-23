import Header from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6 text-center">
          <SectionHeader
            badge="Succes"
            badgeIcon={<CheckCircle className="h-4 w-4" />}
            title="Bestelling Geplaatst"
            description="Hartelijk dank! Uw bestelling is geplaatst!"
          />
          <Link href={"/"}>
            <Button type="button" className="w-full sm:w-auto">
              Ga door met winkelen
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
};

export default page;
