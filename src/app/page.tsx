import { ModernCarousel } from "@/components/products/modern-carousel";
import { SlideCarousel } from "@/components/products/slide-carousel";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { ArrowRight, Award, Mail, Sparkles, Star } from "lucide-react";
import Link from "next/link";

const Home = async ({ params }: { params: { user: string } }): Promise<JSX.Element> => {
  const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);

  const saleProducts = products.filter((p) => p.inSale);
  const newProducts = products.filter((p) => p.isNew);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <div className="mb-6 inline-flex items-center rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Premium Spirits
              </div>
              <div className="mb-6 inline-flex items-center rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Authentieke Ouzo
              </div>
              <div className="mb-6 inline-flex items-center rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Traditionele Rakia
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Authentieke Smaken uit
              <span className="block text-slate-300">Bulgarije</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-300">
              Ontdek onze exclusieve collectie van traditionele dranken, direct geïmporteerd voor de beste kwaliteit en smaak.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                <Link href="/categorieen" className="flex items-center">
                  Ontdek Collectie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="default" className="border-white text-black hover:bg-white/10">
                <Link href="/nieuwe-producten">Nieuwe Producten</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Award className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Premium Kwaliteit</h3>
              <p className="text-gray-600 dark:text-gray-300">Alleen de beste selectie van traditionele dranken</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Star className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Authentieke Smaak</h3>
              <p className="text-gray-600 dark:text-gray-300">Direct geïmporteerd voor de originele ervaring</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Sparkles className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Exclusieve Collectie</h3>
              <p className="text-gray-600 dark:text-gray-300">Unieke producten die je nergens anders vindt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Aanbiedingen Section */}
      {saleProducts.length > 0 && (
        <section className="bg-gray-50 py-20 dark:bg-black/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Beperkte Tijd
              </div>
              <Title name="Speciale Aanbiedingen" cn="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-muted-foreground" />
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Mis deze geweldige deals niet! Beperkte voorraad beschikbaar.
              </p>
            </div>
            <ModernCarousel products={saleProducts} />
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                <Link href="/promoties" className="flex items-center">
                  Alle Aanbiedingen Bekijken
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Nieuwe Producten Section */}
      {newProducts.length > 0 && (
        <section className="bg-white py-20 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                <Star className="mr-2 h-4 w-4" />
                Nieuw
              </div>
              <Title name="Nieuwe Toevoegingen" cn="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-muted-foreground" />
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Ontdek onze nieuwste aanwinsten en laat je verrassen door nieuwe smaken.
              </p>
            </div>
            <SlideCarousel products={newProducts} />
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" className="border-slate-900 text-gray-900 hover:bg-gray-50">
                <Link href="/nieuwe-producten" className="flex items-center">
                  Alle Nieuwe Producten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="bg-slate-50 py-20 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Beperkte Tijd
            </div>
            <Title name="Ontdek Per Categorie" cn="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-muted-foreground" />
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Vind precies wat je zoekt door te bladeren in onze zorgvuldig samengestelde categorieën.
            </p>
          </div>
          <MaxWidthWrapper className="max-w-[84rem]">
            <CategoryCard slug="home" categories={categories} products={products} />
          </MaxWidthWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-black py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Klaar om te Ontdekken?</h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-300">
                Sluit je aan bij duizenden tevreden klanten die onze premium spirits ontdekken.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white px-8 py-3 text-sm text-gray-900 hover:bg-gray-100">
                <Link href="/categorieen" className="flex items-center">
                  Start Winkelen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="default" className="border-white px-8 py-3 text-sm text-black hover:bg-white/10">
                <Link href="/contact" className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Opnemen
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="border-t border-slate-700 pt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-sm text-slate-400">Tevreden Klanten</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-slate-400">Premium Producten</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Stand-by</div>
                  <div className="text-sm text-slate-400">Klantenservice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
