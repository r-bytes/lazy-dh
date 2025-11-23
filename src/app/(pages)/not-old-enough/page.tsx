"use client";

import Header from "@/components/navigation/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { AlertTriangle } from "lucide-react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const NotOldEnough: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("https://www.duckduckgo.com"); // Verwijs naar de gewenste URL
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center">
          <Card className="w-full bg-surface p-6 text-center shadow-lg sm:p-8">
            <div className="mb-4 flex justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive sm:h-16 sm:w-16" />
            </div>
            <h1 className="mb-4 text-xl font-bold text-text-primary sm:text-2xl">Leeftijdsverificatie</h1>
            <p className="mb-3 text-sm text-text-secondary sm:text-base">U moet 18 jaar of ouder zijn om deze site te bezoeken.</p>
            <p className="mb-6 text-sm text-text-secondary sm:text-base">U wordt doorgestuurd naar een andere site...</p>
            <Button 
              onClick={() => router.push("https://www.duckduckgo.com")} 
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
            >
              Direct doorsturen
            </Button>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default NotOldEnough;
