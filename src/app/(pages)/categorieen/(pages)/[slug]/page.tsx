import Header from "@/components/navigation/header";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { generateBreadcrumbSchema, generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import { Product } from "@/lib/types/product";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Metadata } from "next";
import { Sparkles, Star } from "lucide-react";
import Script from "next/script";
import { CategoryPageClient } from "./category-page-client";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params: { slug } }: Props): Promise<Metadata> {
  const categoryName = capitalizeFirstLetter(slug);
  const isNew = slug === "nieuw";
  const isSale = slug === "aanbiedingen";
  
  let title = categoryName;
  let description = `Bekijk onze collectie ${categoryName.toLowerCase()} producten. Premium kwaliteit, authentieke smaken.`;
  
  if (isNew) {
    title = "Nieuwe Producten";
    description = "Ontdek onze nieuwste aanwinsten en laat je verrassen door nieuwe smaken. Exclusieve nieuwe producten met premium kwaliteit.";
  } else if (isSale) {
    title = "Aanbiedingen";
    description = "Mis deze geweldige deals niet! Beperkte voorraad beschikbaar. Speciale aanbiedingen op premium spirits.";
  }

  return generateSEOMetadata({
    title,
    description,
    path: `/categorieen/${slug}`,
    keywords: [categoryName.toLowerCase(), "spirits", "alcoholische dranken", isNew ? "nieuw" : "", isSale ? "aanbieding" : ""].filter(Boolean),
  });
}

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
      (p) => p.category && p.category.toLowerCase() === slug.toLowerCase()
    );
    // Debug: log filtering results
    console.log(`[Category Page] Slug: ${slug}, Total products: ${products.length}, Filtered: ${initialProducts.length}`);
    if (initialProducts.length === 0 && products.length > 0) {
      const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
      console.log(`[Category Page] Available categories: ${categories.join(', ')}`);
    }
  }

  const isNew = slug === "nieuw";
  const isSale = slug === "aanbiedingen";
  const categoryName = capitalizeFirstLetter(slug);

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categorieën", url: "/categorieen" },
    { name: categoryName, url: `/categorieen/${slug}` },
  ]);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
