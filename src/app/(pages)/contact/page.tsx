import Header from "@/components/navigation/header";
import ContactForm from "@/components/contact/contact-form";
import { Section } from "@/components/ui/section";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact",
  description: "Neem contact met ons op voor vragen over onze producten, bestellingen of levering. We helpen je graag verder met al je vragen over Lazo Spirits.",
  path: "/contact",
  keywords: ["contact", "vragen", "klantenservice", "bestelling", "levering", "Den Haag"],
});

const ContactPage: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="flex items-center justify-center">
          <ContactForm />
        </div>
      </Section>
    </>
  );
};

export default ContactPage;
