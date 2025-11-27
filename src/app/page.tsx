import { HeroSection } from "@/components/home/hero-section";
import Header from "@/components/navigation/header";
import { ProductCarousel } from "@/components/products/product-carousel";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/ui/category/category-grid";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import { ArrowRight, Award, Mail, Sparkles, Star } from "lucide-react";
import Link from "next/link";

const Home = async ({ params }: { params: { user: string } }): Promise<JSX.Element> => {
  const [categories, products] = await Promise.all([fetchCategories(), fetchProductsNoStore("")]);

  const saleProducts = products.filter((p) => p.inSale);
  const newProducts = products.filter((p) => p.isNew);

  // Get featured products for hero (first 4 products)
  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      {/* Unified Header + Hero Section */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
        <HeroSection
          categories={categories}
          featuredProducts={featuredProducts}
          title="Authentieke Smaken uit Bulgarije"
          subtitle="Ontdek onze exclusieve collectie van traditionele dranken, direct geïmporteerd voor de beste kwaliteit en smaak."
        />
      </div>

      {/* Features Section */}
      <Section variant="light" spacing="md">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted sm:mb-3 sm:h-12 sm:w-12">
              <Award className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
            </div>
            <h3 className="mb-1 text-base font-semibold sm:text-lg">Premium Kwaliteit</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">Alleen de beste selectie van traditionele dranken</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted sm:mb-3 sm:h-12 sm:w-12">
              <Star className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
            </div>
            <h3 className="mb-1 text-base font-semibold sm:text-lg">Authentieke Smaak</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">Direct geïmporteerd voor de originele ervaring</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted sm:mb-3 sm:h-12 sm:w-12">
              <Sparkles className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
            </div>
            <h3 className="mb-1 text-base font-semibold sm:text-lg">Exclusieve Collectie</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">Unieke producten die je nergens anders vindt</p>
          </div>
        </div>
      </Section>

      {/* Aanbiedingen Section */}
      {saleProducts.length > 0 && (
        <Section variant="default" spacing="md">
          <SectionHeader
            badge="Beperkte Tijd"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Speciale Aanbiedingen"
            description="Mis deze geweldige deals niet! Beperkte voorraad beschikbaar."
            align="center"
            action={
              <Button size="lg" className="bg-surface text-text-primary hover:bg-background-alt dark:bg-surface dark:text-text-primary">
                <Link href="/promoties" className="flex items-center justify-center">
                  Alle Aanbiedingen Bekijken
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            }
          />
          <ProductCarousel products={saleProducts} variant="default" />
        </Section>
      )}

      {/* Nieuwe Producten Section */}
      {newProducts.length > 0 && (
        <Section variant="light" spacing="md">
          <SectionHeader
            badge="Nieuw"
            badgeIcon={<Star className="h-4 w-4" />}
            title="Nieuwe Toevoegingen"
            description="Ontdek onze nieuwste aanwinsten en laat je verrassen door nieuwe smaken."
            align="center"
            action={
              <Button size="lg" variant="outline">
                <Link href="/nieuwe-producten" className="flex items-center justify-center">
                  Alle Nieuwe Producten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            }
          />
          <ProductCarousel products={newProducts} variant="minimal" />
        </Section>
      )}

      {/* Categories Section */}
      <Section variant="default" spacing="md">
        <SectionHeader
          badge="Ontdek"
          badgeIcon={<Sparkles className="h-4 w-4" />}
          title="Ontdek Per Categorie"
          description="Vind precies wat je zoekt door te bladeren in onze zorgvuldig samengestelde categorieën."
          align="center"
        />
        <CategoryGrid
          categories={categories}
          products={products}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="md"
          limit={6}
        />
        <div className="mt-6 text-center sm:mt-8">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/categorieen" className="flex items-center justify-center">
              Bekijk Alle Categorieën
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="gradient" spacing="md" container="md">
        <div className="space-y-4 text-center sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl lg:text-3xl xl:text-4xl">Klaar om te Ontdekken?</h2>
            <p className="mx-auto max-w-2xl text-sm text-text-secondary sm:text-base lg:text-lg">
              Sluit je aan bij duizenden tevreden klanten die onze premium spirits ontdekken.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
            <Button size="lg" className="w-full bg-accent-yellow px-5 py-2.5 text-sm text-text-primary hover:bg-accent-yellow-dark dark:text-black sm:w-auto sm:px-6">
              <Link href="/categorieen" className="flex items-center justify-center">
                Start Winkelen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="border hover:bg-black/10">
              <Link href="/contact" className="flex items-center justify-center">
                <Mail className="mr-2 h-4 w-4" />
                Contact Opnemen
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-border pt-4 sm:pt-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary sm:text-xl">1000+</div>
                <div className="text-xs text-text-secondary">Tevreden Klanten</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary sm:text-xl">300+</div>
                <div className="text-xs text-text-secondary">Premium Producten</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary sm:text-xl">100%</div>
                <div className="text-xs text-text-secondary">Gegarandeerde Kwaliteit</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
};

export default Home;
