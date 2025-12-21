import Header from "@/components/navigation/header";
import { Section } from "@/components/ui/section";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        {children}
      </Section>
    </>
  );
}

