import Header from "@/components/navigation/header";
import Promotions from "@/components/products/products-list-sale";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Aanbiedingen",
  description: "Mis deze geweldige deals niet! Beperkte voorraad beschikbaar. Speciale aanbiedingen op premium spirits uit Bulgarije, Polen en Griekenland.",
  path: "/promoties",
  keywords: ["aanbiedingen", "promoties", "korting", "deals", "beperkte tijd", "speciale aanbiedingen"],
});

export default async function Page() {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Promotions isPromo={true} />
    </>
  );
}
