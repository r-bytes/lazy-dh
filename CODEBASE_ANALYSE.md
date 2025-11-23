# LAZO Spirits Codebase Analyse & Moderniseringsplan

**Datum:** 2024  
**Project:** LAZO Spirits Den Haag  
**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Sanity CMS, shadcn/ui

---

## 🟨 STAP 1 — Bestandsstructuur & Architectuur Analyse

### 1.1 Pages Overzicht

#### **Homepage (`/src/app/page.tsx`)**
- **Structuur:** Server Component met async data fetching
- **Secties:**
  1. Hero section (statisch, 3 badges + CTA buttons)
  2. Features section (3 kolommen: Premium Kwaliteit, Authentieke Smaak, Exclusieve Collectie)
  3. Aanbiedingen section (conditioneel, gebruikt `ModernCarousel`)
  4. Nieuwe Producten section (conditioneel, gebruikt `SlideCarousel`)
  5. Categories section (gebruikt `CategoryCard` met max 4 categorieën)
  6. CTA section (gradient background, trust indicators)

#### **Categorieën Pagina's**
- **`/categorieen/page.tsx`**: Overzicht alle categorieën (gebruikt `CategoryCard`)
- **`/categorieen/[slug]/page.tsx`**: 
  - Filtert producten op slug (nieuw/aanbiedingen/categorie naam)
  - Gebruikt `ProductsWithFilter` alleen voor slug="alles"
  - Andere slugs gebruiken simpel `ProductList` zonder filters

#### **Speciale Pagina's**
- `/nieuwe-producten/page.tsx` → gebruikt `Promotions` component met `isNew={true}`
- `/promoties/page.tsx` → gebruikt `Promotions` component met `isPromo={true}`
- `/winkelwagen/` → Shopping cart functionaliteit
- `/account/` → User account management
- `/admin/` → Admin dashboard

### 1.2 Componenten Structuur

#### **Product Componenten** (`/src/components/products/`)
1. **`product.tsx`** (430 regels)
   - Zeer complex component met veel duplicate code
   - Twee varianten: `carousel` en normale
   - Bevat: Dialog, favorite logic, cart logic, quantity counter
   - **Probleem:** Veel duplicate JSX tussen carousel en normale variant

2. **`product-list.tsx`**
   - Simpele wrapper die `Product` componenten rendert
   - Filtert op "home" slug (toont alleen nieuwe producten, max 4)
   - Gebruikt flex-wrap layout

3. **`modern-carousel.tsx`** & **`slide-carousel.tsx`**
   - **Probleem:** Bijna identieke code (beide ~125 regels)
   - Verschil: alleen styling details (button sizes, dot sizes)
   - Beide gebruiken Framer Motion
   - Toont 4 producten tegelijk, slide één voor één

4. **`products-list-sale.tsx`**
   - Client component die zelf data fetcht
   - Filtert op `isNew` of `inSale`
   - Gebruikt `ProductList` component

5. **`category-skeleton.tsx`**, **`product-skeleton.tsx`**, **`input-form-skeleton.tsx`**
   - Loading states

#### **UI Componenten** (`/src/components/ui/`)
- **shadcn/ui basis:** button, card, dialog, input, select, etc.
- **Custom UI:**
  - `category/category-card.tsx` - Toont categorieën als lijst met product counts
  - `category/products-with-filter.tsx` - Alleen search, geen echte filters
  - `category/search-input.tsx` - Zoekt alleen op product naam
  - `title.tsx` - Herbruikbare title component
  - `max-width-wrapper.tsx` - Layout wrapper

#### **Navigation Componenten**
- **`header.tsx`** (208 regels)
  - Complexe responsive navigatie
  - Mobile hamburger menu
  - Search bar integratie
  - Shopping cart icon met badge
  - Admin link (conditioneel)

- **`footer.tsx`**
  - 4-kolom grid layout
  - Company info, Quick links, Customer service, Contact
  - Bottom bar met legal links

### 1.3 Styling Aanpak

#### **Tailwind CSS Configuratie**
- **Design System:** shadcn/ui met custom CSS variables
- **Colors:** HSL-based color system (light/dark mode)
- **Primary Color:** Geel (`hsl(47.9 95.8% 53.1%)`)
- **Radius:** `0.5rem` (consistent)
- **Dark Mode:** Class-based (`dark:` prefix)

#### **Styling Patronen**
- **Inconsistent spacing:** Mix van `py-16`, `py-20`, `mb-12`, etc.
- **Grid layouts:** 
  - Product grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
  - Footer: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
  - Features: `grid-cols-1 md:grid-cols-3`
- **Background colors:** Veel variatie:
  - `bg-white dark:bg-gray-900`
  - `bg-gray-50 dark:bg-black/60`
  - `bg-slate-50 dark:bg-black`
  - `bg-gradient-to-br from-slate-800 via-slate-900 to-black`

### 1.4 Data Flow & API's

#### **Data Fetching**
- **Sanity CMS** als headless CMS
- **Server Components:** Homepage, categorie pagina's
- **Client Components:** Product lists, carousels, filters
- **API Routes:**
  - `/api/getProducts` - Fetcht producten met optionele filters (type parameter)
  - `/api/getCategories` - Fetcht alle categorieën
  - Andere API's voor auth, favorites, checkout, etc.

#### **Context Providers**
- **`ProductContext`:** Beheert product state, categories, filtered products, search state
- **`CartContext`:** Shopping cart state
- **`AuthContext`:** User authentication state

#### **Data Types**
- **Product:** name, category, price, image, inSale, isNew, volume, percentage, etc.
- **Category:** name, slug, image

### 1.5 Reusable UI Componenten

#### **Goed Herbruikbaar:**
- ✅ `Button` (shadcn/ui)
- ✅ `Card`, `CardContent`, `CardHeader`, etc. (shadcn/ui)
- ✅ `Dialog` (shadcn/ui)
- ✅ `Title` component
- ✅ `MaxWidthWrapper`
- ✅ `Input`, `Select` (shadcn/ui)

#### **Beperkt Herbruikbaar:**
- ⚠️ `Product` component (te complex, veel duplicate code)
- ⚠️ `CategoryCard` (specifiek voor categorie overzicht)
- ⚠️ Carousel componenten (bijna identiek, kunnen geconsolideerd worden)

### 1.6 Problemen & Inconsistenties

#### **Code Duplicatie:**
1. **`modern-carousel.tsx` vs `slide-carousel.tsx`** - 95% identieke code
2. **`product.tsx`** - Duplicate JSX voor carousel vs normale variant (regels 201-315 vs 316-429)
3. **Hero badges** - Hardcoded 3 badges in homepage
4. **Filter logic** - Verspreid over meerdere componenten

#### **Styling Inconsistenties:**
1. **Background colors:** Te veel variaties (white, gray-50, slate-50, etc.)
2. **Spacing:** Inconsistente padding/margin (py-16, py-20, mb-12, etc.)
3. **Section backgrounds:** Geen consistente pattern
4. **Card styling:** Product cards gebruiken verschillende background opacities

#### **Functionaliteit Gaps:**
1. **Geen echte filters:** Alleen search op product naam
2. **Geen sortering:** Producten worden alleen gesorteerd op naam (in API)
3. **Geen paginatie:** Alle producten worden in één keer geladen
4. **Geen price range filter**
5. **Geen category filter op product pagina's** (alleen op categorie overzicht)

#### **UX Problemen:**
1. **Hero section:** Statisch, geen dynamische content
2. **Category grid:** Lijst layout in plaats van grid (minder visueel aantrekkelijk)
3. **Product cards:** Grote hoogte (32rem), weinig informatie zichtbaar
4. **Geen hover states** op product cards (alleen op categorie links)
5. **Search:** Twee verschillende search componenten (`SearchBar` en `InputForm`)

#### **Performance Issues:**
1. **Client-side filtering:** `products-list-sale.tsx` fetcht alle producten client-side
2. **Geen image optimization:** Images worden wel via Next.js Image gebruikt, maar quality=75
3. **Geen lazy loading** voor carousels

### 1.7 Waar Modernisering Hardst Nodig Is

#### **Prioriteit 1 (Hoog):**
1. **Product Cards** - Moderniseren, duplicatie verwijderen
2. **Carousel Componenten** - Consolideren tot één component
3. **Filter Systeem** - Echte filters toevoegen (prijs, categorie, sortering)
4. **Hero Section** - Dynamischer maken, betere layout

#### **Prioriteit 2 (Medium):**
5. **Category Grid** - Van lijst naar visueel grid
6. **Styling Consistentie** - Design tokens standaardiseren
7. **Search Unificatie** - Één search component

#### **Prioriteit 3 (Laag):**
8. **Performance Optimalisaties** - Lazy loading, image optimization
9. **Paginatie** - Voor grote product lijsten
10. **Code Cleanup** - Duplicate code verwijderen

---

## 🟨 STAP 2 — UX/UI Verbeterpunten

### 2.1 Dubbele/Overbodige Componenten

#### **Te Consolideren:**
1. **`modern-carousel.tsx` + `slide-carousel.tsx`** → Één `ProductCarousel` component met varianten
2. **`SearchBar` + `InputForm`** → Één `ProductSearch` component
3. **`product.tsx` carousel variant** → Extract naar aparte `ProductCard` component

#### **Te Verwijderen:**
- Geen volledig overbodige componenten, wel veel duplicatie

### 2.2 Oude/Rommelige CSS

#### **Problemen:**
1. **Inconsistente spacing:**
   - `py-16` vs `py-20` (geen duidelijke regel)
   - `mb-12` vs `mb-8` vs `mb-4` (willekeurig)
   - `gap-6` vs `gap-8` (geen systeem)

2. **Background color chaos:**
   - `bg-white dark:bg-gray-900`
   - `bg-gray-50 dark:bg-black/60`
   - `bg-slate-50 dark:bg-black`
   - `bg-neutral-300/10 dark:bg-neutral-800/30` (product cards)
   - Geen consistente semantische namen

3. **Hardcoded values:**
   - Product card height: `h-[32rem]` (512px) - te groot
   - Image heights: `h-60`, `h-72`, `h-96` - geen systeem
   - Max widths: `max-w-7xl`, `max-w-2xl`, `max-w-4xl` - inconsistent

### 2.3 Inconsistente Design Tokens

#### **Ontbrekende Tokens:**
- Geen spacing scale (4, 8, 12, 16, 20, 24, 32, etc.)
- Geen consistente border radius (sommige `rounded-lg`, andere `rounded-2xl`)
- Geen shadow system (sommige `shadow-md`, andere `shadow-lg`, `shadow-xl`)
- Geen typography scale (veel verschillende text sizes zonder systeem)

#### **Aanbeveling:**
- Uitbreiden Tailwind config met custom spacing/typography scales
- Design tokens documenteren

### 2.4 Eentonigheid in Opmaak

#### **Problemen:**
1. **Hero section:** Te simpel, statische badges, geen visuele hiërarchie
2. **Features section:** 3 identieke cards, geen variatie
3. **Category list:** Horizontale lijst, niet visueel aantrekkelijk
4. **Product cards:** Allemaal hetzelfde, geen highlights voor sale/new items
5. **Sections:** Allemaal dezelfde opbouw (title + description + content)

### 2.5 Slechte Spacing/Margins

#### **Specifieke Problemen:**
1. **Homepage sections:**
   - Hero: `py-20` (80px) - te veel
   - Features: `py-16` (64px) - inconsistent met hero
   - Aanbiedingen: `py-20` - weer anders
   - Categories: `py-20` - consistent maar te veel

2. **Product cards:**
   - `gap-8` tussen cards - goed
   - Maar `my-12` op container - te veel vertical spacing

3. **Category card:**
   - `mt-12` op CardContent - te veel
   - `mx-16` op mobile - te veel horizontal padding

### 2.6 Kaarten/Grids Verbeteren

#### **Product Cards:**
- **Huidige:** `h-[32rem]` (512px hoogte) - te groot
- **Probleem:** Weinig informatie zichtbaar, veel whitespace
- **Verbetering:** Compactere cards, meer info, betere hover states

#### **Category Grid:**
- **Huidige:** Horizontale lijst met arrows
- **Probleem:** Niet visueel aantrekkelijk, weinig gebruik van ruimte
- **Verbetering:** Grid layout (2x2 of 3x3), betere images, hover effects

#### **Product Grid:**
- **Huidige:** `flex flex-wrap` - werkt maar niet optimaal
- **Probleem:** Geen consistente spacing, cards kunnen verschillende widths hebben
- **Verbetering:** CSS Grid met `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

### 2.7 Ontbrekende Filters

#### **Huidige Situatie:**
- Alleen search op product naam
- Geen filters voor:
  - Prijs range
  - Categorie (op product pagina's)
  - Volume
  - Percentage (alcohol)
  - Sale/New status
  - Sortering (prijs, naam, nieuwste)

#### **Impact:**
- Gebruikers kunnen niet efficiënt zoeken
- Geen manier om producten te vergelijken
- Slechte UX voor grote product catalogi

### 2.8 Herhaaldelijke Sections

#### **Pattern Herhaling:**
Elke section volgt hetzelfde patroon:
```tsx
<section className="bg-{color} py-{size}">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mb-12 text-center">
      <div className="mb-4 inline-flex...">Badge</div>
      <Title name="..." />
      <p className="mx-auto mt-4 max-w-2xl...">Description</p>
    </div>
    {/* Content */}
    <div className="mt-12 text-center">
      <Button>CTA</Button>
    </div>
  </div>
</section>
```

**Probleem:** Geen variatie, voorspelbaar, saai

**Oplossing:** Herbruikbare `Section` component met varianten

---

## 🟨 STAP 3 — Ontwerpplan & Architectuur

### 3.1 Nieuwe Hero Layout

#### **Huidige Problemen:**
- Statische badges (hardcoded)
- Simpele tekst layout
- Geen visuele hiërarchie
- Geen call-to-action focus

#### **Voorgestelde Nieuwe Hero:**
```
┌─────────────────────────────────────────┐
│  [Background: Gradient of product image] │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Badge: "Premium Spirits"        │   │
│  └──────────────────────────────────┘   │
│                                          │
│  H1: Authentieke Smaken uit Bulgarije   │
│  P:  Ontdek onze exclusieve collectie   │
│                                          │
│  [CTA Primary] [CTA Secondary]          │
│                                          │
│  ┌────┐ ┌────┐ ┌────┐                  │
│  │ C1 │ │ C2 │ │ C3 │  (Category cards)│
│  └────┘ └────┘ └────┘                  │
└─────────────────────────────────────────┘
```

**Features:**
- Full-width hero met gradient overlay
- Dynamische categorie badges (uit CMS)
- Betere typography hiërarchie
- Featured product image als background (optioneel)
- Animated entrance (Framer Motion)

**Component:** `HeroSection` (nieuw)

### 3.2 Nieuwe Categorie-Grid

#### **Huidige Problemen:**
- Horizontale lijst layout
- Weinig visueel aantrekkelijk
- Grote cards, weinig informatie

#### **Voorgestelde Grid:**
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ [Image]  │ │ [Image]  │ │ [Image]  │
│ Category │ │ Category │ │ Category │
│ (12)     │ │ (8)      │ │ (15)     │
└──────────┘ └──────────┘ └──────────┘
┌──────────┐ ┌──────────┐ ┌──────────┐
│ [Image]  │ │ [Image]  │ │ [Image]  │
│ Category │ │ Category │ │ Category │
│ (5)      │ │ (20)     │ │ (3)      │
└──────────┘ └──────────┘ └──────────┘
```

**Features:**
- 3-kolom grid (responsive: 1 op mobile, 2 op tablet, 3 op desktop)
- Category images als hero images
- Product count badges
- Hover effects (scale, overlay)
- Gradient overlays op images

**Component:** `CategoryGrid` (refactor van `CategoryCard`)

### 3.3 Vernieuwde Productkaarten

#### **Huidige Problemen:**
- Te groot (512px hoogte)
- Veel duplicate code
- Weinig informatie zichtbaar
- Geen sale/new badges prominent

#### **Voorgestelde Nieuwe Card:**
```
┌─────────────────────┐
│ [Sale Badge] [New]  │  ← Top badges
│                     │
│   [Product Image]   │  ← Centered, hover zoom
│                     │
│  Product Name       │  ← Truncated if long
│  750ml • 40%        │  ← Metadata
│                     │
│  € 24,99            │  ← Price (large)
│  € 149,94 doos      │  ← Box price (small)
│                     │
│  [❤️] [Add to Cart] │  ← Actions
└─────────────────────┘
```

**Features:**
- Compactere hoogte (~400px)
- Sale/New badges prominent bovenaan
- Hover state: image zoom, shadow increase
- Quick add to cart button
- Favorite heart icon
- Better typography hierarchy
- Responsive: 1/2/4 kolommen

**Component:** `ProductCard` (refactor van `Product`)

### 3.4 Categoriepagina met Filters + Sortering

#### **Huidige Problemen:**
- Alleen search, geen filters
- Geen sortering
- Alle producten in één keer geladen

#### **Voorgestelde Filter Sidebar:**
```
┌─────────────────┬──────────────────────┐
│  FILTERS        │  PRODUCTS GRID       │
│                 │                      │
│  Sorteren:      │  [Card] [Card] [Card]│
│  [Dropdown]     │  [Card] [Card] [Card]│
│                 │  [Card] [Card] [Card]│
│  Prijs:         │                      │
│  [Min] - [Max]  │  [Pagination]        │
│                 │                      │
│  Categorie:     │                      │
│  ☑ Ouzo         │                      │
│  ☐ Wodka        │                      │
│  ☐ Rakia        │                      │
│                 │                      │
│  Volume:        │                      │
│  ☑ 500ml        │                      │
│  ☐ 750ml        │                      │
│                 │                      │
│  [Reset]        │                      │
└─────────────────┴──────────────────────┘
```

**Features:**
- Sticky filter sidebar (mobile: drawer)
- Price range slider
- Category checkboxes
- Volume/Percentage filters
- Sale/New toggles
- Sort dropdown (prijs, naam, nieuwste)
- Active filter chips
- Reset button
- URL query parameters voor shareable links

**Componenten:**
- `ProductFilters` (nieuw)
- `ProductSort` (nieuw)
- `FilterChips` (nieuw)
- `PriceRangeSlider` (nieuw)

### 3.5 Verbeterde Layout-Structuur

#### **Nieuwe Section Component:**
```tsx
<Section 
  variant="default" | "dark" | "gradient"
  spacing="sm" | "md" | "lg"
  container="sm" | "md" | "lg" | "xl"
>
  <SectionHeader 
    badge="Premium"
    title="Titel"
    description="Beschrijving"
  />
  <SectionContent>
    {/* Content */}
  </SectionContent>
</Section>
```

**Voordelen:**
- Consistente spacing
- Herbruikbaar
- Varianten voor verschillende looks
- Type-safe

#### **Nieuwe Grid Component:**
```tsx
<ProductGrid 
  products={products}
  columns={{ mobile: 1, tablet: 2, desktop: 4 }}
  gap="md"
/>
```

### 3.6 Componenten die Herbouwd Moeten Worden

#### **Prioriteit 1:**
1. **`Product` → `ProductCard`**
   - Verwijder duplicate code
   - Maak compactere variant
   - Betere hover states
   - Extract dialog naar aparte component

2. **`modern-carousel.tsx` + `slide-carousel.tsx` → `ProductCarousel`**
   - Consolideer tot één component
   - Variant prop voor styling
   - Betere responsive behavior

3. **`CategoryCard` → `CategoryGrid`**
   - Van lijst naar grid
   - Betere images
   - Hover effects

#### **Prioriteit 2:**
4. **`ProductsWithFilter` → `ProductFilters` + `ProductGrid`**
   - Split filters en grid
   - Voeg echte filters toe
   - Sortering toevoegen

5. **`SearchBar` + `InputForm` → `ProductSearch`**
   - Één unified search component
   - Betere UX (autocomplete?)

6. **Homepage sections → `Section` component**
   - Herbruikbare section wrapper
   - Consistente spacing

### 3.7 Componenten die Hergebruikt Kunnen Worden

#### **Goed Herbruikbaar (behouden):**
- ✅ `Button` (shadcn/ui)
- ✅ `Card` components (shadcn/ui)
- ✅ `Dialog` (shadcn/ui)
- ✅ `Input`, `Select` (shadcn/ui)
- ✅ `Title` component
- ✅ `MaxWidthWrapper`

#### **Te Hergebruiken met Aanpassingen:**
- ⚠️ `ProductList` → Gebruik nieuwe `ProductCard` + `ProductGrid`
- ⚠️ `products-list-sale.tsx` → Gebruik nieuwe filter systeem
- ⚠️ Skeleton components → Behoud, maar update voor nieuwe cards

### 3.8 Nieuwe Componenten die Gebouwd Moeten Worden

1. **`HeroSection`** - Nieuwe hero layout
2. **`CategoryGrid`** - Grid layout voor categorieën
3. **`ProductCard`** - Vernieuwde product card
4. **`ProductCarousel`** - Geconsolideerde carousel
5. **`ProductFilters`** - Filter sidebar
6. **`ProductSort`** - Sortering dropdown
7. **`FilterChips`** - Active filters display
8. **`PriceRangeSlider`** - Prijs range filter
9. **`Section`** - Herbruikbare section wrapper
10. **`SectionHeader`** - Section header component
11. **`ProductGrid`** - Grid layout voor producten
12. **`ProductSearch`** - Unified search component

### 3.9 Design System Uitbreidingen

#### **Nieuwe Design Tokens:**
```typescript
// tailwind.config.ts
spacing: {
  section: {
    sm: '3rem',   // 48px
    md: '5rem',   // 80px
    lg: '7rem',   // 112px
  },
  card: {
    gap: '2rem',  // 32px
  }
}

colors: {
  section: {
    default: 'bg-white dark:bg-gray-900',
    dark: 'bg-gray-900',
    light: 'bg-gray-50 dark:bg-gray-800',
  }
}
```

#### **Nieuwe Utility Classes:**
- `.section-padding` - Consistente section padding
- `.card-grid` - Product grid layout
- `.category-grid` - Category grid layout

---

## 🟨 STAP 4 — Implementatie Roadmap

### Fase 1: Foundation (Week 1)
1. ✅ Design tokens uitbreiden
2. ✅ `Section` component bouwen
3. ✅ `SectionHeader` component bouwen
4. ✅ Styling consistentie verbeteren

### Fase 2: Product Cards (Week 1-2)
1. ✅ `ProductCard` component bouwen (refactor `Product`)
2. ✅ `ProductGrid` component bouwen
3. ✅ Hover states en animations toevoegen
4. ✅ Update alle product lists

### Fase 3: Carousels (Week 2)
1. ✅ `ProductCarousel` component (consolideer beide)
2. ✅ Varianten toevoegen
3. ✅ Update homepage

### Fase 4: Categories (Week 2-3)
1. ✅ `CategoryGrid` component bouwen
2. ✅ Update categorie pagina's
3. ✅ Hover effects toevoegen

### Fase 5: Filters & Search (Week 3-4)
1. ✅ `ProductFilters` component
2. ✅ `ProductSort` component
3. ✅ `PriceRangeSlider` component
4. ✅ `FilterChips` component
5. ✅ `ProductSearch` component (unified)
6. ✅ URL query parameter support

### Fase 6: Hero & Homepage (Week 4)
1. ✅ `HeroSection` component
2. ✅ Homepage refactor
3. ✅ Animations toevoegen

### Fase 7: Cleanup & Testing (Week 5)
1. ✅ Oude componenten verwijderen
2. ✅ Code cleanup
3. ✅ Testing
4. ✅ Performance optimalisaties

---

## Conclusie

De LAZO Spirits codebase heeft een solide basis met Next.js 14, TypeScript, en shadcn/ui, maar heeft behoefte aan:

1. **Code consolidatie** - Veel duplicate code
2. **Design system** - Consistente styling tokens
3. **UX verbeteringen** - Betere filters, sortering, layouts
4. **Component modernisering** - Product cards, carousels, categories

Het voorgestelde plan biedt een gestructureerde aanpak om de codebase te moderniseren zonder breaking changes, met focus op herbruikbaarheid en consistentie.

