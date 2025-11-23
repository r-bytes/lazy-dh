import Header from "@/components/navigation/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { HelpCircle } from "lucide-react";

export default function Faq() {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <SectionHeader
            badge="FAQ"
            badgeIcon={<HelpCircle className="h-4 w-4" />}
            title="Veelgestelde Vragen"
            description="Vind antwoorden op de meest gestelde vragen over bestellingen en levering."
          />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-light text-text-primary">
                Wat zijn de minimale bestelhoeveelheden voor franco levering?
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary">
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Voor bezorging buiten Den Haag: 1200 euro ex. BTW
                  </li>
                  <li>
                    Voor bezorging binnen Den Haag: 1000 euro ex. BTW
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>
    </>
  );
}