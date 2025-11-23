"use client";

import Header from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Mail } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="mx-auto max-w-md">
          <Card className="bg-surface p-6 text-center shadow-lg sm:p-8">
            <div className="mb-4 flex justify-center">
              <Mail className="h-12 w-12 text-text-secondary sm:h-16 sm:w-16" />
            </div>
            <SectionHeader
              title="Check je email"
              description="We hebben een bevestigings email gestuurd naar je emailadres."
            />
            <div className="mt-6">
              <Button className="w-full sm:w-auto" asChild>
                <Link href={"/"}>Ga naar home</Link>
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default page;
