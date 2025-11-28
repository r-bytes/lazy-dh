import Header from "@/components/navigation/header";
import Promotions from "@/components/products/products-list-sale";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Nieuwe Producten",
  description: "Ontdek onze nieuwste aanwinsten en laat je verrassen door nieuwe smaken. Exclusieve nieuwe producten met premium kwaliteit uit Bulgarije, Polen en Griekenland.",
  path: "/nieuwe-producten",
  keywords: ["nieuwe producten", "nieuw", "nieuwe smaken", "exclusief", "premium spirits"],
});

export default async function Page() {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Promotions isNew={true} />
    </>
  );
}
