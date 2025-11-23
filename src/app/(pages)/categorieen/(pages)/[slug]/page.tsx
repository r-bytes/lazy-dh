import Header from "@/components/navigation/header";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import { Product } from "@/lib/types/product";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Sparkles, Star } from "lucide-react";
import { CategoryPageClient } from "./category-page-client";

type Props = {
  params: { slug: string };
};

async function getProducts(): Promise<Product[] | null> {
  try {
    const products = await fetchProductsNoStore("");
    if (!products || products.length === 0) {
      console.error("No products fetched");
      return null;
    }
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export default async function Page({ params: { slug } }: Props) {
  const [products, categories] = await Promise.all([
    getProducts(),
    fetchCategories(),
  ]);

  if (!products) {
    return <div>Error loading products</div>;
  }

  // Initial filter based on slug
  let initialProducts = products;
  if (slug === "nieuw") {
    initialProducts = products.filter((p) => p.isNew);
  } else if (slug === "aanbiedingen") {
    initialProducts = products.filter((p) => p.inSale);
  } else if (slug !== "alles") {
    initialProducts = products.filter(
      (p) => p.category.toLowerCase() === slug.toLowerCase()
    );
  }

  const isNew = slug === "nieuw";
  const isSale = slug === "aanbiedingen";

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>

      {/* Main Content */}
      <Section variant="default" spacing="lg">
        <SectionHeader
          badge={isNew ? "Nieuw" : isSale ? "Beperkte Tijd" : undefined}
          badgeIcon={
            isNew ? (
              <Star className="h-4 w-4" />
            ) : isSale ? (
              <Sparkles className="h-4 w-4" />
            ) : undefined
          }
          title={capitalizeFirstLetter(slug)}
          description={
            isNew
              ? "Ontdek onze nieuwste aanwinsten en laat je verrassen door nieuwe smaken."
              : isSale
                ? "Mis deze geweldige deals niet! Beperkte voorraad beschikbaar."
                : undefined
          }
        />
        <CategoryPageClient
          initialProducts={initialProducts}
          allProducts={products}
          categories={categories}
        />
      </Section>
    </>
  );
}
