import { CategoryGrid } from "@/components/ui/category/category-grid";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import Header from "@/components/navigation/header";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { Sparkles } from "lucide-react";

async function getData(): Promise<{ categories: Category[]; products: Product[] } | null> {
  try {
    const [categories, products] = await Promise.all([fetchCategories(), fetchProducts("")]);

    if (!categories || categories.length === 0 || !products || products.length === 0) {
      console.error("No categories or products fetched");
      return null;
    }
    return { categories, products };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function Page() {
  const data = await getData();

  if (!data) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>

      {/* Main Content */}
      <Section variant="default" spacing="lg">
        <SectionHeader
          badge="Ontdek"
          badgeIcon={<Sparkles className="h-4 w-4" />}
          title="Alle Categorieën"
          description="Vind precies wat je zoekt door te bladeren in onze zorgvuldig samengestelde categorieën."
        />
        <CategoryGrid
          categories={data.categories}
          products={data.products}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="md"
        />
      </Section>
    </>
  );
}
