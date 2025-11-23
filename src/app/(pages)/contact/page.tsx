import Header from "@/components/navigation/header";
import ContactForm from "@/components/contact/contact-form";
import { Section } from "@/components/ui/section";
import React from "react";

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
