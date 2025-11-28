import Header from "@/components/navigation/header";
// import GoogleMapCard from "@/components/google-map-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";

export const metadata: Metadata = generateSEOMetadata({
  title: "Over Ons",
  description: "Leer meer over Lazo Spirits Den Haag. Onze bedrijfsgegevens, contactinformatie en missie om authentieke traditionele dranken naar Nederland te brengen.",
  path: "/over-ons",
  keywords: ["over ons", "bedrijfsgegevens", "contact", "Lazo Spirits", "Den Haag", "over het bedrijf"],
});

const companyInfo = {
  "Naam": process.env.COMPANY_NAME!,
  "Adres": `${process.env.COMPANY_ADDRESS!}, ${process.env.COMPANY_POSTAL!}, ${process.env.COMPANY_CITY!}`,
  "Telefoonnummer": process.env.COMPANY_PHONE!,
  "IBAN-nummer": process.env.COMPANY_IBAN!,
  "KVK-nummer: ": process.env.COMPANY_KVK_NUMBER!,
  "BTW-identificatienummer: ": process.env.COMPANY_VAT_NUMBER!,
};

const AboutPage = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <MaxWidthWrapper className="mx-auto w-full flex flex-col">
          <SectionHeader
            align="center"
            badge="Over Ons"
            badgeIcon={<Building2 className="h-4 w-4" />}
            title="Over Ons"
            description="Bedrijfsgegevens en contactinformatie"
          />
          <Table className="my-10 w-full min-w-fit">
            <TableBody>
              {/* Iterating over the companyInfo object keys to create a row for each entry */}
              {Object.entries(companyInfo).map(([key, value]) => (
                <TableRow key={key} className="flex flex-row justify-between">
                  <TableCell className="font-semibold text-text-primary">{key.replace(/([a-z])([A-Z])/g, "$1 $2")}</TableCell>
                  <TableCell className="text-text-secondary">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* <GoogleMapCard /> */}
        </MaxWidthWrapper>
      </Section>
    </>
  );
};

export default AboutPage;
